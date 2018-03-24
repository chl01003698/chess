import { MJCardGroupType, MJGangType, MJCardOriginType } from "../../consts/MJEnum";
import { consts } from "../../../poker/pokerAlgo/sanzhang/consts";

export namespace mjapi {
  export namespace event {
    export function zhuangHu(params) {
      if (params.game.m_banker === params.gamePlayer.index) {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx zhuangHu")
        return true;
      }
      return false;
    }

    export function ziMoHu(params) {
      if (params.game.currentIndex === params.gamePlayer.index && params.game.fsm.state == 'output') {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ziMoHu")
        return true;
      }
      return false;
    }
    export function dianPaoHu(params) {
        if (params.game.currentIndex !== params.gamePlayer.index && params.game.fsm.state == 'input') {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx dianPaoHu")
        return true;
      }
      return false;
    }
    export function gangShangHua(params) {
      if (params.game.currentIndex === params.gamePlayer.index) {
        if (params.game.lastHandles && params.game.lastHandles[0].type === MJCardGroupType.GANG && params.game.fsm.state == 'output') {
          console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx gangShangHua")
          return true;
        }
      }
      return false;
    }
    //补杠(杠上花)
    export function buGangShangHua(params) {
      if (params.game.currentIndex === params.gamePlayer.index) {
        if (params.game.lastHandles && params.game.lastHandles[0].type === MJCardGroupType.GANG &&
          params.game.lastHandles[0].subType == MJGangType.BUGANG && params.game.fsm.state == 'output') {
          console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx gangShangHua")
          return true;
        }
      }
      return false;
    }
    //暗杠(杠上花)
    export function anGangShangHua(params) {
      if (params.game.currentIndex === params.gamePlayer.index) {
        if (params.game.lastHandles && params.game.lastHandles[0].type === MJCardGroupType.GANG &&
          params.game.lastHandles[0].subType == MJGangType.ANGANG && params.game.fsm.state == 'output') {
          console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx gangShangHua")
          return true;
        }
      }
      return false;
    }

    export function gangHouPao(params) {
      if (params.game.currentIndex !== params.gamePlayer.index) {
        if (params.game.lastHandles && params.game.lastHandles[0].type === MJCardGroupType.GANG && params.game.currentCard.type == MJCardOriginType.INPUT) {
          console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx gangHouPao")
          return true;
        }
      }
      return false;
    }

    export function qiangGangHu(params) {
      if (params.game.currentIndex !== params.gamePlayer.index) {
        let trigger = params.game.container.mjtriggerManage.getTrigger(params.game.currentTrigger)
        if (trigger && trigger.lastTriggerCache) {
          // 抢杠胡
          //  && trigger.lastTriggerCache.cardGroupType == CardGroupType.Gang
          console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx qiangGangHu")
          return true;
        }
      }
      return false;
    }

    export function saoDiHu(params) {
      if (params.game.currentIndex === params.gamePlayer.index) {
        if (params.game.remainCards.length == 0 && params.game.fsm.state == 'output') {
          console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx saoDiHu")
          return true;
        }
      }
    }

    export function haiDiPao(params) {
      if (params.game.currentIndex !== params.gamePlayer.index) {
        if (params.game.remainCards.length == 0 && params.game.fsm.state == 'input') {
          console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx haiDiPao")
          return true;
        }
      }
    }

    export function baiPai(params) {
      if (params.game.gameConfig.baipai && params.gamePlayer.ting) {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx baiPai")
        return true;
      }
    }

    export function baiDuZhang(params) {
      if (params.game.gameConfig.baipai && params.gamePlayer.ting && params.gamePlayer.huList.length == 1) {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx baiDuZhang")
        return true;
      }
    }

    export function gangZhuanYi(params) {
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx gangZhuanYi")

    }
  }
}