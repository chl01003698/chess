import {ShowItem,ScoreData,ScoreDataBase} from '../../MJModel/MJFormulaModel'
import MJGamePlayer from '../../MJGamePlayer';
import {MJScoreManage} from '../../components/MJScoreManage'
export default class MJXZFormula {
  static getScore(params):ScoreData
  {
    let { game, mjscoreManage, gamePlayer} = params;
    let player:MJGamePlayer = gamePlayer as MJGamePlayer;
    //赢家
    let winindex1,winindex2,winindex3;
    [winindex1,winindex2,winindex3] = ScoreDataBase.getWinners(game);
    
    console.log("赢家" + winindex1 + "    " +winindex2 + "    " +winindex3)
   //输家
    let loseindex1,loseindex2,loseindex3;
    [loseindex1,loseindex2,loseindex3] = ScoreDataBase.getloses(game);
    console.log("输家" + loseindex1 + "    " +loseindex2 + "    " +loseindex3)

    let winnerCount:number = ScoreDataBase.getValidCount([winindex1,winindex2,winindex3]);
    let lostCount:number = ScoreDataBase.getValidCount([loseindex1,loseindex2,loseindex3]);

    console.log("赢家[%d]   输家[%d]" , winnerCount,lostCount)

    if(player.index == winindex1 || player.index == winindex2 || player.index == winindex3)
    {
        let scoreNum = 0;

        scoreNum += ScoreDataBase.getGang(game,mjscoreManage,player.index)  * lostCount;
        scoreNum += ScoreDataBase.getSaoDiHu(game,mjscoreManage,player.index)  * lostCount;
        scoreNum += ScoreDataBase.getHaiDiPao(game,mjscoreManage,player.index) * lostCount;
        scoreNum += ScoreDataBase.getQiangGangHu(game,mjscoreManage,player.index) *lostCount;
        scoreNum += ScoreDataBase.getGangHouPao(game,mjscoreManage,player.index)  *lostCount;
        scoreNum += ScoreDataBase.getGangShangHua(game,mjscoreManage,player.index) *lostCount;
        scoreNum += ScoreDataBase.getDaDiaoChe(game,mjscoreManage,player.index)  *lostCount;
        scoreNum += ScoreDataBase.getQueYiMen(game,mjscoreManage,player.index)  *lostCount;

        scoreNum += ScoreDataBase.getQingYiSe(game,mjscoreManage,player.index)  *lostCount;
        scoreNum += ScoreDataBase.getQiDui(game,mjscoreManage,player.index)  * lostCount;
        scoreNum += ScoreDataBase.getDuanYaoJiu(game,mjscoreManage,player.index)  *lostCount;
        scoreNum += ScoreDataBase.getYiBanGao(game,mjscoreManage,player.index)  *lostCount;
        scoreNum += ScoreDataBase.getJiaWuXin(game,mjscoreManage,player.index)  *lostCount;
        
        if(ScoreDataBase.getBaiPai(game,mjscoreManage,player.index) === 1)
        {
            scoreNum += ScoreDataBase.getBaiPai(game,mjscoreManage,player.index) * 7 * lostCount;
        }
        else
        {
            scoreNum += ScoreDataBase.getBaiPai(game,mjscoreManage,player.index)  * lostCount;
        }
        
        let piaoScore = 0;
        piaoScore += ScoreDataBase.getPiao(game,mjscoreManage,loseindex1);
        piaoScore += ScoreDataBase.getPiao(game,mjscoreManage,loseindex2);
        piaoScore += ScoreDataBase.getPiao(game,mjscoreManage,loseindex3);

        scoreNum += ScoreDataBase.getPiao(game,mjscoreManage,player.index) + piaoScore;

        let clientShowList = new Array(4);
        clientShowList = ScoreDataBase.initList(clientShowList,player.index);
        if(ScoreDataBase.getQingYiSe(game,mjscoreManage,player.index) > 0) 
        {
            ScoreDataBase.addShowItem(clientShowList[0],player.index,30086);
        }
        if(ScoreDataBase.getQingYiSe(game,mjscoreManage,player.index) > 0) 
        {
            ScoreDataBase.addShowItem(clientShowList[0],player.index,30038);
        }

        let info:ScoreData =new ScoreData;
        info.score = scoreNum;
        info.clientShowList = clientShowList;
        console.log(">>赢家得分[%d]" , info.score  );
        return info;
    }



    if(player.index == loseindex1 || player.index == loseindex2 || player.index == loseindex3)
    {

         let scoreNum = 0;

         scoreNum += ScoreDataBase.getGang(game,mjscoreManage,winindex1);
         scoreNum += ScoreDataBase.getSaoDiHu(game,mjscoreManage,winindex1) ;
         scoreNum += ScoreDataBase.getHaiDiPao(game,mjscoreManage,winindex1)  ;
         scoreNum >= ScoreDataBase.getQiangGangHu(game,mjscoreManage,winindex1)  
         scoreNum += ScoreDataBase.getGangHouPao(game,mjscoreManage,winindex1)  ;
         scoreNum += ScoreDataBase.getGangShangHua(game,mjscoreManage,winindex1)  ;
         scoreNum += ScoreDataBase.getDaDiaoChe(game,mjscoreManage,winindex1)  ;
         scoreNum += ScoreDataBase.getQueYiMen(game,mjscoreManage,winindex1)  ;
         scoreNum += ScoreDataBase.getQingYiSe(game,mjscoreManage,winindex1)  ;
         scoreNum += ScoreDataBase.getQiDui(game,mjscoreManage,winindex1)  ;
         scoreNum += ScoreDataBase.getDuanYaoJiu(game,mjscoreManage,winindex1) ;
         scoreNum += ScoreDataBase.getYiBanGao(game,mjscoreManage,winindex1) ;
         scoreNum += ScoreDataBase.getJiaWuXin(game,mjscoreManage,winindex1) ;

         if(ScoreDataBase.getBaiPai(game,mjscoreManage,winindex1) === 1)
         {
             scoreNum += ScoreDataBase.getBaiPai(game,mjscoreManage,winindex1) * 7 ;
         }
         else
         {
             scoreNum += ScoreDataBase.getBaiPai(game,mjscoreManage,winindex1)  ;
         }


         scoreNum += ScoreDataBase.getGang(game,mjscoreManage,winindex2)  ;
         scoreNum += ScoreDataBase.getSaoDiHu(game,mjscoreManage,winindex2) ;
         scoreNum += ScoreDataBase.getHaiDiPao(game,mjscoreManage,winindex2)  ;
         scoreNum += ScoreDataBase.getQiangGangHu(game,mjscoreManage,winindex2)  ;
         scoreNum += ScoreDataBase.getGangHouPao(game,mjscoreManage,winindex2)  ;
         scoreNum += ScoreDataBase.getGangShangHua(game,mjscoreManage,winindex2)  ;
         scoreNum += ScoreDataBase.getDaDiaoChe(game,mjscoreManage,winindex2)  ;
         scoreNum += ScoreDataBase.getQueYiMen(game,mjscoreManage,winindex2)  ;
         scoreNum += ScoreDataBase.getQingYiSe(game,mjscoreManage,winindex2)  ;
         scoreNum += ScoreDataBase.getQiDui(game,mjscoreManage,winindex2)  ;
         scoreNum += ScoreDataBase.getDuanYaoJiu(game,mjscoreManage,winindex2) ;
         scoreNum += ScoreDataBase.getYiBanGao(game,mjscoreManage,winindex2) ;
         scoreNum += ScoreDataBase.getJiaWuXin(game,mjscoreManage,winindex2) ;
         if(ScoreDataBase.getBaiPai(game,mjscoreManage,winindex2) === 1)
         {
             scoreNum += ScoreDataBase.getBaiPai(game,mjscoreManage,player.index) * 7 ;
         }
         else
         {
             scoreNum += ScoreDataBase.getBaiPai(game,mjscoreManage,winindex2)  ;
         }
         

         scoreNum += ScoreDataBase.getGang(game,mjscoreManage,winindex3)  ;
         scoreNum += ScoreDataBase.getSaoDiHu(game,mjscoreManage,winindex3) ;
         scoreNum += ScoreDataBase.getHaiDiPao(game,mjscoreManage,winindex3)  ;
         scoreNum += ScoreDataBase.getQiangGangHu(game,mjscoreManage,winindex3)  ;
         scoreNum += ScoreDataBase.getGangHouPao(game,mjscoreManage,winindex3)  ;
         scoreNum += ScoreDataBase.getGangShangHua(game,mjscoreManage,winindex3)  ;
         scoreNum += ScoreDataBase.getDaDiaoChe(game,mjscoreManage,winindex3)  ;
         scoreNum += ScoreDataBase.getQueYiMen(game,mjscoreManage,winindex3)  ;
         scoreNum += ScoreDataBase.getQingYiSe(game,mjscoreManage,winindex3)  ;
         scoreNum += ScoreDataBase.getQiDui(game,mjscoreManage,winindex3)  ;
         scoreNum += ScoreDataBase.getDuanYaoJiu(game,mjscoreManage,winindex3) ;
         scoreNum += ScoreDataBase.getYiBanGao(game,mjscoreManage,winindex3) ;
         scoreNum += ScoreDataBase.getJiaWuXin(game,mjscoreManage,winindex3)  ;

         if(ScoreDataBase.getBaiPai(game,mjscoreManage,winindex3) === 1)
         {
             scoreNum += ScoreDataBase.getBaiPai(game,mjscoreManage,winindex3) * 7 ;
         }
         else
         {
             scoreNum += ScoreDataBase.getBaiPai(game,mjscoreManage,winindex3)  ;
         }


         let piaoScore = 0;
         piaoScore += ScoreDataBase.getPiao(game,mjscoreManage,winindex1);
         piaoScore += ScoreDataBase.getPiao(game,mjscoreManage,winindex2);
         piaoScore += ScoreDataBase.getPiao(game,mjscoreManage,winindex3);
 
         scoreNum += ScoreDataBase.getPiao(game,mjscoreManage,player.index) * winnerCount + piaoScore;

        let clientShowList = new Array(4);
        clientShowList = ScoreDataBase.initList(clientShowList,winindex1,winindex2,winindex3);
        if(ScoreDataBase.getQingYiSe(game,mjscoreManage,winindex1) > 0) 
        {
            ScoreDataBase.addShowItem(clientShowList[0],winindex1,30086);
        }
        if(ScoreDataBase.getQingYiSe(game,mjscoreManage,winindex1) > 0) 
        {
            ScoreDataBase.addShowItem(clientShowList[0],winindex1,30038);
        }



        if(ScoreDataBase.getQingYiSe(game,mjscoreManage,winindex2) > 0) 
        {
            ScoreDataBase.addShowItem(clientShowList[1],winindex2,30086);
        }
        if(ScoreDataBase.getQingYiSe(game,mjscoreManage,winindex2) > 0) 
        {
            ScoreDataBase.addShowItem(clientShowList[1],winindex2,30038);
        }


        if(ScoreDataBase.getQingYiSe(game,mjscoreManage,winindex3) > 0) 
        {
            ScoreDataBase.addShowItem(clientShowList[2],winindex3,30086);
        }
        if(ScoreDataBase.getQingYiSe(game,mjscoreManage,winindex3) > 0) 
        {
            ScoreDataBase.addShowItem(clientShowList[2],winindex3,30038);
        }
        let info:ScoreData = new ScoreData();
        info.score = -scoreNum;
        info.clientShowList = clientShowList;
        return info;
    }

    let info:ScoreData = new ScoreData();
    info.score = 0;
    return info;
  }

}