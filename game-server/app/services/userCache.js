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
const config = require("config");
const Keyv = require("keyv");
const redisConfig = config.get('redis');
const port = config.get('redis.port');
const host = config.get('redis.host');
const password = config.get('redis.password');
const db = config.get('redis.defaultDB');
class UserCache {
    constructor() {
        this.keyPrefix = 'users';
        this.keyv = new Keyv('', {
            port: redisConfig.port,
            host: redisConfig.host,
            password: redisConfig.password != "" ? redisConfig.password : undefined,
            db: redisConfig.defaultDB,
            adapter: 'redis',
            namespace: this.keyPrefix
        });
        this.keyv.on('error', err => console.error('Connection Error', err));
    }
    online(user, userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this.keyv.get(user.shortId);
            const data = {
                uid: user.id,
                nickname: user.nickname,
                sex: user.sex,
                headimgurl: user.headimgurl,
                sid: userInfo['sid'],
                ip: userInfo['ip'],
                province: userInfo['province'],
                city: userInfo['city']
            };
            if (!userData) {
                this.keyv.set(user.shortId, _.assign(data, { game: "", online: true, roomId: "", status: "idle" }));
            }
            else {
                userData.online = true;
                this.keyv.set(user.shortId, _.assign(userData, data));
            }
        });
    }
    offline(shortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = yield this.keyv.get(shortId);
            if (userInfo != undefined) {
                this.keyv.set(shortId, _.assign(userInfo, { online: false }));
            }
        });
    }
    joinGame(shortId, game, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = yield this.keyv.get(shortId);
            if (userInfo != undefined) {
                this.keyv.set(shortId, _.assign(userInfo, { game, roomId, status: 'ready' }));
            }
        });
    }
    startGame(shortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = yield this.keyv.get(shortId);
            if (userInfo != undefined) {
                this.keyv.set(shortId, _.assign(userInfo, { status: 'gaming' }));
            }
        });
    }
    endGame(shortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = yield this.keyv.get(shortId);
            if (userInfo != undefined) {
                this.keyv.set(shortId, _.assign(userInfo, { game: "", roomId: "", status: "idle" }));
            }
        });
    }
    updateUserSession(shortId, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = yield this.keyv.get(shortId);
            if (userInfo != undefined) {
                this.keyv.set(shortId, _.assign(userInfo, value));
            }
        });
    }
    findUserSession(shortId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keyv.get(shortId);
        });
    }
    findUserAndMerge(friend) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.keyv.get(friend.shortId);
            if (data) {
                const info = {
                    uid: data.uid,
                    online: data.online,
                    shortId: friend.shortId,
                    headimgurl: friend.headimgurl,
                    nickname: friend.nickname,
                    status: data.status,
                    sex: data.sex
                };
                return info;
            }
            const user = {
                uid: friend._id,
                shortId: friend.shortId,
                headimgurl: friend.headimgurl,
                nickname: friend.nickname,
                online: false,
                status: "idle",
                sex: friend.sex
            };
            return user;
        });
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                uid: user._id,
                headimgurl: user.headimgurl,
                nickname: user.nickname,
                sex: user.sex,
                online: false,
                status: "idle",
                province: [],
                city: [],
                shortId: user.shortId,
                loc: user.loc
            };
            this.keyv.set(user.shortId, data);
            return data;
        });
    }
}
exports.default = UserCache;
