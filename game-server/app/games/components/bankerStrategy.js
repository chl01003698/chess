"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class BankerStrategyAlwaysFirst {
    getBanker(game) {
        return 0;
    }
}
exports.BankerStrategyAlwaysFirst = BankerStrategyAlwaysFirst;
class BankerStrategyRandom {
    getBanker(game) {
        return _.random(0, game.playerCount - 1);
    }
}
exports.BankerStrategyRandom = BankerStrategyRandom;
class BankerStrategySpecify {
    constructor() {
        this.banker = 0;
    }
    setBanker(banker) {
        this.banker = banker;
    }
    getBanker() {
        return this.banker;
    }
}
exports.BankerStrategySpecify = BankerStrategySpecify;
