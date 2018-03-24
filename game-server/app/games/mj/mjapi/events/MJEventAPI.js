"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MJEnum_1 = require("../../consts/MJEnum");
var mjapi;
(function (mjapi) {
    let event;
    (function (event) {
        function zhuangHu(params) {
            if (params.game.m_banker === params.gamePlayer.index) {
                console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx zhuangHu");
                return true;
            }
            return false;
        }
        event.zhuangHu = zhuangHu;
        function ziMoHu(params) {
            if (params.game.currentIndex === params.gamePlayer.index && params.game.fsm.state == 'output') {
                console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ziMoHu");
                return true;
            }
            return false;
        }
        event.ziMoHu = ziMoHu;
        function dianPaoHu(params) {
            if (params.game.currentIndex !== params.gamePlayer.index && params.game.fsm.state == 'input') {
                console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx dianPaoHu");
                return true;
            }
            return false;
        }
        event.dianPaoHu = dianPaoHu;
        function gangShangHua(params) {
            if (params.game.currentIndex === params.gamePlayer.index) {
                if (params.game.lastHandles && params.game.lastHandles[0].type === MJEnum_1.MJCardGroupType.GANG && params.game.fsm.state == 'output') {
                    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx gangShangHua");
                    return true;
                }
            }
            return false;
        }
        event.gangShangHua = gangShangHua;
        //补杠(杠上花)
        function buGangShangHua(params) {
            if (params.game.currentIndex === params.gamePlayer.index) {
                if (params.game.lastHandles && params.game.lastHandles[0].type === MJEnum_1.MJCardGroupType.GANG &&
                    params.game.lastHandles[0].subType == MJEnum_1.MJGangType.BUGANG && params.game.fsm.state == 'output') {
                    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx gangShangHua");
                    return true;
                }
            }
            return false;
        }
        event.buGangShangHua = buGangShangHua;
        //暗杠(杠上花)
        function anGangShangHua(params) {
            if (params.game.currentIndex === params.gamePlayer.index) {
                if (params.game.lastHandles && params.game.lastHandles[0].type === MJEnum_1.MJCardGroupType.GANG &&
                    params.game.lastHandles[0].subType == MJEnum_1.MJGangType.ANGANG && params.game.fsm.state == 'output') {
                    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx gangShangHua");
                    return true;
                }
            }
            return false;
        }
        event.anGangShangHua = anGangShangHua;
        function gangHouPao(params) {
            if (params.game.currentIndex !== params.gamePlayer.index) {
                if (params.game.lastHandles && params.game.lastHandles[0].type === MJEnum_1.MJCardGroupType.GANG && params.game.currentCard.type == MJEnum_1.MJCardOriginType.INPUT) {
                    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx gangHouPao");
                    return true;
                }
            }
            return false;
        }
        event.gangHouPao = gangHouPao;
        function qiangGangHu(params) {
            if (params.game.currentIndex !== params.gamePlayer.index) {
                let trigger = params.game.container.mjtriggerManage.getTrigger(params.game.currentTrigger);
                if (trigger && trigger.lastTriggerCache) {
                    // 抢杠胡
                    //  && trigger.lastTriggerCache.cardGroupType == CardGroupType.Gang
                    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx qiangGangHu");
                    return true;
                }
            }
            return false;
        }
        event.qiangGangHu = qiangGangHu;
        function saoDiHu(params) {
            if (params.game.currentIndex === params.gamePlayer.index) {
                if (params.game.remainCards.length == 0 && params.game.fsm.state == 'output') {
                    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx saoDiHu");
                    return true;
                }
            }
        }
        event.saoDiHu = saoDiHu;
        function haiDiPao(params) {
            if (params.game.currentIndex !== params.gamePlayer.index) {
                if (params.game.remainCards.length == 0 && params.game.fsm.state == 'input') {
                    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx haiDiPao");
                    return true;
                }
            }
        }
        event.haiDiPao = haiDiPao;
        function baiPai(params) {
            if (params.game.gameConfig.baipai && params.gamePlayer.ting) {
                console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx baiPai");
                return true;
            }
        }
        event.baiPai = baiPai;
        function baiDuZhang(params) {
            if (params.game.gameConfig.baipai && params.gamePlayer.ting && params.gamePlayer.huList.length == 1) {
                console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx baiDuZhang");
                return true;
            }
        }
        event.baiDuZhang = baiDuZhang;
        function gangZhuanYi(params) {
            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx gangZhuanYi");
        }
        event.gangZhuanYi = gangZhuanYi;
    })(event = mjapi.event || (mjapi.event = {}));
})(mjapi = exports.mjapi || (exports.mjapi = {}));
