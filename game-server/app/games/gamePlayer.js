"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const friendGame_1 = require("./friendGame");
class GamePlayer {
    constructor(app, user, userInfo, index = -1, watcher = false, robot = false) {
        this.app = app;
        this.user = user;
        this.userInfo = userInfo;
        this.index = index;
        this.uid = '';
        this.watcher = false;
        this.robot = false;
        this.score = 0;
        this.initScore = 0;
        this.roundScore = 0;
        this.winCount = 0;
        this.loseCount = 0;
        this.drawCount = 0;
        this.cards = [];
        this.dissolveState = friendGame_1.DissolveState.None;
        this.joined = false;
        this.uid = user.id;
    }
    reset() {
        this.roundScore = 0;
    }
    clientInfo(needEntire = false) {
        const clientInfo = _.pick(this.user, ['id', 'shortId', 'nickname', 'isGuest', 'sex', 'headimgurl', 'count', 'signature', 'loc']);
        clientInfo.index = this.index;
        clientInfo.watcher = this.watcher;
        clientInfo.ip = this.userInfo["ip"];
        return clientInfo;
    }
    updateWinOrLose() {
        if (this.roundScore > 0) {
            ++this.winCount;
        }
        else if (this.roundScore == 0) {
            ++this.drawCount;
        }
        else if (this.roundScore < 0) {
            ++this.loseCount;
        }
    }
    changeScoreSafe(score) {
        if (score < 0) {
            score = -_.min([this.score, Math.abs(score)]);
        }
        this.score += score;
        return score;
    }
}
exports.default = GamePlayer;
