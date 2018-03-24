"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const math = require("mathjs");
const MJComboAPI_1 = require("../mjapi/combo/MJComboAPI");
class MJCombo {
    constructor(data) {
        this.name = data.name;
        if (!_.isEmpty(data.funcExpr)) {
            this.funcExpr = math.compile(data.funcExpr);
        }
        this.score = data.score;
    }
}
exports.MJCombo = MJCombo;
class MJComboManage {
    constructor(game, emitter, mjscoreManage, comboList, comboMode) {
        this.game = game;
        this.emitter = emitter;
        this.mjscoreManage = mjscoreManage;
        this.comboMode = 'one';
        this.comboList = new Array();
        if (comboMode == 'one' || comboMode == 'all') {
            this.comboMode = comboMode;
        }
        _.forEach(comboList, (v) => {
            this.comboList.push(new MJCombo(v));
        });
    }
    computeCombo(params) {
        const { game, curGamePlayer, scoreData, uids, gamePlayer, card } = params;
        let result = false;
        _.forEach(this.comboList, (v) => {
            if (v.funcExpr != undefined && _.isFunction(v.funcExpr.eval)) {
                const result1 = v.funcExpr.eval({ mjapi: MJComboAPI_1.mjapi, params });
                if (result1 > 0) {
                    for (let i = 0; i < result1; i++) {
                        console.log(">>牌形加分   .0" + v.name);
                        let cloneScoreData = _.cloneDeep(scoreData);
                        cloneScoreData.name = v.name;
                        cloneScoreData.value = v.score;
                        this.mjscoreManage.addScore(curGamePlayer, cloneScoreData, uids);
                    }
                    result = result1 > 0 ? true : false;
                    if (this.comboMode == 'one') {
                        return false;
                    }
                }
            }
        });
        return result;
    }
    computeComboV2(params) {
        let result = {};
        _.forEach(this.comboList, (v) => {
            if (v.funcExpr != undefined && _.isFunction(v.funcExpr.eval)) {
                const result1 = v.funcExpr.eval({ mjapi: MJComboAPI_1.mjapi, params });
                // 每个牌型
                let combo = _.cloneDeep(v);
                combo.result = result1;
                result[v.name] = combo;
            }
        });
        return result;
    }
    calcCombo(gamePlayer) {
        // 在结算时才会调用，gamePlayer必须是胡牌的人，可以多人胡牌
        if (gamePlayer.huCode == -1) {
            return {};
        }
        const uids = _.map(this.game.getCurrentHandles(), 'uid');
        const curGamePlayer = this.game.getCurrGamePlayer();
        let params = { game: this.game, curGamePlayer, scoreData: null, uids, gamePlayer, card: gamePlayer.huCode };
        return this.computeComboV2(params);
    }
}
exports.MJComboManage = MJComboManage;
