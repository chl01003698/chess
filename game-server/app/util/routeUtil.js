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
const dispatcher_1 = require("./dispatcher");
const _ = require("lodash");
const Raven = require("raven");
function route(type) {
    return function (session, msg, app, cb) {
        const servers = app.getServersByType(type);
        if (!servers || servers.length === 0) {
            cb(new Error(`can not find ${type} servers.`));
            return;
        }
        const res = dispatcher_1.dispatcher(session.uid, servers);
        cb(null, res.id);
    };
}
exports.route = route;
function randRoute(app, type) {
    const servers = app.getServersByType(type);
    if (!servers || servers.length === 0) {
        return null;
    }
    return _.sample(servers)['id'];
}
exports.randRoute = randRoute;
function gameRoute(session, msg, app, cb) {
    Raven.context(() => __awaiter(this, void 0, void 0, function* () {
        const body = msg.args[0].body;
        const serverId = session.get('gameServerId');
        if (_.isString(serverId)) {
            cb(null, serverId);
            return;
        }
        else if (_.isString(body.roomId)) {
            const coreComponent = app.components.core;
            const roomCache = coreComponent.container.roomCache;
            const serverId = yield roomCache.getRoomAtServerId(body.roomId);
            if (_.isString(serverId) && serverId.length > 0) {
                cb(null, serverId);
                return;
            }
        }
        if (_.isString(session.uid) && session.uid.length > 0) {
            const servers = app.getServersByType('fgame');
            if (!servers || servers.length === 0) {
                cb(new Error('can not find game servers.'));
                return;
            }
            const res = dispatcher_1.dispatcher(session.uid, servers);
            cb(null, res.id);
        }
        else {
            cb(new Error('can not find game servers.'));
        }
    }));
}
exports.gameRoute = gameRoute;
