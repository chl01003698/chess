"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//大结算填充
const MJCmd = require("../base/MJCmd");
const MJNotifyBase_1 = require("../base/MJNotifyBase");
const MJEnum_1 = require("../../consts/MJEnum");
class MJMaxSettleScores {
    constructor(game, Master) {
        this.player_ = Master;
        this.game_ = game;
    }
    fillMsg(MJMsgType, cmd) {
        let info = cmd;
        info.titleinfo.push(this.fillMsgMjTitleInfo()); //称号信息
        info.urinfo.push(this.fillMjUserCostInfo()); //玩家扣卡及进入房间时间信息
    }
    fillMsgMjTitleInfo() {
        let info = new MJCmd.MjTitleInfo();
        info.seatid = this.player_.index; //座位ID
        info.ntitle = this.fillTiteType();
        let myTotalScore = 0;
        let playerScoreList = MJNotifyBase_1.default.getPlayerScoreList(this.player_);
        for (let i = 0; i < playerScoreList.length; i++) {
            myTotalScore += playerScoreList[i];
        }
        info.nscore = myTotalScore; //总分
        return info;
    }
    fillMjUserCostInfo() {
        let info = new MJCmd.MjUserCostInfo();
        info.seatid = this.player_.index;
        let costType;
        let costNum;
        [costType, costNum] = MJNotifyBase_1.default.getCostTypeAndNum(this.game_);
        if (costType === MJEnum_1.MJCostType.OpenCost) {
            if (this.player_.index == 0) {
                info.costticket = costNum;
            }
        }
        else if (costType === MJEnum_1.MJCostType.WinnerCost) {
            if (MJNotifyBase_1.default.getBigWinner(this.player_) === true) {
                info.costticket = costNum;
            }
        }
        info.joinroomtime = new Date().getTime() / 1000;
        return info;
    }
    //获取称号
    fillTiteType() {
        let ntitle = new Array();
        let index = 0;
        let nZiMoMax = 0;
        let nDianPaoMax = 0;
        let nDaPaiWang = 0;
        let nDaYingJia = 0;
        let gamePlayers = MJNotifyBase_1.default.getGamePlayers(this.game_);
        for (let i = 0; i < gamePlayers.length; i++) {
            let player = gamePlayers[i];
            if (player == undefined) {
                continue;
            }
            //自摸王
            if (nZiMoMax == 0) {
                nZiMoMax = MJNotifyBase_1.default.getPlayerZiMoCount(player);
            }
            else if (nZiMoMax < MJNotifyBase_1.default.getPlayerZiMoCount(player)) {
                nZiMoMax = MJNotifyBase_1.default.getPlayerZiMoCount(player);
            }
            //点炮王
            if (nDianPaoMax == 0) {
                nDianPaoMax = MJNotifyBase_1.default.getPlayerDianPaoCount(player);
            }
            else if (nDianPaoMax < MJNotifyBase_1.default.getPlayerDianPaoCount(player)) {
                nDianPaoMax = MJNotifyBase_1.default.getPlayerDianPaoCount(player);
            }
            //大牌王
            if (nDaPaiWang == 0) {
                nDaPaiWang = MJNotifyBase_1.default.getPlayerTopScore(player);
            }
            else if (nDaPaiWang < MJNotifyBase_1.default.getPlayerTopScore(player)) {
                nDaPaiWang = MJNotifyBase_1.default.getPlayerTopScore(player);
            }
            //大赢家
            let totalScore = MJNotifyBase_1.default.getTotalScore(player);
            if (nDaYingJia == 0) {
                nDaYingJia = totalScore;
            }
            else if (nDaYingJia < totalScore) {
                nDaYingJia = totalScore;
            }
        }
        if (nZiMoMax > 0 && MJNotifyBase_1.default.getPlayerZiMoCount(this.player_) === nZiMoMax) {
            ntitle.push(MJCmd.MjTitleType.ziMoWang);
        }
        if (nDianPaoMax > 0 && MJNotifyBase_1.default.getPlayerDianPaoCount(this.player_) === nDianPaoMax) {
            ntitle.push(MJCmd.MjTitleType.dianPaoWang);
        }
        if (nDaPaiWang > 0 && MJNotifyBase_1.default.getPlayerTopScore(this.player_) === nDaPaiWang) {
            ntitle.push(MJCmd.MjTitleType.daPaiWang);
        }
        let myTotalScore = MJNotifyBase_1.default.getTotalScore(this.player_);
        if (nDaYingJia > 0 && myTotalScore === nDaYingJia) {
            MJNotifyBase_1.default.setPlayerBigWinner(this.player_, true);
            ntitle.push(MJCmd.MjTitleType.daYingJia);
        }
        return ntitle;
    }
}
exports.default = MJMaxSettleScores;
