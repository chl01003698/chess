import * as _ from 'lodash'
import { observable, observe } from 'mobx';
import { EventEmitter2 } from 'eventemitter2'
import PokerGamePlayer from '../pokerGamePlayer';

export default class SanZhangGamePlayer extends PokerGamePlayer {
  @observable checked: boolean = false
  @observable giveup: boolean = false
  loser: boolean = false
  pkPlayers: Array<string> = []
  pkIndex: number = 0;
  action: any = {};
  addBets: any = [];
  emitter: EventEmitter2 = new EventEmitter2()
  disposers: Array<any> = []
  showCards: boolean = false; //看牌
  huopinAddBets: any[];
  menpai: any = 0;
  isMenPai: boolean = true;
  speckNum: number = 0;
  betNum: number = 0; //加注的数量
  huopin: boolean = false;  //true 发起火拼 
  chip: number = 0;
  thanCards: boolean = false; //比牌输的
  leave: boolean = false;
  brightBrand: boolean = false;
  cardsType: any = "";
  isSpeck: boolean = false; //是否说话
  LzCards: Array<string> = [];
  isLz: boolean = false;
  type: any = "";
  isRuan: boolean = false;
  isBiPai: boolean = false;
  reset() {
    super.reset()
    _.forEach(this.disposers, function (v) {
      if (_.isFunction(v)) {
        v()
      }
    })
    this.brightBrand = false;
    this.huopin = false;
    this.checked = false
    this.giveup = false
    this.loser = false
    this.pkIndex = 0
    this.pkPlayers = []
    this.action = {};
    this.addBets = [];
    this.showCards = false;
    this.huopinAddBets = [];
    this.menpai = 0;
    this.isMenPai = true;
    this.speckNum = 0;
    this.betNum = 0;  //加注的数量
    this.chip = 0;
    this.thanCards = false;
    this.leave = false;
    this.cardsType = "";
    this.LzCards = [];
    this.isSpeck = false;
    this.isLz = false;
    this.type = ""
    this.isRuan = false;
    this.cards = [];
    this.isBiPai = false;
  }

  bindKey(key: string, autoDisposer: boolean = true) {
    if (_.has(this, key)) {
      const disposer = observe(this, key, () => {
        this.emitter.emit('on' + _.upperFirst(key) + 'Changed', { uid: this.uid }, this)
        disposer()
      })
      if (!autoDisposer) {
        this.disposers.push(disposer)
      }
    }
  }

  clientInfo(needEntire = false) {
    return _.assign(_.pick(this, ['checked', 'giveup', 'loser']), super.clientInfo(needEntire))
  }

  getDeductScore(onceScore: number): number {
    return this.checked == false ? onceScore : onceScore * 2
  }
}
