import { MJScoreData, MJScoreManage } from './MJScoreManage';
import * as _ from 'lodash'
import * as math from 'mathjs'
import * as Bottle from 'bottlejs';
import Game from "../../game";
import { EventEmitter2 } from 'eventemitter2';
import { mjapi } from '../mjapi/rule/MJRuleAPI';

export class MJConvert {
  constructor(data: any) {
    this.name = data.name
    this.type = data.type
    this.desc = data.desc
    this.sourceName = data.sourceName
    this.toTargetName = data.toTargetName
  }
  name: string
  desc:string
  type:string
  sourceName:string
  toTargetName:string
}

export class MJCheck {
  constructor(data: any) {
    this.name = data.name
    if (!_.isEmpty(data.funcExpr)) {
      this.funcExpr = math.compile(data.funcExpr)
    }
    this.score = data.score
    this.type = data.type
    this.desc = data.desc
  }
  name:string
  desc:string
  type:string
  funcExpr: string | Array<string>
  score: number
}

export class MJRuleManage {

  ruleList: Array<MJConvert | MJCheck> = new Array<MJConvert | MJCheck>()
  conventMap:Map<string,string> = new Map<string,string>();
  constructor(private game: Game, private emitter: EventEmitter2, private mjscoreManage: MJScoreManage, ruleList: Array<any>) {
    _.forEach(ruleList, (v) => {
      if(v.type == "convent"){
        this.ruleList.push(new MJConvert(v))
      }else if(v.type = "check")
        this.ruleList.push(new MJCheck(v))
    })
  }

  checkRule(params): boolean {
    const {game, curGamePlayer, scoreData, uids, gamePlayer,card } = params
    let result = false
    _.forEach(this.ruleList, (v) => {
      if (v.type == "convent"){
        console.log(">>规则convent   .0" + v.desc)
        if(this.conventMap.has(v.sourceName) === false){
          this.conventMap.set(v.sourceName,v.toTargetName);
        }
      }
      else if (v.type == "check" && v.funcExpr != undefined && _.isFunction(v.funcExpr.eval)) {
        const result1:number = v.funcExpr.eval({mjapi, params})
        if (result1 > 0) {
          for(let i = 0 ;i < result1;i++){
            console.log(">>规则加分   .0" + v.desc)
            let cloneScoreData:MJScoreData = _.cloneDeep(scoreData)
            cloneScoreData.name = v.name
            cloneScoreData.value = v.score
            this.mjscoreManage.addScore(curGamePlayer,cloneScoreData , uids)
          }
          result = result1 > 0 ? true:false
        }
      }
    })
    return result
  }
}