import * as _ from 'lodash';

import MJGamePlayer from '../MJGamePlayer';
import {MJScoreManage} from '../components/MJScoreManage'
import {MJScore} from '../components/MJScoreManage'
export class ShowItem
{
  winID:number;
  showType:number;
}
export class ScoreData
{
  score:number;
  clientShowList:Array<Array<ShowItem>> ;
}

export class ScoreDataBase
{
  static getComboScoreByName(name:string,game:any,mjScoreManage:MJScoreManage,index:number)
  {
    let tempScores:Array<MJScore> = _.filter(mjScoreManage.scores, (v)=>{ return v.scoreData.name == name })
    // for(let i = 0 ; i < mjScoreManage.scores.length;i++)
    // {
    //   console.log("分项数据"  +  mjScoreManage.scores[i].scoreData.name);
    // }
 
    let num = 0;let value:number = 0;
    if(tempScores.length > 0){
      //console.log("牌形 -->" + name + "  " + tempScores[0].targetIds);
       let targetIds:Array<string> = tempScores[0].targetIds;
      _.forEach(targetIds, (uid)=>{
        console.log("牌形 -->" + name + "  [" + tempScores[0].scoreData.value + "]")
        let idx = game.findPlayerByUid(uid).index
        console.log("赢家" + index + "   " + idx);
        if(index == idx){
          num++; 
          value = tempScores[0].scoreData.value
        }
      })
      return num
    }
    return 0;
  }

  static getEventScoreByName(name:string,game:any,mjScoreManage:MJScoreManage,index:number){
    if(index === -1) return 0;
    let tempScores = _.filter(mjScoreManage.scores, (v)=>{ return v.scoreData.name == name })
    let num = 0;
    if(tempScores.length > 0){
      for(let i = 0; i < tempScores.length;i++){
        _.forEach(tempScores[i].targetIds, (uid)=>{
          let idx = game.findPlayerByUid(uid).index  
          if(index == idx){
            num += tempScores.value; 
          }
        })
      }
      return num
    }
    return 0;
  }

