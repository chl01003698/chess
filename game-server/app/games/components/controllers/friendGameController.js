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
const _ = require("lodash");
const roomPay_1 = require("../roomPay");
const Raven = require("raven");
class FriendGameController {
    constructor(game, container) {
        this.game = game;
        this.emitter = container.emitter;
        container.channel.on('onPushMessage', (route, msg) => {
            container.watchChannel.pushMessage(route, msg);
            container.playback.pushChannelCommand(route, msg);
        });
        container.channel.on('onPushMessageByIds', (route, msg, uids) => {
            container.playback.pushChannelCommand(route, msg);
        });
    }
    bindEvent() {
        Raven.context(() => {
            const fsm = this.game.fsm;
            fsm.observe('onLeaveInit', () => __awaiter(this, void 0, void 0, function* () {
                const app = this.game.app;
                const coreComponent = app.components.core;
                const roomCache = coreComponent.container.roomCache;
                const game = this.game;
                const result = yield roomCache.createRoom({
                    roomId: game.roomId,
                    serverId: game.app.getCurServer().id,
                    game: game.roomConfig.game,
                    type: game.roomConfig.type,
                    playerNumber: 0,
                    watcherNumber: 0,
                    ownerId: game.owner.id,
                    ownerShortId: game.owner.shortId,
                    currentRound: 0,
                    playerCount: game.playerCount,
                    state: 0,
                    config: _.pick(game.roomConfig, ['type', 'expendIndex'])
                });
                this.game.container.emitter.emit('onCreateRoom');
                if (this.game.container.roomPay instanceof roomPay_1.OwnerRoomPay) {
                    this.game.container.roomPay.pay();
                }
                this.game.container.gameRecord.initGame();
                //this.game.container.keen.onGameStart()
            }));
            fsm.observe('onEnterStart', () => {
                const app = this.game.app;
                const coreComponent = app.components.core;
                const roomCache = coreComponent.container.roomCache;
                if (this.game.currentRound == 0) {
                    roomCache.updateRoomInfo(this.game.roomId, { state: 1, startDate: this.game.startDate });
                    if (this.game.container.roomPay instanceof roomPay_1.AARoomPay) {
                        this.game.container.roomPay.pay();
                    }
                    const app = this.game.app;
                    const coreComponent = app.components.core;
                    const userCache = coreComponent.container.userCache;
                    _.forEach(this.game.gamePlayers, (v) => {
                        userCache.startGame(v.user.shortId);
                    });
                }
                else {
                    roomCache.updateRoomInfo(this.game.roomId, { currentRound: this.game.currentRound });
                }
            });
            fsm.observe('onAfterStartTrans', () => {
                if (this.game.currentRound == 0) {
                    this.game.container.gameRecord.startGame();
                }
                this.game.container.playback.startGame(this.game);
                this.game.container.playback.setPlayers(this.game.gamePlayers);
            });
            fsm.observe('onLeaveStart', () => {
            });
            fsm.observe('onAfterFinishTrans', () => {
                if (this.game.container.roomPay instanceof roomPay_1.WinnerRoomPay) {
                    this.game.container.roomPay.pay();
                }
                if (this.game.roomConfig.payway == 'owner') {
                    this.game.container.esearch.onFriendGameCreate(this.game.owner);
                }
                else if (this.game.roomConfig.payway == 'winner') {
                    const winnerPlayer = this.game.findWinnerPlayer();
                    if (winnerPlayer != undefined) {
                        this.game.container.esearch.onFriendGameCreate(winnerPlayer.user);
                    }
                }
                _.forEach(this.game.gamePlayers, (v) => {
                    if (v != undefined && v.joined) {
                        this.game.container.esearch.onJoinGame(v.user);
                    }
                });
            });
            this.emitter.on('onEnterFriendGameOver', () => {
                this.game.container.gameRecord.overGame();
                const roundData = this.game.container.gameRecord.getRoundData(this.game.currentRound);
                this.game.container.playback.overGame(this.game.container.gameRecord.record.rounds[this.game.currentRound]);
            });
            this.emitter.on('onDestroy', () => {
                const app = this.game.app;
                const coreComponent = app.components.core;
                const userCache = coreComponent.container.userCache;
                const roomCache = coreComponent.container.roomCache;
                _.forEach(this.game.gamePlayers, (v) => {
                    if (v != null) {
                        userCache.endGame(v.user.shortId);
                    }
                });
                _.forEach(this.game.gameWatchers, (v) => {
                    userCache.endGame(v.user.shortId);
                });
                roomCache.destroyRoom({ roomId: this.game.roomId });
                this.game.container.channel.destroy();
                this.game.container.watchChannel.destroy();
                if (!this.game.isStart && this.game.container.roomPay instanceof roomPay_1.OwnerRoomPay) {
                    this.game.container.roomPay.refund();
                }
                if (this.game.isStart) {
                    this.game.container.gameRecord.finishGame();
                }
                this.game.container.emitter.removeAllListeners();
            });
            this.emitter.on('onJoin', (gamePlayer) => {
                const app = this.game.app;
                const coreComponent = app.components.core;
                const roomCache = coreComponent.container.roomCache;
                const userCache = coreComponent.container.userCache;
                roomCache.joinRoom({
                    roomId: this.game.roomId,
                    shortId: gamePlayer.user.shortId,
                    watcher: gamePlayer.watcher
                });
                userCache.joinGame(gamePlayer.user.shortId, this.game.roomConfig.type, this.game.roomId);
            });
            this.emitter.on('onLeave', (gamePlayer) => {
                const app = this.game.app;
                const coreComponent = app.components.core;
                const userCache = coreComponent.container.userCache;
                const roomCache = coreComponent.container.roomCache;
                const user = gamePlayer.user;
                userCache.endGame(user.shortId);
                roomCache.leaveRoom({ roomId: this.game.roomId, shortId: user.shortId, watcher: gamePlayer.watcher });
            });
            this.emitter.on('onRest', () => {
                this.game.container.countDown.resetAll();
                this.game.container.playback.resetData();
            });
            this.emitter.on('onServerStop', () => {
                if (!this.game.isStart && this.game.container.roomPay instanceof roomPay_1.OwnerRoomPay) {
                    this.game.container.roomPay.refund();
                }
            });
            this.emitter.on('onSitdown', (gamePlayer) => {
                if (this.game.isStart && this.game.container.roomPay instanceof roomPay_1.AARoomPay) {
                    this.game.container.roomPay.pay(gamePlayer);
                }
            });
        });
    }
}
exports.default = FriendGameController;
