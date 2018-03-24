import GamePlayer from '../gamePlayer';
import * as _ from 'lodash'
import { MJCardGroupManage } from './components/MJCardGroupManage';
import MJSettleScoresModel from './MJCmd/Model/MJSettleScoresModel'
export default class MJGamePlayer extends GamePlayer {
  inputCards: Array<number> = []
  initCards: Array<number> = []
  seriesGangCount: number = 0

  over: boolean = false

	huCode: number = -1
  huCount: number = 0
  inputCount: number = 0
  cardGroupManage: MJCardGroupManage
  canHu: boolean = true
  comboCache:Map<string,number>;
  settleScoresCache:MJSettleScoresModel
	constructor(app, user: any, userInfo: object, index: number = -1, watcher: boolean = false, robot: boolean = false) {
    super(app, user, userInfo, index, watcher, robot)
    this.cardGroupManage = new MJCardGroupManage()
    this.comboCache = new Map<string,number>();
    this.settleScoresCache = new MJSettleScoresModel();
  }

  clientInfo(needEntire = false) {
    let result = super.clientInfo(needEntire)
    return result
  }

  reset() {
    super.reset()
    this.inputCards = []
    this.initCards = []
    this.seriesGangCount = 0
    this.huCount = 0
		this.huCode = -1
    this.inputCount = 0
    this.cardGroupManage.clear()
    this.canHu = true
    this.comboCache.clear();
  }

  inputCard(card: number) {
    let index = _.indexOf(this.cards, card)
    if (index != -1) {
      this.inputCards.push(this.cards[index] as number)
      this.cards.splice(index, 1)
      ++this.inputCount
      return true
    }
    return false
  }

  pushCard(card: number) {
    this.cards.push(card)
  }

  hasCard(card: number){
    console.log("this.cards")
    console.log(this.cards)
    console.log(card)

    return _.indexOf(this.cards, card)!=-1
  }

  getCardsFullCount() {
    return this.cards.length
  }
  
  popInputCard(): number {
    return this.inputCards.pop() as number
  }

  onOutput() {
    this.canHu = true
  }

  incrHuCount() {
    ++this.huCount
  }
}
