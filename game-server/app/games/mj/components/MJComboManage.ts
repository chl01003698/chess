import { MJScoreData, MJScoreManage } from './MJScoreManage';
import * as _ from 'lodash'
import * as math from 'mathjs'
import * as Bottle from 'bottlejs';
import Game from "../../game";
import { EventEmitter2 } from 'eventemitter2';
import { mjapi } from '../mjapi/combo/MJComboAPI';

export class MJCombo {
  constructor(data: any) {
    this.name = data.name
    if (!_.isEmpty(data.funcExpr)) {
      this.funcExpr = math.compile(data.funcExpr)
    }
    this.score = data.score
  }
  name: string
  funcExpr: string | Array<string>
  score: number
}

export class MJComboManage {
  comboMode: string = 'one'
  comboList: Array<MJCombo> = new Array<MJCombo>()

  constructor(private game: Game, private emitter: EventEmitter2, private mjscoreManage: MJScoreManage, comboList: Array<any>, comboMode?: string) {
    if (comboMode == 'one' || comboMode == 'all') {
      this.comboMode = comboMode
    }
    _.forEach(comboList, (v) => {
      this.comboList.push(new MJCombo(v))
    })
  }

  computeCombo(params): boolean {
    const {game, curGamePlayer, scoreData, uids, gamePlayer,card } = params
    let result = false
    _.forEach(this.comboList, (v) => {
      if (v.funcExpr != undefined && _.isFunction(v.funcExpr.eval)) {
        const result1:number = v.funcExpr.eval({mjapi, params})
        if (result1 > 0) {
          for(let i = 0 ;i < result1;i++){
            console.log(">>牌形加分   .0" + v.name)
            let cloneScoreData:MJScoreData = _.cloneDeep(scoreData)
            cloneScoreData.name = v.name
            cloneScoreData.value = v.score
            this.mjscoreManage.addScore(curGamePlayer,cloneScoreData , uids)
          }
          result = result1 > 0 ? true:false
          if (this.comboMode == 'one') {
            return false
          }
        }
      }
    })
    return result
  }

	computeComboV2(params){
    let result = {}
    _.forEach(this.comboList, (v) => {
      if (v.funcExpr != undefined && _.isFunction(v.funcExpr.eval)) {
        const result1:number = v.funcExpr.eval({mjapi, params})
				// 每个牌型
				let combo = _.cloneDeep(v)
				combo.result = result1
				result[v.name] = combo
      }
    })

		return result
	}

	calcCombo(gamePlayer: MJGamePlayer){
		// 在结算时才会调用，gamePlayer必须是胡牌的人，可以多人胡牌
		if(gamePlayer.huCode == -1){
			return {}
		}
		
		const uids = _.map(this.game.getCurrentHandles(), 'uid')
		const curGamePlayer = this.game.getCurrGamePlayer()
		let params = {game:this.game, curGamePlayer, scoreData: null, uids, gamePlayer, card:gamePlayer.huCode}
		return this.computeComboV2(params)
	}
}
