"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const _ = require("lodash");
const code_1 = require("../../../consts/code");
const Joi = require("joi");
const config = require("config");
const helpers_1 = require("../../../util/helpers");
const Raven = require("raven");
const db_1 = require("../../../extend/db");
const helpers_2 = require("../../../util/helpers");
const merge = require("deepmerge");
class GameHandler {
    constructor(app) {
        this.app = app;
    }
    destroy(msg, session, next) {
        return __awaiter(this, void 0, void 0, function* () {
            Raven.context(() => {
                helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                    if (game.isStart || session.uid != game.owner.id)
                        return helpers_2.respError(next, code_1.default.FAIL);
                    game.destroy(true, 'owner');
                    helpers_2.respOK(next);
                });
            });
        });
    }
    dissolve(msg, session, next) {
        return __awaiter(this, void 0, void 0, function* () {
            Raven.context(() => {
                helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                    if (!game.isStart)
                        return helpers_2.respError(next, code_1.default.FAIL);
                    if (game.dissolveId != '')
                        return helpers_2.respError(next, code_1.default.GAME.STATE_ERROR);
                    game.fsm.dissolveTrans(gamePlayer);
                    helpers_2.respOK(next);
                });
            });
        });
    }
    dissolveVote(msg, session, next) {
        return __awaiter(this, void 0, void 0, function* () {
            Raven.context(() => {
                const validate = helpers_1.JoiValidate(msg, {
                    vote: Joi.boolean().required()
                }, next);
                if (!validate)
                    return;
                helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                    if (!game.isStart || game.dissolveId == '')
                        return helpers_2.respError(next, code_1.default.FAIL);
                    if (game.dissolveId == '')
                        return helpers_2.respError(next, code_1.default.GAME.STATE_ERROR);
                    game.fsm.dissolveTrans(gamePlayer, msg.vote);
                    helpers_2.respOK(next);
                });
            });
        });
    }
    create(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const [validate, result] = helpers_1.JoiValidateEx(msg, {
                fakeIds: Joi.array().items(Joi.number()),
                groupId: Joi.number().optional(),
                origin: Joi.string().default('hall').optional(),
                config: Joi.object().required().keys({
                    game: Joi.string().required(),
                    type: Joi.string().optional(),
                    expendIndex: Joi.number().min(0).max(3).required(),
                    payway: Joi.string().allow('AA', 'owner', 'winner').required(),
                    join: Joi.boolean().default(true).optional(),
                    private: Joi.boolean().default(false).optional(),
                    playerCount: Joi.number().min(2).max(5).optional(),
                    autoReady: Joi.boolean().default(false).optional()
                })
            }, next);
            if (!validate)
                return;
            let msgConfig = result.value.config;
            const gameComponent = this.app.components.game;
            const gameFactory = gameComponent.container.gameFactory;
            const createGameConfig = gameFactory.getConfig(msgConfig.game, msgConfig.type);
            if (!createGameConfig)
                return helpers_2.respError(next, code_1.default.PARAMS_ERROR);
            const coreComponent = this.app.components.core;
            const dataManage = coreComponent.container.dataManage;
            const remoteData = dataManage.getData(createGameConfig.config);
            if (!_.isEmpty(remoteData.ajvSchema)) {
                const [validate, ajvMsg] = helpers_1.AjvValidate(msg, remoteData.ajvSchema, next);
                if (!validate)
                    return;
                msgConfig = _.assign(msgConfig, ajvMsg["config"]);
            }
            const willStopServer = yield coreComponent.container.keyv.get('willStopServer');
            if (_.isBoolean(willStopServer) && willStopServer == true &&
                !_.includes(config.get('whiteList'), session.get('shortId'))) {
                return helpers_2.respError(next, code_1.default.GAME.WILL_STOP_SERVER);
            }
            const roomCache = coreComponent.container.roomCache;
            const playerRoomCount = yield roomCache.getPlayerRoomCount(session.get('shortId'));
            if (playerRoomCount >= config.get('friendGame.createRoomLimit')) {
                return helpers_2.respError(next, code_1.default.GAME.GAME_COUNT_LIMIT);
            }
            const [user, userInfo] = yield Promise.all([
                db_1.UserModel.findGameUser(session.uid),
                coreComponent.container.userCache.findUserSession(session.get('shortId'))
            ]);
            if (user == null || userInfo == null)
                return helpers_2.respError(next, code_1.default.NO_EXIST_USER);
            //let gameConfig = remoteData.server
            let gameConfig = merge(_.defaultTo(remoteData.share, {}), _.defaultTo(remoteData.server, {}), {
                arrayMerge: (destination, source) => source
            });
            if (createGameConfig.processGameConfig != undefined && _.isFunction(createGameConfig.processGameConfig)) {
                gameConfig = createGameConfig.processGameConfig(msgConfig, _.cloneDeep(gameConfig));
            }
            if (_.isEmpty(gameConfig))
                return helpers_2.respError(next, code_1.default.FAIL);
            if (!helpers_1.hasEnoughGameCard(user, msgConfig, gameConfig))
                return helpers_2.respError(next, code_1.default.GAME.NOT_ENOUGH_GAMECARDS);
            const payway = msgConfig.payway == 'AA' ? 'AA' : 'owner';
            msgConfig.roundCount = gameConfig.gameExpend[payway][msgConfig.expendIndex].round;
            const existInRoom = yield roomCache.existPlayerInRoom(session.get('shortId'));
            if (existInRoom)
                return helpers_2.respError(next, code_1.default.GAME.ALREADY_EXIST_OTHER_GAME);
            const roomId = yield helpers_1.roomNumberRandomAsync(this.app);
            if (roomId == -1)
                return helpers_2.respError(next, code_1.default.GAME.NO_AVAILABLE_GAME_NUMBER);
            const gameManage = gameComponent.container.gameManage;
            const fakeIds = _.defaultTo(msg.fakeIds, []);
            const game = gameManage.createGame(roomId + '', createGameConfig, gameConfig, msgConfig, user, fakeIds);
            if (game == null)
                helpers_2.respError(next, code_1.default.GAME.CREATE_GAME_ERROR);
            if (msgConfig['join']) {
                game.container.emitter.once('onCreateRoom', () => {
                    game.join(user, userInfo, session, !game.gameConfig.watch);
                    if (msgConfig.autoReady) {
                        process.nextTick(() => {
                            game.ready(session.uid);
                        });
                    }
                });
            }
            helpers_2.respOK(next);
        }));
    }
    updateConfig(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            helpers_1.handleGame.bind(this)(msg, session, next, (game) => {
                let msgConfig = msg.config;
                const gameComponent = this.app.components.game;
                const gameFactory = gameComponent.container.gameFactory;
                const createGameConfig = gameFactory.getConfig(msgConfig.game, msgConfig.type);
                const coreComponent = this.app.components.core;
                const dataManage = coreComponent.container.dataManage;
                const remoteData = dataManage.getData(createGameConfig.config);
                if (!_.isEmpty(remoteData.ajvSchema)) {
                    const [validate, ajvMsg] = helpers_1.AjvValidate(msg, remoteData.ajvSchema, next);
                    if (!validate)
                        return;
                    if (!(game.isStart == false && game.fsm.is('ready')))
                        return helpers_2.respError(next, code_1.default.GAME.STATE_ERROR);
                    msgConfig = _.assign(msgConfig, ajvMsg);
                    let gameConfig = _.cloneDeep(game.gameConfig);
                    if (createGameConfig.processGameConfig != undefined && _.isFunction(createGameConfig.processGameConfig)) {
                        gameConfig = createGameConfig.processGameConfig(msgConfig, gameConfig);
                    }
                    game.updateConfig(msgConfig, gameConfig);
                    helpers_2.respOK(next);
                }
            });
        }));
    }
    join(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                roomId: Joi.string().length(6).required()
            }, next);
            if (!validate)
                return;
            const coreComponent = this.app.components.core;
            const willStopServer = yield coreComponent.container.keyv.get('willStopServer');
            if (_.isBoolean(willStopServer) && willStopServer == true &&
                !_.includes(config.get('whiteList'), session.get('shortId'))) {
                return helpers_2.respError(next, code_1.default.GAME.WILL_STOP_SERVER);
            }
            const existInRoom = yield coreComponent.container.roomCache.existPlayerInRoom(session.get('shortId'));
            if (existInRoom)
                return helpers_2.respError(next, code_1.default.GAME.ALREADY_JOIN_GAME);
            const [user, userInfo] = yield Promise.all([
                db_1.UserModel.findGameUser(session.uid),
                coreComponent.container.userCache.findUserSession(session.get('shortId'))
            ]);
            if (user == null || userInfo == null)
                return helpers_2.respError(next, code_1.default.NO_EXIST_USER);
            const gameComponent = this.app.components.game;
            const gameManage = gameComponent.container.gameManage;
            const game = gameManage.findGame(msg.roomId);
            if (!(game != null))
                return helpers_2.respError(next, code_1.default.GAME.NO_EXIST_GAME);
            if (game.isGameFull())
                return helpers_2.respError(next, code_1.default.GAME.GAME_FULL);
            if (!helpers_1.hasEnoughGameCard(user, game.roomConfig, game.gameConfig))
                return helpers_2.respError(next, code_1.default.GAME.NOT_ENOUGH_GAMECARDS);
            game.join(user, userInfo, session, true);
            helpers_2.respOK(next);
        }));
    }
    leave(msg, session, next) {
        return __awaiter(this, void 0, void 0, function* () {
            Raven.context(() => {
                helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                    if (!(game.isStart == false && game.fsm.is('ready')))
                        return helpers_2.respError(next, code_1.default.GAME.STATE_ERROR);
                    game.leave(session.uid, session);
                    helpers_2.respOK(next);
                });
            });
        });
    }
    sitdown(msg, session, next) {
        return __awaiter(this, void 0, void 0, function* () {
            Raven.context(() => {
                helpers_1.handleGame.bind(this)(msg, session, next, (game) => {
                    const gameWatcher = _.find(game.gameWatchers, { uid: session.uid });
                    if (gameWatcher == undefined)
                        return helpers_2.respError(next, code_1.default.FAIL);
                    if (game.isGameFull())
                        return next(null, { code: code_1.default.GAME.GAME_FULL });
                    if (game.isAboutToFinish())
                        return next(null, { code: code_1.default.GAME.IS_ABOUT_TO_FINISH });
                    if (!helpers_1.hasEnoughGameCard(gameWatcher.user, game.roomConfig, game.gameConfig))
                        return helpers_2.respError(next, code_1.default.GAME.NOT_ENOUGH_GAMECARDS);
                    game.sitdown(gameWatcher, session);
                    helpers_2.respOK(next);
                });
            });
        });
    }
    standup(msg, session, next) {
        return __awaiter(this, void 0, void 0, function* () {
            Raven.context(() => {
                helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                    if (!game.fsm.is('ready'))
                        return helpers_2.respError(next, code_1.default.GAME.STATE_ERROR);
                    if (!(game.currentRound == 0 && gamePlayer.joined == false))
                        return helpers_2.respError(next, code_1.default.FAIL);
                    game.standup(gamePlayer, session);
                    helpers_2.respOK(next);
                });
            });
        });
    }
    ready(msg, session, next) {
        Raven.context(() => {
            helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                if (!game.fsm.is('ready'))
                    return helpers_2.respError(next, code_1.default.GAME.STATE_ERROR);
                game.ready(session.uid);
                helpers_2.respOK(next);
            });
        });
    }
    cancelReady(msg, session, next) {
        Raven.context(() => {
            helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                if (!game.fsm.is('ready'))
                    return helpers_2.respError(next, code_1.default.GAME.STATE_ERROR);
                game.cancelReady(session.uid);
                helpers_2.respOK(next);
            });
        });
    }
    ownerReady(msg, session, next) {
        return __awaiter(this, void 0, void 0, function* () {
            Raven.context(() => {
                helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                    if (game.owner.id == session.uid &&
                        game.gameConfig.ownerReadyEnabled == true &&
                        game.isOwnerReady == false &&
                        game.fsm.is('ready') &&
                        game.currentRound == 0 &&
                        game.readyIds.length >= game.getRealGamePlayersCount() &&
                        game.readyIds.length >= 2) {
                        game.ownerReady();
                        helpers_2.respOK(next);
                    }
                    else {
                        next(null, code_1.default.FAIL);
                    }
                });
            });
        });
    }
    chat(msg, session, next) {
        return __awaiter(this, void 0, void 0, function* () {
            Raven.context(() => {
                const validate = helpers_1.JoiValidate(msg, {
                    type: Joi.number().integer().min(0).max(2).required(),
                    index: Joi.number().integer().min(0).max(100).required(),
                    targetId: Joi.string().allow("")
                }, next);
                if (!validate)
                    return;
                helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                    game.container.chat.chat(gamePlayer, msg);
                    helpers_2.respOK(next);
                });
            });
        });
    }
    chatText(msg, session, next) {
        return __awaiter(this, void 0, void 0, function* () {
            Raven.context(() => {
                const validate = helpers_1.JoiValidate(msg, {
                    text: Joi.string().max(300).required()
                }, next);
                if (!validate)
                    return;
                helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                    game.container.chat.chatText(gamePlayer, msg.text);
                    helpers_2.respOK(next);
                });
            });
        });
    }
    chatHistory(msg, session, next) {
        return __awaiter(this, void 0, void 0, function* () {
            Raven.context(() => {
                helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                    helpers_2.respOK(next, game.container.chat.recentChatRecords());
                });
            });
        });
    }
    kick(msg, session, next) {
        return __awaiter(this, void 0, void 0, function* () {
            Raven.context(() => {
                const validate = helpers_1.JoiValidate(msg, {
                    uid: Joi.string().required()
                }, next);
                if (!validate)
                    return;
                helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                    if (session.uid == msg.uid)
                        return helpers_2.respError(next, code_1.default.FAIL);
                    if (session.uid != game.owner.id)
                        return helpers_2.respError(next, code_1.default.FAIL);
                    if (!(game.isStart == false && game.fsm.is('ready')))
                        return helpers_2.respError(next, code_1.default.GAME.STATE_ERROR);
                    game.leave(msg.uid, session, 'kick');
                    helpers_2.respOK(next);
                });
            });
        });
    }
}
module.exports = function newHandler(app) {
    return new GameHandler(app);
};
