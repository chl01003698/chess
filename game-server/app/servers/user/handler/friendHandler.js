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
const Raven = require("raven");
const helpers_1 = require("../../../util/helpers");
const Joi = require("joi");
const code_1 = require("../../../consts/code");
const pushEvent_1 = require("../../../consts/pushEvent");
const db_1 = require("../../../extend/db");
const friend_1 = require("../../../services/friend");
class FriendHandler {
    constructor(app) {
        this.app = app;
    }
    /**
     * 邀请好友加入房间
     * @param msg
     * @param session
     * @param next
     */
    inviteJoinGame(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                shortId: Joi.number().required()
            }, next);
            if (!validate)
                return;
            const core = this.app.components.core;
            const [userSession1, userSession2] = yield Promise.all([
                core.container.userCache.findUserSession(session.get('shortId')),
                core.container.userCache.findUserSession(msg.shortId)
            ]);
            if (userSession1 == undefined || userSession2 == undefined)
                return helpers_1.respError(next, code_1.default.NO_EXIST_USER);
            if (userSession2.roomId != "")
                return helpers_1.respError(next, code_1.default.GAME.ALREADY_JOIN_GAME);
            if (userSession1.roomId == "")
                return helpers_1.respError(next, code_1.default.GAME.USER_NO_EXIST_IN_GAME);
            const info = { shortId: session.get('shortId'), nickname: userSession1.nickname, roomId: userSession1.roomId };
            this.app.get('statusService').pushByUids([userSession2.uid], pushEvent_1.default.onInviteJoinGame, info);
            helpers_1.respOK(next);
        }));
    }
    /**
     * 拒绝好友邀请
     * @param msg
     * @param session
     * @param next
     */
    refuseInvite(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                shortId: Joi.number().required()
            }, next);
            if (!validate)
                return;
            const core = this.app.components.core;
            const [userSession1, userSession2] = yield Promise.all([
                core.container.userCache.findUserSession(session.get('shortId')),
                core.container.userCache.findUserSession(msg.shortId)
            ]);
            if (userSession1 == undefined || userSession2 == undefined)
                return helpers_1.respError(next, code_1.default.NO_EXIST_USER);
            const info = { shortId: session.get('shortId'), nickname: userSession1.nickname };
            this.app.get('statusService').pushByUids([userSession2.uid], pushEvent_1.default.onRefuseInvite, info);
            helpers_1.respOK(next);
        }));
    }
    /**
     * 进入好友房间
     * @param msg
     * @param session
     * @param next
     */
    joinFriendGame(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                shortId: Joi.number().required()
            }, next);
            if (!validate)
                return;
            const core = this.app.components.core;
            const [userSession1, userSession2] = yield Promise.all([
                core.container.userCache.findUserSession(session.get('shortId')),
                core.container.userCache.findUserSession(msg.shortId)
            ]);
            if (userSession1 == undefined || userSession2 == undefined)
                return helpers_1.respError(next, code_1.default.FAIL);
            if (userSession2.roomId == "")
                return helpers_1.respError(next, code_1.default.GAME.USER_NO_EXIST_IN_GAME);
            if (userSession1.roomId != "")
                return helpers_1.respError(next, code_1.default.GAME.ALREADY_JOIN_GAME);
            const info = { shortId: session.get('shortId'), nickname: userSession1.nickname };
            this.app.get('statusService').pushByUids([userSession2.uid], pushEvent_1.default.onJoinFriendGame, info);
            helpers_1.respOK(next);
        }));
    }
    /**
     * 拒绝加入房间
     * @param msg
     * @param session
     * @param next
     */
    refuseJoinGame(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                shortId: Joi.number().required()
            }, next);
            if (!validate)
                return;
            const core = this.app.components.core;
            const [userSession1, userSession2] = yield Promise.all([
                core.container.userCache.findUserSession(session.get('shortId')),
                core.container.userCache.findUserSession(msg.shortId)
            ]);
            if (userSession1 == undefined || userSession2 == undefined)
                return helpers_1.respError(next, code_1.default.NO_EXIST_USER);
            const info = { shortId: session.get('shortId'), nickname: userSession1.nickname };
            this.app.get('statusService').pushByUids([userSession2.uid], pushEvent_1.default.onRefuseJoinGame, info);
            helpers_1.respOK(next);
        }));
    }
    /**
     * 同意加入房间
     * @param msg
     * @param session
     * @param next
     */
    agreeJoinGame(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                shortId: Joi.number().required()
            }, next);
            if (!validate)
                return;
            const core = this.app.components.core;
            const [userSession1, userSession2] = yield Promise.all([
                core.container.userCache.findUserSession(session.get('shortId')),
                core.container.userCache.findUserSession(msg.shortId)
            ]);
            if (userSession1 == undefined || userSession2 == undefined)
                return helpers_1.respError(next, code_1.default.NO_EXIST_USER);
            const info = { shortId: session.get('shortId'), nickname: userSession1.nickname, roomId: userSession1.roomId };
            this.app.get('statusService').pushByUids([userSession2.uid], pushEvent_1.default.onAgreeJoinGame, info);
            helpers_1.respOK(next);
        }));
    }
    //##############################################################################################
    //#################################### 下面为好友部分 ###########################################
    //##############################################################################################
    /**
     * 加好友
     * @param msg
     * @param session
     * @param next
     */
    addFriend(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                shortId: Joi.number().required()
            }, next);
            if (!validate)
                return;
            const core = this.app.components.core;
            const [userSession1, userSession2] = yield Promise.all([
                core.container.userCache.findUserSession(session.get('shortId')),
                core.container.userCache.findUserSession(msg.shortId)
            ]);
            if (userSession1 == undefined || userSession2 == undefined)
                return helpers_1.respError(next, code_1.default.NO_EXIST_USER);
            const result = yield friend_1.default.addFriend(session.uid, userSession2.uid);
            if (result == null)
                return helpers_1.respError(next, code_1.default.ERROR);
            const info = _.pick(userSession1, ['uid', 'nickname', 'sex', 'headimgurl', 'status']);
            info.shortId = session.get('shortId');
            this.app.get('statusService').pushByUids([userSession2.uid], pushEvent_1.default.onAddFriend, info);
            helpers_1.respOK(next);
        }));
    }
    /**
     * 同意加为好友
     * @param msg
     * @param session
     * @param next
     */
    agree(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                shortId: Joi.number().required()
            }, next);
            if (!validate)
                return;
            const core = this.app.components.core;
            const [userSession2] = yield Promise.all([
                core.container.userCache.findUserSession(msg.shortId)
            ]);
            const result = yield friend_1.default.addFriend(session.uid, userSession2.uid);
            if (result == null)
                return helpers_1.respError(next, code_1.default.ERROR);
            helpers_1.respOK(next);
        }));
    }
    /**
     * 好友列表
     * @param msg
     * @param session
     * @param next
     */
    getFriends(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const result = yield friend_1.default.getFriends(session.uid);
            if (result == null)
                return helpers_1.respError(next, code_1.default.ERROR);
            let friends = new Array();
            const core = this.app.components.core;
            const length = result.length;
            for (let x = 0; x < length; x++) {
                const friend = core.container.userCache.findUserAndMerge(result[x].friend);
                if (friend)
                    friends.push(friend);
            }
            const datas = yield Promise.all(friends);
            helpers_1.respOK(next, datas);
        }));
    }
    /**
     * 好友申请列表
     * @param msg
     * @param session
     * @param next
     */
    getPendings(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const core = this.app.components.core;
            const result = yield friend_1.default.getPendings(session.uid);
            if (result == null)
                return helpers_1.respError(next, code_1.default.ERROR);
            const friends = new Array();
            const length = result.length;
            for (let x = 0; x < length; x++) {
                const friend = friend_1.default._(result[x].friend);
                if (friend)
                    friends.push(friend);
            }
            const datas = yield Promise.all(friends);
            helpers_1.respOK(next, datas);
        }));
    }
    /**
     * 删除好友
     * @param msg
     * @param session
     * @param next
     */
    removeFriend(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                shortId: Joi.number().required()
            }, next);
            if (!validate)
                return;
            const core = this.app.components.core;
            const userSession2 = yield core.container.userCache.findUserSession(msg.shortId);
            const result = yield friend_1.default.removeFriend(session.uid, userSession2.uid);
            if (result == null)
                return helpers_1.respError(next, code_1.default.ERROR);
            helpers_1.respOK(next);
        }));
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
}
module.exports = function newHandler(app) {
    return new FriendHandler(app);
};
