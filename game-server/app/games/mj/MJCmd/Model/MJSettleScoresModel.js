"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MJSettleScoresModel {
    constructor() {
        this.playerZiMoList = new Array(); //记录每一局是否自摸
        this.playerDianPaoList = new Array(); //记录每一局是否点炮
        this.playerChengBao = new Array(); //记录第一局是否承包
        this.playerScoreList = new Array(); //记录每一局得分-（累加后得出总分）
        this.playerBigWinner = false; //大赢家
        this.playerTopScore = -1;
    }
}
exports.default = MJSettleScoresModel;
