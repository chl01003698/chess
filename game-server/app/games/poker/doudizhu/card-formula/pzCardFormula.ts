import { exp } from './consts';
import CardFormula from "./cardFormula";

export default class PzCardForMula extends CardFormula {
    constructor() { super(); }
    getCardsType(cards: any, isPoint: any = false, sorted: any = false) {
        let _cards: Array<string> = [];
        if (cards.length == 1) {
            if (cards.indexOf("PLP") == 0) {
                _cards.push("-1");
                return _cards;
            }
        }
        cards.sort();
        for (let i = 0; i < cards.length; i++) {
            let card: string = cards[i];
            if (card.indexOf("L") > 0) {
                let str: any = card[2];
                if (str.toUpperCase() !== "X" || str.toUpperCase() !== "Y") {
                    if (str == "P") {
                        let _tmp: any = cards[0][1];
                        if ((isNaN(_tmp) || _tmp == "0" || _tmp == "9") && _tmp != "X") {
                            str = "03";
                        } else {
                            if (_tmp == "X") {
                                str = "4Y";
                            } else {
                                if(cards.length !=5 ) str = "0"+(parseInt(_tmp)+1).toString();
                                if(cards.length == 5) str = "0"+parseInt(_tmp).toString();
                            }
                        }
                        _cards.push(str);
                        continue;
                    }
                    str = "0" + str.toString();
                    _cards.push(str);
                    continue;
                }
                str = "4" + str;
                _cards.push(str);
            }
            _cards.push(card);
        }
        return _cards;
    }
    isCardsGreater(cards: Array<string>, compared: Array<string>, isPoint: any = false, sorted: any = false) {
        cards = this.getCardsType(cards);
        compared = this.getCardsType(compared);
        let handInfo: any = this.getHandTypeInfo(cards, isPoint, sorted);
        let compHandInfo: any = this.getHandTypeInfo(compared, isPoint, sorted);
        if (handInfo.info.main === undefined) return false;
        if (compared[0] == "-1") return true;
        if (handInfo.type === exp.handTypes.BOMB && compHandInfo.type === exp.handTypes.ROCKET) {
            if (cards.length === 5 && compared.length === 2) return true;
            return false;
        }
        if (handInfo.type === exp.handTypes.ROCKET && compHandInfo.type != exp.handTypes.FRIED) return true;
        if ((handInfo.type === exp.handTypes.FRIED && compHandInfo.type === exp.handTypes.ROCKET) ||
            (handInfo.type === exp.handTypes.FRIED && compHandInfo.type === exp.handTypes.BOMB)) return true;
        if ((handInfo.type === exp.handTypes.FRIED && compHandInfo.type === exp.handTypes.ROCKET) ||
            (handInfo.type === exp.handTypes.FRIED && compHandInfo.type === exp.handTypes.BOMB)) return false;
        if (handInfo.type === exp.handTypes.BOMB && compHandInfo.type !== exp.handTypes.BOMB) return true;
        // if (handInfo.type !== compHandInfo.type) return false;
        if (handInfo.info.required && handInfo.info.required !== compHandInfo.info.required) return false;

        if (handInfo.type === exp.handTypes.BOMB && compHandInfo.type === exp.handTypes.BOMB) {  //都是炸弹
            if ((handInfo.info.main > compHandInfo.info.main) == false) {
                if (cards.length > compared.length) return true;
            }
            return handInfo.info.main > compHandInfo.info.main;
        }
        return handInfo.info.main > compHandInfo.info.main;
    };
    isHandRocket(cards: Array<string>, isPoint: any = false, sorted: any = false) {
        if (cards.length < 2) return false;
        let ps: any = isPoint ? cards : cards.map((c) => c.substring(1));
        if (cards.length === 2) {  //王炸
            if ((ps[0] === exp.joker && ps[1] === exp.jokerRed) || (ps[1] === exp.joker && ps[0] === exp.jokerRed))
                return { main: this._toPointIdx(cards[cards.length - 1], isPoint) };
        }
        ps.sort();
        if (cards.length === 3) {
            if (ps[0] === exp.joker && ps[1] === exp.jokerRed && ps[2] === exp.jokerRed)
                return { main: this._toPointIdx(cards[cards.length - 1], isPoint) };
        }
        return false;
    };
    isHandBomb(cards: Array<string>, isPoint: any = false, sorted: any = false) {
        if (cards.length < 4) return false;
        let ps: any = isPoint ? cards : cards.map((c) => c.substring(1));
        ps.sort();
        let a: any = "";
        let b: any = "";
        for (let i = 0; i < ps.length; i++) {
            a = ps[i];
            b = ps[i + 1];
            if (b != undefined) {
                if (a != b) return false
            }
        }
        return { main: this._toPointIdx(ps[0], true) };
    };
    //连炸
    isHandFried(cards: Array<string>, isPoint: any = false, sorted: any = false) {
        if (cards.length !== 8) return false;
        let arr: any = [];
        for (let i = 0; i < cards.length; i++) {
            if (arr.length === 4) {
                if (!this.isHandBomb(arr)) return false;
                arr = [];
            }
            arr.push(cards[i]);
        }
        let ps: any = isPoint ? cards : cards.map((c) => c.substring(1));
        let idxs: any = ps.map((p) => this._toPointIdx(p, true));
        if (parseInt(idxs[0]) + 1 == idxs[4]) return { main: this._toPointIdx(ps[idxs.length - 1], true) };;
        return false;

    };
    getLzCardsType(cards:Array<string>){
        let _cards:any = [];
        let str1:any = "";
        for(let i = 0;i<cards.length;i++){
            let card = cards[i];
            if(card.indexOf("L")>0){
                str1 = card.substr(0,2);
                str1 = str1+card[0];
                _cards.push(str1);
                continue;
            }
            _cards.push(card);
        }
        return _cards;
    };
    isCardsValid (cards:Array<string>, isPoint:any = false, sorted:any=false) {
        if(cards[0] == "-1"){
            return true;
        }
        let res = this.getHandType(cards, isPoint, sorted) !== -1;
        return res;
    };

}    