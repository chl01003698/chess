"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diZhuGame_1 = require("./diZhuGame");
// import { SanRenDiZhuAlgorithm } from './sanrendizhu';
const friendGame_1 = require("../../friendGame");
const pushEvent_1 = require("../../../consts/pushEvent");
const _ = require("lodash");
// import { DiZhuAlgo } from '../pokerAlgo/doudizhu/diZhuAlgo';
const pokerAlgo_1 = require("../pokerAlgo/pokerAlgo");
// import { SanRenDiZhuAlgo } from '../pokerAlgo/doudizhu/sanRenDiZhuAlgo';
class FriendDouDiZhuGame extends diZhuGame_1.default(friendGame_1.default) {
    constructor(...args) {
        super(...args);
        // this.algorithm = SanRenDiZhuAlgo
        // this.recordEvents : any = [
        //   pushEvent.dz_onShowZhuang
        // ]
    }
    onEnterOver(lifecycle, gamePlayer, arg2) {
        if (_.isObject(gamePlayer)) {
            this.winId = gamePlayer.uid;
            const nextRound = this.currentRound + 1;
            let finish = this.roomConfig.roundCount != undefined && nextRound >= this.roomConfig.roundCount;
            const [chuntian, zhuangScore, sentScore] = this.getOverResult(gamePlayer);
            let results = [];
            this.gamePlayers.forEach((value) => {
                if (value != undefined) {
                    let score = 0;
                    if (value.identity == "landlord") {
                        score = value.score;
                    }
                    else {
                        score = value.score;
                    }
                    value.roundScore = score;
                    value.score += score;
                    value.updateWinOrLose();
                    let result = {
                        uid: value.uid,
                        remainCards: pokerAlgo_1.PokerAlgo.pickCardIds(value.cards),
                        roundScore: score,
                        score: value.score
                    };
                    results.push(result);
                }
            });
            const overResult = {
                results: results,
                finish: finish,
                chuntian: chuntian
            };
            if (this['gameRecord'] != undefined) {
                this['gameRecord'].overGame(overResult);
            }
            this.container.channel.pushMessage(pushEvent_1.default.dz_onGameOver, overResult);
        }
        super.onEnterOver(lifecycle, gamePlayer, arg2);
    }
    shuffleCards() {
        if (this.roomConfig.ciji) {
            return this.shuffleCards();
        }
        return super.shuffleCards();
    }
}
exports.default = FriendDouDiZhuGame;
