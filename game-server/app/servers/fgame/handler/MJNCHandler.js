"use strict";
const Raven = require("raven");
const helpers_1 = require("../../../util/helpers");
const code_1 = require("../../../consts/code");
const Joi = require("joi");
class MJNCHandler {
    constructor(app) {
        this.app = app;
    }
    selectPiao(msg, session, next) {
        Raven.context(() => {
            const validate = helpers_1.JoiValidate(msg, {
                piao: Joi.number().integer().min(0).max(5).required(),
            }, next);
            if (!validate)
                return;
            helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                const handleOver = game.selectPiao(gamePlayer, msg);
                helpers_1.respOK(next);
            });
        });
    }
    selectBaiPai(msg, session, next) {
        Raven.context(() => {
            const validate = helpers_1.JoiValidate(msg, {
                type: Joi.number().integer().min(0).max(5).required(),
                subType: Joi.number().integer().min(0).max(5).required(),
                selectIndex: Joi.number().integer().min(0).max(4),
                state: Joi.number().integer().min(1).max(2).required(),
                card: Joi.number().required(),
                cards: Joi.array().items(Joi.number()).required()
            }, next);
            if (!validate)
                return;
            helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                if (!game.isCurrentPlayer(gamePlayer.uid))
                    return helpers_1.respError(next, code_1.default.GAME.NOT_CURRENT_INDEX);
                if (!game.canBaiPai(gamePlayer, msg))
                    return helpers_1.respError(next, code_1.default.GAME.MJ_CAN_NOT_HANDLE);
                if (!gamePlayer.hasCard(msg.card) && game.currentCard.card !== msg.card) {
                    return helpers_1.respError(next, code_1.default.FAIL);
                }
                const handleOver = game.doBaiPai(gamePlayer, msg);
                helpers_1.respOK(next, { handleOver });
            });
        });
    }
}
module.exports = function newHandler(app) {
    return new MJNCHandler(app);
};
