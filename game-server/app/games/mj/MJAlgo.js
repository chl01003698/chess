"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const MJCardGroupManage_1 = require("./components/MJCardGroupManage");
const MJEnum_1 = require("./consts/MJEnum");
const MJ = require("./consts/MJConsts");
const MJComboAlgo_1 = require("./MJComboAlgo");
const MJComboBase_1 = require("./MJComboBase");
const MJFormulaModel_1 = require("./MJModel/MJFormulaModel");
let mjlib = require('./MJAlgo/mjlib_js/api.js');
class MJDataActionBuGang {
    constructor(params) {
        this.card = params.card;
        this.triggerUid = params.triggerUid;
    }
}
exports.MJDataActionBuGang = MJDataActionBuGang;
class MJHuTestData {
    constructor(ok, card) {
        this.ok = ok;
        this.card = card;
    }
}
exports.MJHuTestData = MJHuTestData;
class MJAlgo {
    static initCards(config) {
        const cards = new Array();
        for (let i = 0; i < 4; ++i) {
            _.forEach(config.wtb, (v) => {
                cards.push(..._.range(v * 9 + 8, (v + 1) * 9 + 8));
            });
            if (config.zfb) {
                cards.push(..._.range(MJ.Mj_Jian_Begin, MJ.Mj_Jian_End + 1));
            }
            if (config.wind) {
                cards.push(..._.range(MJ.MJ_Feng_Begin, MJ.MJ_Feng_End + 1));
            }
        }
        if (config.flower) {
            cards.push(..._.range(MJ.MJ_Hua_Begin, MJ.MJ_Hua_End + 1));
        }
        if (_.isArray(config.special)) {
            _.forEach(config.special, (v) => {
                cards.push(..._.fill(new Array(v[0]), v[1]));
            });
        }
        return cards;
    }
    static dealCards(cards, assignCount, playerCount = 4) {
        const playerCards = _.chunk(_.slice(cards, 0, assignCount * playerCount), assignCount);
        const remainCards = _.slice(cards, assignCount * playerCount);
        return { playerCards, remainCards };
    }
    static formatCards(cards) {
        let arr = _.fill(Array(MJ.MAX_MJ_CODEARRAY), 0);
        for (let card of cards) {
            if (card > 0 && card < MJ.MAX_MJ_CODEARRAY) {
                ++arr[card];
            }
        }
        return arr;
    }
    static getRangeTingCards(cards) {
        const uniqCards = _.uniq(cards);
        const keyCards = _.map(cards, (v) => v / 10);
        _.forEach(keyCards, (v) => {
            if (_.includes([1, 2, 3], v)) {
                cards.push(..._.range(v * 10 + 1, (v + 1) * 10));
            }
            if (v == 4) {
                cards.push(..._.range(41, 44));
            }
            if (v == 5) {
                cards.push(..._.range(51, 55));
            }
            if (v == 6) {
                cards.push(..._.range(61, 69));
            }
        });
    }
    static getTingCards(cards) {
        const results = new Array();
        // const rangeTingCards = this.getRangeTingCards(cards)
        // _.forEach(rangeTingCards, (v) => {
        // 	const cloneCards = _.clone(cards)
        // 	cloneCards.push(v)
        // 	cloneCards.sort((a, b) => a - b)
        // 	const result = this.canHu(this.xuanJiang(cloneCards))
        // 	if (result) {
        // 		results.push(v)
        // 	}
        // })
        return results;
    }
    static canHu(cards, qiDui = false) {
        let result = mjlib.MHulib.get_hu_info(this.formatCards(cards));
        if (!result && qiDui) {
            if (cards.length == 14) {
                result = mjlib.MHulib.get_hu_7Duiinfo(this.formatCards(cards));
            }
        }
        return result;
    }
    static canHuArr34(cards, qiDui = false) {
        let result = mjlib.MHulib.get_hu_info(cards);
        if (!result && qiDui) {
            if (MJComboBase_1.default.getCardsCount(cards) == 14) {
                result = mjlib.MHulib.get_hu_7Duiinfo(cards);
            }
        }
        return result;
    }
    static filterZhang(params) {
        const cardGroupManage = params.gamePlayer.cardGroupManage;
        //return cardGroupManage.countCardGroupByType(MJCardGroupType.ZHANG) == 0
        return false;
    }
    static testZhang(params) {
        const cards = params.gamePlayer.cards;
        return {
            ok: _.includes(cards, params.card),
            data: undefined
        };
    }
    static actionZhang(params) {
        const cardGroupManage = params.gamePlayer.cardGroupManage;
        const cards = params.gamePlayer.cards;
        //const triggerGamePlayer = params.triggerGamePlayer
        cards.splice(cards.indexOf(params.card), 1);
        cardGroupManage.pushCardGroup(new MJCardGroupManage_1.MJCardGroup(MJEnum_1.MJCardGroupType.ZHANG, _.fill(new Array(2), params.card), params.card, params.gamePlayer.uid));
        return { ok: true };
    }
    static filterChi(params) {
        return true;
    }
    static testChi(params) {
        let result = {
            ok: false,
            data: undefined
        };
        const cards = MJAlgo.formatCards(params.gamePlayer.cards);
        const cur_card = params.card;
        if (cur_card < MJ.MJ_Wan_Begin || cur_card >= MJ.MJ_Hua_Begin) {
            return result;
        }
        let text = [];
        if (cur_card === MJ.MJ_Wan_Begin || cur_card === MJ.MJ_Tiao_Begin || cur_card === MJ.MJ_Bing_Begin) {
            if (cards[cur_card + 1] && cards[cur_card + 2]) {
                text.push(MJEnum_1.MJHuQueKou.chi_zuo);
            }
            return {
                ok: text.length > 0,
                data: text
            };
        }
        if (cur_card === MJ.MJ_Wan_End || cur_card === MJ.MJ_Tiao_End || cur_card === MJ.MJ_Bing_End) {
            if (cards[cur_card - 1] && cards[cur_card - 2]) {
                text.push(MJEnum_1.MJHuQueKou.chi_you);
            }
            return {
                ok: text.length > 0,
                data: text
            };
        }
        if (cur_card === MJ.MJ_Wan_Begin + 1 || cur_card === MJ.MJ_Tiao_Begin + 1 || cur_card === MJ.MJ_Bing_Begin + 1) {
            if (cards[cur_card + 2] && cards[cur_card + 1]) {
                text.push(MJEnum_1.MJHuQueKou.chi_zuo);
            }
            if (cards[cur_card - 1] && cards[cur_card + 1]) {
                text.push(MJEnum_1.MJHuQueKou.chi_zhong);
            }
            return {
                ok: text.length > 0,
                data: text
            };
        }
        if (cur_card === MJ.MJ_Wan_End - 1 || cur_card === MJ.MJ_Tiao_End - 1 || cur_card === MJ.MJ_Bing_End - 1) {
            if (cards[cur_card - 1] && cards[cur_card - 2]) {
                text.push(MJEnum_1.MJHuQueKou.chi_you);
            }
            if (cards[cur_card - 1] && cards[cur_card + 1]) {
                text.push(MJEnum_1.MJHuQueKou.chi_zhong);
            }
            return {
                ok: text.length > 0,
                data: text
            };
        }
        if (cards[cur_card + 2] && cards[cur_card + 1]) {
            text.push(MJEnum_1.MJHuQueKou.chi_zuo);
        }
        if (cards[cur_card - 1] && cards[cur_card - 2]) {
            text.push(MJEnum_1.MJHuQueKou.chi_you);
        }
        if (cards[cur_card - 1] && cards[cur_card + 1]) {
            text.push(MJEnum_1.MJHuQueKou.chi_zhong);
        }
        return {
            ok: text.length > 0,
            data: text
        };
    }
    static actionChi(params) {
        const result = {
            ok: false,
            data: undefined
        };
        const card = params.card;
        const cards = params.gamePlayer.cards;
        const cardGroupManage = params.gamePlayer.cardGroupManage;
        const quekou = params.testData.data[params.selectIndex];
        let card0 = card;
        let card1 = card;
        if (quekou == MJEnum_1.MJHuQueKou.chi_zuo) {
            card0 += 1;
            card1 += 2;
        }
        else if (quekou == MJEnum_1.MJHuQueKou.chi_zhong) {
            card0 -= 1;
            card1 += 1;
        }
        else if (quekou == MJEnum_1.MJHuQueKou.chi_you) {
            card0 -= 2;
            card1 -= 1;
        }
        let index0 = cards.indexOf(card0);
        let index1 = cards.indexOf(card1);
        if (index0 >= 0 && index1 >= 0) {
            _.pullAt(cards, [index0, index1]);
            result.ok = true;
            result.data = [card0, card, card1];
            //const triggerGamePlayer = params.triggerGamePlayer
            cardGroupManage.pushCardGroup(new MJCardGroupManage_1.MJCardGroup(MJEnum_1.MJCardGroupType.CHI, result.data, card, params.gamePlayer.uid));
        }
        return result;
    }
    static filterPeng(params) {
        return true;
    }
    static testPeng(params) {
        const result = {
            ok: false,
            data: undefined
        };
        const cards = params.gamePlayer.cards;
        const card = params.card;
        result.ok = _.filter(cards, (v) => v == card).length >= 2;
        return result;
    }
    static actionPeng(params) {
        const result = {
            ok: false,
            data: undefined
        };
        const cards = params.gamePlayer.cards;
        const card = params.card;
        if (_.filter(cards, (v) => v == card).length >= 2) {
            cards.splice(cards.indexOf(card), 1);
            cards.splice(cards.indexOf(card), 1);
            result.ok = true;
            const cardGroupManage = params.gamePlayer.cardGroupManage;
            //const triggerGamePlayer = params.triggerGamePlayer
            cardGroupManage.pushCardGroup(new MJCardGroupManage_1.MJCardGroup(MJEnum_1.MJCardGroupType.PENG, _.fill(new Array(3), card), card, params.gamePlayer.uid));
        }
        return result;
    }
    static filterAnGang(params) {
        return true;
    }
    static testAnGang(params) {
        const cards = _.clone(params.gamePlayer.cards);
        const card = params.card;
        if (_.isNumber(card)) {
            cards.push(card);
        }
        let tempCards = MJAlgo.formatCards(cards);
        let cardlist = [];
        for (let i = MJ.MIN_CODE_INDEX; i <= MJ.MAX_CHECKCODE_INDEX; i++) {
            if (tempCards[i] >= 4) {
                cardlist.push(i);
            }
        }
        return {
            ok: cardlist.length > 0,
            data: cardlist
        };
    }
    static actionAnGang(params) {
        if (params.game.currentTrigger && params.game.currentCard.type == MJEnum_1.MJCardOriginType.OUTPUT) {
            params.gamePlayer.pushCard(params.game.currentCard.card);
        }
        const cards = params.gamePlayer.cards;
        const selectIndex = params.selectIndex;
        console.log("selectIndex");
        console.log(selectIndex);
        const card = params.testData.data[selectIndex];
        console.log("card");
        console.log(card);
        console.log(cards);
        if (_.isNumber(card)) {
            _.pull(cards, card);
            console.log(cards);
            const cardGroupManage = params.gamePlayer.cardGroupManage;
            // const triggerGamePlayer = params.triggerGamePlayer
            cardGroupManage.pushCardGroup(new MJCardGroupManage_1.MJCardGroup(MJEnum_1.MJCardGroupType.GANG, _.fill(new Array(4), card), card, params.gamePlayer.uid, false, undefined, MJEnum_1.MJGangType.ANGANG));
        }
        return {
            ok: true
        };
    }
    static filterDianGang(params) {
        return true;
    }
    static testDianGang(params) {
        const cards = params.gamePlayer.cards;
        const card = params.card;
        return { ok: _.filter(cards, (v) => v == card).length >= 3 };
    }
    static actionDianGang(params) {
        if (params.game.currentTrigger && params.game.currentCard.type == MJEnum_1.MJCardOriginType.OUTPUT) {
            params.gamePlayer.pushCard(params.game.currentCard.card);
        }
        const cards = params.gamePlayer.cards;
        const card = params.card;
        _.pull(cards, card);
        const cardGroupManage = params.gamePlayer.cardGroupManage;
        //const triggerGamePlayer = params.triggerGamePlayer
        cardGroupManage.pushCardGroup(new MJCardGroupManage_1.MJCardGroup(MJEnum_1.MJCardGroupType.GANG, _.fill(new Array(4), card), card, params.gamePlayer.uid, true, undefined, MJEnum_1.MJGangType.DIANGANG));
        return {
            ok: true
        };
    }
    static filterBuGang(params) {
        return true;
    }
    static testBuGang(params) {
        const cardGroupManage = params.gamePlayer.cardGroupManage;
        const pengCards = _.map(cardGroupManage.filterCardGroupByType(MJEnum_1.MJCardGroupType.PENG), 'card');
        const cards = _.clone(params.gamePlayer.cards);
        cards.push(params.card);
        const gangCards = _.intersection(pengCards, cards);
        return {
            ok: gangCards.length > 0,
            data: gangCards
        };
    }
    static actionBuGang(params) {
        const selectIndex = params.selectIndex;
        const gangCard = params.testData.data[selectIndex];
        const cards = params.gamePlayer.cards;
        const card = params.card;
        const gangCardIndex = _.indexOf(cards, gangCard);
        const cardGroupManage = params.gamePlayer.cardGroupManage;
        if (card == gangCard) {
            cardGroupManage.changePengToBuGang(gangCard);
        }
        else if (gangCardIndex != -1) {
            cards.splice(gangCardIndex, 1);
            cards.push(card);
            cardGroupManage.changePengToBuGang(gangCard);
        }
        const cg = cardGroupManage.findCardGroupByCard(gangCard);
        return new MJDataActionBuGang({ card, triggerUid: cg.triggerId });
    }
    static filterLuanGang(params) {
        return true;
    }
    static testLuanGang(params, luanCards) {
        const result = {
            ok: false
        };
        const card = params.card;
        const cardGroupManage = params.gamePlayer.cardGroupManage;
        const cards = params.gamePlayer.cards;
        if (_.isNumber(card) && cardGroupManage.findCardGroupBySubTypeAndCard(MJEnum_1.MJGangType.LUANGANG, card)) {
            result.ok = true;
        }
        else if (_.every(luanCards, (v) => {
            return cards.indexOf(v) != -1;
        })) {
            result.ok = true;
        }
        return result;
    }
    static actionLuanGang(params) {
    }
    static filterHu(params) {
        return true;
    }
    static testGuoShouHu(params) {
        return params.game.container.mjrulerobjManage.canHu(params.gamePlayer, params);
    }
    static testHu(params) {
        const card = params.card;
        console.log("card");
        console.log(card);
        const cardGroupManage = params.gamePlayer.cardGroupManage;
        let cloneCards = _.clone(params.gamePlayer.cards);
        const cardGroups = cardGroupManage.filterCardGroupByType(MJEnum_1.MJCardGroupType.ZHANG);
        cloneCards.push(card);
        if (cardGroups.length > 0) {
            cloneCards.push(...cardGroups[0].cards);
        }
        //cloneCards.sort((a, b) => a - b)
        return new MJHuTestData(this.canHu(cloneCards), card);
    }
    static actionHu(params) {
        params.gamePlayer.huCode = params.testData.card;
        params.gamePlayer.huCount++;
    }
    static filterTing(params) {
        let tempCards = _.clone(params.gamePlayer.cards);
        if (params.gamePlayer.ting || tempCards.length % 3 === 0) {
            return false;
        }
        return true;
    }
    static testTing(params) {
        let tempCards = _.clone(params.gamePlayer.cards);
        tempCards.push(params.card);
        let tingInfo = this.canTing(tempCards);
        return {
            ok: tingInfo.length > 0,
            data: tingInfo
        };
    }
    static actionTing(params) {
    }
    static canTing(cards, qiDui = false) {
        var text = [];
        if (cards.length % 3 === 1) {
            let huList = [];
            for (let i = MJ.MIN_CODE_INDEX; i <= MJ.MAX_CHECKCODE_INDEX; i++) {
                if (mjlib.MHulib.get_hu_info(MJAlgo.formatCards(cards), i)) {
                    huList.push(i);
                }
                else if (qiDui) {
                    if (cards.length + 1 == 14 && mjlib.MHulib.get_hu_7Duiinfo(cards, i)) {
                        huList.push(i);
                    }
                }
            }
            if (huList.length) {
                text.push({ 'card': 0, 'hulist': huList });
            }
            return text;
        }
        for (let i = MJ.MIN_CODE_INDEX; i <= MJ.MAX_CHECKCODE_INDEX; i++) {
            let tempCards = MJAlgo.formatCards(cards);
            if (tempCards[i] > 0) {
                tempCards[i]--;
            }
            else {
                continue;
            }
            let huList = [];
            for (let j = MJ.MIN_CODE_INDEX; j <= MJ.MAX_CHECKCODE_INDEX; j++) {
                if (mjlib.MHulib.get_hu_info(tempCards, j)) {
                    huList.push(j);
                }
                else if (qiDui) {
                    if (cards.length == 14 && mjlib.MHulib.get_hu_7Duiinfo(tempCards, j)) {
                        huList.push(j);
                    }
                }
            }
            if (huList.length > 0) {
                text.push({ 'card': i, 'hulist': huList });
            }
        }
        return text;
    }
    static canShunKe(cards, qiDui = false) {
        var text;
        let huList = [];
        for (let j = MJ.MIN_CODE_INDEX; j <= MJ.MAX_CHECKCODE_INDEX; j++) {
            if (mjlib.MHulib.get_shun_info(this.formatCards(cards), j)) {
                huList.push(j);
            }
            else if (qiDui) {
                if (cards.length + 1 == 14 && mjlib.MHulib.get_hu_7Duiinfo(this.formatCards(cards), j)) {
                    huList.push(j);
                }
            }
        }
        if (huList.length > 0) {
            text = { 'hulist': huList };
        }
        return text;
    }
    static xuanJiang(cards, index = 0, jiangCards = []) {
        const cloneCards = _.clone(cards);
        for (let i = index, j = cards.length; i < j; i++) {
            // 如果挨着两张牌相同，则当做“将”过滤出来
            if (cards[i] === cards[i + 1]) {
                const tempData = { jiang: [cards[i], cards[i + 1]], cards: [] };
                cloneCards.splice(i, 2); // 把“将”从数组中移除
                tempData.cards = cloneCards;
                jiangCards.push(tempData);
                return this.xuanJiang(cards, i + 2, jiangCards);
            }
        }
        return jiangCards;
    }
    static huPaiPanDing(cards) {
        // 余牌是否大于0
        if (cards.length === 0) {
            return true;
        }
        // 前三张牌相同
        if (cards[0] === cards[1] && cards[0] === cards[2]) {
            cards.splice(0, 3);
            return this.huPaiPanDing(cards);
        }
        // 余牌第一张与后面牌三张连续
        const card1 = cards[0];
        const card2 = cards[0] + 1;
        const card3 = cards[0] + 2;
        if (cards.includes(card1) && cards.includes(card2) && cards.includes(card3)) {
            cards.splice(cards.indexOf(card1), 1);
            cards.splice(cards.indexOf(card2), 1);
            cards.splice(cards.indexOf(card3), 1);
            return this.huPaiPanDing(cards);
        }
        return false;
    }
    //test 十三幺
    static testHuShiSanYao(params) {
        const { game, gamePlayer, currentCard, card } = params;
        let comboParams = { game, curGamePlayer: undefined, scoreData: undefined, uids: undefined, gamePlayer, card };
        return this.shiSanYao(comboParams) > 0 ? true : false;
    }
    //test 十三不靠
    static testHuShiSanBuKao(params) {
        const { game, gamePlayer, currentCard, card } = params;
        let comboParams = { game, curGamePlayer: undefined, scoreData: undefined, uids: undefined, gamePlayer, card };
        return this.shiSanBuKao(comboParams) > 0 ? true : false;
    }
    //清一色
    static qingYiSe(params) {
        let cacheNum = this.getNumCache(params, "qingYiSe");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existQingYiSe(params, tempCards, false, false, false);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]胡清一色检查[%d]", MJComboBase_1.default.getHuGamePlayer(params).index, num);
        console.log(">>" + tempCards);
        if (num > 0) {
            map.set("qingYiSe", num);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]胡清一色检查成功", MJComboBase_1.default.getHuGamePlayer(params).index);
            return num;
        }
        map.set("qingYiSe", 0);
        return 0;
    }
    //七对
    static qiDui(params) {
        let cacheNum = this.getNumCache(params, "qiDui");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existQiDui(params, tempCards, false, false, false);
        if (num > 0) {
            map.set("qiDui", 0);
            return 0;
        }
        map.set("qiDui", 0);
        return 0;
    }
    //平胡
    static pingHu(params) {
        let cacheNum = this.getNumCache(params, "pingHu");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        if (this.qingYiSe(params) > 0) {
            map.set("pingHu", 0);
            return 0;
        }
        if (this.qiDui(params) > 0) {
            map.set("pingHu", 0);
            return 0;
        }
        let num = MJComboAlgo_1.default.existPingHu(params, tempCards, false, false, false);
        if (num > 0 && this.canHu(tempCards, true) === true) {
            map.set("pingHu", num);
            return num;
        }
        map.set("pingHu", 0);
        return 0;
    }
    //对对胡
    static duiDuiHu(params) {
        let cacheNum = this.getNumCache(params, "duiDuiHu");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existDuiDuiHu(params, tempCards, false, false, false);
        if (num > 0 && this.canHu(tempCards, true) === true) {
            map.set("duiDuiHu", num);
        }
        map.set("duiDuiHu", 0);
        return 0;
    }
    static getNumCache(params, key) {
        let map = MJComboBase_1.default.getCacheMap(params);
        let isQueYiMen = MJComboBase_1.default.isQueYiMen(params);
        if (map == undefined) {
            return 0;
        }
        if (map.has(key) === true) {
            let num = map.get(key);
            if (num != undefined) {
                return num;
            }
            return 0;
        }
        //缺一门
        if (isQueYiMen === true) {
            if (this.queYiMen(params) === 0) {
                map.set(key, 0);
                return 0;
            }
        }
        return -1;
    }
    //清一色对对胡
    static qingYiSeDaDuiZi(params) {
        let cacheNum = this.getNumCache(params, "qingYiSeDaDuiZi");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        if (this.qingYiSe(params) > 0 && this.duiDuiHu(params) > 0) {
            map.set("qingYiSeDaDuiZi", 1);
            return 1;
        }
        map.set("qingYiSeDaDuiZi", 0);
        return 0;
    }
    //缺一门
    static queYiMen(params) {
        let map = MJComboBase_1.default.getCacheMap(params);
        if (map == undefined) {
            return 0;
        }
        if (map.has("queYiMen") === true) {
            return map.get("queYiMen");
        }
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existQueYiMen(params, tempCards, false, false, false);
        if (num > 0) {
            map.set("queYiMen", num);
            return num;
        }
        map.set("queYiMen", 0);
        return 0;
    }
    //一般高
    static yiBanGao(params) {
        let map = MJComboBase_1.default.getCacheMap(params);
        if (map == undefined) {
            return 0;
        }
        if (map.has("yiBanGao") === true) {
            return map.get("yiBanGao");
        }
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existYiBanGao(params, tempCards, false, false, false);
        if (num > 0) {
            map.set("yiBanGao", num);
            return num;
        }
        map.set("yiBanGao", 0);
        return 0;
    }
    //卡心五
    static kaXinWu(params) {
        let map = MJComboBase_1.default.getCacheMap(params);
        if (map == undefined) {
            return 0;
        }
        if (map.has("kaXinWu") === true) {
            return map.get("kaXinWu");
        }
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existJiaWuXin(params, tempCards, false, false, false);
        if (num > 0) {
            map.set("kaXinWu", num);
            return num;
        }
        map.set("kaXinWu", 0);
        return 0;
    }
    //将将胡
    static jiangJiangHu(params) {
        let cacheNum = this.getNumCache(params, "jiangJiangHu");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existjiangJiangHu(params, tempCards, false, false, false);
        if (num > 0) {
            map.set("jiangJiangHu", num);
            return 1;
        }
        map.set("jiangJiangHu", 0);
        return 0;
    }
    //一条龙
    static yiTiaoLong(params) {
        let cacheNum = this.getNumCache(params, "yiTiaoLong");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existYiTiaoLong(params, tempCards, false, false, false);
        if (num > 0 && this.canHu(tempCards, true)) {
            map.set("yiTiaoLong", num);
            return 1;
        }
        map.set("yiTiaoLong", 0);
        return 0;
    }
    //清一条龙
    static qingYiTiaoLong(params) {
        let cacheNum = this.getNumCache(params, "qingYiTiaoLong");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let num_1 = this.yiTiaoLong(params);
        let num_2 = this.qingYiSe(params);
        if (num_1 > 0 && num_2 > 0) {
            map.set("qingYiTiaoLong", 1);
            return 1;
        }
        map.set("qingYiTiaoLong", 0);
        return 0;
    }
    //清七对
    static qingQiDui(params) {
        let cacheNum = this.getNumCache(params, "qingQiDui");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let num_1 = this.qiDui(params);
        let num_2 = this.qingYiSe(params);
        if (num_1 > 0 && num_2 > 0) {
            map.set("qingQiDui", 1);
            return 1;
        }
        map.set("qingQiDui", 0);
        return 0;
    }
    //将七对
    static jiangQiDui(params) {
        let cacheNum = this.getNumCache(params, "jiangQiDui");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let num_1 = this.qiDui(params);
        let num_2 = this.jiangJiangHu(params);
        if (num_1 > 0 && num_2 > 0) {
            map.set("jiangQiDui", 1);
            return 1;
        }
        map.set("jiangQiDui", 0);
        return 0;
    }
    //双龙七对
    static shuangLongQiDui(params) {
        if (this.longQiDui(params) === 2) {
            return 2;
        }
        return 0;
    }
    //三龙七对
    static sanLongQiDui(params) {
        if (this.longQiDui(params) === 3) {
            return 3;
        }
        return 0;
    }
    //龙七对
    static longQiDui(params) {
        let cacheNum = this.getNumCache(params, "longQiDui");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let num = this.qiDui(params);
        if (num <= 0) {
            map.set("longQiDui", 0);
            return 0;
        }
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let nLong = 0;
        for (let i = 0; i < 9; i++) {
            if (MJComboBase_1.default.existPaiBySameIndex(tempCards, i + 1, 4) === true) {
                nLong++;
            }
        }
        if (nLong < 0) {
            map.set("longQiDui", nLong);
            return nLong;
        }
        map.set("longQiDui", 0);
        return 0;
    }
    //清双龙七对
    static qingShuangLongQiDui(params) {
        if (this.qingLongQiDui(params) === 2) {
            return 1;
        }
        return 0;
    }
    //清三龙七对
    static qingSanLongQiDui(params) {
        if (this.qingLongQiDui(params) === 3) {
            return 1;
        }
        return 0;
    }
    //清龙七对
    static qingLongQiDui(params) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]清龙七队检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        let cacheNum = this.getNumCache(params, "qingLongQiDui");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let num = this.qingYiSe(params);
        if (num > 0) {
            let nLong = this.longQiDui(params);
            if (nLong > 0) {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]清龙七队检查成功，龙[%d]对", MJComboBase_1.default.getHuGamePlayer(params).index, nLong);
                map.set("qingLongQiDui", nLong);
                return nLong;
            }
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]清龙七队检查失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        map.set("qingLongQiDui", 0);
        return 0;
    }
    //金钩炮
    static jinGouPao(params) {
        return false;
        let cacheNum = this.getNumCache(params, "jinGouPao");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existDaDiaoChe(params, tempCards, false, false, false);
        if (num > 0 && this.canHu(tempCards, true)) {
            map.set("jinGouPao", num);
            return num;
        }
        map.set("jinGouPao", 0);
        return 0;
    }
    //金钩钓
    static jinGouDiao(params) {
        let cacheNum = this.getNumCache(params, "jinGouDiao");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existDaDiaoChe(params, tempCards, false, false, false);
        if (num > 0 && this.canHu(tempCards, true)) {
            map.set("jinGouDiao", num);
            return num;
        }
        map.set("jinGouDiao", 0);
        return 0;
    }
    //将金钩钓
    static jiangJinGouDiao(params) {
        let cacheNum = this.getNumCache(params, "qingLongQiDui");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        if (this.jinGouDiao(params) > 0) {
            if (this.jiangJiangHu(params)) {
                map.set("qingLongQiDui", 1);
                return 1;
            }
        }
        map.set("qingLongQiDui", 0);
        return 0;
    }
    //清金钩钓
    static qingJinGouDiao(params) {
        let cacheNum = this.getNumCache(params, "qingJinGouDiao");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        if (this.jinGouDiao(params) > 0) {
            if (this.qingYiSe(params) > 0) {
                map.set("qingJinGouDiao", 1);
                return 1;
            }
        }
        map.set("qingJinGouDiao", 0);
        return 0;
    }
    //字一色
    static ziYiSe(params) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]字一色检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        let cacheNum = this.getNumCache(params, "ziYiSe");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]字一色检查(清一色[%d])", MJComboBase_1.default.getHuGamePlayer(params).index, this.qingYiSe(params));
        if (this.qingYiSe(params) > 0) {
            let tempCards = MJComboBase_1.default.getTempCards(params);
            let mjIndex = 0;
            for (let i = 0; i < tempCards.length; i++) {
                mjIndex = MJComboBase_1.default.getMJIndexByBegin(i, 0);
                if (tempCards[mjIndex] > 0) {
                    break;
                }
            }
            if (MJComboBase_1.default.getHuaSeByMjIndex(mjIndex) == MJEnum_1.MJHuaSeType.MjHuaSeType_FENG) {
                map.set("ziYiSe", 1);
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]字一色检查成功", MJComboBase_1.default.getHuGamePlayer(params).index);
                return 1;
            }
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]字一色检查失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        map.set("ziYiSe", 0);
        return 0;
    }
    //混一色
    static hunYiSe(params) {
        let cacheNum = this.getNumCache(params, "hunYiSe");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existHuiYiSe(params, tempCards, false, false, false);
        if (num > 0) {
            map.set("hunYiSe", num);
            return 1;
        }
        map.set("hunYiSe", 0);
        return 0;
    }
    //大三元
    static daSanYuan(params) {
        let cacheNum = this.getNumCache(params, "daSanYuan");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existDaSanYuan(params, tempCards, false, false, false);
        if (num > 0 && this.canHu(tempCards, true)) {
            map.set("daSanYuan", num);
            return 1;
        }
        map.set("daSanYuan", 0);
        return 0;
    }
    //小三元
    static xiaoSanYuan(params) {
        let cacheNum = this.getNumCache(params, "xiaoSanYuan");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existXiaoSanYuan(params, tempCards, false, false, false);
        if (num > 0 && this.canHu(tempCards, true)) {
            map.set("xiaoSanYuan", num);
            return 1;
        }
        map.set("xiaoSanYuan", 0);
        return 0;
    }
    //十八罗汉
    static shiBaLuoHan(params) {
        let cacheNum = this.getNumCache(params, "shiBaLuoHan");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existShiBaLuoHan(params, tempCards, false, false, false);
        if (num > 0) {
            map.set("shiBaLuoHan", num);
            return 1;
        }
        map.set("shiBaLuoHan", 0);
        return 0;
    }
    //清十八罗汉
    static qingShiBaLuoHan(params) {
        let cacheNum = this.getNumCache(params, "qingShiBaLuoHan");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        if (this.qingYiSe(params)) {
            if (this.shiBaLuoHan(params)) {
                map.set("qingShiBaLuoHan", 1);
                return 1;
            }
        }
        map.set("qingShiBaLuoHan", 0);
        return 0;
    }
    //十三幺 
    static shiSanYao(params) {
        let cacheNum = this.getNumCache(params, "shiSanYao");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existShiSanYao(params, tempCards, false, false, false);
        if (num > 0) {
            map.set("shiSanYao", num);
            return 1;
        }
        map.set("shiSanYao", 0);
        return 0;
    }
    //十三不靠
    static shiSanBuKao(params) {
        let cacheNum = this.getNumCache(params, "shiSanBuKao");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existShiSanBuKao(params, tempCards, false, false, false);
        if (num > 0) {
            map.set("shiSanBuKao", num);
            return 1;
        }
        map.set("shiSanBuKao", 0);
        return 0;
    }
    //软十三不靠
    static ruanShiSanBuKao(params) {
        let cacheNum = this.getNumCache(params, "ruanShiSanBuKao");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existRuanShiSanBuKao(params, tempCards, false, false, false);
        if (num > 0) {
            map.set("ruanShiSanBuKao", num);
            return 1;
        }
        map.set("ruanShiSanBuKao", 0);
        return 0;
    }
    //全幺九
    static quanYaoJiu(params) {
        let cacheNum = this.getNumCache(params, "quanYaoJiu");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existQuanYaoJiu(params, tempCards, false, false, false);
        if (num > 0) {
            map.set("quanYaoJiu", num);
            return 1;
        }
        map.set("quanYaoJiu", 0);
        return 0;
    }
    //混幺九
    static hunYaoJiu(params) {
        let cacheNum = this.getNumCache(params, "hunYaoJiu");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let map = MJComboBase_1.default.getCacheMap(params);
        let num = MJComboAlgo_1.default.existHunYaoJiu(params, tempCards, false, false, false);
        if (num > 0) {
            map.set("hunYaoJiu", num);
            return 1;
        }
        map.set("hunYaoJiu", 0);
        return 0;
    }
    //带幺九
    static daiYaoJiu(params) {
        let cacheNum = this.getNumCache(params, "daiYaoJiu");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        let tempCards = MJComboBase_1.default.getTempCards(params);
        let num = MJComboAlgo_1.default.existDaiYaoJiu(params, tempCards);
        if (num > 0) {
            map.set("daiYaoJiu", num);
            return 1;
        }
        map.set("daiYaoJiu", 0);
        return 0;
    }
    //清三搭
    static qingSanDa(params) {
        let cacheNum = this.getNumCache(params, "qingSanDa");
        if (cacheNum > -1) {
            return cacheNum;
        }
        let map = MJComboBase_1.default.getCacheMap(params);
        if (this.qingYiSe(params)) {
            let tempCards = MJComboBase_1.default.getTempCards(params);
            let num = MJComboAlgo_1.default.existQingSanDa(params, tempCards, false, false, false);
            if (num > 0) {
                map.set("qingSanDa", num);
                return 1;
            }
        }
        map.set("qingSanDa", 0);
        return 0;
    }
    //门清
    static menQing(params) {
        if (MJComboBase_1.default.getGroupCardsCount(params) === 0) {
            console.log("门清-成功");
            return 1;
        }
        return 0;
    }
    //根(包含杠)
    static genAndGang(params) {
        return MJComboBase_1.default.getGenAndGang(params);
    }
    //根(不包含杠)
    static genRemoveGang(params) {
        return MJComboBase_1.default.getGenRemoveGang(params);
    }
    //呼叫转移
    static gangZhuanYi(params) {
        const { game, curGamePlayer, scoreData, uids, gamePlayer, card } = params;
        let num = MJFormulaModel_1.ScoreDataBase.getGangHouPao(game, game.container.mjscoreManage, gamePlayer.index);
        if (num > 0) {
            return 1;
        }
        return 0;
    }
}
exports.MJAlgo = MJAlgo;
