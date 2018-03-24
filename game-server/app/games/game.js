"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bottle = require("bottlejs");
const channel_1 = require("./components/channel");
const chat_1 = require("./components/chat");
const countDown_1 = require("./components/countDown");
const eventemitter2_1 = require("eventemitter2");
const logger_1 = require("../util/logger");
const _ = require("lodash");
const scoreManage_1 = require("./components/scoreManage");
const cardAdapter_1 = require("./components/cardAdapter");
const pushEvent_1 = require("../consts/pushEvent");
const Raven = require("raven");
const playerStateManage_1 = require("./components/playerStateManage");
const config = require("config");
const gameESearch_1 = require("./components/gameESearch");
class Game extends Bottle {
    constructor(...args) {
        super();
        this.gamePlayers = [];
        this.gameWatchers = [];
        this.currentRound = 0;
        this.isStart = false;
        this.currentIndex = 0;
        this.cards = [];
        this.remainCards = [];
        this.readyIds = [];
        this.owner = this.owner;
        [this.app, this.roomId, this.gameConfig, this.roomConfig, this.GamePlayerType] = args;
        _.isNumber(this.roomConfig['playerCount']) ? this.playerCount = this.roomConfig['playerCount'] : this.playerCount = this.gameConfig['playerCount'];
        this.factory('emitter', () => {
            return new eventemitter2_1.EventEmitter2({ wildcard: true, delimiter: ':' });
        });
        this.factory('channel', () => {
            return new channel_1.default(this.app, 'members', this.roomId);
        });
        this.factory('watchChannel', () => {
            return new channel_1.default(this.app, 'watchers', this.roomId);
        });
        this.factory('chat', (container) => {
            return new chat_1.default(container.channel);
        });
        this.factory('countDown', () => {
            return new countDown_1.default;
        });
        this.service('playerStateManage', playerStateManage_1.PlayerStateManage);
        this.factory('scoreManage', () => {
            return new scoreManage_1.ScoreManage;
        });
        if (this.gameConfig.type == 'poker') {
            this.service('cardAdapter', cardAdapter_1.PokerCardAdapter);
        }
        else {
            this.service('cardAdapter', cardAdapter_1.MJCardAdapter);
        }
        this.factory('esearch', () => {
            const coreComponent = this.app.components.core;
            return new gameESearch_1.GameESearch(this, coreComponent.container.esearch);
        });
    }
    onInvalidTransition(transition, from, to) {
        logger_1.default.debug('transition not allowed from that state');
        logger_1.default.debug('from: ', from);
        if (to != undefined) {
            logger_1.default.debug('to: ', to);
        }
    }
    onTransition(lifecycle, arg1, arg2) { }
    onEnterState(lifecycle, arg1, arg2) {
        // logger.debug('from: ', lifecycle.from);
        // logger.debug('to: ', lifecycle.to);
        this.container.emitter.emit(`onEnter${_.upperFirst(lifecycle.to)}`);
        this.container.countDown.start(lifecycle.to);
    }
    onLeaveState(lifecycle, arg1, arg2) {
        this.container.emitter.emit(`onLeave${_.upperFirst(lifecycle.from)}`);
        this.container.countDown.reset(lifecycle.from);
    }
    onAfterTransition(lifecycle, arg1, arg2) { }
    onBeforeDissolveTrans(lifecycle, arg1, arg2) { }
    onEnterInit(lifecycle, arg1, arg2) { }
    onLeaveInit(lifecycle, arg1, arg2) { }
    onEnterReady(lifecycle, arg1, arg2) { }
    onEnterShuffle(lifecycle, arg1, arg2) { }
    onEnterStart(lifecycle, arg1, arg2) {
        this.startDate = new Date();
        this.gamePlayers = _.compact(this.gamePlayers);
        _.forEach(this.gamePlayers, (v, i) => {
            v.index = i;
            v.joined = true;
        });
        if (this.currentRound == 0) {
            this.isStart = true;
        }
    }
    onEnterOver(lifecycle, arg1, arg2) { }
    onLeaveOver(lifecycle, arg1, arg2) {
        this.reset();
    }
    onEnterFinish(lifecycle, arg1, arg2) { }
    onEnterDissolve(lifecycle, arg1, arg2) { }
    saveCurrentRoundGamePlayer(roundObject, gamePlayer, index) { }
    turnNext() {
        ++this.currentIndex;
        this.currentIndex = this.currentIndex % this.playerCount;
    }
    turnFromTo(from = this.currentIndex, to = 1) {
        let index = from + to;
        return index % this.playerCount;
    }
    shiftCard() {
        return this.remainCards.shift();
    }
    popCard() {
        return this.remainCards.pop();
    }
    isFinish() {
        return this.currentRound >= this.roomConfig.roundCount;
    }
    isAboutToFinish() {
        return this.currentRound + 2 >= this.roomConfig.roundCount;
    }
    clearSessionData(gamePlayer) {
        if (gamePlayer != null && gamePlayer.userInfo['sid'] != '') {
            this.app.backendSessionService.getByUid(gamePlayer.userInfo['sid'], gamePlayer.uid, function (error, sessions) {
                if (sessions != null && _.isArray(sessions) && sessions.length > 0) {
                    const session = sessions[0];
                    if (session != null) {
                        session.set('roomId', null);
                        session.set('gameServerId', null);
                        session.pushAll(function () { });
                    }
                }
            });
        }
    }
    clearSessionsData() {
        this.gamePlayers.forEach((v) => {
            if (v != null) {
                this.clearSessionData(v);
            }
        });
    }
    reset() {
        this.currentIndex = 0;
        this.cards = [];
        this.remainCards = [];
        this.gamePlayers.forEach((value) => {
            if (value != undefined) {
                value.reset();
            }
        });
        this.container.countDown.resetAll();
        const components = this.container.$list();
        this.readyIds = [];
        _.forEach(components, (v) => {
            if (_.isFunction(this.container[v].reset)) {
                this.container[v].reset();
            }
        });
    }
    onRest() {
        this.container.emitter.emit('onRest');
    }
    clientInfo(uid) {
        const clientInfo = _.pick(this, ['roomId', 'roomName', 'currentRound', 'roomConfig', "readyIds"]);
        clientInfo['state'] = this.fsm.state;
        // clientInfo['playerCount'] = this.getGamePlayerCount()
        clientInfo["playerCount"] = this.playerCount;
        if (this.container.countDown.timers[this.fsm.state] != undefined) {
            clientInfo['stateRemain'] = this.container.countDown.getRemainingDuration(this.fsm.state);
        }
        clientInfo.index = 0;
        clientInfo["gamePlayers"] = [];
        if (config.get('game.readySeconds') != undefined)
            clientInfo["readySeconds"] = config.get('game.readySeconds');
        this.gamePlayers.forEach((v, i) => {
            clientInfo.index = i;
            if (v == null) {
                clientInfo["gamePlayers"][i] = null;
            }
            else {
                clientInfo["gamePlayers"][i] = v.clientInfo(uid == v.uid);
                clientInfo["gamePlayers"][i].isOwner = false;
            }
        });
        return clientInfo;
    }
    clientGamePlayers() {
        const clientGamePlayers = [];
        _.forEach(this.gamePlayers, (v) => {
            clientGamePlayers.push(v.clientInfo());
        });
        return clientGamePlayers;
    }
    destroy(needPush = false, reason = '') {
        if (needPush) {
            this.container.channel.pushMessage(pushEvent_1.default.onGameDestroy);
        }
        this.clearSessionsData();
        this.onDestroy(needPush, reason);
        this.deleteGame();
    }
    onDestroy(needPush, reason) {
        this.container.emitter.emit('onDestroy', needPush, reason);
    }
    onServerStop() {
        this.container.emitter.emit('onServerStop');
    }
    ready(uid, needPush = true) {
        if (this.fsm.state == 'ready') {
            const index = this.readyIds.indexOf(uid);
            let playerCount = this.playerCount;
            if (index == -1 && this.readyIds.length < playerCount) {
                this.readyIds.push(uid);
                const gamePlayer = this.findPlayerByUid(uid);
                if (needPush) {
                    this.container.channel.pushMessage(pushEvent_1.default.onGameReady, {
                        uids: this.readyIds,
                        uid,
                        index: gamePlayer.index
                    });
                }
                if (this.readyIds.length >= playerCount) {
                    process.nextTick(() => {
                        this.fsm.startTrans();
                        this.container.countDown.remove('ready');
                    });
                }
                else if (this.readyIds.length == this.gamePlayers.length &&
                    this.gameConfig.freeMode == true &&
                    this.gameConfig.playerMinCount != undefined &&
                    this.readyIds.length >= this.gameConfig.playerMinCount) {
                    process.nextTick(() => {
                        this.fsm.startTrans();
                        this.container.countDown.remove('ready');
                    });
                }
                else if (this.readyIds.length >= 2 && this.gameConfig.freeMode == true &&
                    this.container.countDown.timers['ready'] == undefined) {
                    const readySeconds = config.get('game.readySeconds');
                    this.container.channel.pushMessage(pushEvent_1.default.onGameReadyCountDown, {
                        readySeconds
                    });
                    this.container.countDown.register('ready', readySeconds, () => {
                        this.fsm.startTrans();
                        this.container.countDown.remove('ready');
                    }, { start: true });
                }
            }
        }
    }
    cancelReady(uid) {
        this.readyIds = [];
        this.container.countDown.remove('ready');
        let player = this.findPlayerByUid(uid);
        this.container.channel.pushMessage(pushEvent_1.default.onGameCancelReady, {
            uid: uid, sid: player.index
        });
    }
    findPlayerByUid(uid) {
        return _.find(this.gamePlayers, function (v) {
            if (v != null) {
                return v.uid == uid;
            }
            return false;
        });
    }
    findPlayerByShortId(shortId) {
        return _.find(this.gamePlayers, function (v) {
            if (v != null) {
                return v.shortId == shortId;
            }
            return false;
        });
    }
    findWinnerPlayer() {
        const gamePlayers = _.compact(this.gamePlayers);
        return _.maxBy(gamePlayers, (v) => {
            return v.score;
        });
    }
    getAllGamePlayers() {
        return _.compact(_.concat(this.gamePlayers, this.gameWatchers));
    }
    nullPlayerIndex(players) {
        return _.findIndex(players, function (value) {
            return value == null;
        });
    }
    indexOfPlayer(players, uid) {
        return _.findIndex(players, function (value) {
            if (value != undefined) {
                return value.uid == uid;
            }
            return false;
        });
    }
    getGamePlayerCount() {
        return this.gamePlayers.length;
    }
    getPlayerIds() {
        const results = [];
        _.forEach(this.gamePlayers, (v) => {
            if (v != undefined)
                results.push(v.uid);
        });
        return results;
    }
    getOtherPlayerIds(uid) {
        return _.filter(this.gamePlayers, (v) => {
            return v != undefined && v.uid != uid;
        });
    }
    // 获取房间真实玩家数量
    getRealGamePlayersCount() {
        return _.compact(this.gamePlayers).length;
    }
    // 是否玩家数量已满
    isGameFull() {
        return _.compact(this.gamePlayers).length >= this.playerCount;
    }
    // 检测是否为当前玩家
    isCurrentPlayer(uid) {
        return this.gamePlayers[this.currentIndex].uid == uid;
    }
    addGamePlayer(gamePlayer) {
        const nullIndex = this.nullPlayerIndex(this.gamePlayers);
        if (nullIndex == -1) {
            this.gamePlayers.push(gamePlayer);
            gamePlayer.index = this.gamePlayers.length - 1;
        }
        else {
            this.gamePlayers[nullIndex] = gamePlayer;
            gamePlayer.index = nullIndex;
        }
    }
    // 检测是否在某些状态当中
    inStates(states) {
        return _.includes(states, this.fsm.state);
    }
    // 洗牌接口
    shuffleCards() {
        return _.shuffle(this.cards);
    }
    sessionBindGame(gamePlayer) {
        this.app.backendSessionService.getByUid(gamePlayer.userInfo['sid'], gamePlayer.uid, (error, sessions) => {
            if (sessions != null && _.isArray(sessions) && sessions.length > 0) {
                const session = sessions[0];
                session.set('roomId', this.roomId);
                session.set('gameServerId', this.app.getCurServer().id);
                session.pushAll(function (error) {
                    if (error != null) {
                        Raven.captureException(error);
                    }
                });
            }
        });
    }
    onGamePlayerLogin(uid, sid) {
        const gamePlayer = _.find(this.getAllGamePlayers(), { uid: uid });
        // const channel = gamePlayer.watcher ? this.container.watchChannel : this.container.channel;
        const channel = this.container.channel;
        if (gamePlayer != undefined) {
            channel.leave(uid);
            gamePlayer.userInfo['sid'] = sid;
            channel.add(uid, gamePlayer.userInfo['sid']);
            this.sessionBindGame(gamePlayer);
            this.container.channel.pushMessage(pushEvent_1.default.onGamePlayerLogin, { uid });
            // if (gamePlayer.watcher == false) {
            // 	// if (this.currentRound > 0 && this.fsm.state == "ready") {
            // 	// 	this.ready(uid)
            // 	// }
            // }
            this.container.channel.pushMessageByIds(pushEvent_1.default.onRestoreGameInfo, this.clientInfo(uid), uid);
        }
    }
    onGamePlayerLogout(uid) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const gamePlayer = this.findPlayerByUid(uid);
            if (gamePlayer != null) {
                yield this.container.channel.pushMessage(pushEvent_1.default.onGamePlayerLogout, { uid });
                this.container.channel.leave(gamePlayer.uid);
            }
        }));
    }
    deleteGame() {
        const gameComponent = this.app.components.game;
        gameComponent.container.gameManage.deleteGame(this.roomId);
    }
    getTimeLeft(timeout) {
        return Math.ceil(timeout.getRemainingDuration() / 1000);
    }
    getCurrGamePlayer() {
        return this.gamePlayers[this.currentIndex];
    }
}
exports.default = Game;
