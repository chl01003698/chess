  import { MJCardGroupManage, MJCardGroup } from './components/MJCardGroupManage';
  import { MJScoreData } from './components/MJScoreManage'
  import * as _ from 'lodash'
  import { MJCardGroupType, MJGangType ,MJHuaSeType,MJGameType} from './consts/MJEnum';
  import * as MJConsts  from  './consts/MJConsts'
  import MJGamePlayer from  './MJGamePlayer'
  import {MJAlgo} from './MJAlgo'

  export default class MJComboBase {
  static getTempCards(params):Array<number>
  {
    const cardGroupManage = this.getHuGamePlayer(params).cardGroupManage as MJCardGroupManage
    const cards = _.clone(this.getHuGamePlayer(params).cards);
    cards.push(this.GetHuLastMjCard(params));
    return MJAlgo.formatCards(cards);
  }
  //获取根的数量
  static getGenAndGang(params):number
  {
    let num:number = 0;
    let tempCards = this.getTempCards(params)
    for(let i = 0 ;i < tempCards.length ;i++)
    {
      if(tempCards[i] === 4)
      {
        num++;
      }
    }
    return num;
  }

  static getGenRemoveGang(params):number
  {
    let num:number = 0;
    num = this.getGenAndGang(params)  - this.getGangCount(params)
    return num;
  }

  static getGangCount(params)
  {
    const cardGroupManage = this.getHuGamePlayer(params).cardGroupManage as MJCardGroupManage
    const cardGroups:Array<any>= cardGroupManage.getPrivateCardGroups();
    let num:number = 0;
    for(let i = 0;i < cardGroups.length;i++)
    {
      if(cardGroups[i].type === MJCardGroupType.GANG)
      {
        num++;
      }
    }
    return num;
  }
  static getGroupCardsCount(params)
  {
    const cardGroupManage = this.getHuGamePlayer(params).cardGroupManage as MJCardGroupManage
    return cardGroupManage.getPrivateCardGroups().length;
  }
  static GetGangList(params):Array<number>
  {
    let gangList = Array<number>();
    const cardGroupManage = this.getHuGamePlayer(params).cardGroupManage as MJCardGroupManage
    const cardGroups:Array<any>= cardGroupManage.getPrivateCardGroups();
    for(let i = 0;i < cardGroups.length;i++)
    {
      if(cardGroups[i].type === MJCardGroupType.GANG)
      {
        gangList = _.concat(gangList,cardGroups[i].cards);
      }
    }
    return gangList;
  }
  
  static getPlayerHu(params)
  {

    return true;
  }

  static GetPengList(params)
  {
    let pengList = Array<number>();
    const cardGroupManage = this.getHuGamePlayer(params).cardGroupManage as MJCardGroupManage
    const cards:Array<any>= cardGroupManage.getPrivateCardGroups();
    for(let i = 0;i < cards.length;i++)
    {
      if(cards[i].type === MJCardGroupType.PENG)
      {
        pengList = _.concat(pengList,cards[i].cards);
      }
    }
    return pengList;
  }
  static GetChiList(params)
  {
    let chiList = Array<number>();

    const cardGroupManage = this.getHuGamePlayer(params).cardGroupManage as MJCardGroupManage
    const cards:Array<any>= cardGroupManage.getPrivateCardGroups();
    for(let i = 0;i < cards.length;i++)
    {
      if(cards[i].type === MJCardGroupType.CHI)
      {
        chiList = _.concat(chiList,cards[i].cards);
      }
    }
    return chiList;
  }
  //移除指定牌码
  static removeCards(mjCards:Array<number>, removeList:Array<number>,minNum:number = 1)
  {
    if(removeList != undefined)
    {
      for(let i = 0 ;i <removeList.length;i++)
      {
        if(mjCards[removeList[i]] >= minNum)
        {
            mjCards[removeList[i]] -= minNum;
        }
      }
    }
  }

  static getGame(params)
  {
    const {game, curGamePlayer, scoreData, uids, gamePlayer,card } = params;
    return game;
  }

  //获取玩法（13张，10张，7张）
  static getGameType(params):MJGameType
  {
    let gametype = this.getGame(params).gameConfig.playerInitCards;
    switch(gametype)
    {
      case 13:{
        return MJGameType.zhang13;
      }
      case 10:{
        return MJGameType.zhang10;
      }
      case 7:{
        return MJGameType.zhang7;
      }
    }
    return MJGameType.zhang13;
  }

  static getCardsCount(mjCards:Array<number>):number
  {
    let nCount  = 0;
    for(let i = 0 ;i <mjCards.length;i++)
    {
      if(mjCards[i] > 0)
      {
          nCount += mjCards[i];
          //console.log("[%d]牌的数量 [%d]",i,nCount);
      }
    }
    //console.log("牌的数量 [%d]",nCount);
    return nCount;
  }

  static isQueYiMen(params)
  {
    return false;
  }

  static getHuGamePlayer(params):MJGamePlayer
  {
    const {game, curGamePlayer, scoreData, uids, gamePlayer,card } = params;
    return gamePlayer;
  }
  static getCacheMap(params):Map<string,number>
  {
    return this.getHuGamePlayer(params).comboCache;
  }
  static removeCardSelect(params,tempCrads:Array<number>,removeChi:boolean,removePeng:boolean,removeGang:boolean):Array<number>
  {
    let cloneCrads = tempCrads.slice();
    if(removeGang === true)
    {
        this.removeCards(cloneCrads,this.GetGangList(params));
    }
    if(removePeng === true)
    {
        this.removeCards(cloneCrads,this.GetPengList(params));
    }
    if(removeChi === true)
    {
        this.removeCards(cloneCrads,this.GetChiList(params));
    }
    return cloneCrads;
  }

  static getMJIndexByBegin(index:number,beginIndex:number)
  {
    if(beginIndex == 0)
    {
      return index + 1;
    }
    return index;
  }

  //检查顺子是否存在
  static existShunZiBySameIndex(tempCards:Array<number>,mjHuaSe:MJHuaSeType,mjCardSameIndex:number,minNum:number)
  {
    //console.log("顺子牌码[%d][%d]",mjCard.mjCode,mjCard.mjIndex);
    if(mjCardSameIndex < 1 || mjCardSameIndex > 7)
    {
      return false;
    }

    let nHuaSeBegin:number = 0;
    switch (mjHuaSe)
    {
      case MJHuaSeType.MjHuaSeType_WAN:
      {
        nHuaSeBegin = MJConsts.MJ_Wan_Begin;
      }break;
      case MJHuaSeType.MjHuaSeType_TIAO:
      {
        nHuaSeBegin = MJConsts.MJ_Tiao_Begin;
      }break;
      case MJHuaSeType.MjHuaSeType_TONG:
      {
        nHuaSeBegin = MJConsts.MJ_Bing_Begin;
      }break;
    }
    let nIndex1 = mjCardSameIndex - 1 + nHuaSeBegin;
    let nIndex2 = nIndex1 + 1;
    let nIndex3 = nIndex2 + 1;
    // console.log("顺子牌码[%d][%d][%d]",nIndex1,nIndex2,nIndex3);
    if( tempCards[nIndex1] >=minNum  && tempCards[nIndex2] >=minNum  && tempCards[nIndex3] >=minNum)
    {
      return true;
    }
    return false;
  }

  //转换牌码到通用索引
  static transform2Index(mjHuaSe:MJHuaSeType,mjCardSameIndex:number):number
  {//只转万 条 筒
    //mjCardIndex  起始值为 1
    if(mjCardSameIndex < 1)
    {
      return -1;
    }
    let nHuaSeBegin = 1;
    switch (mjHuaSe)
    {
      case MJHuaSeType.MjHuaSeType_WAN:
      {
        nHuaSeBegin = MJConsts.MJ_Wan_Begin;
      }break;
      case MJHuaSeType.MjHuaSeType_TIAO:
      {
        nHuaSeBegin = MJConsts.MJ_Tiao_Begin;
      }break;
      case MJHuaSeType.MjHuaSeType_TONG:
      {
        nHuaSeBegin = MJConsts.MJ_Bing_Begin;
      }break;
    }
    return mjCardSameIndex - 1 + nHuaSeBegin;
  }

  //查找相对于花色的牌码的牌是否存在（忽略花色，如，万1 ，条1 ，筒1，有一个存在则返回为真）
  static existPaiBySameIndex(tempCards:Array<number>,mjCardSameIndex:number,minNum:number = 1):boolean
  {
    if(mjCardSameIndex < 1 || mjCardSameIndex > 9)
    {
      return false;
    }
    if(tempCards[this.transform2Index(MJHuaSeType.MjHuaSeType_WAN,mjCardSameIndex)] >= minNum)
    {
      return true;
    }
    if(tempCards[this.transform2Index(MJHuaSeType.MjHuaSeType_TIAO,mjCardSameIndex)] >= minNum)
    {
      return true;
    }
    if(tempCards[this.transform2Index(MJHuaSeType.MjHuaSeType_TONG,mjCardSameIndex)] >= minNum)
    {
      return true;
    }
    return false;
  }

  //转换牌码到同门花色的牌码索引
  static transform2SameIndex(mjCardIndex:number)
  {//只转万 条 筒
    let mjHuaSe:MJHuaSeType;
    mjHuaSe = this.getHuaSeByMjIndex(mjCardIndex);
    let SameIndex;
    
    let nHuaSe = 1;
    switch (mjHuaSe)
    {
      case MJHuaSeType.MjHuaSeType_WAN:
      {
        nHuaSe = MJConsts.MJ_Wan_Begin;
      }break;
      case MJHuaSeType.MjHuaSeType_TIAO:
      {
        nHuaSe = MJConsts.MJ_Tiao_Begin;
      }break;
      case MJHuaSeType.MjHuaSeType_TONG:
      {
        nHuaSe = MJConsts.MJ_Bing_Begin;
      }break;
    }
    return [mjHuaSe, mjCardIndex - nHuaSe + 1];
  }

  //自摸
  static getZiMo(params):boolean
  {
    return true
  }

  //胡牌时最后一次获取的牌
  static GetHuLastMjCard(params):number
  {
    const {game, curGamePlayer, scoreData, uids, gamePlayer,card } = params;
    return card;
  }

  static getHuaSeByMjIndex(MjIndex:number)
  {
    if(MjIndex >=MJConsts.MJ_Feng_Begin && MjIndex<= MJConsts.Mj_Jian_End)
    {
      return MJHuaSeType.MjHuaSeType_FENG;
    }
    else if( MjIndex >=MJConsts.MJ_Wan_Begin && MjIndex<= MJConsts.MJ_Wan_End)
    {
      return MJHuaSeType.MjHuaSeType_WAN;
    }
    else if(MjIndex >=MJConsts.MJ_Tiao_Begin && MjIndex<= MJConsts.MJ_Tiao_End)
    {
      return MJHuaSeType.MjHuaSeType_TIAO;
    }
    else if(MjIndex >=MJConsts.MJ_Bing_Begin && MjIndex<= MJConsts.MJ_Bing_End)
    {
      return MJHuaSeType.MjHuaSeType_TONG;
    }
    else if(MjIndex >=MJConsts.MJ_Hua_Begin && MjIndex<= MJConsts.MJ_Hua_End)
    {
      return MJHuaSeType.MjHuaSeType_HUA;
    }
    return MJHuaSeType.MjHuaSeType_NONE;
  }

}
