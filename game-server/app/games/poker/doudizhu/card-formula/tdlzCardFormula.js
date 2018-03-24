"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cardFormula_1 = require("./cardFormula");
const logger_1 = require("../../../../util/logger");
const consts_1 = require("./consts");
class TdLzCardFormula extends cardFormula_1.default {
    constructor() {
        super();
        this._cards = "";
        this._compared = "";
        this.isCardsLz = false;
        this.isComparedLz = false;
        this._isCardsLz = false;
        this._isComparedLz = false;
    }
    //对比牌型是否大小
    isCardsGreater(cards, compared, isPoint = false, sorted = false) {
        logger_1.default.info('cards: %j, compared: %j', cards, compared);
        this.isCardsLz = false;
        this.isComparedLz = false;
        this._isCardsLz = false;
        this._isComparedLz = false;
        cards = this.getCardsType(cards, true);
        compared = this.getCardsType(compared);
        console.log("=========compared", compared);
        console.log("========cards", cards.length);
        let handInfo = this.getHandTypeInfo(cards, isPoint, sorted);
        let compHandInfo = this.getHandTypeInfo(compared, isPoint, sorted);
        console.log("=======handInfo,", handInfo);
        console.log("=======compHandInfo,", compHandInfo);
        if (handInfo.type === consts_1.exp.handTypes.ROCKET)
            return true;
        if (compHandInfo.type === consts_1.exp.handTypes.ROCKET)
            return false;
        if (handInfo.type === consts_1.exp.handTypes.BOMB && compHandInfo.type === consts_1.exp.handTypes.BOMB) {
            console.log("handInfo.info,", handInfo.info, "isCardsLz", this.isCardsLz, "isComparedLz", this.isComparedLz, "_isCardsLz", this._isCardsLz, "_isComparedLz", this._isComparedLz, "compHandInfo.info", compHandInfo.info);
            if ((this.isCardsLz == true && this.isComparedLz == false)
                || (this.isCardsLz == false && this.isComparedLz == true)
                || (this.isCardsLz == true && this.isComparedLz == true)) {
                console.log("======isCardsGreater====lanzha===this.isCardsLz==", this.isCardsLz, "this.isComparedLz", this.isComparedLz);
                if (cards.length == compared.length) {
                    if (this.isCardsLz == true && this.isComparedLz == false) {
                        return true;
                    }
                    if (this.isCardsLz == true && this.isComparedLz == true) {
                        return false;
                    }
                    if (this.isCardsLz == false && this._isComparedLz == true) {
                        return true;
                    }
                    if (this._isCardsLz == true && this._isComparedLz == true) {
                        return handInfo.info.main > compHandInfo.info.main;
                    }
                }
                if (cards.length < compared.length) {
                    return false;
                }
                if (cards.length > compared.length) {
                    return true;
                }
                return false;
            } //懒炸大
            if (this.isCardsLz == true && this._isComparedLz == true && this.isComparedLz == false) {
                if (cards.length == compared.length) {
                    return true;
                }
                return false;
            }
            // this.isCardsLz = false; this.isComparedLz = false this._isCardsLz = true this._isComparedLz = true
            // if (this.isCardsLz == false && this._isComparedLz == true && this._isCardsLz == false) {  //硬炸 软炸
            //     if (cards.length > compared.length) {
            //         return true;
            //     }
            //     if(cards.length == compared.length){
            //         return true;
            //     }
            //     return false;
            // }
            if (this._isCardsLz != true && this._isComparedLz == true) {
                if (cards.length == compared.length) {
                    return true; // 硬炸 >软炸
                }
                if (cards.length > compared.length) {
                    return true;
                }
                // return false;
            }
            if (this._isCardsLz == true && this._isComparedLz != true) {
                if (cards.length == compared.length) {
                    return false; // 硬炸 >软炸
                }
                if (cards.length > compared.length) {
                    return true;
                }
                return false;
            }
            if (this._isCardsLz != true && this._isComparedLz != true) {
                return handInfo.info.main > compHandInfo.info.main;
            }
            if (this._isCardsLz == true && this._isComparedLz == true) {
                console.log("======isCardsGreater====this._isCardsLz=====", this._isCardsLz, "this._isComparedLz", this._isComparedLz);
                if (cards.length > compared.length)
                    return true;
                return handInfo.info.main > compHandInfo.info.main;
            }
        }
        if (handInfo.type === consts_1.exp.handTypes.BOMB && compHandInfo.type !== consts_1.exp.handTypes.BOMB)
            return true;
        // if (handInfo.type !== compHandInfo.type) return false;
        if (handInfo.info.required && handInfo.info.required !== compHandInfo.info.required)
            return false;
        return handInfo.info.main > compHandInfo.info.main;
    }
    ;
    isHandBomb(cards, isPoint = false, sorted = false) {
        if (cards.length < 4)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps.sort();
        let a = "";
        let b = "";
        let cardsType = "";
        for (let i = 0; i < ps.length; i++) {
            a = ps[i];
            b = ps[i + 1];
            if (b != undefined) {
                if (a != b)
                    return false;
            }
        }
        var c = "";
        var d = "";
        var count = 0;
        var cardType = 0;
        cards.sort();
        for (let i = 0; i < cards.length; i++) {
            c = cards[i];
            d = cards[i + 1];
            if (c == d)
                count += 1;
        }
        return { main: this._toPointIdx(ps[0], true), cardType: cardType };
        // return { main: this._toPointIdx(ps[0], true) };;
    }
    ;
    //获取癞子牌型
    getCardsType(cards, isPoint = false, sorted = false) {
        let _cards = [];
        let count = 0;
        let card = "";
        let str = "";
        for (let i = 0; i < cards.length; i++) {
            card = cards[i];
            if (card.indexOf("L") > 0) {
                count += 1;
                str = card[3];
                if (str.toLocaleUpperCase() == "X" || str.toLocaleUpperCase() == "Y") {
                    return false;
                }
                str = "0" + str.toString();
                _cards.push(str);
                continue;
            }
            _cards.push(card);
        }
        if (count != 0) {
            if (isPoint == true)
                this._isCardsLz = true; //软炸
            if (isPoint == false)
                this._isComparedLz = true; //软炸
        }
        if (count == cards.length && cards.length >= 4) {
            _cards = [];
            if (isPoint == true)
                this.isCardsLz = true; //懒炸
            if (isPoint == false)
                this.isComparedLz = true; //懒炸
            let _cardStr = cards[cards.length - 1];
            for (let i = 0; i < cards.length; i++) {
                card = cards[i];
                if (card.indexOf("L") > 0) {
                    str = _cardStr[3];
                    str = "0" + str.toString();
                    _cards.push(str);
                    continue;
                }
                _cards.push(card);
            }
        }
        return _cards;
    }
}
exports.default = TdLzCardFormula;
