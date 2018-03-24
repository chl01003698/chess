"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const math = require("mathjs");
const MJFormulaAPI_1 = require("../mjapi/formula/MJFormulaAPI");
class MJFormulaManage {
    constructor(game, mjscoreManage, score) {
        this.game = game;
        this.mjscoreManage = mjscoreManage;
        this.formulaExprs = new Map();
        this.formula = score.formula;
        const formulas = score.formulas;
        _.forEach(formulas, (v, k) => {
            if (!_.isEmpty(v)) {
                this.formulaExprs.set(k, math.compile(v));
            }
        });
    }
    // 听口的分数，没有triggerPlayer，那么triggerPlayer传空
    preCalcScoreByPlayer(gamePlayer, triggerPlayer, card) {
        const formulaExpr = this.formulaExprs.get("pre");
        if (formulaExpr) {
            return formulaExpr.eval({ mjapi: MJFormulaAPI_1.mjapi, params: { game: this.game, mjscoreManage: this.mjscoreManage, gamePlayer, triggerPlayer, card } });
        }
        return 0;
    }
    calculateScoresByPlayer(gamePlayer) {
        let result = {};
        const formulaExpr = this.formulaExprs.get(this.formula);
        if (formulaExpr != undefined) {
            result = formulaExpr.eval({ mjapi: MJFormulaAPI_1.mjapi, params: { game: this.game, mjscoreManage: this.mjscoreManage, gamePlayer: gamePlayer } });
        }
        return result;
    }
    calculateScores(gamePlayers) {
        const results = {};
        const formulaExpr = this.formulaExprs.get(this.formula);
        if (formulaExpr != undefined) {
            _.forEach(gamePlayers, (v) => {
                results[v.uid] = formulaExpr.eval({ mjapi: MJFormulaAPI_1.mjapi, params: { game: this.game, mjscoreManage: this.mjscoreManage, gamePlayer: v } });
            });
        }
        return results;
    }
}
exports.MJFormulaManage = MJFormulaManage;
