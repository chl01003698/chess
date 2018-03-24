"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gamePlayer_1 = require("../gamePlayer");
const _ = require("lodash");
const MJCardGroupManage_1 = require("./components/MJCardGroupManage");
const MJSettleScoresModel_1 = require("./MJCmd/Model/MJSettleScoresModel");
class MJGamePlayer extends gamePlayer_1.default {
    constructor(app, user, userInfo, index = -1, watcher = false, robot = false) {
        super(app, user, userInfo, index, watcher, robot);
        this.inputCards = [];
        this.initCards = [];
        this.seriesGangCount = 0;
        this.over = false;
        this.huCode = -1;
        this.huCount = 0;
        this.inputCount = 0;
        this.canHu = true;
        this.cardGroupManage = new MJCardGroupManage_1.MJCardGroupManage();
        this.comboCache = new Map();
        this.settleScoresCache = new MJSettleScoresModel_1.default();
    }
    clientInfo(needEntire = false) {
        let result = super.clientInfo(needEntire);
        return result;
    }
    reset() {
        super.reset();
        this.inputCards = [];
        this.initCards = [];
        this.seriesGangCount = 0;
        this.huCount = 0;
        this.huCode = -1;
        this.inputCount = 0;
        this.cardGroupManage.clear();
        this.canHu = true;
        this.comboCache.clear();
    }
    inputCard(card) {
        let index = _.indexOf(this.cards, card);
        if (index != -1) {
            this.inputCards.push(this.cards[index]);
            this.cards.splice(index, 1);
            ++this.inputCount;
            return true;
        }
        return false;
    }
    pushCard(card) {
        this.cards.push(card);
    }
    hasCard(card) {
        console.log("this.cards");
        console.log(this.cards);
        console.log(card);
        return _.indexOf(this.cards, card) != -1;
    }
    getCardsFullCount() {
        return this.cards.length;
    }
    popInputCard() {
        return this.inputCards.pop();
    }
    onOutput() {
        this.canHu = true;
    }
    incrHuCount() {
        ++this.huCount;
    }
}
exports.default = MJGamePlayer;
