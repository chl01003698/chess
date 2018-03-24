import * as Bottle from 'bottlejs';
import FriendGame from '../../friendGame';
import { MJScoreData, MJScoreManage } from './MJScoreManage';
import * as _ from 'lodash'
import * as math from 'mathjs'
import Game from '../../game';
import { EventEmitter2 } from 'eventemitter2';
import { mjapi } from '../mjapi/events/MJEventAPI';

class MJEvent {
  constructor(data: any) {
    this.name = data.name
    this.event = data.event
    this.time = data.time
    this.scoreData = data.score
    if (!_.isEmpty(data.filterExpr)) {
      this.filterExpr = math.compile(data.filterExpr)
    }

    if (!_.isEmpty(data.funcExpr)) {
      this.funcExpr = math.compile(data.funcExpr)
    }
  }

  name: string
  event: string
  filterExpr?
  time?: string
  //scoreData?: MJScoreData
	scoreData
  funcExpr?
}

export class MJEventManage {
  events: Array<MJEvent> = new Array<MJEvent>()
  handles = new Array<object>()
  constructor(private game: Game, private emitter: EventEmitter2, private mjscoreManage: MJScoreManage, events: Array<any>) {
    _.forEach(events, (v) => {
      this.events.push(new MJEvent(v))
    })
  }

  bindEvents() {
    _.forEach(this.events, (v: MJEvent) => {
        console.log("this.bindEvents 1")
        const on = _.defaultTo(v.time, 'on')
      const callback = (data, params) => {
        console.log("this.bindEvents 2")
        if (v.filterExpr != undefined && _.isFunction(v.filterExpr.eval)) {
          if (!v.filterExpr.eval({mjapi ,params})) return
        }
        if (v.scoreData != undefined) {
          console.log("增加事件分项",v.scoreData.name);
          this.mjscoreManage.addScore(params.curGamePlayer, v.scoreData, params.uids)
        } else if (v.funcExpr != undefined && _.isFunction(v.funcExpr.eval)) {
          v.funcExpr.eval({ mjapi, data, params })
        }
      }
      this.emitter[on](v.event, callback)
      this.handles.push({event: v.event, callback})
    })
  }

	// 所有事件判断重写
	calcEvents(params){
		let result = {}
		_.forEach(this.events, (v: MJEvent) => {			
      if (v.filterExpr != undefined && _.isFunction(v.filterExpr.eval)) {
        const data = v.filterExpr.eval({mjapi ,params})
				let v2 = _.cloneDeep(v)
				v2.result = data
				result[v2.name] = v2
      }
    })
		return result
	}
	
  reset() {
    _.forEach(this.handles, (v) => {
      this.emitter.removeListener(v.event, v.callback)
    })
  }
}
