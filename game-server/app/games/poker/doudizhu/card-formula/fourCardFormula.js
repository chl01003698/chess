"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cardFormula_1 = require("./cardFormula");
const logger_1 = require("../../../../util/logger");
const consts_1 = require("./consts");
class FourCardFormula extends cardFormula_1.default {
    constructor() { super(); }
    //对比牌型大小
    isCardsGreater(cards, compared, isPoint = false, sorted = false) {
        logger_1.default.info('cards: %j, compared: %j', cards, compared);
        let handInfo = this.getHandTypeInfo(cards, isPoint, sorted);
        let compHandInfo = this.getHandTypeInfo(compared, isPoint, sorted);
        if (handInfo.type === consts_1.exp.handTypes.ROCKET)
            return true;
        if (compHandInfo.type === consts_1.exp.handTypes.ROCKET)
            return false;
        if (handInfo.type === consts_1.exp.handTypes.BOMB && compHandInfo.type !== consts_1.exp.handTypes.BOMB)
            return true;
        // if (handInfo.type !== compHandInfo.type) return false;
        if (handInfo.info.required && handInfo.info.required !== compHandInfo.info.required)
            return false;
        if (handInfo.type === consts_1.exp.handTypes.BOMB && compHandInfo.type === consts_1.exp.handTypes.BOMB) {
            if ((handInfo.info.main > compHandInfo.info.main) == false) {
                if (cards.length > compared.length)
                    return true;
            }
            return handInfo.info.main > compHandInfo.info.main;
        }
        return handInfo.info.main > compHandInfo.info.main;
    }
    ;
    //是否是火箭
    isHandRocket(cards, isPoint = false, sorted = false) {
        if (cards.length !== 4)
            return false;
        var ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps.sort();
        if ((ps[0] === consts_1.exp.joker && ps[1] === consts_1.exp.joker) || (ps[2] === consts_1.exp.jokerRed && ps[3] === consts_1.exp.jokerRed))
            return { main: this._toPointIdx(cards[cards.length - 1], isPoint) };
        return false;
    }
    ;
    isHandBomb(cards, isPoint = false, sorted = false) {
        if (cards.length < 4)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps.sort();
        let a = "";
        let b = "";
        for (let i = 0; i < ps.length; i++) {
            a = ps[i];
            b = ps[i + 1];
            if (b != undefined) {
                if (a != b)
                    return false;
            }
        }
        return { main: this._toPointIdx(ps[0], true) };
        ;
    }
    ;
}
exports.default = FourCardFormula;
