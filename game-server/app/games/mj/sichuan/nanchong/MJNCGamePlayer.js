"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MJGamePlayer_1 = require("../../MJGamePlayer");
const MJFormulaModel_1 = require("../../MJModel/MJFormulaModel");
class MJNCGamePlayer extends MJGamePlayer_1.default {
    constructor() {
        super(...arguments);
        this.piao = -1;
        this.raoGang = [];
        this.ting = false;
        this.huList = [];
        this.baiPai = [];
        this.daJiaoScore = new MJFormulaModel_1.ScoreData();
    }
    reset() {
        super.reset();
        this.piao = -1;
        this.raoGang = [];
        this.ting = false;
        this.huList = [];
        this.baiPai = [];
        this.daJiaoScore = new MJFormulaModel_1.ScoreData();
    }
}
exports.default = MJNCGamePlayer;
