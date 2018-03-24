"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../extend/db");
class GameRecord {
    constructor(game, playback, roomPay) {
        this.game = game;
        this.playback = playback;
        this.roomPay = roomPay;
    }
    initGame() {
        const game = this.game;
        this.record = new db_1.RecordModel({
            type: game.roomConfig["type"],
            game: game.roomConfig["game"],
            roomId: game.roomId,
            roundCount: game.roomConfig["roundCount"],
            currentRound: game.currentRound,
            owner: game.owner,
            config: game.roomConfig
        });
    }
    startGame() {
        this.record.startAt = this.game.startDate;
    }
    overGame() {
        const game = this.game;
        const seconds = (Date.now() - game.startDate.getTime()) / 1000;
        this.record.rounds[game.currentRound] = {
            seconds: seconds,
            players: []
        };
        if (this.playback.config.enabled == true) {
            this.record.playbackIds.push(this.playback.id);
        }
        const players = this.record.rounds[game.currentRound].players;
        game.gamePlayers.forEach((v, i) => {
            if (v != null) {
                const roundObject = {};
                roundObject['uid'] = v.uid;
                roundObject['score'] = v.roundScore;
                game.saveCurrentRoundGamePlayer(roundObject, v, i);
                players.push(roundObject);
            }
        });
    }
    getRoundData(round) {
        return this.record.rounds[round];
    }
    finishGame() {
        if (this.game.currentRound >= 1) {
            const game = this.game;
            this.record.done = game.isFinish();
            this.record.currentRound = game.currentRound;
            game.gamePlayers.forEach((value) => {
                if (value != null) {
                    this.record.players.push({
                        user: value.user,
                        score: value.score,
                        winCount: value.winCount,
                        loseCount: value.loseCount,
                        drawCount: value.drawCount
                    });
                }
            });
            this.record.payUIds = Array.from(this.roomPay.payUsers);
            this.record.markModified('rounds');
            this.record.save();
        }
    }
}
exports.default = GameRecord;
