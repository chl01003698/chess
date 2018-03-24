'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Keyv = require("keyv");
class UserCache {
    constructor(redisConfig) {
        this.keyv = new Keyv('', redisConfig);
        this.keyv.on('error', err => console.error('Connection Error', err));
    }
    async online(user, userInfo) {
        const userData = await this.keyv.get(user.shortId);
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
            this.keyv.set(user.shortId, _.assign(data, { game: "", online: true, roomId: "" }));
        }
        else {
            this.keyv.set(user.shortId, _.assign(userData, data));
        }
    }
    async offline(shortId) {
        const userInfo = await this.keyv.get(shortId);
        if (userInfo != undefined) {
            this.keyv.set(shortId, _.assign(userInfo, { online: false }));
        }
    }
    async startGame(shortId, game, roomId) {
        const userInfo = await this.keyv.get(shortId);
        if (userInfo != undefined) {
            this.keyv.set(shortId, _.assign(userInfo, { game, roomId }));
        }
    }
    async endGame(shortId) {
        const userInfo = await this.keyv.get(shortId);
        if (userInfo != undefined) {
            this.keyv.set(shortId, _.assign(userInfo, { game: "", roomId: "" }));
        }
    }
    async updateUserSession(shortId, value) {
        const userInfo = await this.keyv.get(shortId);
        if (userInfo != undefined) {
            this.keyv.set(shortId, _.assign(userInfo, value));
        }
    }
    async findUserSession(shortId) {
        const user = await this.keyv.get(shortId);
        console.log('user=>', user);
        return await this.keyv.get(shortId);
    }
}
exports.default = UserCache;
