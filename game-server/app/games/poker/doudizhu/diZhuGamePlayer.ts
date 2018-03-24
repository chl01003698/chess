// import * as _ from 'lodash'
import PokerGamePlayer from '../pokerGamePlayer';
// import { DiZhuAlgo } from '../pokerAlgo/doudizhu/diZhuAlgo';
// import { SanRenDiZhuAlgo } from '../pokerAlgo/doudizhu/sanRenDiZhuAlgo';
// import { PokerCard, PokerAlgo } from '../pokerAlgo/pokerAlgo';


export default class DiZhuGamePlayer extends PokerGamePlayer {
  inputCount: number = 0;
  zhaDanCount: number = 0;
  side: number = 0;
  multiple: number = 1;
  identity: any = ""; //landlord  farmers
  state: any = ""; //状态
  isBrightBrand: boolean = false; //是否是明牌
  grabLandlord: boolean = true; //是否叫过地主 true 是  false 否
  kickPullMul: number = 1; //踢拉倍数
  isFlip: boolean = true; //是否翻拍 true 是 false 
  cardsStack: any = []; //打出去的手牌
  action: any = {};
  IsLandOwner: any = false;  //叫地主 true 叫地主
  gameStart: any = false;
  grabLandlordNum: any = 0;
  sendCard: number = 0;
  JiPaiQI: boolean = false // true 开启记牌器
  isFenDing: boolean = false;
  points: number = 0;
  tmpCards: any = [];
  isDouble: boolean = false;
  statistical: object = {
    grabLandlord: 1,   //抢地主倍数
    bomb: 1,          //炸弹
    spring: 1,        //春天
    brandCard: 1,     //明牌
    lowCard: 1,       //抓底
    friedBomb: 1,  //连炸
    tilagen: 1, //踢拉
    jiabei: 1, //加倍
    rockets:1, //火箭
  }
  isSpeack = false;
  bomb: number = 0;
  reset() {
    super.reset();
    this.inputCount = 0;
    this.zhaDanCount = 0;
    this.multiple = 1;
    this.identity = "";
    this.state = "";
    this.isBrightBrand = false;
    this.grabLandlord = true;
    this.kickPullMul = 1;
    this.isFlip = true;
    this.cardsStack = [];
    this.action = {};
    this.IsLandOwner = false;
    this.gameStart = false;
    this.grabLandlordNum = 0;
    this.sendCard = 0;
    this.JiPaiQI = false;
    this.bomb = 0;
    this.tmpCards = [];
    this.isFenDing = false;
    this.isDouble = false;
    this.isSpeack = false;
    this.statistical = {
      grabLandlord: 1,   //抢地主倍数
      bomb: 1,          //炸弹
      spring: 1,        //春天
      brandCard: 1,     //明牌
      lowCard: 1,       //抓底
      friedBomb: 1,  //连炸
      tilagen: 1, //踢拉 
      jiabei: 1, //加倍 
      rockets:1, //火箭
    }
    this.points = 0;
  }

  incrInputCount() {
    ++this.inputCount
  }

  clientInfo(needEntire = false) {
    let result = super.clientInfo(needEntire)
    result['zhaDanCount'] = this.zhaDanCount
    result.integral = this.score;
    result.multiple = this.multiple;
    return result
  }
}
