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
const code_1 = require("../consts/code");
const _ = require("lodash");
const config = require("config");
const helpers_1 = require("../util/helpers");
const axios_1 = require("axios");
const moment = require("moment");
const Raven = require("raven");
function getResetUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        if (!moment().isSame(user.loginAt, 'day')) {
            user.loginAt = now;
            return yield user.save();
        }
        return user;
    });
}
function onSessionClosed(app, session, reason) {
    try {
        if (!session || !session.uid) {
            return;
        }
        const core = app.components.core;
        if (session.get('shortId') != undefined) {
            core.container.userCache.offline(session.get('shortId'));
        }
        helpers_1.callFGameRemoteFunc(app, session, 'onUserLogout');
    }
    catch (error) {
        Raven.captureException(error);
    }
}
function bindSessionAndNext(app, msg, session, next, user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = user.id;
            app.get('sessionService').kick(userId, { text: '您的帐户已在其他地方登录' }, function () { });
            user = yield getResetUser(user);
            session.bind(userId);
            session.set('shortId', user.shortId);
            const userInfo = {
                ip: '',
                sid: session.frontendId,
                province: '',
                city: ''
            };
            let ip = session.__session__.__socket__.remoteAddress.ip;
            if (ip != null) {
                const ipArray = ip.split(':');
                if (ipArray.length > 0) {
                    ip = ipArray[ipArray.length - 1];
                    userInfo.ip = ip;
                    const response = yield axios_1.default.get(`http://restapi.amap.com/v3/ip?ip=${session.get('ip')}&output=json&key=${config.get('gaodeKey')}`);
                    const jsonObject = response.data;
                    if (_.isString(jsonObject['status']) && jsonObject['status'] == '1') {
                        userInfo.province = jsonObject['province'];
                        userInfo.city = jsonObject['city'];
                    }
                }
            }
            if (app.get('sessionService').get(session.id) != null) {
                const core = app.components.core;
                core.container.userCache.online(user, userInfo);
                session.pushAll((error) => {
                    if (error != null)
                        throw error;
                });
                session.on('disconnect', () => {
                });
                session.on('closed', _.bind(onSessionClosed, _, app));
                const roomInfo = yield core.container.roomCache.getRoomInfoByPlayerId(user.shortId);
                if (roomInfo != null && _.isString(roomInfo.serverId) && _.isString(roomInfo.roomId)) {
                    helpers_1.callFGameRemoteFuncWithData(app, roomInfo.serverId, {
                        uid: user.id,
                        sid: session.frontendId,
                        roomId: roomInfo.roomId
                    }, 'onUserLogin');
                }
                helpers_1.respOK(next, { user, ip });
            }
            else {
                helpers_1.respError(next, code_1.default.NO_EXIST_SESSION);
            }
        }
        catch (error) {
            Raven.captureException(error);
        }
    });
}
exports.bindSessionAndNext = bindSessionAndNext;
