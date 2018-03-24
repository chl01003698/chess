"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Cards = [
    "03", "13", "23", "33",
    "04", "14", "24", "34",
    "05", "15", "25", "35",
    "06", "16", "26", "36",
    "07", "17", "27", "37",
    "08", "18", "28", "38",
    "09", "19", "29", "39",
    "00", "10", "20", "30",
    "0J", "1J", "2J", "3J",
    "0Q", "1Q", "2Q", "3Q",
    "0K", "1K", "2K", "3K",
    "0A", "1A", "2A", "3A",
    "02", "12", "22", "32",
    "4X", "4Y" //小王/大王
];
class DealCards {
    constructor(self, playerIds, max, min, removeCards = [], few = 1, isLz = false, isPz = false) {
        this.cards = "";
        this.playerIds = "";
        this._cards = "";
        this.gameConfig = "";
        this.roomConfig = "";
        this.max = "";
        this.min = "";
        this._removeCards = "";
        this.isPz = "";
        this.isLz = "";
        this._LzCards = [];
        this.result = "";
        this.self = "";
        console.log("======playerIds,max,min", playerIds, max, min);
        this.playerIds = playerIds;
        this.cards = few == 1 ? Cards : Cards.concat(Cards);
        this._cards = [];
        this.gameConfig = "";
        this.roomConfig = self.roomConfig;
        this.max = max;
        this.min = min;
        this.self = self;
        this._removeCards = removeCards;
        this.isLz = isLz;
        this.isPz = isPz;
        this._LzCards = [];
    }
    SendCards() {
        let _tmpCards = [];
        let __tmpCards = this._removeCards.concat(this.cards).filter(v => !this._removeCards.includes(v) || !this.cards.includes(v));
        if (this.isLz == true)
            this._LzCards = this.generateLz(this._LzCards);
        if (this.isLz == true)
            __tmpCards = this.getLzCards(__tmpCards, this._LzCards);
        if (this.isPz == true)
            __tmpCards.push("PLP");
        __tmpCards = _.shuffle(__tmpCards);
        let _num = 0;
        if (this.roomConfig.type == "ddz2")
            _num = 1;
        if (this.self.peiCards.length > 0) {
            let _arr = [];
            let ds = __tmpCards;
            for (let i = 0; i < this.playerIds.length + _num; i++) {
                let c = [];
                if (this.self.peiCards[i] != undefined) {
                    c = this.self.peiCards[i].cards;
                    console.log("====c==", c.length);
                    ds = this.get_diff(c, ds);
                }
            }
            ds = _.shuffle(ds);
            console.log("=====ds.length==", ds.length);
            for (let i = 0; i < this.playerIds.length + _num; i++) {
                let c = [];
                if (this.self.peiCards[i] != undefined)
                    c = this.self.peiCards[i].cards;
                let _tc = _.slice(ds, i * (this.max - c.length), i * (this.max - c.length) + (this.max - c.length));
                let _a = _.concat(_tc, c);
                console.log("==SendCards===_a====", _a.length);
                _arr = _.concat(_arr, _a);
            }
            let __tmpArr = this.get_diff(_arr, __tmpCards);
            __tmpArr = _.shuffle(__tmpArr);
            _arr = _.concat(_arr, __tmpArr);
            __tmpCards = _arr;
            console.log("========_tmpCards", __tmpCards.length, "=========__tmpArr====", _arr.length);
        }
        for (let i = 0; i < this.playerIds.length + _num; i++) {
            _tmpCards = _.slice(__tmpCards, i * this.max, i * this.max + this.max);
            this._cards.push(_tmpCards);
        }
        return { "cards": this._cards, "lordCards": _.slice(__tmpCards, __tmpCards.length - this.min, __tmpCards.length), "LzCards": this._LzCards };
    }
    get_diff(cards, __tmpCards) {
        let obj = {};
        let card = "";
        for (let i = 0; i < __tmpCards.length; i++) {
            card = __tmpCards[i];
            if (obj[card]) {
                obj[card].cards.push(card);
                continue;
            }
            obj[card] = {
                cards: [card]
            };
        }
        for (let i = 0; i < cards.length; i++) {
            card = cards[i];
            if (obj[card])
                obj[card].cards.pop();
        }
        let _cards = [];
        for (var key in obj) {
            _cards = _cards.concat(obj[key].cards);
        }
        return _cards;
    }
    getLzCards(cards, LzCards) {
        let _LzCards = [];
        let arr = [];
        let _card = [];
        if (LzCards.length == 2) {
            arr.push(LzCards[1]);
        }
        else {
            arr = LzCards;
        }
        for (var i = 0; i < arr.length; i++) {
            _card = arr[i];
            let str = _card.substr(1);
            for (let j = 0; j < 4; j++) {
                let _str = j.toString() + str.toString();
                _LzCards.push(_str);
            }
            ;
        }
        ;
        let union = cards.filter(v => _LzCards.includes(v));
        if (union.length > 0) {
            let difference = union.concat(cards).filter(v => !union.includes(v) || !cards.includes(v));
            for (let i = 0; i < union.length; i++) {
                let str = union[i].substr(1);
                _card = union[i].toString() + "L" + str;
                difference.push(_card);
            }
            return difference;
        }
        return cards;
    }
    generateLz(LzCards) {
        let z = 0;
        let num = "";
        let cards = [];
        let card = "";
        if (LzCards.length == 0) {
            num = Math.ceil(Math.random() * (Cards.length - 5));
            card = Cards[num];
            return [card];
        }
        for (let i = 0; i < LzCards.length; i++) {
            let _card = LzCards[i];
            let str = _card.substr(1);
            for (let j = 0; j < 4; j++) {
                let _str = j.toString() + str.toString();
                cards.push(_str);
            }
            ;
        }
        ;
        while (z < 1) {
            num = Math.ceil(Math.random() * (Cards.length - 5));
            if (num == "4X" || num == "4Y")
                continue;
            card = Cards[num];
            if (cards.indexOf(card) === -1) {
                LzCards.push(card);
                z++;
            }
        }
        return LzCards;
    }
    defaultCards() {
        let cards = [];
        for (let i = 0; i < this.max; i++) {
            cards.push("-1");
        }
        return cards;
    }
}
exports.DealCards = DealCards;
