import CardFormula from './cardFormula';
import logger from '../../../../util/logger';
import { exp } from './consts';

export default class FourCardFormula extends CardFormula {
    constructor() { super(); }
    //对比牌型大小
    isCardsGreater(cards: Array<string>, compared: Array<string>, isPoint: any = false, sorted: any = false) {
        logger.info('cards: %j, compared: %j', cards, compared);
        let handInfo: any = this.getHandTypeInfo(cards, isPoint, sorted);
        let compHandInfo: any = this.getHandTypeInfo(compared, isPoint, sorted);
        if (handInfo.type === exp.handTypes.ROCKET) return true;
        if (compHandInfo.type === exp.handTypes.ROCKET) return false;
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
    //是否是火箭
    isHandRocket(cards: Array<string>, isPoint: any = false, sorted: any = false) {
        if (cards.length !== 4) return false;
        var ps = isPoint ? cards : cards.map((c) => c.substring(1));
        ps.sort();
        if ((ps[0] === exp.joker && ps[1] === exp.joker) || (ps[2] === exp.jokerRed && ps[3] === exp.jokerRed))
            return { main: this._toPointIdx(cards[cards.length - 1], isPoint) };
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
        return { main: this._toPointIdx(ps[0], true) };;
    };
}