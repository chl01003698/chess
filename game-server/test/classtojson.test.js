"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameRecord {
    constructor() {
        this.roomId = "";
        this.ownerId = "";
        this.currentRound = 0;
        this.roundCount = 0;
        this.playerCount = 0;
        this.players = [];
        this.roomConfig = {};
        this.remainCards = [];
        this.commands = [];
        this.id = "";
    }
    startGame(game) {
    }
}
exports.default = GameRecord;
const gameRecord = new GameRecord();
console.log(JSON.stringify(gameRecord));