  static getEventScoreByTrigerIndex(name:string,game:any,mjScoreManage:MJScoreManage,index:number){
    if(index === -1) return 0;
    let tempScores = _.filter(mjScoreManage.scores, (v)=>{ return v.scoreData.name == name })
    let num = 0;
    if(tempScores.length > 0){
      for(let i = 0; i < tempScores.length;i++){
          let idx = game.findPlayerByUid(tempScores[i].uid).index  
          if(index == idx){
            num += tempScores[i].scoreData.value; 
          }
      }
      return num
    }
    return 0;
  }
  static getWinners(game:any)
  {
    console.log("获取赢家index");
    // console.log(game.mjScoreManage);

    let scoreManage = game.container.mjscoreManage as MJScoreManage
    
    let filterZimo = _.filter(scoreManage.scores, (v)=>{ return v.scoreData.name == "zimo" })
    let filterDianPao = _.filter(scoreManage.scores, (v)=>{ return v.scoreData.name == "dianpao" })
    console.log(filterZimo);
    console.log(filterDianPao);
    if(filterZimo.length > 0){
      let uid = filterZimo[0].targetIds[0]
      let idx = game.findPlayerByUid(uid).index
      return [idx, -1, -1]
    }

    if(filterDianPao.length > 0){
      let result:Array<number> = []
      _.forEach(filterDianPao[0].targetIds, (uid)=>{
        let idx = game.findPlayerByUid(uid).index  
        result.push(idx)
      })
      if(result.length < 3){
        for(var i = 0; i < 3 - result.length;i++){
          result.push(-1)
        }
      }
      return result
    }
    return [-1,-1,-1];
  }
  static getDianPaoShouNum(game:any){
    return 1;
  }
  static getloses(game:any)
  {
    let scoreManage = game.container.mjscoreManage as MJScoreManage


    console.log("获取输家index");
    let result:Array<number> = []
    let index1:number,index2:number,index3:number;
    [index1,index2,index3] = this.getWinners(game);

    let filterIndexs = _.filter( [index1,index2,index3], (v)=>{ return v > -1 })
    for(let i = 0; i < game.gamePlayers.length; i++){
      if(_.indexOf(filterIndexs,i) === -1){
        result.push(i);
      }
    }
    if(result.length < 3){
      for(var i = 0; i < 3 - result.length;i++){
        result.push(-1)
      }
    }


    let num = this.getDianPaoShouNum(game);
    if(num === 1){
      for(let index of result){
        if(this.getEventScoreByTrigerIndex("dianpao",game,scoreManage,index)){
          return [index,-1,-1]
        }
      }
    return [-1, -1, -1];
    }
    
    return result;
  }
  static getValidCount(playerIndexs:Array<number>):number
  {
    let num = 0;
    for(let i = 0 ; i < playerIndexs.length ;i++){
      if(playerIndexs[i] > -1){
        num++;
      }
    }
    return num;
  }
  static getGang(game:any,mjScoreManage:MJScoreManage, index:number):number{

    return 0;
  }
  static getSaoDiHu(game:any,mjScoreManage:MJScoreManage,index:number){
    return 0;
  }
  static getHaiDiPao(game:any,mjScoreManage:MJScoreManage,index:number){
    return 0;
  }
  static getQiangGangHu(game:any,mjScoreManage:MJScoreManage,index:number){
    return 0;
  }
  static getGangHouPao(game:any,mjScoreManage:MJScoreManage,index:number){
    return 0;
  }
  static getGangShangHua(game:any,mjScoreManage:MJScoreManage,index:number){
    return this.getEventScoreByName("gangShangHua",game,mjScoreManage,index);
  }
  static getDaDiaoChe(game:any,mjScoreManage:MJScoreManage,index:number){
    return this.getComboScoreByName("大吊车",game,mjScoreManage,index);
  }
  static getQueYiMen(game:any,mjScoreManage:MJScoreManage,index:number){
    return this.getComboScoreByName("缺一门",game,mjScoreManage,index);
  }

  static getQingYiSe(game:any,mjScoreManage:MJScoreManage,index:number){
    return this.getComboScoreByName("清一色",game,mjScoreManage,index);
  }
  static getQiDui(game:any,mjScoreManage:MJScoreManage,index:number){
    return this.getComboScoreByName("七对",game,mjScoreManage,index);
  }
  static getDuanYaoJiu(game:any,mjScoreManage:MJScoreManage,index:number){
    return this.getComboScoreByName("断幺九",game,mjScoreManage,index);
  }
  static getYiBanGao(game:any,mjScoreManage:MJScoreManage,index:number){
    return this.getComboScoreByName("一般高",game,mjScoreManage,index);
  }
  static getJiaWuXin(game:any,mjScoreManage:MJScoreManage,index:number){
    return this.getComboScoreByName("夹五心",game,mjScoreManage,index);
  }
  static getBaiPai(game:any,mjScoreManage:MJScoreManage,index:number){
    return 0;
  }
  static getPiao(game:any,mjScoreManage:MJScoreManage,index:number){

    return 0;
  }
  static initList(list:Array<Array<ShowItem>>,index_1:number,index_2:number = -1,index_3:number = -1){
    if(list != undefined){
      console.log("初使数组  信息！1");
      if(index_1 > -1){
        list[0] = new Array<ShowItem>();
      }
      if(index_2 > -1){
        list[1] = new Array<ShowItem>();
      }
      if(index_3 > -1){
        list[2] = new Array<ShowItem>();
      }
    }
    console.log("初使数组  信息！2");
    return list;
  }
  static addShowItem(showList:Array<ShowItem>,winID:number,showType:number){
    let item:ShowItem = new ShowItem;
    console.log("显示列表信息！2" + ShowItem + "  " + winID);
    item.winID = winID;
    item.showType = showType;
    showList.push(item);
  }

}