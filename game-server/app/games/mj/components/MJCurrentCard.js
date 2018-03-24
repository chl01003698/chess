"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MJEnum_1 = require("../consts/MJEnum");
class MJCurrentCard {
    constructor() {
        this.card = -1;
        this.shift = true;
        this.type = MJEnum_1.MJCardOriginType.NONE;
        this.fIndex = -1;
        this.bIndex = -1;
        this.uid = '';
    }
    rest() {
        this.card = -1;
        this.shift = true;
        this.type = MJEnum_1.MJCardOriginType.NONE;
        this.fIndex = -1;
        this.bIndex = -1;
        this.uid = '';
    }
}
exports.MJCurrentCard = MJCurrentCard;
