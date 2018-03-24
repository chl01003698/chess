"use strict";
const Raven = require("raven");
const helpers_1 = require("../../../util/helpers");
const code_1 = require("../../../consts/code");
const Joi = require("joi");
class MJHandler {
    constructor(app) {
        this.app = app;
    }
    selectCPGH(msg, session, next) {
        Raven.context(() => {
            const validate = helpers_1.JoiValidate(msg, {
                type: Joi.number().integer().min(0).max(5).required(),
                subType: Joi.number().integer().min(0).max(5).required(),
                selectIndex: Joi.number().integer().min(0).max(4),
                state: Joi.number().integer().min(1).max(2).required()
            }, next);
            if (!validate)
                return;
            helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                if (!game.canHandle(gamePlayer.uid))
                    return helpers_1.respError(next, code_1.default.GAME.MJ_CAN_NOT_HANDLE);
                const handleOver = game.selectHandle(gamePlayer, msg);
                helpers_1.respOK(next, { handleOver });
            });
        });
    }
    input(msg, session, next) {
        Raven.context(() => {
            const validate = helpers_1.JoiValidate(msg, {
                card: Joi.number().required()
            }, next);
            if (!validate)
                return;
            helpers_1.handleGamePlayer.bind(this)(msg, session, next, (game, gamePlayer) => {
                if (!game.isCurrentPlayer(gamePlayer.uid))
                    return helpers_1.respError(next, code_1.default.GAME.NOT_CURRENT_INDEX);
                if (gamePlayer.cardGroupManage.getCardCount() + gamePlayer.cards.length != game.gameConfig.playerInitCards + 1)
                    return helpers_1.respError(next, code_1.default.GAME.MJ_CARD_NUMBER_ERROR);
                if (game.canHandle())
                    return helpers_1.respError(next, code_1.default.FAIL);
                if (!gamePlayer.hasCard(msg.card))
                    return helpers_1.respError(next, code_1.default.FAIL);
                if (!game.canInPutCard(gamePlayer, msg.card))
                    return helpers_1.respError(next, code_1.default.FAIL);
                game.fsm.inputTrans({ uid: gamePlayer.uid, card: msg.card });
                helpers_1.respOK(next);
            });
        });
    }
}
module.exports = function newHandler(app) {
    return new MJHandler(app);
};
