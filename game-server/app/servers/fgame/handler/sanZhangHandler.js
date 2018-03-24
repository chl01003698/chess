"use strict";
const Joi = require("joi");
const helpers_1 = require("../../../util/helpers");
const code_1 = require("../../../consts/code");
class SanZhangHandler {
    constructor(app) {
        this.app = app;
    }
    //玩家看牌
    checked(msg, session, next) {
        helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
            if (!(game.fsm.is('input') &&
                gamePlayer.checked == false &&
                gamePlayer.giveup == false))
                return helpers_1.respError(next, code_1.default.FAIL);
            game.lookCards(session["uid"]);
            helpers_1.respOK(next);
        });
    }
    //玩家弃牌
    giveup(msg, session, next) {
        helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
            if (!(game.fsm.is("input") && gamePlayer.giveup == false))
                return next(null, { code: code_1.default.FAIL });
            game.removeBeatPlayer(gamePlayer);
            helpers_1.respOK(next);
        });
    }
    getBeatPlayers(msg, session, next) {
        helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
            game.getBiPaiPlayers(session["uid"]);
            next(null, { code: code_1.default.OK });
        });
    }
    showCards(msg, session, next) {
        helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
            game.showCards(session["uid"]);
            next(null, { code: code_1.default.OK });
        });
    }
    gameLeave(msg, session, next) {
        helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
            game.leave(session["uid"], session);
            next(null, { code: code_1.default.OK });
        });
    }
    peiPai(msg, session, next) {
        helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
            game.peiPai(session["uid"], msg);
            next(null, { code: code_1.default.OK });
        });
    }
    chooseCards(msg, session, next) {
        let validate = helpers_1.JoiValidate(msg, {
            cards: Joi.array().required(),
        }, next);
        if (!validate)
            return;
        helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
            game.chooseCards(session["uid"], msg);
            next(null, { code: code_1.default.OK });
        });
    }
    //玩家跟加 比
    input(msg, session, next) {
        let validate = helpers_1.JoiValidate(msg, {
            type: Joi.number().min(0).max(8).required(),
            param: Joi.any().optional()
        }, next);
        if (!validate)
            return;
        helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
            if (!(game.fsm.is('input')))
                return next(null, { code: code_1.default.GAME.STATE_ERROR });
            // if (!(gamePlayer.pkIndex == game.currentIndex)) return next(null, {code: Code.GAME.NOT_CURRENT_INDEX})
            if (!(gamePlayer.giveup == false))
                return next(null, { code: code_1.default.GAME.IS_GIVEUP });
            game.fsm.inputTrans(gamePlayer, msg);
            next(null, { code: code_1.default.OK });
        });
    }
    getResults(msg, session, next) {
        helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
            game.getResults(session["uid"]);
            next(null, { code: code_1.default.OK });
        });
    }
}
module.exports = function newHandler(app) {
    return new SanZhangHandler(app);
};
