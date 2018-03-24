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
const noun = require('../../config/noun.json');
const adjective = require('../../config/adjective.json');
const _ = require("lodash");
const Joi = require("joi");
const mongoose = require("mongoose");
const pushEvent_1 = require("../consts/pushEvent");
const Raven = require("raven");
const ulid_1 = require("ulid");
const config = require("config");
const Redis = require("ioredis");
const code_1 = require("../consts/code");
const db_1 = require("../extend/db");
const Ajv = require("ajv");
const math = require("mathjs");
const moment = require("moment");
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
exports.applyMixins = applyMixins;
function roomNumberRandomAsync(app) {
    return new Promise(function (resolve) {
        app.rpc.gate.gateRemote.random.toServer('cluster-server-gate-0', {}, function (ret) {
            resolve(ret);
        });
    });
}
exports.roomNumberRandomAsync = roomNumberRandomAsync;
function roomNumberReleaseAsync(app, roomNumber) {
    return new Promise(function (resolve) {
        app.rpc.gate.gateRemote.release.toServer('cluster-server-gate-0', roomNumber, function () {
            resolve();
        });
    });
}
exports.roomNumberReleaseAsync = roomNumberReleaseAsync;
function respOK(next, data) {
    next(null, { code: 200, data });
}
exports.respOK = respOK;
function respError(next, error) {
    next(null, error);
}
exports.respError = respError;
function createNickName() {
    return adjective[_.random(0, adjective.length - 1)] + '的' + noun[_.random(0, noun.length - 1)];
}
exports.createNickName = createNickName;
exports.validateOptions = { allowUnknown: true, stripUnknown: true, convert: true };
function JoiValidate(msg, schema, next) {
    const result = Joi.validate(msg, schema, exports.validateOptions);
    if (result.error != null) {
        Raven.captureException(result.error);
        next(null, { code: code_1.default.PARAMS_ERROR.code, msg: result.error.message });
        return false;
    }
    return true;
}
exports.JoiValidate = JoiValidate;
function JoiValidateEx(msg, schema, next) {
    const result = Joi.validate(msg, schema, exports.validateOptions);
    if (result.error != null) {
        Raven.captureException(result.error);
        next(null, { code: code_1.default.PARAMS_ERROR.code, msg: result.error.message });
        return [false, result];
    }
    return [true, result];
}
exports.JoiValidateEx = JoiValidateEx;
function AjvValidate(msg, schema, next) {
    var ajv = new Ajv({ removeAdditional: true, useDefaults: true });
    var valid = ajv.validate(schema, msg);
    if (!valid) {
        Raven.captureException(ajv.errors);
        next(null, { code: code_1.default.PARAMS_ERROR.code, msg: ajv.errorsText });
        return [false, msg];
    }
    return [true, msg];
}
exports.AjvValidate = AjvValidate;
function handleGame(msg, session, next, cb) {
    const roomId = session.get('roomId');
    if (!_.isString(roomId))
        return respError(next, code_1.default.PARAMS_ERROR);
    const gameComponent = this.app.components.game;
    const gameManage = gameComponent.container.gameManage;
    const game = gameManage.findGame(roomId);
    if (!(game != null))
        return respError(next, code_1.default.GAME.NO_EXIST_GAME);
    cb.bind(this)(game);
}
exports.handleGame = handleGame;
function handleGamePlayer(msg, session, next, cb) {
    const roomId = session.get('roomId');
    if (!_.isString(roomId))
        return next(null, code_1.default.PARAMS_ERROR);
    const gameComponent = this.app.components.game;
    const gameManage = gameComponent.container.gameManage;
    const game = gameManage.findGame(roomId);
    if (!(game != null))
        return next(null, code_1.default.GAME.NO_EXIST_GAME);
    const gamePlayer = game.findPlayerByUid(session.uid);
    if (!(gamePlayer != null))
        return next(null, code_1.default.GAME.USER_NO_EXIST_IN_GAME);
    cb.bind(this)(game, gamePlayer);
}
exports.handleGamePlayer = handleGamePlayer;
function pushMail(app, to, title, content = title, items = [], type = 0, sender) {
    return __awaiter(this, void 0, void 0, function* () {
        const mail = new db_1.MailModel({
            type,
            sender,
            to: mongoose.Types.ObjectId(to),
            title,
            content,
            items
        });
        yield mail.save();
        app.get('statusService').pushByUids([to], pushEvent_1.default.onNewMail, { id: mail.id });
    });
}
exports.pushMail = pushMail;
function callFGameRemoteFunc(app, session, funcName) {
    const gameServerId = session.get('gameServerId');
    const roomId = session.get('roomId');
    callFGameRemoteFuncTemplate(app, session.uid, gameServerId, roomId, funcName);
}
exports.callFGameRemoteFunc = callFGameRemoteFunc;
function callFGameRemoteFuncTemplate(app, uid, gameServerId, roomId, funcName) {
    if (_.isString(gameServerId) && _.isString(roomId)) {
        const args = {
            uid,
            roomId
        };
        if (_.isFunction(app.rpc.fgame.gameRemote[funcName])) {
            app.rpc.fgame.gameRemote[funcName].toServer(gameServerId, args, function (err, ret) {
                if (err != null) {
                    throw err;
                }
            });
        }
    }
}
exports.callFGameRemoteFuncTemplate = callFGameRemoteFuncTemplate;
function callFGameRemoteFuncWithData(app, gameServerId, data, funcName) {
    if (_.isFunction(app.rpc.fgame.gameRemote[funcName])) {
        app.rpc.fgame.gameRemote[funcName].toServer(gameServerId, data, function (err, ret) {
            if (err != null) {
                throw err;
            }
        });
    }
}
exports.callFGameRemoteFuncWithData = callFGameRemoteFuncWithData;
function createFakeGamePlayer() {
    const sex = _.random(1, 2);
    const sexName = sex == 1 ? 'nan' : 'nv';
    const avatarMax = sex == 1 ? config.get('fakerGuest.nan') : config.get('fakerGuest.nv');
    const seriesMax = _.random(3, 20);
    const count = _.random(30, 1000);
    const player = {
        id: ulid_1.ulid(),
        shortId: _.random(10000000, 99999999),
        nickname: createNickName(),
        isGuest: false,
        sex: sex,
        headimgurl: `${config.get('fakerGuest.headimgurl')}${sexName}/${_.random(1, avatarMax)}.jpg`,
        coin: { card: 0 },
        signature: '',
        count: {
            seriesMax: seriesMax,
            series: _.random(seriesMax),
            winCount: _.random(Math.trunc(count / 3), Math.trunc(count / 1.3)),
            count: count
        }
    };
    return [player, {}];
}
exports.createFakeGamePlayer = createFakeGamePlayer;
function pushGlobalMessage(app, route, msg) {
    app.get('channelService').broadcast('connector', route, msg, {}, function (err) {
        if (err) {
            Raven.captureException(err);
        }
    });
}
exports.pushGlobalMessage = pushGlobalMessage;
function createRedisClient(host = 'localhost', port = 6379, password = '', select = 0) {
    const redis = new Redis({
        host,
        port,
        detect_buffers: true,
        password
    });
    redis.select(select);
    return redis;
}
exports.createRedisClient = createRedisClient;
function hasEnoughGameCard(user, roomConfig, gameConfig) {
    if (gameConfig.free == true) {
        return true;
    }
    let result = false;
    const payway = roomConfig.payway == 'AA' ? 'AA' : 'owner';
    const expend = gameConfig.gameExpend[payway][roomConfig.expendIndex].expend;
    if (_.isNumber(expend) && expend > 0 && user.coin.card >= expend) {
        result = true;
    }
    return result;
}
exports.hasEnoughGameCard = hasEnoughGameCard;
function evalExpr(expr, params) {
    let result = undefined;
    if (_.isString(expr) && expr.length > 0) {
        result = math.eval(expr, params);
    }
    return result;
}
exports.evalExpr = evalExpr;
function recordEvent(client, event, body) {
    client.index({ index: 'game-server', type: 'game', body: _.assign({ event, createdAt: moment().format("YYYY-MM-DD H:mm:ss") }, body) });
}
exports.recordEvent = recordEvent;
