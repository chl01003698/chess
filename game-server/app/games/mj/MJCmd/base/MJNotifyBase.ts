import MJGamePlayer from "../../MJGamePlayer";
import {BestMjRecord} from '../base/MJCmd';
import {MJCostType} from '../../consts/MJEnum';


export default class MJNotifyBase{
  //是否流局
  static getIsdraw(game:any):boolean{
    return false;
  }
  static getBanker(game:any):number{
    return game.m_banker;
  }
  static getRoomID(game:any):string{
    return  game.roomId;
  }
  static getGamePlayers(game:any):Array<MJGamePlayer>{
    return game.gamePlayers;
  }
  static getCurrentRound(game:any):number{
    return game.currentRound;
  }
  static getPlayerDianPaoCount(player:MJGamePlayer):number{
    let num:number = 0;
    for(let i = 0; i < player.settleScoresCache.playerDianPaoList.length;i++){
      if(player.settleScoresCache.playerDianPaoList[i] === true){
        num++;
      }
    }
    return num;
  }
  static getPlayerZiMoCount(player:MJGamePlayer):number{
    let num:number = 0;
    for(let i = 0; i < player.settleScoresCache.playerZiMoList.length;i++){
      if(player.settleScoresCache.playerZiMoList[i] === true){
        num++;
      }
    }
    return num;
  }


  static getPlayerOptimalRecord(player:MJGamePlayer):BestMjRecord{
    return player.settleScoresCache.playerPersonalBest
  }
  static getPlayerDianPaoList(player:MJGamePlayer):Array<boolean>{
    return player.settleScoresCache.playerDianPaoList;
  }
  static getPlayerScoreList(player:MJGamePlayer):Array<number>{
    return player.settleScoresCache.playerScoreList;
  }
  static getPlayerHuSeatIDList(game:any):Array<number>{
    return [];
  }
  static getPlayerTopScore(player:MJGamePlayer):number{
    return player.settleScoresCache.playerTopScore;
  }
  static getTotalScore(player:MJGamePlayer):number{
    let totalScore:number = 0;
    for(let i  = 0;i < this.getPlayerScoreList(player).length;i++){
      totalScore += this.getPlayerScoreList(player)[i];
    }
    return totalScore;
  }
  static getCostTypeAndNum(game:any){
    return [MJCostType.OpenCost,1];
  }
  //大赢家
  static getBigWinner(player:MJGamePlayer){
    return player.settleScoresCache.playerBigWinner;
  }
  static getZiMo(player:MJGamePlayer):boolean{
    return false;
  }
  static getDianPao(player:MJGamePlayer):boolean{
    return false;
  }
  static getGangList(player:MJGamePlayer):Array<number>{
    return [];
  }
  static getChiList(player:MJGamePlayer):Array<number>{
    return [];
  }
  static getPengList(player:MJGamePlayer):Array<number>{
    return [];
  }
  static isHu(player:MJGamePlayer){
    return false;
  }
//******************************************************************** */

  static setPlayerZiMoList(player:MJGamePlayer,index:number,b:boolean){
    if(player.settleScoresCache.playerZiMoList.length >index -1){
      player.settleScoresCache.playerZiMoList[index] = b;
    }else if(player.settleScoresCache.playerZiMoList.length == index -1){
      player.settleScoresCache.playerZiMoList.push(b);
    }
  }

  static setPlayerDianPaoList(player:MJGamePlayer,index:number,b:boolean){
    if(player.settleScoresCache.playerDianPaoList.length >index -1){
      player.settleScoresCache.playerDianPaoList[index] = b;
    }else if(player.settleScoresCache.playerDianPaoList.length == index -1){
      player.settleScoresCache.playerDianPaoList.push(b);
    }
  }

  static setPlayerBigWinner(player:MJGamePlayer,b:boolean){
    // playerBigWinner:boolean
    player.settleScoresCache.playerBigWinner = b;
  }

  static setPersonalBest(player:MJGamePlayer,info:BestMjRecord){
    //玩家最佳牌形  
    player.settleScoresCache.playerPersonalBest = info;
  }
  static setPlayerChengBao(){
    //playerChengBao:Array<boolean>
  }
  static setPlayerScoreList(player:MJGamePlayer,index:number,score:number){
    if(player.settleScoresCache.playerScoreList.length >index -1){
      player.settleScoresCache.playerScoreList[index] = score;
    }else if(player.settleScoresCache.playerScoreList.length == index -1){
      player.settleScoresCache.playerScoreList.push(score);
    }
  }
  static setPlayerHuSeatIDList(game:any){
    return [];
  }
  static setPlayerTopScore(player:MJGamePlayer,score:number):boolean{
    if(this.getPlayerTopScore(player) < score){
        player.settleScoresCache.playerTopScore = score;
        return true;
    }
    return false;
  }
}