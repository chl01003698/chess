"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//********************************************小结算填充************************************************
const mjCmd = require("../base/MJCmd");
const MJNotifyBase_1 = require("../base/MJNotifyBase");
const MJCmd_1 = require("../base/MJCmd");
const MJAlgo_1 = require("../../MJAlgo");
const _ = require("lodash");
const MJFormulaModel_1 = require("../../MJModel/MJFormulaModel");
class MJMinSettleScores {
    constructor(game, player) {
        this.game_ = game;
        this.player_ = player;
        this.relativeMap = new Map();
        this.myShowInfo = new MJFormulaModel_1.ScoreData();
        this.reset();
    }
    reset() {
        this.relativeMap.clear();
        //点炮
        // this.relativeMap.set(MJEnum.MJRulerType.MjRulerType_Points_KONGLOSE,MjHu2ClientType.MjHuType_Gun);
        // this.relativeMap.set(MJEnum.MJRulerType.MjRulerType_Action_HaidiPao,MjHu2ClientType.MjHuType_Gun);
        // this.relativeMap.set(MJEnum.MJRulerType.MjRulerType_WinLimit_GUN,MjHu2ClientType.MjHuType_Gun);
        // //一炮多响
        // this.relativeMap.set(MJEnum.MJRulerType.MjRulerType_Special_GUNMANY,MjHu2ClientType.MjHuType_GunMany);
        // //自摸
        // this.relativeMap.set(MJEnum.MJRulerType.MjRulerType_Points_ZIMOJIADI,MjHu2ClientType.MjHuType_Self);
        // this.relativeMap.set(MJEnum.MJRulerType.MjRulerType_Score_ZiMoJiaFan,MjHu2ClientType.MjHuType_Self);
        // this.relativeMap.set(MJEnum.MJRulerType.MjRulerType_Score_ZiMoJiaDi,MjHu2ClientType.MjHuType_Self);
        // //抢杠胡
        // this.relativeMap.set(MJEnum.MJRulerType.MjRulerType_Points_GRABKONG,MjHu2ClientType.MjHuType_QiangGangHu);
        // //杠上花
        // this.relativeMap.set(MJEnum.MJRulerType.MjRulerType_Points_DIANGANGGANGKAI,MjHu2ClientType.MjHuType_GangShangHua);
        // this.relativeMap.set(MJEnum.MJRulerType.MjRulerType_Points_DIANGANGGANGKAI,MjHu2ClientType.MjHuType_GangShangHua);
    }
    fillMsg(MJMsgType, cmd) {
        let info = cmd;
        let playerInfo = this.fillMsgMjBalancePlayerInfo();
        info.balanceplayerinfo.push(playerInfo);
        this.changeFinalData(playerInfo.mjrecords);
    }
    getCurrScore() {
        let currScore = this.myShowInfo.score != undefined ? this.myShowInfo.score : 0;
        MJNotifyBase_1.default.setPlayerScoreList(this.player_, MJNotifyBase_1.default.getCurrentRound(this.player_), currScore);
        return currScore;
    }
    //记录部分数据用于大结算
    changeFinalData(info) {
        console.log("玩家得分[%d]", this.getCurrScore());
        if (MJNotifyBase_1.default.setPlayerTopScore(this.player_, this.getCurrScore()) === true) {
            MJNotifyBase_1.default.setPersonalBest(this.player_, info);
        }
        if (MJNotifyBase_1.default.getZiMo(this.player_) === true) {
            MJNotifyBase_1.default.setPlayerZiMoList(this.player_, MJNotifyBase_1.default.getCurrentRound(this.player_), true);
            console.log("玩家自摸胡次数[%d]", MJNotifyBase_1.default.getPlayerZiMoCount(this.player_));
        }
        else {
            MJNotifyBase_1.default.setPlayerZiMoList(this.player_, MJNotifyBase_1.default.getCurrentRound(this.player_), false);
        }
        if (MJNotifyBase_1.default.getDianPao(this.player_) === true) {
            MJNotifyBase_1.default.setPlayerDianPaoList(this.player_, MJNotifyBase_1.default.getCurrentRound(this.player_), true);
            console.log("玩家点炮胡次数[%d]", MJNotifyBase_1.default.getPlayerDianPaoCount(this.player_));
        }
        else {
            MJNotifyBase_1.default.setPlayerDianPaoList(this.player_, MJNotifyBase_1.default.getCurrentRound(this.player_), false);
        }
    }
    getScoreDetail() {
        let winindex1, winindex2, winindex3;
        [winindex1, winindex2, winindex3] = MJFormulaModel_1.ScoreDataBase.getWinners(this.game_);
        let winnerCount = MJFormulaModel_1.ScoreDataBase.getValidCount([winindex1, winindex2, winindex3]);
        if (winnerCount == 0 && this.game_.gameConfig.baipai) {
            return this.player_.daJiaoScore;
        }
        let mjformulaManage = this.game_.container.mjformulaManage;
        return mjformulaManage.calculateScoresByPlayer(this.player_);
    }
    fillMsgMjBalancePlayerInfo() {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>【%d】小结算消息填充开始<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", this.player_.index);
        // let nScore =  this.Master_.ScoreRuler.autoScore();
        this.myShowInfo = this.getScoreDetail();
        console.log(this.myShowInfo);
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        let info = new mjCmd.MjBalancePlayerInfo();
        let player = this.player_;
        info.userid = player.user.shortId;
        info.seatid = player.index;
        info.name = player.user.nickname;
        info.headurl = player.user.headimgurl;
        info.mjrecords = this.fillBestMjRecord();
        info.nhucode = this.fillhuCode();
        console.log("info.nhucode " + info.nhucode);
        info.nscore = MJNotifyBase_1.default.getTotalScore(player); //总分数
        info.nbureauscore = this.getCurrScore();
        info.detailscorelist = this.fillMjDetaildedScore(); //分数详细
        info.ndianpao = MJNotifyBase_1.default.getDianPao(player) === true ? 1 : 0;
        info.nzimo = MJNotifyBase_1.default.getZiMo(player) === true ? 1 : 0;
        info.bchengbao = false; //是否承包
        info.ncheck = this.fillMjCheckShow(); //特殊类型MjCheckBaseType
        info.nmatchscore = 0; //积分赛分数
        info.nguoscore = 0; //锅分[北京打锅]
        info.bshowguoscore = false; //是否显示打锅分
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>【%d】小结算消息填充结束<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", this.player_.index);
        return info;
    }
    fillhuCode() {
        let huCode = [];
        let mjCardIndex = this.game_.currentCard.card;
        if (mjCardIndex === 0) {
            return huCode;
        }
        huCode.push(mjCardIndex);
        return huCode;
    }
    fillMjDetaildedScore() {
        let aArr = [];
        if (this.myShowInfo.clientShowList == undefined) {
            return aArr;
        }
        for (let i = 0; i < this.myShowInfo.clientShowList.length; i++) {
            console.log("clientShowList.length  " + this.myShowInfo.clientShowList.length);
            if (this.myShowInfo.clientShowList[i] != undefined) {
                console.log("clientShowList  " + i);
                let MjDetaildedScoreItem = new mjCmd.MjDetaildedScore;
                let playerIndex = this.getWinIndex(i);
                MjDetaildedScoreItem.scoretype = this.getScore2ClientType(playerIndex); //积分类型
                MjDetaildedScoreItem.score = this.getScoreBy2ClientType(playerIndex); //分值
                MjDetaildedScoreItem.seatid = [this.player_.index]; //座位ID
                MjDetaildedScoreItem.paitype = this.fillPaiType(i);
                // MjDetaildedScoreItem.hutype	= this.fill_huType();				                  //胡型(如：抢杠胡)
                MjDetaildedScoreItem.sptype = [];
                aArr.push(MjDetaildedScoreItem);
            }
        }
        return aArr;
    }
    // fill_huType()
    // {
    //   let huType:number = 0;
    //   for(let [key, value] of this.Master_.ActionRuler.mapScore) {
    //     let nType = this.getHu2ClientType(key);
    //     if(nType > 0)
    //     {
    //         huType	= nType;				                  //胡型(如：抢杠胡)
    //         break;
    //     }
    //   }
    //   return huType;
    // }
    fillMjCheckShow() {
        let aArr = [];
        return aArr;
    }
    fillBestMjRecord() {
        let bestMjRecord = new mjCmd.BestMjRecord();
        bestMjRecord.mjtype = 100; //南充
        bestMjRecord.mjlist = this.fillMjList();
        bestMjRecord.mjspeciallist = [];
        bestMjRecord.oddscount = 1;
        bestMjRecord.scorechange = [];
        // bestMjRecord.paitype = this.fillPaiType();
        bestMjRecord.configid = 100;
        return bestMjRecord;
    }
    fillPaiType(index) {
        let paiType = [];
        let player;
        if (this.myShowInfo.clientShowList == undefined) {
            return paiType;
        }
        //player = this.Master_.GetPlayerByID(this.Master_.m_roomShareData.OnePlayerHuID);
        for (let i = 0; i < this.myShowInfo.clientShowList[index].length; i++) {
            if (this.myShowInfo.clientShowList[index][i] != undefined) {
                paiType.push(this.myShowInfo.clientShowList[index][i].showType);
            }
        }
        // for(let i = 0 ;i <this.Master_.ScoreRuler.paiXingList.length;i++)
        // {
        //     paiType.push(this.Master_.ScoreRuler.paiXingList[i]);
        // }
        // player = this.Master_.GetPlayerByID(this.Master_.m_roomShareData.OnePlayerHuID);
        // for(let [key, value] of player.m_mjRule.ScoreRuler.mapScore) {
        //     if(value > 0)
        //     {
        //         paiType.push(key);
        //     }
        // }
        // for(let [key, value] of player.m_mjRule.ActionRuler.mapScore) {
        //     if(value > 0)
        //     {
        //         paiType.push(key);
        //     }
        // }
        return paiType;
    }
    fillMjList() {
        let mjList = Array();
        let tempCards = MJAlgo_1.MJAlgo.formatCards(this.player_.cards);
        let nCount = 0;
        for (let i = 0; i < tempCards.length; i++) {
            if (this.player_.cards[i] > 0) {
                for (let j = 0; j < tempCards[i]; j++) {
                    if (i === this.game_.currentCard.card) {
                        nCount += 1;
                    }
                    if (nCount !== 1) {
                        mjList.push(this.fillMjPai(mjCmd.MjCodeType.CodeHands, i, this.player_.index));
                    }
                }
            }
        }
        if (MJNotifyBase_1.default.getZiMo(this.player_) === false) {
            mjList.push(this.fillMjPai(mjCmd.MjCodeType.CodeHands, this.game_.currentCard.card, this.player_.index));
        }
        //杠
        let gangList = MJNotifyBase_1.default.getGangList(this.player_);
        for (let i = 0; i < gangList.length; i += 4) {
            if (gangList[i] > 0) {
                mjList.push(this.fillMjPai(mjCmd.MjCodeType.CodeZhiGang, gangList[i], this.player_.index));
            }
        }
        //吃
        let aList = MJNotifyBase_1.default.getChiList(this.player_);
        for (let i = 0; i < aList.length; i++) {
            if (aList[i] > 0) {
                mjList.push(this.fillMjPai(mjCmd.MjCodeType.CodeChi, aList[i], this.player_.index));
            }
        }
        //碰
        aList = MJNotifyBase_1.default.getPengList(this.player_);
        for (let i = 0; i < aList.length; i++) {
            if (aList[i] > 0 && _.indexOf(gangList, 0, aList[i]) == 0) {
                mjList.push(this.fillMjPai(mjCmd.MjCodeType.CodePeng, aList[i], this.player_.index));
            }
        }
        return mjList;
    }
    fillMjPai(codeType, mjIndex, nSeatid) {
        let MjPai = new mjCmd.MjPai;
        MjPai.codetype = codeType;
        MjPai.mjcode = mjIndex;
        MjPai.nseatid = nSeatid;
        return MjPai;
    }
    getScoreBy2ClientType(index) {
        let ScoreType = this.getScore2ClientType(index);
        switch (ScoreType) {
            case MJCmd_1.MjBalanceSocreType.ZIMO:
                {
                    return this.getCurrScore();
                }
                break;
            case MJCmd_1.MjBalanceSocreType.DIANPAO:
                {
                    return this.getCurrScore();
                }
                break;
        }
        return 0;
    }
    getWinIndex(index) {
        let playerIndex = -1;
        let item;
        if (this.myShowInfo.clientShowList == undefined) {
            return playerIndex;
        }
        for (let i = 0; i < this.myShowInfo.clientShowList[index].length; i++) {
            item = this.myShowInfo.clientShowList[index][i];
            if (item != undefined) {
                playerIndex = item.winID;
                break;
            }
        }
        return playerIndex;
    }
    getScore2ClientType(playerIndex) {
        let ScoreType = MJCmd_1.MjBalanceSocreType.None;
        let player = this.player_;
        if (player == undefined) {
            return ScoreType;
        }
        if (MJNotifyBase_1.default.getZiMo(player)) {
            ScoreType = MJCmd_1.MjBalanceSocreType.ZIMO;
        }
        else if (MJNotifyBase_1.default.isHu(player) === true) {
            ScoreType = MJCmd_1.MjBalanceSocreType.DIANPAO;
        }
        else if (MJNotifyBase_1.default.getDianPao(player) === true) {
            ScoreType = MJCmd_1.MjBalanceSocreType.DIANPAO;
        }
        return ScoreType;
    }
}
exports.default = MJMinSettleScores;
