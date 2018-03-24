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
const game_1 = require("./game");
const gameRecord_1 = require("./components/gameRecord");
const moment = require("moment");
const config = require("config");
const gamePlayer_1 = require("./gamePlayer");
const axios_1 = require("axios");
const _ = require("lodash");
const pushEvent_1 = require("../consts/pushEvent");
const friendGameController_1 = require("./components/controllers/friendGameController");
const helpers_1 = require("../util/helpers");
const Raven = require("raven");
const roomPay_1 = require("./components/roomPay");
const playback_1 = require("./components/playback");
var DissolveState;
(function (DissolveState) {
    DissolveState[DissolveState["None"] = 0] = "None";
    DissolveState[DissolveState["Agree"] = 1] = "Agree";
    DissolveState[DissolveState["Reject"] = 2] = "Reject";
})(DissolveState = exports.DissolveState || (exports.DissolveState = {}));
const friendGameConfig = config.get('friendGame');
class FriendGame extends game_1.default {
    constructor(...args) {
        super(...args);
        this.isOwnerReady = false;
        this.fakeIds = [];
        this.dissolveId = '';
        this.dissoleTimer = null;
        this.initDate = new Date();
        [, , , , , this.owner, this.fakeIds] = args;
        this.factory('playback', (container) => {
            return new playback_1.default(this.gameConfig.playback);
        });
        this.factory('controller', (container) => {
            const friendController = new friendGameController_1.default(this, container);
            return friendController;
        });
        if (this.gameConfig.free == true) {
            this.factory('roomPay', () => {
                return new roomPay_1.FreeRoomPay(this);
            });
        }
        else if (this.roomConfig.payway == 'AA') {
            this.factory('roomPay', () => {
                return new roomPay_1.AARoomPay(this);
            });
        }
        else if (this.roomConfig.payway == 'owner') {
            this.factory('roomPay', () => {
                return new roomPay_1.OwnerRoomPay(this);
            });
        }
        else if (this.roomConfig.payway == 'winner') {
            this.factory('roomPay', () => {
                return new roomPay_1.WinnerRoomPay(this);
            });
        }
        this.factory('gameRecord', (container) => {
            return new gameRecord_1.default(this, container.playback, container.roomPay);
        });
        this.initFSM();
        this.container.controller.bindEvent();
    }
    initFSM() {
        // this.fsm = new StateMachine({
        // 	observeUnchangedState: true,
        // 	init: "init", // 初始化状态,牌桌,配置,玩家初始化在这里完成
        // 	transitions: [
        // 		{ name: "readyTrans", from: ['init', 'over'], to: "ready" },      //准备
        // 		{ name: "startTrans", from: 'ready', to: "start" },      // 准备开始一局游戏    
        // 		{ name: "shuffleTrans", from: 'start', to: "shuffle" }, //洗牌
        // 		{ name: "outputTrans", from: 'shuffle', to: "output" }, 
        // 		{ name: "overTrans", from: "output", to: "over" },  //发牌
        // 		{ name: "finishTrans", from: "*", to: "finish" },  // 完成约定局数游戏
        // 		{ name: 'dissolveTrans', from: "*", to: "dissolve" }    // 中途解散游戏
        // 	],
        // 	methods: {
        // 		onTransition: this.onTransition.bind(this),
        // 		onAfterTransition: this.onAfterTransition.bind(this),
        // 		onBeforeDissolveTrans: this.onBeforeDissolveTrans.bind(this),
        // 		onEnterState: this.onEnterState.bind(this),
        // 		onLeaveState: this.onLeaveState.bind(this),
        // 		onEnterInit: this.onEnterInit.bind(this),
        // 		onLeaveInit: this.onLeaveInit.bind(this),
        // 		onEnterStart: this.onEnterStart.bind(this),
        // 		onEnterShuffle: this.onEnterShuffle.bind(this),
        // 		onEnterReady: this.onEnterReady.bind(this),
        // 		onEnterOutput: this.onEnterOutput.bind(this),
        // 		onEnterOver: this.onEnterOver.bind(this),
        // 		onLeaveOver: this.onLeaveOver.bind(this),
        // 		onEnterFinish: this.onEnterFinish.bind(this),
        // 		onEnterDissolve: this.onEnterDissolve.bind(this),
        // 		onInvalidTransition: this.onInvalidTransition.bind(this)
        // 	}
        // })
    }
    join(user, userInfo, session, autoSit = true) {
        if (_.find(this.getAllGamePlayers(), { uid: user.id }) != undefined)
            return;
        const gamePlayer = new this.GamePlayerType(this.app, user, userInfo, -1, !autoSit);
        if (autoSit) {
            this.addGamePlayer(gamePlayer);
        }
        else {
            this.gameWatchers.push(gamePlayer);
        }
        session.set('roomId', this.roomId);
        session.set('gameServerId', this.app.getCurServer().id);
        session.pushAll((error) => {
            if (error != null) {
                Raven.captureException(error);
            }
        });
        this.onJoin(gamePlayer, autoSit);
    }
    onJoin(gamePlayer, autoSit) {
        const channel = gamePlayer.watcher ? this.container.watchChannel : this.container.channel;
        if (this.isStart == true && this.fsm.is('ready') != true)
            gamePlayer.watcher = true;
        channel.add(gamePlayer.uid, gamePlayer.userInfo['sid']);
        channel.pushMessageByIds(pushEvent_1.default.onPlayerJoinGame_, this.clientInfo(gamePlayer.uid), gamePlayer.uid);
        if (autoSit) {
            this.container.channel.pushMessage(pushEvent_1.default.onPlayerJoinGame, { gamePlayer: gamePlayer.clientInfo() });
        }
        this.container.emitter.emit('onJoin', gamePlayer, autoSit);
    }
    leave(userId, session, reason = '') {
        const gamePlayer = _.find(this.getAllGamePlayers(), { uid: userId });
        if (gamePlayer == undefined)
            return;
        if (gamePlayer.watcher) {
            _.remove(this.gameWatchers, { uid: userId });
        }
        else {
            _.pull(this.readyIds, userId);
            this.gamePlayers[gamePlayer.index] = null;
        }
        session.set('roomId', null);
        session.set('gameServerId', null);
        session.pushAll(function (error) {
            if (error != null) {
                Raven.captureException(error);
            }
        });
        this.onLeave(gamePlayer);
    }
    onLeave(gamePlayer, reason = '') {
        return __awaiter(this, void 0, void 0, function* () {
            if (!gamePlayer.watcher) {
                yield this.container.channel.pushMessage(pushEvent_1.default.onPlayerLeaveGame, { uid: gamePlayer.uid, reason });
            }
            this.container.channel.leave(gamePlayer.uid);
            this.container.emitter.emit('onLeave', gamePlayer);
        });
    }
    sitdown(gamePlayer, session) {
        const [rmGamePlayer] = _.remove(this.gameWatchers, { uid: gamePlayer.uid });
        if (rmGamePlayer != null) {
            rmGamePlayer.watcher = false;
            this.addGamePlayer(rmGamePlayer);
            this.onSitdown(rmGamePlayer);
        }
    }
    onSitdown(gamePlayer) {
        this.container.watchChannel.leave(gamePlayer.uid);
        this.container.channel.add(gamePlayer.uid, gamePlayer.userInfo['sid']);
        this.container.channel.pushMessage(pushEvent_1.default.onPlayerSitDown, { gamePlayer: gamePlayer.clientInfo() });
        this.container.emitter.emit('onSitdown', gamePlayer);
    }
    standup(gamePlayer, session) {
        _.pull(this.readyIds, gamePlayer.uid);
        this.gamePlayers[gamePlayer.index] = null;
        this.onStandup(gamePlayer);
    }
    onStandup(gamePlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!gamePlayer.watcher) {
                yield this.container.channel.pushMessage(pushEvent_1.default.onPlayerStandUp, { uid: gamePlayer.uid });
            }
            this.container.channel.leave(gamePlayer.uid);
        });
    }
    onBeforeDissolveTrans(lifecycle, gamePlayer, vote) {
        if (gamePlayer instanceof gamePlayer_1.default && vote == undefined) {
            this.dissolveId = gamePlayer.uid;
            const seconds = friendGameConfig.dissolveMinutes * 60;
            this.dissoleTimer = moment.duration(seconds, 'seconds')['timer']({ start: true }, () => {
                _.forEach(this.gamePlayers, (v) => {
                    if (v != undefined && v.dissolveState == DissolveState.None) {
                        v.dissolveState = DissolveState.Agree;
                    }
                });
                this.dissolveTemplate();
            });
            gamePlayer.dissolveState = DissolveState.Agree;
            this.container.channel.pushMessage(pushEvent_1.default.onRequestGameDissolve, {
                states: this.getPlayersDissolveState(),
                seconds: seconds,
                uid: gamePlayer.uid
            });
        }
        else if (gamePlayer instanceof gamePlayer_1.default && _.isBoolean(vote)) {
            gamePlayer.dissolveState = vote ? DissolveState.Agree : DissolveState.Reject;
            this.dissolveTemplate();
        }
        return false;
    }
    dissolveTemplate() {
        const result = this.getDissolveResult();
        let playerCount = this.playerCount;
        if (this.gameConfig.freeMode == true) {
            playerCount = this.getRealGamePlayersCount();
        }
        const agreeCount = Math.floor(playerCount / 2) + 1;
        const rejectCount = Math.floor(playerCount / 2);
        if (result.rejectCount >= rejectCount || result.agreeCount >= agreeCount) {
            if (result.agreeCount >= agreeCount) {
                this.container.channel.pushMessage(pushEvent_1.default.onGameDissolveResult, { result: true, states: this.getPlayersDissolveState() });
                process.nextTick(() => {
                    this.fsm.finishTrans();
                });
            }
            else if (result.rejectCount >= rejectCount) {
                this.container.channel.pushMessage(pushEvent_1.default.onGameDissolveResult, { result: false, states: this.getPlayersDissolveState() });
            }
            this.clearDissoleData();
        }
        else {
            this.container.channel.pushMessage(pushEvent_1.default.onRefreshGameDissolve, {
                states: this.getPlayersDissolveState(),
                uid: this.dissolveId
            });
        }
    }
    onEnterDissolve(lifecycle, gamePlayer, vote) {
    }
    getPlayersDissolveState() {
        const results = [];
        this.gamePlayers.forEach(function (value) {
            if (value != null) {
                results.push({ uid: value.uid, state: value.dissolveState });
            }
        });
        return results;
    }
    getDissolveResult() {
        let agreeCount = 0;
        let rejectCount = 0;
        let resultCount = 0;
        this.gamePlayers.forEach(function (v) {
            if (v != null) {
                if (v.dissolveState == DissolveState.Agree) {
                    ++agreeCount;
                    ++resultCount;
                }
                else if (v.dissolveState == DissolveState.Reject) {
                    ++rejectCount;
                    ++resultCount;
                }
            }
        });
        return { agreeCount, rejectCount, resultCount };
    }
    clearDissoleData() {
        this.gamePlayers.forEach(function (v) {
            if (v != null) {
                v.dissolveState = DissolveState.None;
            }
        });
        if (this.dissoleTimer != null) {
            this.dissoleTimer.stop();
            this.dissoleTimer = null;
        }
        this.dissolveId = '';
    }
    onEnterStart(lifecycle, arg1, arg2) {
        super.onEnterStart(lifecycle, arg1, arg2);
    }
    onEnterShuffle(lifecycle, arg1, arg2) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.app.get('env') != 'production' && config.get('friendGame.fakeEnabled') && this.fakeIds.length > 0) {
                const cards = yield this.getFakeCards();
                if (_.isArray(cards) && cards.length >= 0) {
                    const fakeCardIds = cards;
                    const allCardIds = this.gameConfig.allCardIds;
                    const otherCards = _.difference(allCardIds, fakeCardIds);
                    const ids = _.slice(_.concat(fakeCardIds, _.shuffle(otherCards)), 0, allCardIds.length);
                    this.cards = this.container.cardAdapter.createCardsFromIds(ids);
                }
                else {
                    this.cards = this.shuffleCards();
                }
            }
            else {
                this.cards = this.shuffleCards();
            }
            setTimeout(() => {
                this.fsm.outputTrans();
            }, 0);
        });
    }
    onEnterOver(lifecycle, arg1, arg2) {
        this.container.emitter.emit('onEnterFriendGameOver');
        ++this.currentRound;
        process.nextTick(() => {
            if (this.isFinish()) {
                this.fsm.finishTrans();
            }
            else {
                this.fsm.readyTrans();
            }
        });
        super.onEnterOver(lifecycle, arg1, arg2);
    }
    // 派生类实现getFinishData
    getFinishData(data) {
    }
    // 派生类实现getGamePlayerFinishData
    getGamePlayerFinishData(gamePlayer, data) {
    }
    onEnterFinish(lifecycle, arg1, arg2) {
        super.onEnterFinish(lifecycle, arg1, arg2);
        const data = { gamePlayers: [], payUIds: Array.from(this.container.roomPay.payUsers), payway: this.roomConfig.payway };
        this.getFinishData(data);
        this.gamePlayers.forEach((value) => {
            if (value != null) {
                const result = {
                    uid: value.uid,
                    isGuest: value.user.isGuest,
                    score: value.score - value.initScore,
                    winCount: value.winCount,
                    loseCount: value.loseCount,
                    drawCount: value.drawCount
                };
                this.getGamePlayerFinishData(value, result);
                data.gamePlayers.push(result);
            }
        });
        this.container.channel.pushMessage(pushEvent_1.default.onGameFinish, data);
        this.destroy(false);
    }
    ownerReady() {
        if (this.isOwnerReady == false) {
            this.isOwnerReady = true;
            process.nextTick(() => {
                this.fsm.startTrans();
                this.readyIds = [];
            });
        }
    }
    reset() {
        super.reset();
        this.clearDissoleData();
    }
    clientInfo(uid) {
        let result = super.clientInfo(uid);
        if (this.dissoleTimer != null) {
            result['dissolveInfo'] = {
                seconds: this.getTimeLeft(this.dissoleTimer),
                states: this.getPlayersDissolveState(),
                dissolveId: this.dissolveId
            };
        }
        result['ownerId'] = this.owner.id;
        return result;
    }
    destroy(needPush = false, reason = '') {
        helpers_1.roomNumberReleaseAsync(this.app, parseInt(this.roomId));
        super.destroy(needPush, reason);
    }
    updateConfig(roomConfig, gameConfig) {
        _.assign(this.roomConfig, roomConfig);
        this.gameConfig = gameConfig;
        this.container.channel.pushMessage(pushEvent_1.default.onUpdateRoomConfig, this.roomConfig);
    }
    getFakeCards() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fakeDataURL = config.get('fakeDataURL');
                if (this.fakeIds.length > 0) {
                    const fakeId = this.fakeIds.shift();
                    if (_.isSafeInteger(fakeId)) {
                        const response = yield axios_1.default.get(`${fakeDataURL}cards/${fakeId}`);
                        const jsonObject = response.data;
                        const initCards = jsonObject['cards'];
                        if (_.isArray(initCards) && initCards.length > 0) {
                            return initCards;
                        }
                    }
                }
            }
            catch (e) {
                Raven.captureException(e);
            }
        });
    }
}
exports.default = FriendGame;
