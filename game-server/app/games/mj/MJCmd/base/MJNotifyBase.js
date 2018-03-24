"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MJEnum_1 = require("../../consts/MJEnum");
class MJNotifyBase {
    //是否流局
    static getIsdraw(game) {
        return false;
    }
    static getBanker(game) {
        return game.m_banker;
    }
    static getRoomID(game) {
        return game.roomId;
    }
    static getGamePlayers(game) {
        return game.gamePlayers;
    }
    static getCurrentRound(game) {
        return game.currentRound;
    }
    static getPlayerDianPaoCount(player) {
        let num = 0;
        for (let i = 0; i < player.settleScoresCache.playerDianPaoList.length; i++) {
            if (player.settleScoresCache.playerDianPaoList[i] === true) {
                num++;
            }
        }
        return num;
    }
    static getPlayerZiMoCount(player) {
        let num = 0;
        for (let i = 0; i < player.settleScoresCache.playerZiMoList.length; i++) {
            if (player.settleScoresCache.playerZiMoList[i] === true) {
                num++;
            }
        }
        return num;
    }
    static getPlayerOptimalRecord(player) {
        return player.settleScoresCache.playerPersonalBest;
    }
    static getPlayerDianPaoList(player) {
        return player.settleScoresCache.playerDianPaoList;
    }
    static getPlayerScoreList(player) {
        return player.settleScoresCache.playerScoreList;
    }
    static getPlayerHuSeatIDList(game) {
        return [];
    }
    static getPlayerTopScore(player) {
        return player.settleScoresCache.playerTopScore;
    }
    static getTotalScore(player) {
        let totalScore = 0;
        for (let i = 0; i < this.getPlayerScoreList(player).length; i++) {
            totalScore += this.getPlayerScoreList(player)[i];
        }
        return totalScore;
    }
    static getCostTypeAndNum(game) {
        return [MJEnum_1.MJCostType.OpenCost, 1];
    }
    //大赢家
    static getBigWinner(player) {
        return player.settleScoresCache.playerBigWinner;
    }
    static getZiMo(player) {
        return false;
    }
    static getDianPao(player) {
        return false;
    }
    static getGangList(player) {
        return [];
    }
    static getChiList(player) {
        return [];
    }
    static getPengList(player) {
        return [];
    }
    static isHu(player) {
        return false;
    }
    //******************************************************************** */
    static setPlayerZiMoList(player, index, b) {
        if (player.settleScoresCache.playerZiMoList.length > index - 1) {
            player.settleScoresCache.playerZiMoList[index] = b;
        }
        else if (player.settleScoresCache.playerZiMoList.length == index - 1) {
            player.settleScoresCache.playerZiMoList.push(b);
        }
    }
    static setPlayerDianPaoList(player, index, b) {
        if (player.settleScoresCache.playerDianPaoList.length > index - 1) {
            player.settleScoresCache.playerDianPaoList[index] = b;
        }
        else if (player.settleScoresCache.playerDianPaoList.length == index - 1) {
            player.settleScoresCache.playerDianPaoList.push(b);
        }
    }
    static setPlayerBigWinner(player, b) {
        // playerBigWinner:boolean
        player.settleScoresCache.playerBigWinner = b;
    }
    static setPersonalBest(player, info) {
        //玩家最佳牌形  
        player.settleScoresCache.playerPersonalBest = info;
    }
    static setPlayerChengBao() {
        //playerChengBao:Array<boolean>
    }
    static setPlayerScoreList(player, index, score) {
        if (player.settleScoresCache.playerScoreList.length > index - 1) {
            player.settleScoresCache.playerScoreList[index] = score;
        }
        else if (player.settleScoresCache.playerScoreList.length == index - 1) {
            player.settleScoresCache.playerScoreList.push(score);
        }
    }
    static setPlayerHuSeatIDList(game) {
        return [];
    }
    static setPlayerTopScore(player, score) {
        if (this.getPlayerTopScore(player) < score) {
            player.settleScoresCache.playerTopScore = score;
            return true;
        }
        return false;
    }
}
exports.default = MJNotifyBase;
