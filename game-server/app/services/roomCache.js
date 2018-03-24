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
const Joi = require("joi");
const helpers_1 = require("../util/helpers");
const _ = require("lodash");
const config = require("config");
const redisConfig = config.get('redis');
const Raven = require("raven");
const pushEvent_1 = require("../consts/pushEvent");
const Keyv = require("keyv");
class RoomCache {
    constructor(redis, app) {
        this.redis = redis;
        this.app = app;
        this.roomKeyPrefix = 'rooms';
        this.roomPlayersKeyPrefix = 'room:players:';
        this.roomWatchersKeyPrefix = 'room:watchers:';
        this.roomPlayersKey = 'room:players';
        this.playerRoomsKeyPrefix = 'player:rooms:';
        this.groupRoomsKeyPrefix = 'group:rooms:';
        this.keyv = new Keyv('', {
            port: redisConfig.port,
            host: redisConfig.host,
            password: redisConfig.password != "" ? redisConfig.password : undefined,
            db: redisConfig.defaultDB,
            adapter: 'redis',
            namespace: this.roomKeyPrefix
        });
        this.keyv.on('error', err => console.error('Connection Error', err));
    }
    createRoom(args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = {
                    roomId: Joi.string().required(),
                    serverId: Joi.string().required(),
                    game: Joi.string().required(),
                    type: Joi.string().required(),
                    playerNumber: Joi.number().required(),
                    watcherNumber: Joi.number().required(),
                    ownerId: Joi.string().required(),
                    ownerShortId: Joi.number().required(),
                    currentRound: Joi.number().required(),
                    playerCount: Joi.number().required(),
                    state: Joi.number().default(0).required(),
                    groupId: Joi.number().optional(),
                    config: Joi.object().required().keys({
                        type: Joi.string().required(),
                        expendIndex: Joi.number().min(0).max(3).required(),
                        private: Joi.boolean().optional()
                    })
                };
                const result = Joi.validate(args, schema, helpers_1.validateOptions);
                if (result.error != null) {
                    throw result.error;
                }
                this.redis.lpush(`${this.playerRoomsKeyPrefix}${args.ownerId}`, args.roomId);
                if (_.isNumber(args.groupId) && args.groupId > 0) {
                    this.redis.lpush(`${this.groupRoomsKeyPrefix}${args.groupId}`, args.roomId);
                    // todo: 推送群组创建房间消息
                }
                this.pushRoomCreateMessage(args.ownerId, args);
                return yield this.keyv.set(args['roomId'], args);
            }
            catch (e) {
                Raven.captureException(e);
            }
        });
    }
    joinRoom(args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = {
                    roomId: Joi.string().required(),
                    shortId: Joi.number().required(),
                    watcher: Joi.boolean().optional()
                };
                const result = Joi.validate(args, schema, helpers_1.validateOptions);
                if (result.error != null) {
                    throw result.error;
                }
                const roomInfo = yield this.keyv.get(args['roomId']);
                if (roomInfo != undefined) {
                    if (args['watcher'] == true) {
                        ++roomInfo.watcherNumber;
                        this.redis.sadd(`${this.roomWatchersKeyPrefix}${args['roomId']}`, args['shortId']);
                    }
                    else {
                        ++roomInfo.playerNumber;
                        this.redis.sadd(`${this.roomPlayersKeyPrefix}${args['roomId']}`, args['shortId']);
                    }
                    this.keyv.set(args['roomId'], roomInfo);
                    this.redis.hset(this.roomPlayersKey, args['shortId'], args['roomId']);
                    this.pushRoomChangeMessage(roomInfo.ownerId, roomInfo);
                }
            }
            catch (error) {
                Raven.captureException(error);
            }
        });
    }
    leaveRoom(args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = {
                    roomId: Joi.string().required(),
                    shortId: Joi.number().required(),
                    watcher: Joi.boolean().optional()
                };
                const result = Joi.validate(args, schema, helpers_1.validateOptions);
                if (result.error != null) {
                    throw result.error;
                }
                this.redis.hdel(this.roomPlayersKey, args['shortId']);
                const roomInfo = yield this.keyv.get(args['roomId']);
                if (roomInfo != undefined) {
                    if (args['watcher'] == true) {
                        --roomInfo.watcherNumber;
                        this.redis.srem(`${this.roomWatchersKeyPrefix}${args['roomId']}`, args['shortId']);
                    }
                    else {
                        --roomInfo.playerNumber;
                        this.redis.srem(`${this.roomPlayersKeyPrefix}${args['roomId']}`, args['shortId']);
                    }
                    this.keyv.set(args['roomId'], roomInfo);
                    this.pushRoomChangeMessage(roomInfo.ownerId, roomInfo);
                }
            }
            catch (error) {
                Raven.captureException(error);
            }
        });
    }
    destroyRoom(args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = {
                    roomId: Joi.string().required()
                };
                const result = Joi.validate(args, schema, helpers_1.validateOptions);
                if (result.error != null) {
                    throw result.error;
                }
                const roomInfo = yield this.keyv.get(args['roomId']);
                if (roomInfo != undefined) {
                    const members = yield this.redis.smembers(`${this.roomPlayersKeyPrefix}${args['roomId']}`);
                    if (_.isArray(members) && members.length > 0) {
                        this.redis.hdel(this.roomPlayersKey, members);
                    }
                    const watchers = yield this.redis.smembers(`${this.roomWatchersKeyPrefix}${args['roomId']}`);
                    if (_.isArray(watchers) && watchers.length > 0) {
                        this.redis.hdel(this.roomPlayersKey, watchers);
                    }
                    this.redis.lrem(`${this.playerRoomsKeyPrefix}${roomInfo.owner}`, 0, roomInfo.roomId);
                    if (_.isNumber(roomInfo.groupId) && roomInfo.groupId > 0) {
                        this.redis.lrem(`${this.groupRoomsKeyPrefix}${roomInfo.groupId}`, 0, roomInfo.roomId);
                        // todo: 推送群组在线成员,游戏结束消息
                    }
                    this.keyv.delete(args['roomId']);
                    this.redis.del(`${this.roomPlayersKeyPrefix}${args['roomId']}`);
                    this.redis.del(`${this.roomWatchersKeyPrefix}${args['roomId']}`);
                    this.pushRoomDestroy(roomInfo.ownerId, roomInfo.roomId);
                }
            }
            catch (error) {
                Raven.captureException(error);
            }
        });
    }
    getRoomInfoByRoomId(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keyv.get(roomId);
        });
    }
    getRoomMembersByRoomId(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const members = yield this.redis.smembers(`${this.roomPlayersKeyPrefix}${roomId}`);
            return members;
        });
    }
    getRoomAtServerId(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.keyv.get(roomId);
            if (result != undefined) {
                return result['serverId'];
            }
            return undefined;
        });
    }
    getRoomsInfoByPlayerId(shortId) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = [];
            const roomIds = yield this.redis.lrange(`${this.playerRoomsKeyPrefix}${shortId}`, 0, -1);
            if (roomIds.length == 0) {
                return [];
            }
            else {
                results = yield Promise.all(roomIds.map((roomId) => __awaiter(this, void 0, void 0, function* () {
                    return yield this.keyv.get(roomId);
                })));
            }
            return results;
        });
    }
    getRoomsInfoByGroupId(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = [];
            const roomIds = yield this.redis.lrange(`${this.groupRoomsKeyPrefix}${groupId}`, 0, -1);
            if (roomIds.length == 0) {
                return [];
            }
            else {
                results = yield Promise.all(roomIds.map((roomId) => __awaiter(this, void 0, void 0, function* () {
                    return yield this.keyv.get(roomId);
                })));
            }
            return results;
        });
    }
    updateRoomInfo(roomId, object, needPush = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let roomInfo = yield this.getRoomInfoByRoomId(roomId);
            if (roomInfo != null) {
                roomInfo = _.assign(roomInfo, object);
                this.keyv.set(roomId, roomInfo);
                if (needPush && _.isString(roomInfo.ownerId) && roomInfo.ownerId != "") {
                    this.pushRoomChangeMessage(roomInfo.ownerId, roomInfo);
                }
            }
        });
    }
    getRoomInfoByPlayerId(shortId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = null;
            const roomId = yield this.redis.hget(this.roomPlayersKey, shortId);
            if (_.isString(roomId) && roomId.length > 0) {
                const roomInfo = yield this.keyv.get(roomId);
                if (!_.isEmpty(roomInfo)) {
                    result = roomInfo;
                }
            }
            return result;
        });
    }
    existPlayerInRoom(shortId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = false;
            const roomId = yield this.redis.hget(this.roomPlayersKey, shortId);
            if (_.isString(roomId) && roomId.length > 0) {
                result = true;
            }
            return result;
        });
    }
    getPlayerRoomCount(shortId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.redis.llen(`${this.playerRoomsKeyPrefix}${shortId}`);
        });
    }
    getGroupRoomCount(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.redis.llen(`${this.groupRoomsKeyPrefix}${groupId}`);
        });
    }
    pushRoomCreateMessage(ownerId, roomInfo) {
        this.app.get('statusService').pushByUids([ownerId], pushEvent_1.default.onRoomCreate, roomInfo);
    }
    pushRoomChangeMessage(ownerId, roomInfo) {
        this.app.get('statusService').pushByUids([ownerId], pushEvent_1.default.onRoomChange, _.omit(roomInfo, ['serverId', 'type', 'AA', 'playerCount', 'watcherNumber', 'config', 'owner', 'ownerId']));
    }
    pushRoomDestroy(ownerId, roomId) {
        this.app.get('statusService').pushByUids([ownerId], pushEvent_1.default.onRoomDestroy, { roomId: roomId });
    }
}
exports.default = RoomCache;
