import CardFormula from './cardFormula';
import logger from '../../../../util/logger';
import { exp } from './consts';
import { isPast, compareAsc } from 'date-fns';

export default class TdLzCardFormula extends CardFormula {
    _cards: any = "";
    _compared: any = "";
    isCardsLz: any = false;
    isComparedLz: any = false;
    _isCardsLz: any = false;
    _isComparedLz: any = false;
    constructor() { super(); }
    //对比牌型是否大小

    isCardsGreater(cards: any, compared: any, isPoint: any = false, sorted: any = false) {
        logger.info('cards: %j, compared: %j', cards, compared);
        this.isCardsLz = false;
        this.isComparedLz = false;
        this._isCardsLz = false;
        this._isComparedLz = false;
        cards = this.getCardsType(cards, true);
        compared = this.getCardsType(compared);
        console.log("=========compared",compared);
        console.log("========cards",cards.length)
        let handInfo: any = this.getHandTypeInfo(cards, isPoint, sorted);
        let compHandInfo: any = this.getHandTypeInfo(compared, isPoint, sorted);
        console.log("=======handInfo,",handInfo);
        console.log("=======compHandInfo,",compHandInfo);
        if (handInfo.type === exp.handTypes.ROCKET) return true;
        if (compHandInfo.type === exp.handTypes.ROCKET) return false;
        if (handInfo.type === exp.handTypes.BOMB && compHandInfo.type === exp.handTypes.BOMB) {  //都是炸弹
            console.log("handInfo.info,", handInfo.info, "isCardsLz", this.isCardsLz,
                "isComparedLz", this.isComparedLz, "_isCardsLz", this._isCardsLz,
                "_isComparedLz", this._isComparedLz, "compHandInfo.info", compHandInfo.info);
            if ((this.isCardsLz == true && this.isComparedLz == false)
                || (this.isCardsLz == false && this.isComparedLz == true)
                || (this.isCardsLz == true && this.isComparedLz == true)) {  //赖炸
                console.log("======isCardsGreater====lanzha===this.isCardsLz==", this.isCardsLz, "this.isComparedLz", this.isComparedLz);
                if (cards.length == compared.length) {
                    if (this.isCardsLz == true && this.isComparedLz == false) { //懒炸 和硬炸
                        return true;
                    }
                    if (this.isCardsLz == true && this.isComparedLz == true) {  //都是懒炸
                        return false;
                    }
                    if(this.isCardsLz == false && this._isComparedLz == true){ //硬炸 和软炸
                        return true
                    }
                    if(this._isCardsLz == true && this._isComparedLz == true){ //软炸和软炸
                        return handInfo.info.main > compHandInfo.info.main;                        
                    }
                }
                if (cards.length < compared.length) {
                    return false
                }
                if (cards.length > compared.length) {
                    return true;
                }
                
                return false;
            }  //懒炸大
            if (this.isCardsLz == true && this._isComparedLz == true && this.isComparedLz == false) { //懒炸 >硬炸对比
                if (cards.length == compared.length) {
                    return true
                }
                return false
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
                    return true // 硬炸 >软炸
                }
                if (cards.length > compared.length) {
                    return true;
                }
                // return false;
            }
            if (this._isCardsLz == true && this._isComparedLz != true) {
                if (cards.length == compared.length) {
                    return false // 硬炸 >软炸
                }
                if (cards.length > compared.length) {
                    return true;
                }
                return false;
            }
            if (this._isCardsLz != true && this._isComparedLz != true) { //硬炸

                return handInfo.info.main > compHandInfo.info.main;
            }
            if (this._isCardsLz == true && this._isComparedLz == true) {  //软炸
                console.log("======isCardsGreater====this._isCardsLz=====", this._isCardsLz, "this._isComparedLz", this._isComparedLz);

                if (cards.length > compared.length) return true;
                return handInfo.info.main > compHandInfo.info.main;
            }
        }
        if (handInfo.type === exp.handTypes.BOMB && compHandInfo.type !== exp.handTypes.BOMB) return true;
        // if (handInfo.type !== compHandInfo.type) return false;
        if (handInfo.info.required && handInfo.info.required !== compHandInfo.info.required) return false;
        return handInfo.info.main > compHandInfo.info.main;
    };

    isHandBomb(cards: Array<string>, isPoint: any = false, sorted: any = false) {
        if (cards.length < 4) return false;
        let ps: any = isPoint ? cards : cards.map((c) => c.substring(1));
        ps.sort();
        let a: any = "";
        let b: any = "";
        let cardsType: any = "";
        for (let i = 0; i < ps.length; i++) {
            a = ps[i];
            b = ps[i + 1];
            if (b != undefined) {
                if (a != b) return false
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
            if (c == d) count += 1;
        }
        return { main: this._toPointIdx(ps[0], true), cardType: cardType };
        // return { main: this._toPointIdx(ps[0], true) };;
    };

    //获取癞子牌型

    getCardsType(cards:any, isPoint: any = false, sorted: any = false) {
        let _cards: any = [];
        let count = 0;
        let card: any = "";
        let str: string = "";
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
            if (isPoint == true) this._isCardsLz = true;   //软炸
            if (isPoint == false) this._isComparedLz = true; //软炸
        }
        if (count == cards.length && cards.length >= 4) {
            _cards = [];
            if (isPoint == true) this.isCardsLz = true; //懒炸
            if (isPoint == false) this.isComparedLz = true; //懒炸
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