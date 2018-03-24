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
const db_1 = require("../../../extend/db");
class GroupHandler {
    constructor(app) {
        this.app = app;
    }
    // 创建群组
    createGroup(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                name: Joi.string().required()
            }, next);
            if (!validate)
                return;
            const curatorUser = yield db_1.UserModel.findCuratorByShortId(session.get('shortId'));
            if (curatorUser == null)
                return helpers_1.respError(next, code_1.default.NO_EXIST_USER);
            if (curatorUser.curator == null)
                return helpers_1.respError(next, code_1.default.USER.NOT_CURATOR);
            const groupId = yield db_1.CuratorGroupModel.createCommonGroup(curatorUser._id, msg.name);
            if (groupId == null)
                return helpers_1.respError(next, code_1.default.ERROR);
            helpers_1.respOK(next, groupId);
        }));
    }
    // 修改群组名称
    changeGroupName(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                groupId: Joi.string().required(),
                name: Joi.string().required()
            }, next);
            if (!validate)
                return;
            const result = yield db_1.CuratorGroupModel.updateGroupName(msg.groupId, msg.name);
            if (result.nModified == 0)
                return helpers_1.respError(next, code_1.default.GROUP.NOT_EXIST_GROUP);
            helpers_1.respOK(next, {});
        }));
    }
    // 获取群组列表
    groupList(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const core = this.app.components.core;
            const [userSession1] = yield Promise.all([
                core.container.userCache.findUserSession(session.get('shortId')),
            ]);
            if (userSession1 == null)
                helpers_1.respError(next, code_1.default.NO_EXIST_USER);
            const groups = yield db_1.CuratorGroupModel.getGroups(userSession1.uid);
            if (groups == null)
                helpers_1.respError(next, code_1.default.GROUP.ERROR);
            helpers_1.respOK(next, groups);
        }));
    }
    // 获取某群组成员列表
    memberList(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                groupId: Joi.string().required()
            }, next);
            if (!validate)
                return;
            const members = yield db_1.CuratorGroupModel.getGroupMembers(msg.groupId);
            if (members == null)
                return helpers_1.respError(next, code_1.default.GROUP.NOT_EXIST_GROUP);
            helpers_1.respOK(next, members);
        }));
    }
    // 获取某群组游戏列表
    gameList(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                groupId: Joi.string().required()
            }, next);
            if (!validate)
                return;
            const coreComponent = this.app.components.core;
            const roomCache = coreComponent.container.roomCache;
            const roomsInfo = yield roomCache.getRoomsInfoByGroupId(msg.groupId);
            helpers_1.respOK(next, roomsInfo);
        }));
    }
    // 解散群组
    destroyGroup(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                groupId: Joi.string().required()
            }, next);
            if (!validate)
                return;
            const result = yield db_1.CuratorGroupModel.removeGroup(msg.groupId);
            if (result == null)
                return helpers_1.respError(next, code_1.default.GROUP.NOT_EXIST_GROUP);
            helpers_1.respOK(next, {});
        }));
    }
    // 分配某些成员到某群组
    assignMembersToGroup(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                uids: Joi.array().items(Joi.string()).required(),
                groupId: Joi.string().required()
            }, next);
            if (!validate)
                return;
            const members = yield db_1.CuratorGroupModel.insertMembers(msg.groupId, msg.uids);
            if (members == null)
                return helpers_1.respError(next, code_1.default.GROUP.NOT_EXIST_GROUP);
            helpers_1.respOK(next, members);
        }));
    }
    // 把某些成员从群组移除
    removeMembersFromGroup(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                uids: Joi.array().items(Joi.string()).required(),
                groupId: Joi.string().required()
            }, next);
            if (!validate)
                return;
            const members = yield db_1.CuratorGroupModel.removeMembers(msg.groupId, msg.uids);
            if (members == null)
                return helpers_1.respError(next, code_1.default.GROUP.NOT_EXIST_GROUP);
            helpers_1.respOK(next);
        }));
    }
}
module.exports = function newHandler(app) {
    return new GroupHandler(app);
};
