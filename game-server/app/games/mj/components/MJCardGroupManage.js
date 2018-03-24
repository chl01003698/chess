"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MJEnum_1 = require("../consts/MJEnum");
const _ = require("lodash");
class MJCardGroup {
    constructor(type, cards, card, triggerId, open = true, data, subType) {
        this.type = type;
        this.cards = cards;
        this.card = card;
        this.triggerId = triggerId;
        this.open = open;
        this.data = data;
        this.subType = subType;
        this.count = 1;
    }
}
exports.MJCardGroup = MJCardGroup;
class MJCardGroupManage {
    constructor() {
        this.cardGroups = new Array();
    }
    pushCardGroup(cardGroup) {
        this.cardGroups.push(cardGroup);
    }
    updateCardGroup(subType, card) {
        const cardGroup = this.findCardGroupBySubTypeAndCard(subType, card);
        if (cardGroup != undefined) {
            cardGroup.cards.push(card);
            cardGroup.count++;
            return true;
        }
        return false;
    }
    findCardGroupByCard(card) {
        return _.find(this.cardGroups, { card });
    }
    findCardGroupBySubTypeAndCard(subType, card) {
        return _.find(this.cardGroups, (v) => {
            return v.subType == subType && v.cards.indexOf(card) != -1;
        });
    }
    changePengToBuGang(card) {
        const cardGroup = this.findCardGroupByCard(card);
        if (cardGroup != undefined && cardGroup.type == MJEnum_1.MJCardGroupType.PENG) {
            cardGroup.type = MJEnum_1.MJCardGroupType.GANG;
            cardGroup.subType = MJEnum_1.MJGangType.BUGANG;
            cardGroup.cards.push(card);
            return true;
        }
        return false;
    }
    existCardGroupType(type) {
        return _.some(this.cardGroups, { type });
    }
    existPengCardGroup(card) {
        return _.some(this.cardGroups, { type: MJEnum_1.MJCardGroupType.PENG, card });
    }
    countCardGroupByType(type) {
        return _.filter(this.cardGroups, { type }).length;
    }
    filterCardGroupByType(type) {
        return _.filter(this.cardGroups, { type });
    }
    getCardCount() {
        return _.sumBy(this.cardGroups, function (v) {
            let length = v.cards.length;
            if (length > 3) {
                length = 3;
            }
            return length;
        });
    }
    getCardRealCount() {
        return _.sumBy(this.cardGroups, function (v) { return v.cards.length; });
    }
    getPrivateCardGroups() {
        return _.map(this.cardGroups, (v) => { return _.pick(v, ['type', 'cards', 'triggerId', 'subType']); });
    }
    getPublicCardGroups() {
        return _.map(this.cardGroups, (v) => {
            if (!v.open) {
                return _.pick(v, ['type', 'triggerId', 'subType']);
            }
            return _.pick(v, ['type', 'cards', 'triggerId', 'subType']);
        });
    }
    clear() {
        this.cardGroups = [];
    }
}
exports.MJCardGroupManage = MJCardGroupManage;
