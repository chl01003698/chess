"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const consts_1 = require("./consts");
const logger_1 = require("../../../../util/logger");
class CardFormula {
    constructor() {
        this.cardPoints = {};
        this.handTypes = {};
        this.handSDTypes = {};
        this.handFuncNames = "";
        this.handSDFuncNames = "";
        this.isLz = false;
        this.cardPoints[consts_1.exp.jokerRed] = consts_1.exp.points.length + 1;
        this.cardPoints[consts_1.exp.joker] = consts_1.exp.points.length;
        this.isLz = false;
        consts_1.exp.points.forEach((k, i) => {
            this.cardPoints[k] = i;
        });
        this.handTypes = _.keys(consts_1.exp.handTypes);
        this.handSDTypes = _.keys(consts_1.exp.handSDTypes);
        this.handFuncNames = this.handTypes.map((t) => 'isHand' + t.toLowerCase().split('_').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(''));
        this.handSDFuncNames = this.handSDTypes.map((t) => 'isHand' + t.toLowerCase().split('_').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(''));
    }
    pointIdx2Point(i) {
        if (i === consts_1.exp.points.length)
            return consts_1.exp.joker;
        if (i === consts_1.exp.points.length + 1)
            return consts_1.exp.jokerRed;
        return consts_1.exp.points[i];
    }
    _toPointIdx(c, isPoint = false) {
        let p = isPoint ? c : c.substring(1);
        return this.cardPoints[p];
    }
    sortCards(cards, isPoint = false) {
        return _.sortBy(cards, (c) => { return this._toPointIdx(c, isPoint); });
    }
    autoPlay(cards, must) { return must ? [cards[0]] : []; }
    ;
    //检查皮子牌型
    checkCardType(cards) {
        cards.sort();
        let _cards = [];
        let isPz = false;
        let _diff = [];
        let _obj = {};
        if ((cards.indexOf("PLP") === 1) && (cards.indexOf("4X") === 1) && (cards.indexOf("4Y") === 1))
            return true; //重炸
        if (cards.indexOf("PLP") === 1)
            isPz = true;
        for (var i = 0; i < cards.length; i++) {
            var _card = cards[i];
            if (_card == "PLP")
                continue;
            let s = _card.substr(1);
            if (s != "X" || s != "Y") {
                if (_diff.indexOf(s) == -1)
                    _diff.push(s);
            }
            ;
            if (_obj[s.toString()]) {
                _obj[s.toString()].push(s);
                continue;
            }
            _obj[s.toString()] = [s];
        }
        if (_obj['2']) {
            if (((_obj['2'].length >= 2) && (cards.indexOf("4X") === 1) || (cards.indexOf("4Y") === 1)) || _obj["2"].length === 4)
                return true;
        }
        var count = 0;
        var idxs = _diff.map((p) => this._toPointIdx(p, true));
        for (let i = 1; i < idxs.length; i++) {
            if (idxs[i] === idxs[i - 1] + 1) {
                var _k = consts_1.exp.points[idxs[i]];
                var _k1 = consts_1.exp.points[idxs[i - 1] + 1];
                if (!_k || !_k1)
                    continue;
                var k = _k.toString();
                var k1 = _k1.toString();
                if ((_obj[k].length === 4 && _obj[k1].length === 4) || (_obj[k].length === 4 && isPz == true))
                    return true;
                if (_obj[k].length === 4)
                    count += 1;
                if (count === 3)
                    return true;
            }
        }
        return false;
    }
    //检查出牌是否正确
    getCardsType(cards, isPoint = false, sorted = false) {
        let _cards = [];
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            if (card.indexOf("L") > 0) {
                let str = card[3];
                str = "0" + str.toString();
                _cards.push(str);
                continue;
            }
            _cards.push(card);
        }
        return _cards;
    }
    //获取癞子牌型
    getLzCardsType(cards) {
        let _cards = [];
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            if (card.indexOf("L") > 0) {
                let str = card.substr(0, 3);
                str = str + str[1];
                _cards.push(str);
                continue;
            }
            _cards.push(card);
        }
        return _cards;
    }
    //检查牌型
    isCardsValid(cards, isPoint = false, sorted = false) {
        let res = this.getHandType(cards, isPoint, sorted) !== -1;
        return res;
    }
    //检查闪电牌型
    isSDCardsValid(cards, isPoint = false, sorted = false) {
        let res = this.getSDHandType(cards, isPoint, sorted) !== -1;
        return res;
    }
    ;
    //3张顺子
    isHandThreeStraight(cards, isPoint = false, sorted = false) {
        if (cards.length < 3)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps = sorted ? ps : this.sortCards(ps, true);
        let idxs = ps.map((p) => this._toPointIdx(p, true));
        for (let i = 1; i < idxs.length; i++) {
            if (idxs[i] !== idxs[i - 1] + 1)
                return false;
        }
        if (idxs[idxs.length - 1] >= consts_1.exp.points.length - 1)
            return false;
        return { main: idxs[idxs.length - 1], required: cards.length };
    }
    ;
    //对比牌型是否大小
    isCardsGreater(cards, compared, isPoint = false, sorted = false) {
        logger_1.default.info('cards: %j, compared: %j', cards, compared);
        let handInfo = this.getHandTypeInfo(cards, isPoint, sorted);
        let compHandInfo = this.getHandTypeInfo(compared, isPoint, sorted);
        console.log("=====handInfo==", handInfo, "====compHandInfo==", compHandInfo);
        if (handInfo.type === consts_1.exp.handTypes.ROCKET)
            return true;
        if (compHandInfo.type === consts_1.exp.handTypes.ROCKET)
            return false;
        if (handInfo.type === consts_1.exp.handTypes.BOMB && compHandInfo.type !== consts_1.exp.handTypes.BOMB)
            return true;
        // if (handInfo.type !== compHandInfo.type) return false;
        if (handInfo.info.required && handInfo.info.required !== compHandInfo.info.required)
            return false;
        return handInfo.info.main > compHandInfo.info.main;
    }
    ;
    isSDCardsGreater(cards, compared, isPoint = false, sorted = false) {
        logger_1.default.info('cards: %j, compared: %j', cards, compared);
        let handInfo = this.getSDHandTypeInfo(cards, isPoint, sorted);
        let compHandInfo = this.getSDHandTypeInfo(compared, isPoint, sorted);
        if (handInfo.type === consts_1.exp.handTypes.ROCKET)
            return true;
        if (compHandInfo.type === consts_1.exp.handTypes.ROCKET)
            return false;
        if (handInfo.type === consts_1.exp.handTypes.BOMB && compHandInfo.type !== consts_1.exp.handTypes.BOMB)
            return true;
        if (handInfo.type !== compHandInfo.type)
            return false;
        if (handInfo.info.required && handInfo.info.required !== compHandInfo.info.required)
            return false;
        return handInfo.info.main > compHandInfo.info.main;
    }
    ;
    //得到手牌类型
    getHandType(cards, isPoint = false, sorted = false) {
        for (let i = 0; i < this.handTypes.length; i++) {
            if (this[this.handFuncNames[i]]) {
                if (this[this.handFuncNames[i]](cards, isPoint, sorted))
                    return this.handTypes[this.handTypes[i]];
            }
            else {
                console.log("======this.handFuncNames[i]", this.handFuncNames[i]);
            }
        }
        return -1;
    }
    ;
    getSDHandType(cards, isPoint = false, sorted = false) {
        for (let i = 0; i < this.handSDTypes.length; i++) {
            if (this[this.handSDFuncNames[i]](cards, isPoint, sorted))
                return consts_1.exp.handSDTypes[this.handSDTypes[i]];
        }
        return -1;
    }
    ;
    //获取手牌类型详细信息
    getHandTypeInfo(cards, isPoint = false, sorted = false) {
        for (let i = 0; i < this.handTypes.length; i++) {
            let funName = this.handFuncNames[i];
            let info = this[funName](cards, isPoint, sorted);
            if (info)
                return { type: consts_1.exp.handTypes[this.handTypes[i]], info: info };
        }
        return null;
    }
    ;
    getSDHandTypeInfo(cards, isPoint = false, sorted = false) {
        for (let i = 0; i < this.handSDTypes.length; i++) {
            let info = this[this.handSDFuncNames[i]](cards, isPoint, sorted);
            if (info)
                return { type: consts_1.exp.handSDTypes[this.handTypes[i]], info: info };
        }
        return null;
    }
    ;
    //检查是否是火箭
    isHandRocket(cards, isPoint = false, sorted = false) {
        if (cards.length !== 2)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        if ((ps[0] === consts_1.exp.joker && ps[1] === consts_1.exp.jokerRed) || (ps[1] === consts_1.exp.joker && ps[0] === consts_1.exp.jokerRed))
            return { main: this._toPointIdx(cards[cards.length - 1], isPoint) };
        return false;
    }
    ;
    //检查是否是炸弹
    isHandBomb(cards, isPoint = false, sorted = false) {
        if (cards.length !== 4)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        if (ps[1] === ps[0] && ps[2] === ps[0] && ps[3] === ps[0])
            return { main: this._toPointIdx(ps[0], true) };
        return false;
    }
    ;
    //检查是否是单张
    isHandSolo(cards, isPoint = false, sorted = false) {
        if (cards.length !== 1)
            return false;
        return { main: this._toPointIdx(cards[0], isPoint) };
    }
    ;
    //检查是否是单王
    isHandKing(cards, isPoint = false, sorted = false) {
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        if ((ps[0] === consts_1.exp.joker || ps[0] === consts_1.exp.jokerRed))
            return { main: this._toPointIdx(cards[0], isPoint) };
        return false;
    }
    //检查是否同花
    isHandFlowers(cards, isPoint = false, sorted = false) {
        if (cards.length <= 1)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(0, 1));
        ps = sorted ? ps : this.sortCards(ps, true);
        let a = "";
        let b = "";
        for (let i = 0; i < ps.length; i++) {
            a = ps[i + 1] ? ps[i + 1] : ps[0];
            b = ps[i];
            if (a != b)
                return false;
        }
        return true;
    }
    //检查是否是对子
    isHandPair(cards, isPoint = false, sorted = false) {
        if (cards.length !== 2)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        if (ps[1] === ps[0])
            return { main: this._toPointIdx(ps[0], true) };
        return false;
    }
    ;
    //检查是否是顺子
    isHandStraight(cards, isPoint = false, sorted = false) {
        if (cards.length < 5)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps = sorted ? ps : this.sortCards(ps, true);
        let idxs = ps.map((p) => this._toPointIdx(p, true));
        for (let i = 1; i < idxs.length; i++) {
            if (idxs[i] !== idxs[i - 1] + 1)
                return false;
        }
        if (idxs[idxs.length - 1] >= consts_1.exp.points.length - 1)
            return false;
        return { main: idxs[idxs.length - 1], required: cards.length };
    }
    ;
    //检查底牌是否是顺子
    isHandThree(cards, num, isPoint = false, sorted = false) {
        if (cards.length != num)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps = sorted ? ps : this.sortCards(ps, true);
        var idxs = ps.map((p) => this._toPointIdx(p, true));
        for (let i = 1; i < idxs.length; i++) {
            if (idxs[i] !== idxs[i - 1] + 1)
                return false;
        }
        if (idxs[idxs.length - 1] >= consts_1.exp.points.length - 1)
            return false;
        return { main: idxs[idxs.length - 1], required: cards.length };
    }
    ;
    //检查是否是双对
    isHandConsecutivePairs(cards, isPoint = false, sorted = false) {
        if (cards.length < 6 || cards.length % 2 !== 0)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps = sorted ? ps : this.sortCards(ps, true);
        if (_.indexOf(['2', consts_1.exp.joker, consts_1.exp.jokerRed], ps[ps.length - 1]) !== -1)
            return false;
        for (let i = 0; i < ps.length / 2; i++) {
            if (ps[i * 2] !== ps[i * 2 + 1])
                return false;
            if (i > 0 && this._toPointIdx(ps[i * 2 - 1], true) + 1 !== this._toPointIdx(ps[i * 2], true))
                return false;
        }
        return { main: this._toPointIdx(ps[ps.length - 1], true), required: cards.length / 2 };
    }
    ;
    //检查是否是三张
    isHandTrio(cards, isPoint = false, sorted = false) {
        if (cards.length !== 3)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        if (ps[1] === ps[0] && ps[2] === ps[0])
            return { main: this._toPointIdx(ps[0], true) };
        return false;
    }
    ;
    //检查是否三带一
    isHandTrioSolo(cards, isPoint = false, sorted = false) {
        if (cards.length !== 4)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps = sorted ? ps : this.sortCards(ps, true);
        if (ps[1] === ps[0] ? (ps[2] === ps[0] && ps[3] !== ps[0]) : (ps[2] === ps[1] && ps[3] === ps[1]))
            return { main: this._toPointIdx(ps[1], true) };
        return false;
    }
    ;
    //检查是否三带对
    isHandTrioPair(cards, isPoint = false, sorted = false) {
        if (cards.length !== 5)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps = sorted ? ps : this.sortCards(ps, true);
        if (ps[2] === ps[1] ? (ps[0] === ps[1] && ps[4] === ps[3] && ps[3] !== ps[2]) :
            (ps[0] === ps[1] && ps[3] === ps[2] && ps[4] === ps[2]))
            return { main: this._toPointIdx(ps[2], true) };
        return false;
    }
    ;
    //检查飞机带单
    isHandAirplaneSolo(cards, isPoint = false, sorted = false) {
        if (cards.length < 8 || cards.length % 4 !== 0)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps = sorted ? ps : this.sortCards(ps, true);
        let trios = [];
        for (let i = 2; i < ps.length; i++) {
            if (ps[i] === ps[i - 2] && ps[i - 1] === ps[i - 2]) {
                if (_.indexOf(trios, ps[i]) === -1)
                    trios.push(ps[i]);
            }
        }
        if (trios.length < 2)
            return false;
        if (trios[trios.length - 1] === '2')
            return false;
        var trioIdxs = trios.map((p) => this._toPointIdx(p, true));
        for (let i = 1; i < trioIdxs.length; i++) {
            if (trioIdxs[i] !== trioIdxs[i - 1] + 1)
                return false;
        }
        return { main: trioIdxs[trioIdxs.length - 1], required: cards.length / 4 };
    }
    ;
    //检查飞机带队
    isHandAirplanePair(cards, isPoint = false, sorted = false) {
        if (cards.length < 10 || cards.length % 5 !== 0)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps = sorted ? ps : this.sortCards(ps, true);
        let trios = [];
        for (let i = 2; i < ps.length; i++) {
            if (ps[i] === ps[i - 2] && ps[i - 1] === ps[i - 2]) {
                if (_.indexOf(trios, ps[i]) === -1)
                    trios.push(ps[i]);
            }
        }
        if (trios.length < 2)
            return false;
        if (trios[trios.length - 1] === '2')
            return false;
        let trioIdxs = trios.map((p) => this._toPointIdx(p, true));
        for (let i = 1; i < trioIdxs.length; i++) {
            if (trioIdxs[i] !== trioIdxs[i - 1] + 1)
                return false;
        }
        let pairs = [];
        for (let i = 0; i < ps.length; i++) {
            if (_.indexOf(trios, ps[i]) === -1)
                pairs.push(ps[i]);
        }
        if (this._isPairs(pairs))
            return { main: trioIdxs[trioIdxs.length - 1], required: cards.length / 5 };
        return false;
    }
    ;
    //检查是否是飞机 
    isHandAirplane(cards, isPoint = false, sorted = false) {
        if (cards.length < 6 || cards.length % 3 !== 0)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps = sorted ? ps : this.sortCards(ps, true);
        for (var i = 0; i < ps.length / 3; i++) {
            if (ps[i * 3 + 2] !== ps[i * 3] || ps[i * 3 + 1] !== ps[i * 3])
                return false;
            if (i > 0 && this._toPointIdx(ps[i * 3 - 1], true) + 1 !== this._toPointIdx(ps[i * 3], true))
                return false;
        }
        if (ps[ps.length - 1] === '2')
            return false;
        return { main: this._toPointIdx(ps[ps.length - 1], true), required: cards.length / 3 };
    }
    ;
    //检查是否四带一
    isHandSpaceShuttleSolo(cards, isPoint = false, sorted = false) {
        if (cards.length !== 6)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps = sorted ? ps : this.sortCards(ps, true);
        let fours = [];
        for (let i = 3; i < ps.length; i++) {
            if (ps[i] === ps[i - 3] && ps[i - 1] === ps[i - 3] && ps[i - 2] === ps[i - 3]) {
                if (_.indexOf(fours, ps[i]) === -1)
                    fours.push(ps[i]);
            }
        }
        if (fours.length < 1)
            return false;
        return { main: this._toPointIdx(fours[fours.length - 1], true) };
    }
    ;
    _isPairs(pairs) {
        if (pairs.length % 2 !== 0)
            return false;
        for (let i = 0; i < pairs.length / 2; i++) {
            if (pairs[i * 2] !== pairs[i * 2 + 1])
                return false;
        }
        return true;
    }
    ;
    //检查四带两对 
    isHandSpaceShuttlePair(cards, isPoint = false, sorted = false) {
        if (cards.length !== 8)
            return false;
        let ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps = sorted ? ps : this.sortCards(ps, true);
        let fours = [];
        for (let i = 3; i < ps.length; i++) {
            if (ps[i] === ps[i - 3] && ps[i - 1] === ps[i - 3] && ps[i - 2] === ps[i - 3]) {
                if (_.indexOf(fours, ps[i]) === -1)
                    fours.push(ps[i]);
            }
        }
        if (fours.length < 1)
            return false;
        let pairs = [];
        for (let i = 0; i < ps.length; i++) {
            if (_.indexOf(fours, ps[i]) === -1)
                pairs.push(ps[i]);
        }
        if (this._isPairs(pairs))
            return { main: this._toPointIdx(fours[fours.length - 1], true) };
        return false;
    }
    ;
}
exports.default = CardFormula;
