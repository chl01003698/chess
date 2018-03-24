"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MJFormulaModel_1 = require("../../MJModel/MJFormulaModel");
class MJXZFormula {
    static getScore(params) {
        let { game, mjscoreManage, gamePlayer } = params;
        let player = gamePlayer;
        //赢家
        let winindex1, winindex2, winindex3;
        [winindex1, winindex2, winindex3] = MJFormulaModel_1.ScoreDataBase.getWinners(game);
        console.log("赢家" + winindex1 + "    " + winindex2 + "    " + winindex3);
        //输家
        let loseindex1, loseindex2, loseindex3;
        [loseindex1, loseindex2, loseindex3] = MJFormulaModel_1.ScoreDataBase.getloses(game);
        console.log("输家" + loseindex1 + "    " + loseindex2 + "    " + loseindex3);
        let winnerCount = MJFormulaModel_1.ScoreDataBase.getValidCount([winindex1, winindex2, winindex3]);
        let lostCount = MJFormulaModel_1.ScoreDataBase.getValidCount([loseindex1, loseindex2, loseindex3]);
        console.log("赢家[%d]   输家[%d]", winnerCount, lostCount);
        if (player.index == winindex1 || player.index == winindex2 || player.index == winindex3) {
            let scoreNum = 0;
            scoreNum += MJFormulaModel_1.ScoreDataBase.getGang(game, mjscoreManage, player.index) * lostCount;
            scoreNum += MJFormulaModel_1.ScoreDataBase.getSaoDiHu(game, mjscoreManage, player.index) * lostCount;
            scoreNum += MJFormulaModel_1.ScoreDataBase.getHaiDiPao(game, mjscoreManage, player.index) * lostCount;
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQiangGangHu(game, mjscoreManage, player.index) * lostCount;
            scoreNum += MJFormulaModel_1.ScoreDataBase.getGangHouPao(game, mjscoreManage, player.index) * lostCount;
            scoreNum += MJFormulaModel_1.ScoreDataBase.getGangShangHua(game, mjscoreManage, player.index) * lostCount;
            scoreNum += MJFormulaModel_1.ScoreDataBase.getDaDiaoChe(game, mjscoreManage, player.index) * lostCount;
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQueYiMen(game, mjscoreManage, player.index) * lostCount;
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQingYiSe(game, mjscoreManage, player.index) * lostCount;
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQiDui(game, mjscoreManage, player.index) * lostCount;
            scoreNum += MJFormulaModel_1.ScoreDataBase.getDuanYaoJiu(game, mjscoreManage, player.index) * lostCount;
            scoreNum += MJFormulaModel_1.ScoreDataBase.getYiBanGao(game, mjscoreManage, player.index) * lostCount;
            scoreNum += MJFormulaModel_1.ScoreDataBase.getJiaWuXin(game, mjscoreManage, player.index) * lostCount;
            if (MJFormulaModel_1.ScoreDataBase.getBaiPai(game, mjscoreManage, player.index) === 1) {
                scoreNum += MJFormulaModel_1.ScoreDataBase.getBaiPai(game, mjscoreManage, player.index) * 7 * lostCount;
            }
            else {
                scoreNum += MJFormulaModel_1.ScoreDataBase.getBaiPai(game, mjscoreManage, player.index) * lostCount;
            }
            let piaoScore = 0;
            piaoScore += MJFormulaModel_1.ScoreDataBase.getPiao(game, mjscoreManage, loseindex1);
            piaoScore += MJFormulaModel_1.ScoreDataBase.getPiao(game, mjscoreManage, loseindex2);
            piaoScore += MJFormulaModel_1.ScoreDataBase.getPiao(game, mjscoreManage, loseindex3);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getPiao(game, mjscoreManage, player.index) + piaoScore;
            let clientShowList = new Array(4);
            clientShowList = MJFormulaModel_1.ScoreDataBase.initList(clientShowList, player.index);
            if (MJFormulaModel_1.ScoreDataBase.getQingYiSe(game, mjscoreManage, player.index) > 0) {
                MJFormulaModel_1.ScoreDataBase.addShowItem(clientShowList[0], player.index, 30086);
            }
            if (MJFormulaModel_1.ScoreDataBase.getQingYiSe(game, mjscoreManage, player.index) > 0) {
                MJFormulaModel_1.ScoreDataBase.addShowItem(clientShowList[0], player.index, 30038);
            }
            let info = new MJFormulaModel_1.ScoreData;
            info.score = scoreNum;
            info.clientShowList = clientShowList;
            console.log(">>赢家得分[%d]", info.score);
            return info;
        }
        if (player.index == loseindex1 || player.index == loseindex2 || player.index == loseindex3) {
            let scoreNum = 0;
            scoreNum += MJFormulaModel_1.ScoreDataBase.getGang(game, mjscoreManage, winindex1);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getSaoDiHu(game, mjscoreManage, winindex1);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getHaiDiPao(game, mjscoreManage, winindex1);
            scoreNum >= MJFormulaModel_1.ScoreDataBase.getQiangGangHu(game, mjscoreManage, winindex1);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getGangHouPao(game, mjscoreManage, winindex1);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getGangShangHua(game, mjscoreManage, winindex1);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getDaDiaoChe(game, mjscoreManage, winindex1);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQueYiMen(game, mjscoreManage, winindex1);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex1);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQiDui(game, mjscoreManage, winindex1);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getDuanYaoJiu(game, mjscoreManage, winindex1);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getYiBanGao(game, mjscoreManage, winindex1);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getJiaWuXin(game, mjscoreManage, winindex1);
            if (MJFormulaModel_1.ScoreDataBase.getBaiPai(game, mjscoreManage, winindex1) === 1) {
                scoreNum += MJFormulaModel_1.ScoreDataBase.getBaiPai(game, mjscoreManage, winindex1) * 7;
            }
            else {
                scoreNum += MJFormulaModel_1.ScoreDataBase.getBaiPai(game, mjscoreManage, winindex1);
            }
            scoreNum += MJFormulaModel_1.ScoreDataBase.getGang(game, mjscoreManage, winindex2);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getSaoDiHu(game, mjscoreManage, winindex2);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getHaiDiPao(game, mjscoreManage, winindex2);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQiangGangHu(game, mjscoreManage, winindex2);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getGangHouPao(game, mjscoreManage, winindex2);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getGangShangHua(game, mjscoreManage, winindex2);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getDaDiaoChe(game, mjscoreManage, winindex2);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQueYiMen(game, mjscoreManage, winindex2);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex2);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQiDui(game, mjscoreManage, winindex2);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getDuanYaoJiu(game, mjscoreManage, winindex2);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getYiBanGao(game, mjscoreManage, winindex2);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getJiaWuXin(game, mjscoreManage, winindex2);
            if (MJFormulaModel_1.ScoreDataBase.getBaiPai(game, mjscoreManage, winindex2) === 1) {
                scoreNum += MJFormulaModel_1.ScoreDataBase.getBaiPai(game, mjscoreManage, player.index) * 7;
            }
            else {
                scoreNum += MJFormulaModel_1.ScoreDataBase.getBaiPai(game, mjscoreManage, winindex2);
            }
            scoreNum += MJFormulaModel_1.ScoreDataBase.getGang(game, mjscoreManage, winindex3);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getSaoDiHu(game, mjscoreManage, winindex3);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getHaiDiPao(game, mjscoreManage, winindex3);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQiangGangHu(game, mjscoreManage, winindex3);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getGangHouPao(game, mjscoreManage, winindex3);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getGangShangHua(game, mjscoreManage, winindex3);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getDaDiaoChe(game, mjscoreManage, winindex3);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQueYiMen(game, mjscoreManage, winindex3);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex3);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getQiDui(game, mjscoreManage, winindex3);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getDuanYaoJiu(game, mjscoreManage, winindex3);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getYiBanGao(game, mjscoreManage, winindex3);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getJiaWuXin(game, mjscoreManage, winindex3);
            if (MJFormulaModel_1.ScoreDataBase.getBaiPai(game, mjscoreManage, winindex3) === 1) {
                scoreNum += MJFormulaModel_1.ScoreDataBase.getBaiPai(game, mjscoreManage, winindex3) * 7;
            }
            else {
                scoreNum += MJFormulaModel_1.ScoreDataBase.getBaiPai(game, mjscoreManage, winindex3);
            }
            let piaoScore = 0;
            piaoScore += MJFormulaModel_1.ScoreDataBase.getPiao(game, mjscoreManage, winindex1);
            piaoScore += MJFormulaModel_1.ScoreDataBase.getPiao(game, mjscoreManage, winindex2);
            piaoScore += MJFormulaModel_1.ScoreDataBase.getPiao(game, mjscoreManage, winindex3);
            scoreNum += MJFormulaModel_1.ScoreDataBase.getPiao(game, mjscoreManage, player.index) * winnerCount + piaoScore;
            let clientShowList = new Array(4);
            clientShowList = MJFormulaModel_1.ScoreDataBase.initList(clientShowList, winindex1, winindex2, winindex3);
            if (MJFormulaModel_1.ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex1) > 0) {
                MJFormulaModel_1.ScoreDataBase.addShowItem(clientShowList[0], winindex1, 30086);
            }
            if (MJFormulaModel_1.ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex1) > 0) {
                MJFormulaModel_1.ScoreDataBase.addShowItem(clientShowList[0], winindex1, 30038);
            }
            if (MJFormulaModel_1.ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex2) > 0) {
                MJFormulaModel_1.ScoreDataBase.addShowItem(clientShowList[1], winindex2, 30086);
            }
            if (MJFormulaModel_1.ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex2) > 0) {
                MJFormulaModel_1.ScoreDataBase.addShowItem(clientShowList[1], winindex2, 30038);
            }
            if (MJFormulaModel_1.ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex3) > 0) {
                MJFormulaModel_1.ScoreDataBase.addShowItem(clientShowList[2], winindex3, 30086);
            }
            if (MJFormulaModel_1.ScoreDataBase.getQingYiSe(game, mjscoreManage, winindex3) > 0) {
                MJFormulaModel_1.ScoreDataBase.addShowItem(clientShowList[2], winindex3, 30038);
            }
            let info = new MJFormulaModel_1.ScoreData();
            info.score = -scoreNum;
            info.clientShowList = clientShowList;
            return info;
        }
        let info = new MJFormulaModel_1.ScoreData();
        info.score = 0;
        return info;
    }
}
exports.default = MJXZFormula;
