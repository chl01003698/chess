import logger from '../../../util/logger';
import * as _ from 'lodash';
const Cards = [
    "03", "13", "23", "33",   //3
    "04", "14", "24", "34",	//4
    "05", "15", "25", "35",	//5
    "06", "16", "26", "36",	//6
    "07", "17", "27", "37",	//7
    "08", "18", "28", "38",	//8
    "09", "19", "29", "39",	//9
    "00", "10", "20", "30",	//10
    "0J", "1J", "2J", "3J",	//J
    "0Q", "1Q", "2Q", "3Q",	//Q
    "0K", "1K", "2K", "3K",	//K
    "0A", "1A", "2A", "3A",	//A
    "02", "12", "22", "32", 	//2
    "4X", "4Y"				//小王/大王
];
export class DealCards {
    cards: any = "";
    playerIds: any = "";
    _cards: any = "";
    gameConfig: any = "";
    roomConfig: any = "";
    max: any = "";
    min: any = "";
    _removeCards: any = "";
    isPz: any = "";
    isLz: any = "";
    _LzCards: Array<string> = [];
    result: any = "";
    self: any = "";
    constructor(self, playerIds: any, max: any, min: any, removeCards: any = [], few: any = 1, isLz: any = false, isPz: any = false) {
        console.log("======playerIds,max,min", playerIds, max, min);
        this.playerIds = playerIds;
        this.cards = few == 1 ? Cards : Cards.concat(Cards)
        this._cards = [];
        this.gameConfig = "";
        this.roomConfig = self.roomConfig;
        this.max = max;
        this.min = min;
        this.self = self
        this._removeCards = removeCards;
        this.isLz = isLz;
        this.isPz = isPz;
        this._LzCards = [];
    }
    SendCards() {
        let _tmpCards: any = [];
        let __tmpCards: any = this._removeCards.concat(this.cards).filter(v => !this._removeCards.includes(v) || !this.cards.includes(v));
        if (this.isLz == true) this._LzCards = this.generateLz(this._LzCards);
        if (this.isLz == true) __tmpCards = this.getLzCards(__tmpCards, this._LzCards);
        if (this.isPz == true) __tmpCards.push("PLP");
        __tmpCards = _.shuffle(__tmpCards);
        let _num = 0;
        if (this.roomConfig.type == "ddz2") _num = 1;
        if (this.self.peiCards.length > 0) {
            let _arr = [];
            let ds: Array<string> = __tmpCards;
            for (let i = 0; i < this.playerIds.length + _num; i++) {
                let c = [];
                if (this.self.peiCards[i] != undefined) {
                    c = this.self.peiCards[i].cards;
                    console.log("====c==", c.length);
                    ds = this.get_diff(c, ds);
                }
            }
            ds = _.shuffle(ds);
            console.log("=====ds.length==",ds.length);
            for (let i = 0; i < this.playerIds.length + _num; i++) {
                let c = [];
                if (this.self.peiCards[i] != undefined) c = this.self.peiCards[i].cards;
                let _tc = _.slice(ds, i * (this.max - c.length), i * (this.max - c.length) + (this.max - c.length));
                let _a = _.concat(_tc, c)
                console.log("==SendCards===_a====", _a.length);
                _arr = _.concat(_arr, _a);
            }
            let __tmpArr = this.get_diff(_arr,__tmpCards);
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
        let obj: any = {};
        let card: string = "";
        for (let i = 0; i < __tmpCards.length; i++) {
            card = __tmpCards[i];
            if (obj[card]) {
                obj[card].cards.push(card);
                continue;
            }
            obj[card] = {
                cards: [card]
            }
        }
        for (let i = 0; i < cards.length; i++) {
            card = cards[i];
            if (obj[card]) obj[card].cards.pop();
        }
        let _cards: Array<string> = [];
        for (var key in obj) {
            _cards = _cards.concat(obj[key].cards);
        }
        return _cards;
    }
    getLzCards(cards: any, LzCards: any) {
        let _LzCards: any = [];
        let arr: any = [];
        let _card: any = [];
        if (LzCards.length == 2) {
            arr.push(LzCards[1]);
        } else {
            arr = LzCards;
        }
        for (var i = 0; i < arr.length; i++) {
            _card = arr[i];
            let str: any = _card.substr(1);
            for (let j = 0; j < 4; j++) {
                let _str: any = j.toString() + str.toString();
                _LzCards.push(_str);
            };
        };
        let union = cards.filter(v => _LzCards.includes(v));
        if (union.length > 0) {
            let difference = union.concat(cards).filter(v => !union.includes(v) || !cards.includes(v));
            for (let i = 0; i < union.length; i++) {
                let str = union[i].substr(1)
                _card = union[i].toString() + "L" + str;
                difference.push(_card);
            }
            return difference;
        }
        return cards
    }
    generateLz(LzCards: any) {
        let z = 0;
        let num: any = "";
        let cards: Array<string> = [];
        let card: any = "";
        if (LzCards.length == 0) {
            num = Math.ceil(Math.random() * (Cards.length - 5));
            card = Cards[num];
            return [card];
        }
        for (let i = 0; i < LzCards.length; i++) {
            let _card: any = LzCards[i];
            let str = _card.substr(1);
            for (let j = 0; j < 4; j++) {
                let _str = j.toString() + str.toString();
                cards.push(_str);
            };
        };
        while (z < 1) {
            num = Math.ceil(Math.random() * (Cards.length - 5));
            if (num == "4X" || num == "4Y") continue;
            card = Cards[num];
            if (cards.indexOf(card) === -1) {
                LzCards.push(card);
                z++;
            }
        }
        return LzCards;
    }
    defaultCards() {
        let cards: any = [];
        for (let i = 0; i < this.max; i++) {
            cards.push("-1");
        }
        return cards;
    }

}