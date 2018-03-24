import MJGamePlayer from '../MJGamePlayer';
import { MJScoreManage } from './MJScoreManage';
import * as _ from 'lodash'
import * as math from 'mathjs'
import Game from '../../game';
import { mjapi } from '../mjapi/formula/MJFormulaAPI';
export class MJFormulaManage {
  formula: string
  formulaExprs = new Map<string, any>()

  constructor(private game: Game, private mjscoreManage: MJScoreManage, score: any) {
    this.formula = score.formula
    const formulas = score.formulas
    _.forEach(formulas, (v, k) => {
      if (!_.isEmpty(v)) {
        this.formulaExprs.set(k, math.compile(v))
      }
    })
  }

	// 听口的分数，没有triggerPlayer，那么triggerPlayer传空
	preCalcScoreByPlayer(gamePlayer:MJGamePlayer, triggerPlayer?:MJGamePlayer, card?:number){
    const formulaExpr = this.formulaExprs.get("pre")
		if(formulaExpr){
			return formulaExpr.eval({mjapi, params:{game:this.game, mjscoreManage: this.mjscoreManage, gamePlayer, triggerPlayer, card}})
		}
		return 0
	}
	
  calculateScoresByPlayer(gamePlayer:MJGamePlayer) {
    let result = { }
    const formulaExpr = this.formulaExprs.get(this.formula)
    if (formulaExpr != undefined) {
      result = formulaExpr.eval({mjapi, params: { game: this.game, mjscoreManage: this.mjscoreManage, gamePlayer: gamePlayer}})
    }
    return result
  }
  calculateScores(gamePlayers: Array<MJGamePlayer>) {
    const results = { }
    const formulaExpr = this.formulaExprs.get(this.formula)
    if (formulaExpr != undefined) {
      _.forEach(gamePlayers, (v: MJGamePlayer) => {
        results[v.uid] = formulaExpr.eval({mjapi, params: { game: this.game, mjscoreManage: this.mjscoreManage, gamePlayer: v}})
      })
    }
    return results
  }
}
