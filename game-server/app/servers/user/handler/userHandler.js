"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Raven = require("raven");
const helpers_1 = require("../../../util/helpers");
const Joi = require("joi");
const code_1 = require("../../../consts/code");
const pushEvent_1 = require("../../../consts/pushEvent");
const db_1 = require("../../../extend/db");
class UserHandler {
    constructor(app) {
        this.app = app;
    }
    /**
     * 获取用户详情
     * @param msg
     * @param session
     * @param next
     */
    getUserDetail(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                shortId: Joi.number().required()
            }, next);
            if (!validate)
                return;
            const core = this.app.components.core;
            const userSession2 = yield core.container.userCache.findUserSession(msg.shortId);
            const friend = yield db_1.UserModel.findUserDetail(msg.shortId);
            if (userSession2 != null) {
                userSession2.shortId = msg.shortId;
                delete userSession2.game;
                delete userSession2.sid;
                delete userSession2.roomId;
                userSession2.loc = friend.loc;
                return helpers_1.respOK(next, userSession2);
            }
            ;
            const detail = yield core.container.userCache.addUser(friend);
            helpers_1.respOK(next, detail);
        }));
    }
    /**
     * 绑定棋牌室
     * @param msg
     * @param session
     * @param next
     */
    bindChessRoom(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                shortId: Joi.number().required() //馆长shorId
            }, next);
            if (!validate)
                return;
            const user = yield db_1.UserModel.findUserByShortIdCustomSelect(session.get('shortId'), '_id nickname shortId chessRoomId');
            const curatorUser = yield db_1.UserModel.findCuratorByShortId(msg.shortId);
            if (user == null)
                return helpers_1.respError(next, code_1.default.NO_EXIST_USER);
            if (user.chessRoomId != 0)
                return helpers_1.respError(next, code_1.default.USER.ALREADY_BINDCHESSROOM);
            if (curatorUser == null)
                return helpers_1.respError(next, code_1.default.NO_EXIST_USER);
            if (curatorUser.curator == null)
                return helpers_1.respError(next, code_1.default.USER.NOT_CURATOR);
            const chessRoomId = curatorUser.curator.shortId;
            const curatorId = curatorUser._id;
            const agentId = curatorUser.agentParent;
            const result = yield db_1.UserModel.bindChessRoom(user._id, curatorUser._id, chessRoomId, agentId);
            if (result.nModified = 0)
                return helpers_1.respError(next, code_1.default.ERROR);
            const info = { shortId: session.get('shortId'), nickname: user.nickname };
            this.app.get('statusService').pushByUids([user._id], pushEvent_1.default.onBindChessRoom, info);
            helpers_1.respOK(next);
        }));
    }
    /**
     * 获取用户游戏(chess)
     * @param msg
     * @param session
     * @param next
     */
    getUserGame(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const core = this.app.components.core;
            const [userSession1] = yield Promise.all([
                core.container.userCache.findUserSession(session.get('shortId'))
            ]);
            if (userSession1 == undefined)
                return helpers_1.respError(next, code_1.default.NO_EXIST_USER);
            const selectKey = 'game.chess';
            const result = yield db_1.UserModel.findUserByIdCustomSelect(userSession1.uid, selectKey);
            helpers_1.respOK(next, result.game);
        }));
    }
    /**
     * 添加用户游戏
     * @param msg
     * @param session
     * @param next
     */
    addUserGame(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                game: Joi.string().required()
            }, next);
            if (!validate)
                return;
            const core = this.app.components.core;
            const [userSession1] = yield Promise.all([
                core.container.userCache.findUserSession(session.get('shortId'))
            ]);
            if (userSession1 == undefined)
                return helpers_1.respError(next, code_1.default.NO_EXIST_USER);
            const result = yield db_1.UserModel.addUserGameById(userSession1.uid, msg.game);
            if (result.nModified == 0)
                return helpers_1.respError(next, code_1.default.ERROR);
            helpers_1.respOK(next);
        }));
    }
    /**
     * 删除用户游戏
     * @param msg
     * @param session
     * @param next
     */
    removeUserGame(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                game: Joi.string().required()
            }, next);
            if (!validate)
                return;
            const core = this.app.components.core;
            const [userSession1] = yield Promise.all([
                core.container.userCache.findUserSession(session.get('shortId'))
            ]);
            if (userSession1 == undefined)
                return helpers_1.respError(next, code_1.default.NO_EXIST_USER);
            const result = yield db_1.UserModel.removeUserGameById(userSession1.uid, msg.game);
            if (result.nModified == 0)
                return helpers_1.respError(next, code_1.default.ERROR);
            helpers_1.respOK(next);
        }));
    }
}
module.exports = function newHandler(app) {
    return new UserHandler(app);
};
