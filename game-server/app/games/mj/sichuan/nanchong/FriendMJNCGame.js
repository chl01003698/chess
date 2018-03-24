"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MJEnum_1 = require("../../consts/MJEnum");
const MJCardGroupManage_1 = require("../../components/MJCardGroupManage");
const MJGame_1 = require("../../MJGame");
const friendGame_1 = require("../../../friendGame");
const objectPath = require("object-path");
const MJAlgo_1 = require("../../MJAlgo");
const _ = require("lodash");
const MJ = require("../../consts/MJConsts");
const MJComboBase_1 = require("../../MJComboBase");
let mjlib = require('../../MJAlgo/mjlib_js/api.js');
function processGameConfig_MJNC(roomConfig, gameConfig) {
    if (roomConfig.cantZhang) {
        objectPath.del(gameConfig, 'triggers.input.actions.1.0');
    }
    gameConfig.baipai = roomConfig.baipai;
    gameConfig.piaoIndex = roomConfig.piaoIndex;
    return gameConfig;
}
exports.processGameConfig_MJNC = processGameConfig_MJNC;
class SCNCMJAlGo extends MJAlgo_1.MJAlgo {
    static testHu(params) {
        const card = params.card;
        console.log("card");
        console.log(card);
        if (params.game.gameConfig.baipai && params.gamePlayer.ting) {
            if (_.indexOf(params.gamePlayer.huList, card) !== -1) {
                return new MJAlgo_1.MJHuTestData(true, card);
            }
            else {
                return new MJAlgo_1.MJHuTestData(false, card);
            }
        }
        let cloneCards = _.clone(params.gamePlayer.cards);
        cloneCards.push(card);
        //cloneCards.sort((a, b) => a - b)
        //	return { ok: MJAlgo.canHu(cloneCards, true) }
        return new MJAlgo_1.MJHuTestData(MJAlgo_1.MJAlgo.canHu(cloneCards, true), card);
    }
    static actionPeng(params) {
        const result = {
            ok: false,
            data: undefined
        };
        const cards = params.gamePlayer.cards;
        const card = params.card;
        if (_.filter(cards, (v) => v == card).length >= 2) {
            if (_.filter(cards, (v) => v == card).length >= 3) {
                params.gamePlayer.raoGang.push(card);
            }
            cards.splice(cards.indexOf(card), 1);
            cards.splice(cards.indexOf(card), 1);
            result.ok = true;
            const cardGroupManage = params.gamePlayer.cardGroupManage;
            //const triggerGamePlayer = params.triggerGamePlayer
            cardGroupManage.pushCardGroup(new MJCardGroupManage_1.MJCardGroup(MJEnum_1.MJCardGroupType.PENG, _.fill(new Array(3), card), card, params.gamePlayer.uid));
        }
        return result;
    }
    static testAnGang(params) {
        let cards = _.clone(params.gamePlayer.cards);
        let card = params.card;
        if (_.isNumber(card)) {
            cards.push(card);
        }
        let handCards = MJAlgo_1.MJAlgo.formatCards(cards);
        let cardlist = [];
        if (params.game.gameConfig.baipai && params.gamePlayer.ting == true) {
            for (let card of params.gamePlayer.baiPai) {
                handCards[card]--;
            }
            if (handCards[params.card] >= 4) {
                handCards[params.card] -= 4;
                if (MJComboBase_1.default.getCardsCount(handCards) == 0 || MJAlgo_1.MJAlgo.canHuArr34(handCards, true)) {
                    cardlist.push(params.card);
                }
            }
        }
        else {
            for (let i = MJ.MIN_CODE_INDEX; i <= MJ.MAX_CHECKCODE_INDEX; i++) {
                if (handCards[i] >= 4) {
                    cardlist.push(i);
                }
            }
        }
        return {
            ok: cardlist.length > 0,
            data: cardlist
        };
    }
    static testDianGang(params) {
        let cards = _.clone(params.gamePlayer.cards);
        let card = params.card;
        if (_.isNumber(card)) {
            cards.push(card);
        }
        let handCards = MJAlgo_1.MJAlgo.formatCards(cards);
        let cardlist = [];
        if (params.game.gameConfig.baipai && params.gamePlayer.ting == true) {
            for (let card of params.gamePlayer.baiPai) {
                handCards[card]--;
            }
            if (handCards[params.card] >= 4) {
                handCards[params.card] -= 4;
                if (MJComboBase_1.default.getCardsCount(handCards) == 0 || MJAlgo_1.MJAlgo.canHuArr34(handCards, true)) {
                    cardlist.push(params.card);
                }
            }
        }
        else {
            if (handCards[params.card] >= 4) {
                cardlist.push(params.card);
            }
        }
        return {
            ok: cardlist.length > 0,
            data: cardlist
        };
    }
    static testBuGang(params) {
        const cardGroupManage = params.gamePlayer.cardGroupManage;
        const pengCards = _.map(cardGroupManage.filterCardGroupByType(MJEnum_1.MJCardGroupType.PENG), 'card');
        const cards = _.clone(params.gamePlayer.cards);
        if (params.card > 0) {
            cards.push(params.card);
        }
        if (params.game.gameConfig.raoGang) {
            _.pullAll(cards, params.gamePlayer.raoGang);
        }
        const gangCards = _.intersection(pengCards, cards);
        return {
            ok: gangCards.length > 0,
            data: gangCards
        };
    }
    static filterBaiPai(params) {
        if (params.game.gameConfig.baipai && (params.gamePlayer.ting == true || params.game.remainCards.length < 12)) {
            return false;
        }
        return true;
    }
    static testBaiPai(params) {
        let cards = _.clone(params.gamePlayer.cards);
        if (params.card > 0) {
            cards.push(params.card);
        }
        let tingInfo = this.canTing(cards, true);
        if (tingInfo.length) {
            _.remove(tingInfo, (info) => {
                return _.indexOf(params.game.allTingCards, info['card']) !== -1;
            });
        }
        return {
            ok: tingInfo.length > 0,
            data: tingInfo
        };
    }
    static actionBaiPai(params) {
        params.gamePlayer.ting = true;
        params.gamePlayer.baipai = params.cards;
        console.log("params.game.allTingCards");
        console.log(params.game.allTingCards);
        console.log("params.gamePlayer.huList");
        console.log(params.gamePlayer.huList);
        params.game.allTingCards = _.union(params.game.allTingCards, params.gamePlayer.huList);
    }
}
exports.SCNCMJAlGo = SCNCMJAlGo;
class FriendMJNCGame extends MJGame_1.default(friendGame_1.default) {
    constructor(...args) {
        super(...args);
        this.maxpiao = 0;
        this.algo = SCNCMJAlGo;
    }
    onEnterReady(lifecycle, arg1, arg2) {
        super.onEnterReady(lifecycle, arg1, arg2);
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    this.gameConfig.piaos");
        console.log(this.gameConfig.piaoList);
        console.log("this.gameConfig.piaoIndex");
        console.log(this.gameConfig.piaoIndex);
        if (!this.gameConfig.piaoIndex) {
            this.gameConfig.piaoIndex = 0;
        }
        this.maxpiao = this.gameConfig.piaoList[this.gameConfig.piaoIndex];
        console.log(this.maxpiao);
    }
    onEnterDeal(lifecycle, arg1, arg2) {
        if (this.maxpiao < 1) {
            super.onEnterDeal(lifecycle, arg1, arg2);
        }
    }
    selectPiao(gamePlayer, msg) {
        gamePlayer.piao = msg.piao;
        for (let i = 0; i < this.gamePlayers.length; i++) {
            if (this.gamePlayers[i].piao < 0) {
                return;
            }
        }
        process.nextTick(() => {
            this.fsm.dealTrans();
        });
    }
    afterHu(uids) {
        _.forEach(uids, (v) => {
            const gamePlayer = this.findPlayerByUid(v);
            if (gamePlayer != null) {
                this.container.mjbanker.setPaoHu(this.currentIndex, gamePlayer.index);
            }
        });
    }
    canBaiPai(gamePlayer, msg) {
        let result = false;
        let handCards = gamePlayer.cards.concat();
        if (this.currentCard.type == MJEnum_1.MJCardOriginType.OUTPUT) {
            handCards.push(this.currentCard.card);
        }
        if (_.isString(this.currentTrigger) && this.currentTrigger.length > 0) {
            const trigger = this.container.mjtriggerManage.getTrigger(this.currentTrigger);
            if (trigger != null) {
                return _.some(trigger.handleManage.handles, (v) => {
                    if (v.uid == gamePlayer.uid && v.state == MJEnum_1.MJHandleState.NONE && v.type == MJEnum_1.MJCardGroupType.BAIPAI) {
                        for (let baipaiinfo of v.testData.data) {
                            if (baipaiinfo['card'] === msg.card) {
                                let tempcards = handCards.concat();
                                for (let oneCard of msg.cards) {
                                    if (_.indexOf(tempcards, oneCard) !== -1) {
                                        _.pullAt(tempcards, _.indexOf(tempcards, oneCard));
                                    }
                                    else {
                                        console.log("baipaiinfo['card'] err 1:");
                                        return false;
                                    }
                                }
                                if (_.indexOf(tempcards, msg.card) !== -1) {
                                    _.pullAt(tempcards, _.indexOf(tempcards, msg.card));
                                }
                                else {
                                    console.log("baipaiinfo['card'] err 11:");
                                    return false;
                                }
                                if (tempcards.length !== 0 && !MJAlgo_1.MJAlgo.canHu(tempcards)) {
                                    if (!mjlib.MHulib.get_shun_info(MJAlgo_1.MJAlgo.formatCards(tempcards))) {
                                        console.log("baipaiinfo['card'] err 2:");
                                        return false;
                                    }
                                }
                                let tinginfo = MJAlgo_1.MJAlgo.canShunKe(msg.cards, true);
                                console.log("tingInfo:" + tinginfo);
                                //console.log("tinginfo['hulist']:" + tinginfo['hulist'])
                                if (tinginfo && tinginfo['hulist'].length > 0) {
                                    gamePlayer.huList = tinginfo['hulist'];
                                    return true;
                                }
                                console.log("baipaiinfo['card'] err 2xx:");
                                return false;
                            }
                        }
                    }
                });
            }
        }
    }
    doBaiPai(gamePlayer, msg) {
        //this.container.mjactionManage.get("baipai"). evalActionExpr()
        const triggerName = this.currentTrigger;
        const trigger = this.container.mjtriggerManage.getTrigger(triggerName);
        let handleOver = true;
        if (trigger != undefined) {
            trigger.handleManage.selectHandle(this, gamePlayer, msg.state, msg.type, msg.subType, msg.selectIndex);
            const { state, handles, type } = trigger.handleManage.findHandleResult();
            console.log("trigger:" + triggerName);
            console.log(trigger);
            const curGamePlayer = this.gamePlayers[this.currentIndex];
            this.container.mjtriggerManage.triggerAction(handles, { game: this, curGamePlayer, gamePlayer, cards: msg.cards, card: msg.card });
            this.container.mjtriggerManage.clearTriggerHandles();
            this.currentTrigger = '';
            this.fsm.inputTrans({ uid: gamePlayer.uid, card: msg.card });
        }
        return handleOver;
    }
    canInPutCard(gamePlayer, card) {
        if (this.gameConfig.baipai) {
            if (gamePlayer.ting === true) {
                if (card !== this.currentCard.card) {
                    return false;
                }
            }
            else {
                console.log("putCard allTingCards" + this.allTingCards);
                if (_.indexOf(this.allTingCards, card) !== -1) {
                    let cards = gamePlayer.cards.concat();
                    if (_.pullAll(cards, this.allTingCards).length > 0) {
                        return false;
                    }
                    else if (card !== this.currentCard.card) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
exports.default = FriendMJNCGame;
