"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sanZhangGame_1 = require("./sanZhangGame");
const matchGame_1 = require("../../matchGame");
class MatchSanZhangGame extends sanZhangGame_1.default(matchGame_1.default) {
    constructor(...args) {
        super(...args);
    }
}
exports.default = MatchSanZhangGame;
