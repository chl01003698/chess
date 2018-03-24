"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class MJScore {
    constructor(uid, scoreData, targetIds) {
        this.uid = uid;
        this.targetIds = targetIds;
        this.scoreData = scoreData;
    }
}
exports.MJScore = MJScore;
class MJScoreV2 {
    constructor(params) {
        this.uid = params.uid;
        this.triggerUid = params.triggerUid;
        this.type = params.type;
        this.data = params.data;
    }
}
exports.MJScoreV2 = MJScoreV2;
class MJScoreManage {
    constructor(mjGame) {
        this.scores = new Array();
        this.scoresV2 = new Array();
        this.game = mjGame;
    }
    addScore(gamePlayer, scoreData, targetIds) {
        const uids = this.getScopeUids(scoreData.scope, gamePlayer, targetIds);
        if (!_.isEmpty(uids)) {
            console.log("______________________________________________________________________________");
            console.log(uids);
            console.log(scoreData);
            console.log(targetIds);
            this.scores.push(new MJScore(gamePlayer.uid, scoreData, uids));
        }
    }
    addScoreV2(params) {
        this.scoresV2.push(new MJScoreV2(params));
    }
    filterScoreByType(type) {
        return _.filter(this.scoresV2, (v) => { return v.type == type; });
    }
    groupByType(type) {
        return _.groupBy(this.scores, 'type');
    }
    groupByTag(tag) {
        return _.groupBy(this.scores, 'tag');
    }
    groupByName(name) {
        return _.groupBy(this.scores, (v) => {
            return v.scoreData.name == name;
        });
    }
    groupByTypeAndTag(type, tag) {
        return _.groupBy(this.scores, (v) => {
            return v.type == type && v.tag == tag;
        });
    }
    addByScores(scores, baseScore = 0) {
        const value = _.reduce(scores, (sum, v) => {
            return sum + v.value;
        }, baseScore);
        return {
            value,
            scores
        };
    }
    multiplyByScores(scores, baseScore = 1) {
        const value = _.reduce(scores, (sum, v) => {
            return sum * v.value;
        }, baseScore);
        return {
            value,
            scores
        };
    }
    maxByScores(scores) {
        const maxScore = _.maxBy(scores, (v) => {
            return v.value;
        });
        return {
            value: maxScore.value,
            scores: [maxScore]
        };
    }
    powByScores(scores, baseScore = 2) {
        const y = _.sumBy(scores, 'value');
        const value = Math.pow(baseScore, y);
        return {
            value,
            scores
        };
    }
    filterScoresByUid(uid) {
        return _.filter(this.scores, (v) => {
            return v.uid == uid || _.includes(v.targetIds, uid);
        });
    }
    filterWinScoresByUid(uid) {
        return _.filter(this.scores, (v) => {
            return (v.uid == uid && v.type == 'in') || (_.includes(v.targetIds, uid) && v.type == 'out');
        });
    }
    filterLoseScoresByUid(uid) {
        return _.filter(this.scores, (v) => {
            return (v.uid == uid && v.type == 'out') || (_.includes(v.targetIds, uid) && v.type == 'in');
        });
    }
    getScopeUids(scope, gamePlayer, targetIds) {
        const game = this.game;
        let uids = [];
        if (scope == 'one' && !_.isEmpty(targetIds)) {
            uids = targetIds;
        }
        else if (scope == 'all') {
            uids = _.filter(game.gamePlayers, (v) => {
                return v.uid != gamePlayer.uid;
            });
            uids = _.map(uids, 'uid');
        }
        return uids;
    }
    // huCard: currentHandles[0].getCard() 抢杠胡
    // huCard: game.currentCard.card 自摸，点炮
    preCalcComboScore(gamePlayer, huCard) {
        const uids = _.map(this.game.getCurrentHandles(), 'uid');
        const curGamePlayer = this.game.getCurrGamePlayer();
        let params = { game: this.game, curGamePlayer, scoreData: null, uids, gamePlayer, card: huCard };
        return this.game.container.mjcomboManage.computeComboV2(params);
    }
}
exports.MJScoreManage = MJScoreManage;
