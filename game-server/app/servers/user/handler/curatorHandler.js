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
class CuratorHandler {
    constructor(app) {
        this.app = app;
    }
    // 获取牌桌详情
    getRoomDetail(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                roomId: Joi.string().required()
            }, next);
            if (!validate)
                return;
            const coreComponent = this.app.components.core;
            const roomCache = coreComponent.container.roomCache;
            const roomInfo = yield roomCache.getRoomInfoByRoomId(msg.roomId);
            if (roomInfo == null)
                return helpers_1.respError(next, code_1.default.GAME.NO_EXIST_GAME);
            helpers_1.respOK(next, roomInfo);
        }));
    }
    // 获取代开桌列表
    getRoomsInfo(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const coreComponent = this.app.components.core;
            const roomCache = coreComponent.container.roomCache;
            const roomsInfo = yield roomCache.getRoomsInfoByPlayerId(session.get('shortId'));
            helpers_1.respOK(next, roomsInfo);
        }));
    }
}
module.exports = function newHandler(app) {
    return new CuratorHandler(app);
};
