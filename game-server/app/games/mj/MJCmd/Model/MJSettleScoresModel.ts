import * as mjCmd from '../base/MJCmd';
export default class MJSettleScoresModel{
  playerZiMoList:Array<boolean>
  playerDianPaoList:Array<boolean>
  playerChengBao:Array<boolean>
  playerScoreList:Array<number>
  playerBigWinner:boolean
  playerPersonalBest:mjCmd.BestMjRecord;       //玩家最佳牌形
  playerTopScore:number;                       //玩家最高得分
  constructor() {
    this.playerZiMoList = new Array<boolean>();         //记录每一局是否自摸
    this.playerDianPaoList = new Array<boolean>();      //记录每一局是否点炮
    this.playerChengBao= new Array<boolean>();          //记录第一局是否承包
    this.playerScoreList = new Array<number>();         //记录每一局得分-（累加后得出总分）
    this.playerBigWinner = false;                       //大赢家
    this.playerTopScore = -1;                           
  }
}