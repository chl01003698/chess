import { EventEmitter2 } from 'eventemitter2'
import * as _ from 'lodash'
import { DissolveState } from './friendGame';
import { PokerCard } from './poker/pokerAlgo/pokerAlgo';

export default class GamePlayer {
  uid: string = ''
  watcher: boolean = false
  robot: boolean = false

  score: number = 0
  initScore: number = 0
  roundScore: number = 0

  winCount: number = 0
  loseCount: number = 0
  drawCount: number = 0
  cards: Array<PokerCard | number> = []
  dissolveState: DissolveState = DissolveState.None
  joined: boolean = false
  
  constructor(private app, public user: any, public userInfo: object, public index: number = -1, watcher: boolean = false, robot: boolean = false) {
    this.uid = user.id
  }

  reset() {
    this.roundScore = 0
  }

  clientInfo(needEntire = false) {
    const clientInfo = _.pick(this.user, ['id', 'shortId', 'nickname', 'isGuest', 'sex', 'headimgurl', 'count', 'signature','loc'])
    clientInfo.index = this.index;
    clientInfo.watcher = this.watcher
    clientInfo.ip = this.userInfo["ip"];
    return clientInfo
  }

  updateWinOrLose() {
    if (this.roundScore > 0) {
      ++this.winCount
    } else if (this.roundScore == 0) {
      ++this.drawCount
    } else if (this.roundScore < 0) {
      ++this.loseCount
    }
  }

  changeScoreSafe(score: number) {
    if (score < 0) {
      score = -_.min([this.score, Math.abs(score)])
    }
    this.score += score
    return score
  }
}