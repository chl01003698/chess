import Game from '../../game';
import MJGamePlayer from '../MJGamePlayer';
import * as _ from 'lodash'

export interface MJScoreData {
  type: string
  scope: string
  value: number
  tag: string
  name: string
}

export class MJScore {
  uid: string
  targetIds: Array<string>
  scoreData: MJScoreData

  constructor(uid: string, scoreData: MJScoreData, targetIds: Array<string>) {
    this.uid = uid
    this.targetIds = targetIds
    this.scoreData = scoreData
  }
}

export class MJScoreV2{
  uid: string
  triggerUid: string
  type: string
	data

	constructor(params){
		this.uid = params.uid
		this.triggerUid = params.triggerUid
		this.type = params.type
		this.data = params.data
	}
}

export class MJScoreManage {
  scores = new Array<MJScore>()
	scoresV2 = new Array<MJScoreV2>()
	
  game: Game

	constructor(mjGame:Game){
    this.game = mjGame;
  }
	
  addScore(gamePlayer: MJGamePlayer, scoreData: MJScoreData, targetIds?: Array<string>) {
    const uids = this.getScopeUids(scoreData.scope, gamePlayer, targetIds)
    if (!_.isEmpty(uids)) {
      console.log("______________________________________________________________________________")
      console.log(uids);
      console.log(scoreData);
      console.log(targetIds);
      this.scores.push(new MJScore(gamePlayer.uid, scoreData, uids))
    }
  }

	addScoreV2(params){
		this.scoresV2.push(new MJScoreV2(params))
	}

	filterScoreByType(type: string){
		return _.filter(this.scoresV2, (v)=>{ return v.type == type })
	}
	
  groupByType(type: string) {
    return _.groupBy(this.scores, 'type')
  }

  groupByTag(tag: string) {
    return _.groupBy(this.scores, 'tag')
  }

  groupByName(name: string) {
    return _.groupBy(this.scores, (v)=>{
      return v.scoreData.name == name})
  }

  groupByTypeAndTag(type: string, tag: string) {
    return _.groupBy(this.scores, (v) => {
      return v.type == type && v.tag == tag
    })
  }

  addByScores(scores: Array<MJScore>, baseScore = 0) {
    const value = _.reduce(scores, (sum, v) => {
      return sum + v.value;
    }, baseScore);
    return {
      value,
      scores
    }
  }

  multiplyByScores(scores: Array<MJScore>, baseScore = 1) {
    const value = _.reduce(scores, (sum, v) => {
      return sum * v.value;
    }, baseScore);
    return {
      value,
      scores
    }
  }

  maxByScores(scores: Array<MJScore>) {
    const maxScore = _.maxBy(scores, (v) => {
      return v.value
    })
    return {
      value: maxScore.value,
      scores: [maxScore]
    }
  }

  powByScores(scores: Array<MJScore>, baseScore = 2) {
    const y = _.sumBy(scores, 'value')
    const value = Math.pow(baseScore, y)
    return {
      value,
      scores
    }
  }

  filterScoresByUid(uid: string) {
    return _.filter(this.scores, (v) => {
      return v.uid == uid || _.includes(v.targetIds, uid)
    })
  }

  filterWinScoresByUid(uid: string) {
    return _.filter(this.scores, (v) => {
      return (v.uid == uid && v.type == 'in') || (_.includes(v.targetIds, uid) && v.type == 'out')
    })
  }

  filterLoseScoresByUid(uid: string) {
    return _.filter(this.scores, (v) => {
      return (v.uid == uid && v.type == 'out') || (_.includes(v.targetIds, uid) && v.type == 'in')
    })
  }

  getScopeUids(scope: string, gamePlayer: MJGamePlayer, targetIds?: Array<string>): Array<string> {
    const game = this.game
    let uids: Array<string> = []
    if (scope == 'one' && !_.isEmpty(targetIds)) {
      uids = targetIds!
    } else if (scope == 'all') {
      uids = _.filter(game.gamePlayers, (v) => {
        return v.uid != gamePlayer.uid
      })

      uids = _.map(uids, 'uid')
    }
    return uids
  }

	// huCard: currentHandles[0].getCard() 抢杠胡
	// huCard: game.currentCard.card 自摸，点炮
	preCalcComboScore(gamePlayer:MJGamePlayer, huCard:number){
		const uids = _.map(this.game.getCurrentHandles(), 'uid')
		const curGamePlayer = this.game.getCurrGamePlayer()
		let params = {game:this.game, curGamePlayer, scoreData: null, uids, gamePlayer, card:huCard}
		return this.game.container.mjcomboManage.computeComboV2(params)		
	}	
}
