"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class Score {
    constructor(score, type, sourceId, targetId, data) {
        this.score = 0;
        this.type = -1;
        this.score = score;
        this.type = type;
        this.sourceId = sourceId;
        this.targetId = targetId;
        this.data = data;
    }
}
exports.Score = Score;
function createMultipleScore(multiple = 2, data = null, type = -1) {
    return new Score(multiple, type, "", "", data);
}
exports.createMultipleScore = createMultipleScore;
class ScoreManage {
    constructor() {
        this.scores = [];
    }
    pushScore(score) {
        this.scores.push(score);
    }
    pushTargetScore(score) {
        const targetScore = new Score(-score.score, score.type, score.targetId, score.sourceId, score.data);
        this.scores.push(targetScore);
    }
    sumScores() {
        return _.sumBy(this.scores, 'score');
    }
    sumScoresByMultiple(baseScore) {
        let sum = baseScore;
        _.forEach(this.scores, function (v) {
            sum *= v.score;
        });
        return sum;
    }
    sumPositiveScores() {
        let filterScores = _.filter(this.scores, function (v) { return v.score > 0; });
        return _.sumBy(filterScores, 'score');
    }
    sumNegativeScores() {
        let filterScores = _.filter(this.scores, function (v) { return v.score < 0; });
        return _.sumBy(filterScores, 'score');
    }
    sumScoresByType(type) {
        return _.sumBy(this.scores, function (v) {
            if (v.type == type) {
                return v.score;
            }
            return 0;
        });
    }
    removeScoresByTypes(types) {
        return _.filter(this.scores, function (v) {
            return !_.includes(types, v.type);
        });
    }
    removePositiveScoresByType(type) {
        return _.filter(this.scores, function (v) {
            return (v.type != type && v.score > 0);
        });
    }
    removeNegativeScoresByType(type) {
        return _.filter(this.scores, function (v) {
            return (v.type != type && v.score < 0);
        });
    }
    rejectScores(condition) {
        return _.reject(this.scores, condition);
    }
    updateScoresZero(condition) {
        _.forEach(this.scores, function (v) {
            if (_.isMatch(v, condition)) {
                v.score = 0;
            }
        });
    }
    existScoreType(type) {
        return _.find(this.scores, { 'type': type }) != undefined;
    }
}
exports.ScoreManage = ScoreManage;
