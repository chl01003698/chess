"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class MJBankerDefault {
    getBanker(game) {
        return game.gamePlayers[0].index;
    }
    setPaoHu(paoIndex, huIndex) { }
}
class MJBankerRandom {
    getBanker(game) {
        return game.gamePlayers[_.random(0, game.gamePlayers.length - 1)].index;
    }
    setPaoHu(paoIndex, huIndex) { }
}
class MJBankerSpecify {
    constructor() {
        this.bankerId = 0;
    }
    setBanker(bankerId) {
        this.bankerId = bankerId;
    }
    setPaoHu(paoIndex, huIndex) { }
    getBanker(game) {
        return this.bankerId;
    }
}
class MJBankerHu {
    getBanker(game) {
        return game['huId'];
    }
    setPaoHu(paoIndex, huIndex) { }
}
class MJSCNCHu {
    constructor() {
        this.bankerId = -1;
        this.currentRound = 0;
        this.currentHu = _.fill(new Array(4), 0);
    }
    setPaoHu(paoIndex, huIndex) {
        this.currentHu[paoIndex] = -1;
        this.currentHu[huIndex] = 1;
    }
    getBanker(game) {
        this.currentRound++;
        if (this.currentRound == 1) {
            this.bankerId = 0;
        }
        else {
            let group = _.countBy(this.currentHu);
            if (group['1'] == 1) {
                this.bankerId = _.indexOf(this.currentHu, 1);
            }
            else if (group['1'] > 1) {
                this.bankerId = _.indexOf(this.currentHu, -1);
            }
            else {
                this.bankerId = game.m_banker;
            }
        }
        this.currentHu = _.fill(new Array(4), 0);
        return this.bankerId;
    }
}
exports.MJBankerMap = {
    'default': MJBankerDefault,
    'random': MJBankerRandom,
    'specify': MJBankerSpecify,
    'hu': MJBankerHu,
    'sc_nanchong': MJSCNCHu
};
