import MJComboBase from './MJComboBase'
import { MJCardGroupType, MJGangType ,MJHuaSeType,MJGameType} from './consts/MJEnum';
import * as MJConsts  from  './consts/MJConsts'

export default class MJComboAlgo
{
  //金钩钓（大吊车）(胡将牌)
  static existDaDiaoChe(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]金钩钓检查",MJComboBase.getHuGamePlayer(params).index);
    if(MJComboBase.getPlayerHu(params) === true)
    {
        let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
        //移除碰杠之后，余两张牌则是大吊车成立
        if(MJComboBase.getCardsCount(cardsArray) === 2)
        {
            return 1;
        }
    }
    return 0;
  }

  //清一色
  static existQingYiSe(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]清一色检查",MJComboBase.getHuGamePlayer(params).index);
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    let nNum = -1;
    let sameCount = 0;
    for(let i = 0 ;i <cardsArray.length;i++)
    {
      if(cardsArray[i] > 0 && nNum == -1)
      {
          nNum = i;
      }
      if(nNum > -1 && cardsArray[i] > 0)
      {
        if(MJComboBase.getHuaSeByMjIndex(nNum) === MJComboBase.getHuaSeByMjIndex(i))
        {
          sameCount += cardsArray[i];
        }
      }
    }
    if(sameCount ===  MJComboBase.getCardsCount(cardsArray))
    {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]清一色检查成功",MJComboBase.getHuGamePlayer(params).index);
      return 1;
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]清一色失败",MJComboBase.getHuGamePlayer(params).index);
    return 0;
  }

  //缺一门
  static existQueYiMen(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]缺一门检查",MJComboBase.getHuGamePlayer(params).index);
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    let wan:boolean = false;
    let tiao:boolean = false;
    let tong:boolean = false;
    for(let i = 0 ;i <cardsArray.length;i++)
    {
      if(cardsArray[i] > 0 && MJHuaSeType.MjHuaSeType_WAN === MJComboBase.getHuaSeByMjIndex(cardsArray[i]))
      {
          wan = true;
      }
      if(cardsArray[i] > 0 && MJHuaSeType.MjHuaSeType_TIAO === MJComboBase.getHuaSeByMjIndex(cardsArray[i]))
      {
          tiao = true;
      }
      if(cardsArray[i] > 0 && MJHuaSeType.MjHuaSeType_TONG === MJComboBase.getHuaSeByMjIndex(cardsArray[i]))
      {
          tong = true;
      }
    }   
    if(wan === false || tiao === false || tong === false)
    {
      return 1;
    } 
    return 0;
  }

  // 七对
  static existQiDui(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]七对检查",MJComboBase.getHuGamePlayer(params).index);
    if(MJComboBase.GetChiList(params).length > 0)
    {
        return 0;
    }

    let duiCount = 0 ;
    if(MJComboBase.GetChiList(params).length > 0)
    {
        return 0;
    }
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    for(let i = 0 ; i < cardsArray.length;i++)
    {
      if(cardsArray[i] === 2)
      {
          duiCount++;
      }
      if(cardsArray[i] === 4)
      {
          duiCount+=2;
      }
    }
    if(duiCount == MJComboBase.getCardsCount(tempCards) / 2)
    {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]七对检查 -- 成功",MJComboBase.getHuGamePlayer(params).index);
      return 1;
    }
  
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]七对检查 -- 失败",MJComboBase.getHuGamePlayer(params).index);
    return 0;
  }

  //对对胡(碰碰胡，大对子，将对倒)
  static existDuiDuiHu(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]对对胡检查",MJComboBase.getHuGamePlayer(params).index);

    if(MJComboBase.GetChiList(params).length > 0)            //不能有吃
    {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]对对胡检查 -- 失败",MJComboBase.getHuGamePlayer(params).index);
      return 0;
    }

    if(MJComboBase.GetChiList(params).length > 0)
    {
      return 0;
    }

    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    //移除所有刻子
    for(let i = 0 ;i <cardsArray.length;i++) 
    {
      if(cardsArray[i] == 3)
      {
          cardsArray[i] = 0;
      }
    }
    let mjinx:number;
    mjinx =  MJComboBase.GetHuLastMjCard(params);
    if(cardsArray[mjinx] == 3 && MJComboBase.getCardsCount(cardsArray) === 5)
    {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]对对胡检查 -- 成功",MJComboBase.getHuGamePlayer(params).index);
      return 1; 
    }
    
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]对对胡检查 -- 失败",MJComboBase.getHuGamePlayer(params).index);
    return 0;
  }
  
  //断幺九
  static existDuanYaoJiu(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]断幺九检查",MJComboBase.getHuGamePlayer(params).index);
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    let mjCard_1:number = 1;
    let mjCard_2:number = 9;
    if(MJComboBase.existPaiBySameIndex(tempCards,1)  === false &&　 MJComboBase.existPaiBySameIndex(tempCards,9) === false)
    {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]断幺九检查 --- 成功",MJComboBase.getHuGamePlayer(params).index );
        return 1;
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]断幺九检查 --- 失败",MJComboBase.getHuGamePlayer(params).index );
    return 0;
  }

  //姊妹对(包含吃，不包含碰 杠)
  //一般高(包含碰 杠，不包含吃)
  static existYiBanGao(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一般高检查",MJComboBase.getHuGamePlayer(params).index);
    let removeList:Array<number> = new Array<number>();
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    for(let i = 0 ; i < 7; i++)
    {
      let mjCardSameIndex = MJComboBase.getMJIndexByBegin(i,0);
      if(MJComboBase.existShunZiBySameIndex(cardsArray,MJHuaSeType.MjHuaSeType_WAN, mjCardSameIndex ,2) === true)
      {
        let cardIndex = MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_WAN,mjCardSameIndex);

        removeList.push(cardIndex);
        removeList.push(cardIndex+1);
        removeList.push(cardIndex+2);

        removeList.push(cardIndex);
        removeList.push(cardIndex+1);
        removeList.push(cardIndex+2);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一般高检查 -- 成功",MJComboBase.getHuGamePlayer(params).index);
        return 1;
      }
    }   
    for(let i = 0 ; i < 7; i++)
    {
      let mjCardSameIndex = MJComboBase.getMJIndexByBegin(i,0);
      if(MJComboBase.existShunZiBySameIndex(cardsArray,MJHuaSeType.MjHuaSeType_TIAO, mjCardSameIndex ,2) === true)
      {
        let cardIndex = MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TIAO,mjCardSameIndex);

        removeList.push(cardIndex);
        removeList.push(cardIndex+1);
        removeList.push(cardIndex+2);

        removeList.push(cardIndex);
        removeList.push(cardIndex+1);
        removeList.push(cardIndex+2);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一般高检查 -- 成功",MJComboBase.getHuGamePlayer(params).index);
        return 1;                   
      }
    }   
    // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    // console.log(mjCards);
    // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    for(let i = 0 ; i < 7; i++)
    {
      let mjCardSameIndex = MJComboBase.getMJIndexByBegin(i,0);
      if(MJComboBase.existShunZiBySameIndex(cardsArray,MJHuaSeType.MjHuaSeType_TONG, mjCardSameIndex ,2) === true)
      {
        let cardIndex = MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TONG,mjCardSameIndex);

        removeList.push(cardIndex);
        removeList.push(cardIndex+1);
        removeList.push(cardIndex+2);

        removeList.push(cardIndex);
        removeList.push(cardIndex+1);
        removeList.push(cardIndex+2);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一般高检查 -- 成功",MJComboBase.getHuGamePlayer(params).index);
        return 1;
      }
    }

    MJComboBase.removeCards(tempCards,removeList);     //移除卡牌后，用于胡检查

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一般高检查 -- 失败",MJComboBase.getHuGamePlayer(params).index);
    return 0;
  }
  //夹心五
  static existJiaWuXin(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    let removeList:Array<number> = new Array<number>();
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]夹心五检查",MJComboBase.getHuGamePlayer(params).index);

    let mjHuaSe:MJHuaSeType;
    let SameIndex:number;
    let mjCardIndex:number;
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    mjCardIndex = MJComboBase.GetHuLastMjCard(params);
    //console.log("最后摸到的牌[%d]",this.Master_.m_PlayerMoPaiMjCode);
    [mjHuaSe,SameIndex] = MJComboBase.transform2SameIndex(mjCardIndex);
    console.log("花色[%d]同门索引[%d]",mjHuaSe,SameIndex);
    if(MJComboBase.getPlayerHu(params) === true &&  SameIndex === (5 - 1))
    {
      let mjCardIndex_1:number = SameIndex -1 ;
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]夹心五检查 -- ------  1",MJComboBase.getHuGamePlayer(params).index);
      if(MJComboBase.existShunZiBySameIndex(cardsArray,mjHuaSe, mjCardIndex_1 ,1) === true)
      {
        removeList.push(mjCardIndex_1);
        removeList.push(mjCardIndex_1+1);
        removeList.push(mjCardIndex_1+2);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]夹心五检查 -- 成功",MJComboBase.getHuGamePlayer(params).index);
        return 1;
      }
    }
    MJComboBase.removeCards(tempCards,removeList);     //移除卡牌后，用于胡检查
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]夹心五检查 -- 失败",MJComboBase.getHuGamePlayer(params).index);
    return 0;
  }
  //平胡
  static existPingHu(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]平胡检查",MJComboBase.getHuGamePlayer(params).index);
    console.log("牌码"  +  tempCards)
    let num:number = 0;
    let removeList:Array<number> = new Array<number>();
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    for(let i = 0 ; i < 7; i++)
    {
      let mjCardSameIndex = MJComboBase.getMJIndexByBegin(i,0);
      if(MJComboBase.existShunZiBySameIndex(cardsArray,MJHuaSeType.MjHuaSeType_TONG, mjCardSameIndex ,3) === false)
      {
        if(MJComboBase.existShunZiBySameIndex(cardsArray,MJHuaSeType.MjHuaSeType_TONG, mjCardSameIndex ,1) === true)
        {
          let cardIndex = MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TONG,mjCardSameIndex);

          removeList.push(cardIndex);
          removeList.push(cardIndex+1);
          removeList.push(cardIndex+2);
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]平胡检查 -- 成功",MJComboBase.getHuGamePlayer(params).index);
          num += 1;
        }
      }
      if(MJComboBase.existShunZiBySameIndex(cardsArray,MJHuaSeType.MjHuaSeType_TIAO, mjCardSameIndex ,3) === false)
      {
        if(MJComboBase.existShunZiBySameIndex(cardsArray,MJHuaSeType.MjHuaSeType_TIAO, mjCardSameIndex ,1) === true)
        {
          let cardIndex = MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TIAO,mjCardSameIndex);

          removeList.push(cardIndex);
          removeList.push(cardIndex+1);
          removeList.push(cardIndex+2);
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]平胡检查 -- 成功",MJComboBase.getHuGamePlayer(params).index);
          num += 1;
        }
      }
      if(MJComboBase.existShunZiBySameIndex(cardsArray,MJHuaSeType.MjHuaSeType_WAN, mjCardSameIndex ,3) === false)
      {
        if(MJComboBase.existShunZiBySameIndex(cardsArray,MJHuaSeType.MjHuaSeType_WAN, mjCardSameIndex ,1) === true)
        {
          let cardIndex = MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_WAN,mjCardSameIndex);

          removeList.push(cardIndex);
          removeList.push(cardIndex+1);
          removeList.push(cardIndex+2);
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]平胡检查 -- 成功",MJComboBase.getHuGamePlayer(params).index);
          num += 1;
        }
      }
    }
    if(num === 0)
    {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]平胡检查 --- 失败",MJComboBase.getHuGamePlayer(params).index);
    }
    MJComboBase.removeCards(tempCards,removeList);     //移除卡牌后，用于胡检查
    return num;
  }
  //将将胡
  static existjiangJiangHu(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    if(MJComboBase.GetChiList(params).length > 0)
    {
      return 0;
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]将将胡检查",MJComboBase.getHuGamePlayer(params).index);
    let removeList:Array<number> = new Array<number>();
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TONG,2));
    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TIAO,2));
    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_WAN,2));

    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TONG,5));
    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TIAO,5));
    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_WAN,5));

    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TONG,8));
    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TIAO,8));
    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_WAN,8));

    MJComboBase.removeCards(cardsArray,removeList,3);        //移除所有2 5 8 的刻子
    
    if(MJComboBase.getCardsCount(cardsArray) === 2)
    {
      if(MJComboBase.existPaiBySameIndex(cardsArray, 2 ,2) || MJComboBase.existPaiBySameIndex(cardsArray, 5 ,2) || MJComboBase.existPaiBySameIndex(cardsArray, 8 ,2))
      {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]将将胡检查成功",MJComboBase.getHuGamePlayer(params).index);
        return 1;
      }
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]将将胡检查失败",MJComboBase.getHuGamePlayer(params).index);
    return 0;
  }
  //一条龙
  static existYiTiaoLong(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一条龙检查",MJComboBase.getHuGamePlayer(params).index);
    let removeList:Array<number> = new Array<number>();
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);

    let long_Wan:boolean = true;
    let long_Tong:boolean = true;
    let long_Tiao:boolean = true;
    //万
    for(let i = 0; i < 9 ;i++)
    {
      if(cardsArray[MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_WAN,i + 1)] == 0)
      {
        long_Wan = false;
        removeList = [];
        break;
      }
      else
      {
        removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_WAN,i + 1));
      }
    }
    //条
    for(let i = 0; i < 9 ;i++)
    {
      if(cardsArray[MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TIAO,i + 1)] == 0)
      {
        long_Tiao = false;
        removeList = [];
        break;
      }
      else
      {
        removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TIAO,i + 1));
      }
    }
    //筒
    for(let i = 0; i < 9 ;i++)
    {
      if(cardsArray[MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TONG,i + 1)] == 0)
      {
        long_Tong = false;
        removeList = [];
        break;
      }
      else
      {
        removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TONG,i + 1));
      }
    }

    if(long_Wan === true || long_Tong === true || long_Tiao === true)
    {
      MJComboBase.removeCards(tempCards,removeList);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一条龙检查成功",MJComboBase.getHuGamePlayer(params).index);
      return 1;
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一条龙失败",MJComboBase.getHuGamePlayer(params).index);
    return 0;
  }
  //混一色
  static existHuiYiSe(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    let removeList:Array<number> = new Array<number>();
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
  //移除风牌
    let num:number = 0;
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]混一色检查",MJComboBase.getHuGamePlayer(params).index);
    if(removeGang === false)
    {//如查不移除杠牌，先移除杠牌中的风牌
      let gangList = MJComboBase.GetGangList(params);
      for(let i = 0 ;i <gangList.length;i++)
      {
        if(MJComboBase.getHuaSeByMjIndex(gangList[i]) === MJHuaSeType.MjHuaSeType_FENG)
        {
          cardsArray[gangList[i]] = 0;
          num++;
        }
      }
    }
    
    let bJiang:boolean = false;
    for(let i = MJConsts.MJ_Feng_Begin; i < MJConsts.Mj_Jian_End; i++)
    {
      if(bJiang === false && cardsArray[i] == 2)
      {
        bJiang = true;
        cardsArray[i] = 0;
        num++;
      }
      else if(cardsArray[i] == 3)
      {
        cardsArray[i] = 0;
        num++
      }
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>混一色成功" + cardsArray);
    if(num > 0 && this.existQingYiSe(params,cardsArray,removeChi,removePeng,removeGang))
    {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]混一色成功",MJComboBase.getHuGamePlayer(params).index);
      return 1;
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]混一色失败",MJComboBase.getHuGamePlayer(params).index);
    return 0;
  }
  //大三元
  static existDaSanYuan(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    let num:number = 0;
    let removeList:Array<number> = new Array<number>();
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]大三元检查",MJComboBase.getHuGamePlayer(params).index);
    let gangnum = 0;
    if(removeGang === false)
    {
      let gangList:Array<number> =MJComboBase.GetGangList(params);
      for(let i = 0 ;i <gangList.length;i++)
      {
        if(MJComboBase.getHuaSeByMjIndex(gangList[i]) === MJHuaSeType.MjHuaSeType_FENG)
        {
          removeList.push(i);
          gangnum++;
        }
      }
    }
    if(gangnum > 0)
    {
      num += gangnum / 4;
    }
    for(let i = MJConsts.Mj_Jian_Begin ;i <= MJConsts.Mj_Jian_End;i++)
    {
      if(cardsArray[i] === 3)
      {
        num += cardsArray[i] / 3;
        removeList.push(i);
        removeList.push(i);
        removeList.push(i);
      }
    }
    if(num === 3)
    {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]大三元检查 -- 成功",MJComboBase.getHuGamePlayer(params).index);
      MJComboBase.removeCards(tempCards,removeList);
      return 1;
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]大三元检查 -- 失败",MJComboBase.getHuGamePlayer(params).index);
    return 0;
  }
  //小三元
  static existXiaoSanYuan(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    let num = 0;
    let removeList:Array<number> = new Array<number>();
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]小三元检查",MJComboBase.getHuGamePlayer(params).index);
    let gangnum = 0;
    if(removeGang === false)
    {
      let gangList:Array<number> =MJComboBase.GetGangList(params);
      for(let i = 0 ;i <gangList.length;i++)
      {
        if(MJComboBase.getHuaSeByMjIndex(gangList[i]) === MJHuaSeType.MjHuaSeType_FENG)
        {
          removeList.push(i);
          gangnum++;
        }
      }
    }
    if(gangnum > 0)
    {
      num += gangnum / 4;
    }
    for(let i = MJConsts.Mj_Jian_Begin ;i <= MJConsts.Mj_Jian_End;i++)
    {
      if(cardsArray[i] > 1 && cardsArray[i] < 4)
      {
        num += Math.ceil(cardsArray[i] / 3)
        if(cardsArray[i] === 3)
        {
          removeList.push(i);
          removeList.push(i);
          removeList.push(i);
        }
        if(cardsArray[i] === 2)
        {
          removeList.push(i);
          removeList.push(i);
        }
      }
    }
    if(num == 3)
    {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]小三元检查成功",MJComboBase.getHuGamePlayer(params).index);
      MJComboBase.removeCards(tempCards,removeList);
      return 1;
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]小三元检查失败",MJComboBase.getHuGamePlayer(params).index);
    return 0;
  }

  //十八罗汉
  static existShiBaLuoHan(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    console.log("十八罗汉 杠  " ,MJComboBase.GetGangList(params));
    if(MJComboBase.getGangCount(params) == 4)
    {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]十八罗汉检查成功",MJComboBase.getHuGamePlayer(params).index);
      return 1;
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]十八罗汉检查失败",MJComboBase.getHuGamePlayer(params).index);
    return 0;
  } 
  //十三幺
  static existShiSanYao(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    let removeList:Array<number> = new Array<number>();

    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TONG,1));
    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TONG,9));

    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TIAO,1));
    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TIAO,9));

    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_WAN,1));
    removeList.push(MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_WAN,9));

    for(let i = MJConsts.MJ_Feng_Begin ;i < MJConsts.Mj_Jian_End;i++)
    {
        removeList.push(i);
    }
    MJComboBase.removeCards(cardsArray,removeList);
    let bExist = false;
    for(let i = 0 ;i < removeList.length; i++ )
    {
      if(cardsArray[removeList[i]] === 1)
      {
        bExist = true;
        break;
      }
    }
    if(MJComboBase.getCardsCount(cardsArray) === 1 && bExist)
    {
      return 1;
    }
    return 0;
  }
  //十三不靠。
  static existShiSanBuKao(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    //1.4.7   2.5.8  3.6.9  三色牌组成的牌形
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    let removeList:Array<number> = new Array<number>();
    let huaSeAllCombo:Array<Array<MJHuaSeType>> =[
                                                  [MJHuaSeType.MjHuaSeType_WAN,MJHuaSeType.MjHuaSeType_TIAO,MJHuaSeType.MjHuaSeType_TONG ],
                                                  [MJHuaSeType.MjHuaSeType_WAN,MJHuaSeType.MjHuaSeType_TONG,MJHuaSeType.MjHuaSeType_TIAO ],
                                                  [MJHuaSeType.MjHuaSeType_TIAO,MJHuaSeType.MjHuaSeType_TONG,MJHuaSeType.MjHuaSeType_WAN ],
                                                  [MJHuaSeType.MjHuaSeType_TIAO,MJHuaSeType.MjHuaSeType_WAN,MJHuaSeType.MjHuaSeType_TONG ],
                                                  [MJHuaSeType.MjHuaSeType_TONG,MJHuaSeType.MjHuaSeType_WAN,MJHuaSeType.MjHuaSeType_TIAO ],
                                                  [MJHuaSeType.MjHuaSeType_TONG,MJHuaSeType.MjHuaSeType_WAN,MJHuaSeType.MjHuaSeType_TIAO ],
                                                 ]
    let bExist = false;
    for(let i = 0 ;i < huaSeAllCombo.length;i++)
    {
      let bExistA:Array<boolean> = [false,false,false];
      for(let j = 0;j < huaSeAllCombo[i].length;j++)
      {
        let bCheck = false;
        let bExistB:Array<boolean> = [false,false,false];
        if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],1)] === 1)
        {
          bExistB[0] = true;
        }
        if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],4)] === 1)
        {
          bExistB[1] = true;
        }
        if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],7)] === 1)
        {
          bExistB[1] = true;
        }
        if(bExistB[0] === true && bExistB[1] === true && bExistB[2] === true)
        {
          bCheck = true;
          bExistA[0] = true;
        }

        if(bCheck === false)
        {
          bExistB = [false,false,false];
          if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],2)] === 1)
          {
            bExistB[0] = true;
          }
          if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],5)] === 1)
          {
            bExistB[1] = true;
          }
          if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],8)] === 1)
          {
            bExistB[1] = true;
          }
          if(bExistB[0] === true && bExistB[1] === true && bExistB[2] === true)
          {
            bExistA[1] = true;
          }
        }
        if(bCheck === false)
        {
          bExistB = [false,false,false];
          if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],3)] === 1)
          {
            bExistB[0] = true;
          }
          if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],6)] === 1)
          {
            bExistB[1] = true;
          }
          if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],9)] === 1)
          {
            bExistB[1] = true;
          }
          if(bExistB[0] === true && bExistB[1] === true && bExistB[2] === true)
          {
            bExistA[2] = true;
          }
        }
      }
      if(bExistA[0] === true && bExistA[1] === true && bExistA[2] === true)
      {
        bExist = true;
        break;
      }
    }

    let fengNum = 0;
    for(let i = MJConsts.MJ_Feng_Begin ;i < MJConsts.Mj_Jian_End;i++)
    {
        if(cardsArray[i] === 1)
        {
          fengNum++;
        }
    }
    if(bExist && fengNum === 5)
    {
      return 1;
    }
    return 0;
  }
  //软十三不靠
  static existRuanShiSanBuKao(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    //1.4.7   2.5.8  3.6.9  三色牌组成的牌形
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    let removeList:Array<number> = new Array<number>();
    let huaSeAllCombo:Array<Array<MJHuaSeType>> =[
                                                  [MJHuaSeType.MjHuaSeType_WAN,MJHuaSeType.MjHuaSeType_TIAO,MJHuaSeType.MjHuaSeType_TONG ],
                                                  [MJHuaSeType.MjHuaSeType_WAN,MJHuaSeType.MjHuaSeType_TONG,MJHuaSeType.MjHuaSeType_TIAO ],
                                                  [MJHuaSeType.MjHuaSeType_TIAO,MJHuaSeType.MjHuaSeType_TONG,MJHuaSeType.MjHuaSeType_WAN ],
                                                  [MJHuaSeType.MjHuaSeType_TIAO,MJHuaSeType.MjHuaSeType_WAN,MJHuaSeType.MjHuaSeType_TONG ],
                                                  [MJHuaSeType.MjHuaSeType_TONG,MJHuaSeType.MjHuaSeType_WAN,MJHuaSeType.MjHuaSeType_TIAO ],
                                                  [MJHuaSeType.MjHuaSeType_TONG,MJHuaSeType.MjHuaSeType_WAN,MJHuaSeType.MjHuaSeType_TIAO ],
                                                 ]
    let bExist = false;
    for(let i = 0 ;i < huaSeAllCombo.length;i++)
    {
      let bExistA:Array<number> = [0,0,0];
      for(let j = 0;j < huaSeAllCombo[i].length;j++)
      {
        let bExistB:Array<boolean> = [false,false,false];
        let bExistC:Array<number> =[0,0,0];
        let existBIndex = huaSeAllCombo[i][j] - MJHuaSeType.MjHuaSeType_WAN;
        if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],1)] === 1)
        {
          bExistB[0] = true;
        }
        if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],4)] === 1)
        {
          bExistB[1] = true;
        }
        if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],7)] === 1)
        {
          bExistB[1] = true;
        }
        if(bExistB[0] === true && bExistB[1] === true && bExistB[2] === true)
        {
          bExistC[existBIndex]++;
        }

        bExistB = [false,false,false];
        if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],2)] === 1)
        {
          bExistB[0] = true;
        }
        if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],5)] === 1)
        {
          bExistB[1] = true;
        }
        if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],8)] === 1)
        {
          bExistB[1] = true;
        }
        if(bExistB[0] === true && bExistB[1] === true && bExistB[2] === true)
        {
          bExistC[existBIndex]++;
        }

        bExistB = [false,false,false];
        if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],3)] === 1)
        {
          bExistB[0] = true;
        }
        if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],6)] === 1)
        {
          bExistB[1] = true;
        }
        if(cardsArray[MJComboBase.transform2Index(huaSeAllCombo[i][j],9)] === 1)
        {
          bExistB[1] = true;
        }
        if(bExistB[0] === true && bExistB[1] === true && bExistB[2] === true)
        {
          bExistC[existBIndex]++;
        }

        if(bExistC[existBIndex] >0)
        {
          bExistA[existBIndex] = bExistC[existBIndex];
        }
      }
      
      let existNum = 0;
      for(let i = 0 ;i < bExistA.length;i++)
      {
        existNum+= bExistA[i];
      }
      if(existNum === 3)
      {
        bExist = true;
        break;
      }
    }

    let fengNum = 0;
    for(let i = MJConsts.MJ_Feng_Begin ;i < MJConsts.Mj_Jian_End;i++)
    {
        if(cardsArray[i] === 1)
        {
          fengNum++;
        }
    }
    if(bExist && fengNum === 5)
    {
      return 1;
    }
    return 0;
  }
  //带幺九
  static existDaiYaoJiu(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    //检查是否全幺九
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]带幺九检查",MJComboBase.getHuGamePlayer(params).index);
    if(this.existQuanYaoJiu(params,tempCards,removeChi,removePeng,removeGang) > 0)
    {
      return 0;
    }
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);

    let num:number = 0;
    let tempNum = Math.ceil(cardsArray[MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_WAN,1)] / 3);
    num += tempNum > 1 ? 1:tempNum;
    tempNum = Math.ceil(cardsArray[MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TIAO,1)] / 3);
    num += tempNum > 1 ? 1:tempNum;
    tempNum = Math.ceil(cardsArray[MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TONG,1)] / 3);
    num += tempNum > 1 ? 1:tempNum;

    tempNum = Math.ceil(cardsArray[MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_WAN,9)] / 3);
    num += tempNum > 1 ? 1:tempNum;
    tempNum = Math.ceil(cardsArray[MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TIAO,9)] / 3);
    num += tempNum > 1 ? 1:tempNum;
    tempNum = Math.ceil(cardsArray[MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TONG,9)] / 3);
    num += tempNum > 1 ? 1:tempNum;
    
    let maxNum = 5;
    if(MJComboBase.getGameType(params) == MJGameType.zhang13)
    {
      maxNum = 5;
    }
    if(MJComboBase.getGameType(params) == MJGameType.zhang10)
    {
      maxNum = 4;
    }   
    if(MJComboBase.getGameType(params) == MJGameType.zhang7)
    {
      maxNum = 3;
    }     
    if(num == maxNum)
    {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]带幺九成功",MJComboBase.getHuGamePlayer(params).index);
      return 1;
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]带幺九失败",MJComboBase.getHuGamePlayer(params).index);
    return 0;
  }
  //全幺九
  static existQuanYaoJiu(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]全幺九检查",MJComboBase.getHuGamePlayer(params).index);
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    let removeList:Array<number> = new Array<number>();
    let wan_1 = MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_WAN,1);
    let tiao_1 =  MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TIAO,1);
    let tong_1 = MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TONG,1);
    let wan_9 = MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_WAN,9);
    let tiao_9 =  MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TIAO,9);
    let tong_9 = MJComboBase.transform2Index(MJHuaSeType.MjHuaSeType_TONG,9);

    let num = 0;
    if(cardsArray[wan_1] > 1) num += cardsArray[wan_1];
    if(cardsArray[tiao_1] > 1) num += cardsArray[tiao_1];
    if(cardsArray[tong_1] > 1) num += cardsArray[tong_1];

    if(cardsArray[wan_9] > 1) num += cardsArray[wan_9];
    if(cardsArray[tiao_9] > 1) num += cardsArray[tiao_9];
    if(cardsArray[tong_9] > 1) num += cardsArray[tong_9];

    if(num === MJComboBase.getCardsCount(cardsArray))
    {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]全幺九检查成功",MJComboBase.getHuGamePlayer(params).index);
      return 1;
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]全幺九失败",MJComboBase.getHuGamePlayer(params).index);
    return 0;
  } 
  //清三搭(这里只算出了三搭，请配合清一色使有)
  static existQingSanDa(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]清三搭检查",MJComboBase.getHuGamePlayer(params).index);
    let num:number = 0;
    for(let i = 0; i <cardsArray.length;i++)
    {
      num += Math.floor(cardsArray[i] / 3)
    }
    if(num === 3)
    {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]清三搭检查成功",MJComboBase.getHuGamePlayer(params).index);
      return 1;
    }
    return 0;
  }
  //混幺九
  static existHunYaoJiu(params,tempCards:Array<number>,removeChi:boolean = false,removePeng:boolean = false,removeGang:boolean = false):number
  {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]混幺九检查",MJComboBase.getHuGamePlayer(params).index);
    let cardsArray:Array<number> = MJComboBase.removeCardSelect(params,tempCards,removeChi,removePeng,removeGang);
    let removeList:Array<number> = new Array<number>();
    if(removeGang === false)
    {
      let gangList:Array<number> = MJComboBase.GetGangList(params);
      for(let i = 0; i < gangList.length;i++)
      {
        if(MJComboBase.getHuaSeByMjIndex(gangList[i]) === MJHuaSeType.MjHuaSeType_FENG)
        {
          removeList.push(gangList[i]);
        }
      }
    }

    for(let i = MJConsts.MJ_Feng_Begin ;i < MJConsts.Mj_Jian_End;i++)
    {
      if(cardsArray[i] === 3)
      {
        removeList.push(i);
        removeList.push(i);
        removeList.push(i);
      }
      if(cardsArray[i] === 2)
      {
        removeList.push(i);
        removeList.push(i);
        removeList.push(i);
      }
    }

    MJComboBase.removeCards(cardsArray,removeList);
    if(MJComboBase.getCardsCount(cardsArray) > 5)
    {
      if(this.existQuanYaoJiu(params,cardsArray))
      {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]混幺九检查成功",MJComboBase.getHuGamePlayer(params).index);
        return 1;
      }
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]混幺九检查失败",MJComboBase.getHuGamePlayer(params).index);
    return 0;
  }
}