"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MJGamePlayer_1 = require("../../MJGamePlayer");
class MJXZGamePlayer extends MJGamePlayer_1.default {
    constructor() {
        super(...arguments);
        this.piao = 0;
        this.raoGang = [];
        this.ting = false;
    }
}
exports.default = MJXZGamePlayer;
