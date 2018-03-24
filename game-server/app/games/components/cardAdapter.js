"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pokerAlgo_1 = require("../poker/pokerAlgo/pokerAlgo");
class PokerCardAdapter {
    pickCardIds(cards) {
        return pokerAlgo_1.PokerAlgo.pickCardIds(cards);
    }
    createCardsFromIds(cards) {
        return pokerAlgo_1.PokerAlgo.createCardsFromIds(cards);
    }
}
exports.PokerCardAdapter = PokerCardAdapter;
class MJCardAdapter {
    pickCardIds(cards) {
        return cards;
    }
    createCardsFromIds(cards) {
        return cards;
    }
}
exports.MJCardAdapter = MJCardAdapter;
