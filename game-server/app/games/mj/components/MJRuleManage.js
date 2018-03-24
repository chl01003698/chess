"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const math = require("mathjs");
const MJRuleAPI_1 = require("../mjapi/rule/MJRuleAPI");
class MJConvert {
    constructor(data) {
        this.name = data.name;
        this.type = data.type;
        this.desc = data.desc;
        this.sourceName = data.sourceName;
        this.toTargetName = data.toTargetName;
    }
}
exports.MJConvert = MJConvert;
class MJCheck {
    constructor(data) {
        this.name = data.name;
        if (!_.isEmpty(data.funcExpr)) {
            this.funcExpr = math.compile(data.funcExpr);
        }
        this.score = data.score;
        this.type = data.type;
        this.desc = data.desc;
    }
}
exports.MJCheck = MJCheck;
class MJRuleManage {
    constructor(game, emitter, mjscoreManage, ruleList) {
        this.game = game;
        this.emitter = emitter;
        this.mjscoreManage = mjscoreManage;
        this.ruleList = new Array();
        this.conventMap = new Map();
        _.forEach(ruleList, (v) => {
            if (v.type == "convent") {
                this.ruleList.push(new MJConvert(v));
            }
            else if (v.type = "check")
                this.ruleList.push(new MJCheck(v));
        });
    }
    checkRule(params) {
        const { game, curGamePlayer, scoreData, uids, gamePlayer, card } = params;
        let result = false;
        _.forEach(this.ruleList, (v) => {
            if (v.type == "convent") {
                console.log(">>规则convent   .0" + v.desc);
                if (this.conventMap.has(v.sourceName) === false) {
                    this.conventMap.set(v.sourceName, v.toTargetName);
                }
            }
            else if (v.type == "check" && v.funcExpr != undefined && _.isFunction(v.funcExpr.eval)) {
                const result1 = v.funcExpr.eval({ mjapi: MJRuleAPI_1.mjapi, params });
                if (result1 > 0) {
                    for (let i = 0; i < result1; i++) {
                        console.log(">>规则加分   .0" + v.desc);
                        let cloneScoreData = _.cloneDeep(scoreData);
                        cloneScoreData.name = v.name;
                        cloneScoreData.value = v.score;
                        this.mjscoreManage.addScore(curGamePlayer, cloneScoreData, uids);
                    }
                    result = result1 > 0 ? true : false;
                }
            }
        });
        return result;
    }
}
exports.MJRuleManage = MJRuleManage;
