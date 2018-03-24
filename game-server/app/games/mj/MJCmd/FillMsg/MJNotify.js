"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mjCmd = require("../base/MJCmd");
const MJCmd_1 = require("../base/MJCmd");
const MJNotifyBase_1 = require("../base/MJNotifyBase");
const _ = require("lodash");
const MJMinSettleScores_1 = require("./MJMinSettleScores");
const MJMaxSettleScores_1 = require("./MJMaxSettleScores");
const MJFormulaModel_1 = require("../../MJModel/MJFormulaModel");
class MJNotify {
    static fillMsg(game, MJMsgType) {
        switch (MJMsgType) {
            case MJCmd_1.MJMsgFillType.FillMJMinSettleScores: {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>小结算消息填充开始0<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
                return this.FillMsgMJMinSettleScores(game, MJMsgType);
            }
            case MJCmd_1.MJMsgFillType.FillMJMaxSettleScores: {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>大结算消息填充开始0<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
                return this.FillMsgMJMaxSettleScores(game, MJMsgType);
            }
        }
    }
    static FillMsgMJMaxSettleScores(game, nType) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>大结算消息填充开始<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        let info = new mjCmd.MjGameOverNotify();
        info.showtype = 1; //显示类型
        info.gametype = 66666; //玩法类型
        info.oddscount = 1; //多少番
        info.deskid = _.parseInt(MJNotifyBase_1.default.getRoomID(game));
        info.isshow = true; //是否展示
        info.configid = 50006; //配置唯一ID
        info.recordtime = 2018; //开局日期
        info.deskmgrid = 0; //桌主ID
        info.desktype = 1; //房卡类型
        info.bigwinneruid = 1; //付卡大赢家
        info.islastuser = true; //大赢家是否最后进入房间player.m_mjRule.UtilRuler
        info.titleinfo = []; //称号信息
        info.bureauinfo = []; //局信息
        info.urinfo = []; //玩家扣卡及进入房间时间信息
        let gamePlayers = MJNotifyBase_1.default.getGamePlayers(game);
        for (let i = 0; i < gamePlayers.length; i++) {
            let player = gamePlayers[i];
            if (player == undefined) {
                continue;
            }
            let MaxSettleScores = new MJMaxSettleScores_1.default(game, player);
            MaxSettleScores.fillMsg(nType, info);
        }
        console.log(MJNotifyBase_1.default.getCurrentRound(game));
        for (let i = 0; i < MJNotifyBase_1.default.getCurrentRound(game); i++) {
            info.bureauinfo.push(this.fill_MjBureauDetialInfo(game, i));
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>大结算消息填充结束<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        return info;
    }
    static fill_MjBureauDetialInfo(game, bureauIndex) {
        let info = new mjCmd.MjBureauDetialInfo();
        info.bureauinfo = this.fillMjBureauInfo(game, bureauIndex); //局基本信息
        info.nmaxsomenum = 255; //最大番数
        info.nsomenumseatid = []; //最大番的玩家
        info.ndianpaocount = []; //点炮次数
        info.nzimocount = []; ////自摸次数
        let gamePlayers = MJNotifyBase_1.default.getGamePlayers(game);
        for (let i = 0; i < gamePlayers.length; i++) {
            let player = gamePlayers[i];
            if (player == undefined) {
                continue;
            }
            info.ndianpaocount.push(MJNotifyBase_1.default.getPlayerDianPaoCount(player)); //点炮次数
            info.nzimocount.push(MJNotifyBase_1.default.getPlayerZiMoCount(player)); //自摸次数
            info.mjrecords = MJNotifyBase_1.default.getPlayerOptimalRecord(player); //最佳战绩
        }
        return info;
    }
    static fillMjBureauInfo(game, bureauIndex) {
        let info = new mjCmd.MjBureauInfo();
        info.nbureaucount = bureauIndex; //总局数
        info.ndetailscore = [];
        let gamePlayers = MJNotifyBase_1.default.getGamePlayers(game);
        for (let i = 0; i < gamePlayers.length; i++) {
            let player = gamePlayers[i];
            if (player == undefined) {
                continue;
            }
            let MjScore = new mjCmd.MjScore();
            MjScore.seatid = player.index;
            let playerScoreList = MJNotifyBase_1.default.getPlayerScoreList(player);
            console.log("第[%d]局，得分[%d]", bureauIndex, playerScoreList[bureauIndex]);
            MjScore.score = playerScoreList[bureauIndex];
            let playerDianPaoList = MJNotifyBase_1.default.getPlayerDianPaoList(player);
            MjScore.isdianpao = playerDianPaoList[bureauIndex];
            MjScore.ischengbao = false; //还没有承包功能
            info.ndetailscore.push(MjScore); //详细信息
        }
        info.nwinseatid = MJNotifyBase_1.default.getPlayerHuSeatIDList(game); //胡的玩家座位
        return info;
    }
    static FillMsgMJMinSettleScores(game, nType) {
        //小结算
        console.log("**************************小结算共用信息填充开始********************************");
        let notify = new mjCmd.MjBalanceNewNotify;
        notify.ncurbureau = MJNotifyBase_1.default.getCurrentRound(game); //当前局数
        notify.nmaxbureau = 2; //最大局数
        // let notify: any = {}
        notify.showtype = 1;
        notify.gametype = 66666;
        notify.configid = 50006;
        notify.rulertype = [];
        notify.deskid = _.parseInt(MJNotifyBase_1.default.getRoomID(game));
        notify.dealerseatid = MJNotifyBase_1.default.getBanker(game);
        notify.deskmgrseatid = MJNotifyBase_1.default.getBanker(game);
        console.log("**************************小结算共用信息填充结束********************************");
        let gamePlayers = MJNotifyBase_1.default.getGamePlayers(game);
        notify.balanceplayerinfo = [];
        let winindex1, winindex2, winindex3;
        [winindex1, winindex2, winindex3] = MJFormulaModel_1.ScoreDataBase.getWinners(game);
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  winindex1");
        console.log(winindex1);
        console.log(winindex2);
        console.log(winindex3);
        let winnerCount = MJFormulaModel_1.ScoreDataBase.getValidCount([winindex1, winindex2, winindex3]);
        if (winnerCount == 0 && game.gameConfig.baipai) {
            game.gamePlayers.forEach(gamePlayer => {
                if (gamePlayer.ting) {
                    let maxScore = 0;
                    for (let card of gamePlayer.huList) {
                        let score = game.container.mjformulaManage(gamePlayer, null, card);
                        maxScore = score > maxScore ? score : maxScore;
                    }
                    if (maxScore !== 0) {
                        game.gamePlayers.forEach(player => {
                            if (!gamePlayer.ting) {
                                player.daJiaoScore.score += -maxScore;
                                gamePlayer.daJiaoScore.score += maxScore;
                            }
                        });
                    }
                }
            });
        }
        for (let i = 0; i < gamePlayers.length; i++) {
            let player = gamePlayers[i];
            if (player == undefined) {
                continue;
            }
            let MinSettleScores = new MJMinSettleScores_1.default(game, player);
            MinSettleScores.fillMsg(nType, notify);
        }
        notify.isdraw = MJNotifyBase_1.default.getIsdraw(game) === false ? true : false;
        return notify;
    }
}
exports.default = MJNotify;
