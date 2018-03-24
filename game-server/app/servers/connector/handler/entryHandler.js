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
const db_1 = require("../../../extend/db");
const code_1 = require("../../../consts/code");
const login_1 = require("../../../services/login");
class EntryHandler {
    constructor(app) {
        this.app = app;
    }
    login(msg, session, next) {
        Raven.context(() => __awaiter(this, void 0, void 0, function* () {
            const validate = helpers_1.JoiValidate(msg, {
                token: Joi.string().required()
            }, next);
            if (!validate)
                return;
            const user = yield db_1.UserModel.findClientUserByToken(msg['token']);
            if (user == null)
                return helpers_1.respError(next, code_1.default.NO_EXIST_USER);
            login_1.bindSessionAndNext(this.app, msg, session, next, user);
        }));
    }
    /**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
    entry(msg, session, next) {
        next(null, { code: 200, msg: 'game server is ok.' });
    }
    ;
    /**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
    publish(msg, session, next) {
        var result = {
            topic: 'publish',
            payload: JSON.stringify({ code: 200, msg: 'publish message is ok.' })
        };
        next(null, result);
    }
    ;
    /**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
    subscribe(msg, session, next) {
        var result = {
            topic: 'subscribe',
            payload: JSON.stringify({ code: 200, msg: 'subscribe message is ok.' })
        };
        next(null, result);
    }
    ;
    ping(msg, session, next) {
        next(null, {});
    }
}
module.exports = function newHandler(app) {
    return new EntryHandler(app);
};
