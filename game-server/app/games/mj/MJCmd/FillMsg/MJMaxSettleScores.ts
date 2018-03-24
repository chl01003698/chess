//大结算填充
import * as MJCmd from '../base/MJCmd';
import  {MJMsgFillType} from '../base/MJCmd'
import NotifyBase from '../base/MJNotifyBase'
import MJGamePlayer from '../../MJGamePlayer';
import {MJCostType} from '../../consts/MJEnum';
import * as _ from 'lodash';
export default class MJMaxSettleScores {
  private player_:MJGamePlayer;
  private game_:any;
  constructor(game:any,Master:MJGamePlayer) {  
      this.player_ =   Master;    
      this.game_ = game;       
  }

  fillMsg(MJMsgType:MJMsgFillType,cmd:any){
    let info:MJCmd.MjGameOverNotify = cmd;
    info.titleinfo.push(this.fillMsgMjTitleInfo());//称号信息
    info.urinfo.push(this.fillMjUserCostInfo());//玩家扣卡及进入房间时间信息
  }

  fillMsgMjTitleInfo(){
    let info:MJCmd.MjTitleInfo = new MJCmd.MjTitleInfo();

    info.seatid=this.player_.index;//座位ID
    info.ntitle = this.fillTiteType();

    let myTotalScore:number = 0;
    let playerScoreList:Array<number> = NotifyBase.getPlayerScoreList(this.player_);
    for(let i = 0;i < playerScoreList.length;i++){
        myTotalScore += playerScoreList[i];
    }
    info.nscore=myTotalScore;//总分

    return info;

  }
  fillMjUserCostInfo(){
    let info:MJCmd.MjUserCostInfo = new MJCmd.MjUserCostInfo();
    info.seatid= this.player_.index;
    let costType:MJCostType;
    let costNum:number;
    [costType,costNum] = NotifyBase.getCostTypeAndNum(this.game_);
    if(costType === MJCostType.OpenCost){
      if(this.player_.index == 0){
          info.costticket = costNum;
      }
    }
    else if(costType === MJCostType.WinnerCost){
      if(NotifyBase.getBigWinner(this.player_) === true){
          info.costticket = costNum;
      }
    }
    info.joinroomtime=new Date().getTime() / 1000;
    return info;
  }

      //获取称号
  fillTiteType(){
    let ntitle:Array<MJCmd.MjTitleType> = new Array<MJCmd.MjTitleType>();
    let index:number = 0;
    let nZiMoMax:number = 0;
    let nDianPaoMax:number = 0;
    let nDaPaiWang:number = 0;
    let nDaYingJia:number = 0;
    let gamePlayers = NotifyBase.getGamePlayers(this.game_);
    for (let i = 0; i < gamePlayers.length; i++) {
      let player:MJGamePlayer = gamePlayers[i];
      if(player == undefined){
        continue;
      }
      //自摸王
      if(nZiMoMax == 0){
        nZiMoMax = NotifyBase.getPlayerZiMoCount(player);
      }
      else if(nZiMoMax < NotifyBase.getPlayerZiMoCount(player)){
        nZiMoMax = NotifyBase.getPlayerZiMoCount(player);
      }
      //点炮王
      if(nDianPaoMax == 0){
        nDianPaoMax = NotifyBase.getPlayerDianPaoCount(player);
      }
      else if(nDianPaoMax < NotifyBase.getPlayerDianPaoCount(player)){
        nDianPaoMax = NotifyBase.getPlayerDianPaoCount(player);
      }
      //大牌王
      if(nDaPaiWang == 0){
        nDaPaiWang = NotifyBase.getPlayerTopScore(player);
      }
      else if(nDaPaiWang < NotifyBase.getPlayerTopScore(player)){
        nDaPaiWang = NotifyBase.getPlayerTopScore(player);
      }
      //大赢家
      let totalScore:number = NotifyBase.getTotalScore(player);
      if(nDaYingJia == 0){
        nDaYingJia = totalScore;
      }
      else if(nDaYingJia < totalScore){
        nDaYingJia = totalScore;
      }
    }
    if(nZiMoMax > 0 &&  NotifyBase.getPlayerZiMoCount(this.player_) === nZiMoMax){
      ntitle.push(MJCmd.MjTitleType.ziMoWang);
    }
    if(nDianPaoMax > 0 && NotifyBase.getPlayerDianPaoCount(this.player_) === nDianPaoMax){
      ntitle.push(MJCmd.MjTitleType.dianPaoWang);
    }

    if(nDaPaiWang > 0 && NotifyBase.getPlayerTopScore(this.player_) === nDaPaiWang){
      ntitle.push(MJCmd.MjTitleType.daPaiWang);
    }
    let myTotalScore:number = NotifyBase.getTotalScore(this.player_);
    if(nDaYingJia > 0 && myTotalScore === nDaYingJia){
      NotifyBase.setPlayerBigWinner(this.player_,true);
      ntitle.push(MJCmd.MjTitleType.daYingJia);
    }
    return ntitle;
  }
}