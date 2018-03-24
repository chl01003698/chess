"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cardFormula_1 = require("./card-formula/cardFormula");
const fourCardFormula_1 = require("./card-formula/fourCardFormula");
const pzCardFormula_1 = require("./card-formula/pzCardFormula");
const diZhuHelper_1 = require("./diZhuHelper");
const tdlzCardFormula_1 = require("./card-formula/tdlzCardFormula");
class CheckCardType {
    constructor(self, roomConfig, gameConfig, uid = false) {
        this.roomConfig = roomConfig;
        this.gameConfig = gameConfig;
        this._gameType = roomConfig["type"];
        if (this._gameType == "ddz4")
            this._cardFormula = new fourCardFormula_1.default();
        if (this._gameType == "pz3")
            this._cardFormula = new pzCardFormula_1.default();
        if (this._gameType == "lz3" || this._gameType == "tdlz3")
            this._cardFormula = new tdlzCardFormula_1.default();
        if (this._gameType == "ddz2" || this._gameType == "ddz3" || this._gameType == "sd3")
            this._cardFormula = new cardFormula_1.default();
        this.cards = [];
        this.self = self;
        if (uid != false)
            this.playerInfo = this.self.findOne;
    }
    ;
    checkCardType(cards, bombNum) {
        let LzCards = cards.slice();
        cards = this._cardFormula.getCardsType(cards);
        if (cards.length < 0) {
            return true;
        }
        if (this._cardFormula.isHandRocket(cards)) {
            let multiple = this.gameConfig["multiple"].rockets;
            if (cards.length == 3) {
                multiple = this.gameConfig["multiple"].zmul;
            }
            if (cards.length == 4)
                multiple = this.gameConfig["multiple"].fourRocket;
            diZhuHelper_1.pushMultiple(multiple, this.self, "rockets");
        }
        ;
        if (this._cardFormula.isHandBomb(cards)) {
            bombNum += 1;
            if (this._gameType === "ddz4") {
                if (cards.length == 8) {
                    diZhuHelper_1.pushMultiple(this.gameConfig["multiple"].zmul, this.self, "bomb");
                }
                else {
                    diZhuHelper_1.pushMultiple(this.gameConfig["multiple"].bomb, this.self, "bomb");
                }
            }
            else {
                if (this._gameType == "lz3" || this._gameType == "tdlz3") {
                    let num = this.checkLz(LzCards);
                    diZhuHelper_1.pushMultiple(num, this.self, "bomb");
                }
                else {
                    if (cards.length > 4) {
                        diZhuHelper_1.pushMultiple(this.gameConfig["multiple"].yingzha, this.self, "bomb");
                    }
                    else {
                        diZhuHelper_1.pushMultiple(this.gameConfig["multiple"].bomb, this.self, "bomb");
                    }
                }
            }
            return bombNum;
        }
        ;
        if (this._gameType == "pz3") {
            if (this._cardFormula.isHandFried(cards)) {
                diZhuHelper_1.pushMultiple(this.gameConfig["multiple"].lianzha, this.self, "bomb");
            }
        }
        return false;
    }
    checkLz(cards) {
        let num = 0;
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            if (card.length == 4) {
                num += 1;
            }
        }
        if (num === 0)
            return this.gameConfig["multiple"].yingzha;
        if (num === cards.length)
            return this.gameConfig["multiple"].lanzhua;
        if (num !== 0)
            return this.gameConfig["multiple"].ruanzha;
        if (cards.length > 4)
            return this.gameConfig["multiple"].yingzha;
    }
    checkLowCardAsync(cards) {
        //检查是否是三条
        if (this._cardFormula.isHandTrio(cards)) {
            diZhuHelper_1.pushMultiple(this.gameConfig["multiple"].graspBottomMultiple.article3, this.self, "lowCard");
            return true;
        }
        //检查是否是同花
        if (this._cardFormula.isHandFlowers(cards)) {
            diZhuHelper_1.pushMultiple(this.gameConfig["multiple"].graspBottomMultiple.flowers, this.self, "lowCard");
            return true;
        }
        //检查是否是顺子
        if (this._cardFormula.isHandThree(cards, cards.length)) {
            diZhuHelper_1.pushMultiple(this.gameConfig["multiple"].graspBottomMultiple.flowers, this.self, "lowCard");
            return true;
        }
        //检查是否是双王或者是对子 或者是单王
        for (let i = 0; i < cards.length; i++) {
            let _arr = [cards[i], cards[i + 1] ? cards[i + 1] : cards[0]];
            if (this._cardFormula.isHandRocket(_arr)) {
                diZhuHelper_1.pushMultiple(this.gameConfig["multiple"].graspBottomMultiple.flowers, this.self, "lowCard");
                return true;
            }
        }
        for (var i = 0; i < cards.length; i++) {
            var _arr = [cards[i], cards[i + 1] ? cards[i + 1] : cards[0]];
            if (this._cardFormula.isHandPair(_arr)) {
                diZhuHelper_1.pushMultiple(this.gameConfig["multiple"].graspBottomMultiple.pairs, this.self, "lowCard");
                return true;
            }
            if (this._cardFormula.isHandKing([cards[i]])) {
                diZhuHelper_1.pushMultiple(this.gameConfig["multiple"].graspBottomMultiple.king, this.self, "lowCard");
                return true;
            }
        }
        return false;
    }
    //检查是否是春天
    checkspringAsync() {
        var count = 0;
        for (let i = 0; i < this.self.playerIds.length; i++) {
            let _playerId = this.self.playerIds[i];
            let player = this.self.findPlayerByUid(_playerId);
            if (player["identity"] == "landlord") {
                if (player["sendCard"] == 1) {
                    return true; // 农民春天
                }
            }
            if (player["identity"] == "farmers") {
                count += parseInt(player["sendCard"]);
            }
        }
        if (count == 0) {
            return true; //地主春天
        }
        return false;
    }
    //检查牌型并且去除牌型
    checkSendCardsType(playerCards, Cards) {
        let article3 = this.roomConfig["article3"]; //检查三张
        let plane = this.roomConfig["plane"]; //检查飞机
        let four = this.roomConfig["four"]; //检查4张
        let pzPw = this.roomConfig["pzPw"]; //检查皮子
        // console.log("========article3=", article3, "plane", plane, "four==", four, "pzPw==", pzPw, "this.cards=", this.cards);
        for (let i = 0; i < article3.length; i++) {
            let a = article3[i];
            if (playerCards.length != this.cards)
                if (this._cardFormula.isHandTrio(this.cards))
                    return true;
            if (a == 1)
                if (this._cardFormula.isHandTrioSolo(this.cards))
                    return false;
            if (a == 2)
                if (this._cardFormula.isHandTrioPair(this.cards))
                    return false;
            if (a == 3) {
                if (this._cardFormula.isHandTrio(this.cards)) {
                    if (playerCards.length == this.cards)
                        return true;
                    return false;
                }
            }
        }
        for (let i = 0; i < plane.length; i++) {
            let p = plane[i];
            if (playerCards != this.cards)
                if (this._cardFormula.isHandAirplane(this.cards))
                    return true;
            if (p == 1)
                if (this._cardFormula.isHandAirplaneSolo(this.cards))
                    return false;
            if (p == 2)
                if (this._cardFormula.isHandAirplanePair(this.cards))
                    return false;
            if (p == 3) {
                if (this._cardFormula.isHandAirplane(this.cards)) {
                    if (playerCards == this.cards)
                        return true;
                    return false;
                }
            }
        }
        for (let i = 0; i < four.length; i++) {
            let f = four[i];
            if (this._cardFormula.isHandBomb(this.cards))
                return true;
            // console.log("this._cardFormula.isHandAirplaneSolo(this.cards)", this._cardFormula.isHandAirplaneSolo(this.cards));
            // console.log("this._cardFormula.isHandAirplanePair(this.cards)", this._cardFormula.isHandAirplanePair(this.cards));
            if (f == 1)
                if (this._cardFormula.isHandAirplaneSolo(this.cards))
                    return false;
            if (f == 2)
                if (this._cardFormula.isHandAirplanePair(this.cards))
                    return false;
        }
        if (pzPw != undefined) {
            for (let i = 0; i < pzPw.length; i++) {
                let z = pzPw[i];
                if (z == 1) {
                    if (this._cardFormula.isHandRocket(this.cards)) {
                        if (this.cards.length == 3) {
                            return false;
                        }
                    }
                }
                if (z == 2) {
                    if (this._cardFormula.isHandRocket(this.cards)) {
                        if (Cards.indexOf("PLY") || Cards.indexOf("PLX")) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
}
exports.default = CheckCardType;
