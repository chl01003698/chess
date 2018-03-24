"use strict";
const Joi = require("joi");
const helpers_1 = require("../../../util/helpers");
const Raven = require("raven");
const code_1 = require("../../../consts/code");
class DiZhuHandler {
    constructor(app) {
        this.app = app;
    }
    //明牌开始
    showCards(msg, session, next) {
        Raven.context(() => {
            const validate = helpers_1.JoiValidate(msg, { multiple: Joi.number().min(1).max(5).default(1).optional(), state: Joi.number().min(1).max(3).required() }, next);
            if (!validate)
                return;
            helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                if (!game.fsm.is('showCards'))
                    return helpers_1.respError(next, code_1.default.GAME.STATE_ERROR);
                game.fsm.showCardsTrans(session['uid'], msg);
                next(null, { code: code_1.default.OK });
            });
        });
    }
    //叫地主
    call(msg, session, next) {
        Raven.context(() => {
            const validate = helpers_1.JoiValidate(msg, { choosed: Joi.string().required() }, next); //landOwner叫地主 notCall不叫 landGrab抢地主 //"1","2","3" 叫分
            if (!validate)
                return;
            helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                if (!game.fsm.is('callZhuang'))
                    return helpers_1.respError(next, code_1.default.GAME.STATE_ERROR);
                game.fsm.callZhuangTrans(session['uid'], msg);
                next(null, { code: code_1.default.OK });
            });
        });
    }
    //踢拉
    kickPull(msg, session, next) {
        Raven.context(() => {
            const validate = helpers_1.JoiValidate(msg, { choosed: Joi.string().required() }, next); //kick-->notKick  follow-->notFollow  pull--->notPull
            if (!validate)
                return;
            helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                if (!game.fsm.is('kickPull'))
                    return helpers_1.respError(next, code_1.default.GAME.STATE_ERROR);
                game.fsm.kickPullTrans(session['uid'], msg);
                next(null, { code: code_1.default.OK });
            });
        });
    }
    //打牌
    input(msg, session, next) {
        Raven.context(() => {
            const validate = helpers_1.JoiValidate(msg, {
                cards: Joi.array().items(Joi.string()).max(20).required(),
                cardsType: Joi.string().default(""),
                soundRestart: Joi.boolean().default(false)
            }, next);
            console.log("====input==validate==", validate);
            if (!validate)
                return;
            helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                if (!game.fsm.is('input'))
                    return helpers_1.respError(next, code_1.default.GAME.STATE_ERROR);
                game.fsm.inputTrans(session['uid'], msg);
                next(null, { code: code_1.default.OK });
            });
        });
    }
    lookCards(msg, session, next) {
        Raven.context(() => {
            const validate = helpers_1.JoiValidate(msg, { multiple: Joi.number().min(1).max(5).default(1).optional(), state: Joi.number().min(1).max(3).required() }, next);
            if (!validate)
                return;
            helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                game.onShowCards(session['uid'], msg);
                next(null, { code: code_1.default.OK });
            });
        });
    }
    getResults(msg, session, next) {
        Raven.context(() => {
            helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                game.getResults(session['uid']);
                next(null, { code: code_1.default.OK });
            });
        });
    }
}
module.exports = function newHandler(app) {
    return new DiZhuHandler(app);
};
