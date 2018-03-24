"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MJComboBase_1 = require("./MJComboBase");
const MJEnum_1 = require("./consts/MJEnum");
const MJConsts = require("./consts/MJConsts");
class MJComboAlgo {
    //金钩钓（大吊车）(胡将牌)
    static existDaDiaoChe(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]金钩钓检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        if (MJComboBase_1.default.getPlayerHu(params) === true) {
            let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
            //移除碰杠之后，余两张牌则是大吊车成立
            if (MJComboBase_1.default.getCardsCount(cardsArray) === 2) {
                return 1;
            }
        }
        return 0;
    }
    //清一色
    static existQingYiSe(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]清一色检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        let nNum = -1;
        let sameCount = 0;
        for (let i = 0; i < cardsArray.length; i++) {
            if (cardsArray[i] > 0 && nNum == -1) {
                nNum = i;
            }
            if (nNum > -1 && cardsArray[i] > 0) {
                if (MJComboBase_1.default.getHuaSeByMjIndex(nNum) === MJComboBase_1.default.getHuaSeByMjIndex(i)) {
                    sameCount += cardsArray[i];
                }
            }
        }
        if (sameCount === MJComboBase_1.default.getCardsCount(cardsArray)) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]清一色检查成功", MJComboBase_1.default.getHuGamePlayer(params).index);
            return 1;
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]清一色失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
    //缺一门
    static existQueYiMen(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]缺一门检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        let wan = false;
        let tiao = false;
        let tong = false;
        for (let i = 0; i < cardsArray.length; i++) {
            if (cardsArray[i] > 0 && MJEnum_1.MJHuaSeType.MjHuaSeType_WAN === MJComboBase_1.default.getHuaSeByMjIndex(cardsArray[i])) {
                wan = true;
            }
            if (cardsArray[i] > 0 && MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO === MJComboBase_1.default.getHuaSeByMjIndex(cardsArray[i])) {
                tiao = true;
            }
            if (cardsArray[i] > 0 && MJEnum_1.MJHuaSeType.MjHuaSeType_TONG === MJComboBase_1.default.getHuaSeByMjIndex(cardsArray[i])) {
                tong = true;
            }
        }
        if (wan === false || tiao === false || tong === false) {
            return 1;
        }
        return 0;
    }
    // 七对
    static existQiDui(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]七对检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        if (MJComboBase_1.default.GetChiList(params).length > 0) {
            return 0;
        }
        let duiCount = 0;
        if (MJComboBase_1.default.GetChiList(params).length > 0) {
            return 0;
        }
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        for (let i = 0; i < cardsArray.length; i++) {
            if (cardsArray[i] === 2) {
                duiCount++;
            }
            if (cardsArray[i] === 4) {
                duiCount += 2;
            }
        }
        if (duiCount == MJComboBase_1.default.getCardsCount(tempCards) / 2) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]七对检查 -- 成功", MJComboBase_1.default.getHuGamePlayer(params).index);
            return 1;
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]七对检查 -- 失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
    //对对胡(碰碰胡，大对子，将对倒)
    static existDuiDuiHu(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]对对胡检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        if (MJComboBase_1.default.GetChiList(params).length > 0) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]对对胡检查 -- 失败", MJComboBase_1.default.getHuGamePlayer(params).index);
            return 0;
        }
        if (MJComboBase_1.default.GetChiList(params).length > 0) {
            return 0;
        }
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        //移除所有刻子
        for (let i = 0; i < cardsArray.length; i++) {
            if (cardsArray[i] == 3) {
                cardsArray[i] = 0;
            }
        }
        let mjinx;
        mjinx = MJComboBase_1.default.GetHuLastMjCard(params);
        if (cardsArray[mjinx] == 3 && MJComboBase_1.default.getCardsCount(cardsArray) === 5) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]对对胡检查 -- 成功", MJComboBase_1.default.getHuGamePlayer(params).index);
            return 1;
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]对对胡检查 -- 失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
    //断幺九
    static existDuanYaoJiu(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]断幺九检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        let mjCard_1 = 1;
        let mjCard_2 = 9;
        if (MJComboBase_1.default.existPaiBySameIndex(tempCards, 1) === false && MJComboBase_1.default.existPaiBySameIndex(tempCards, 9) === false) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]断幺九检查 --- 成功", MJComboBase_1.default.getHuGamePlayer(params).index);
            return 1;
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]断幺九检查 --- 失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
    //姊妹对(包含吃，不包含碰 杠)
    //一般高(包含碰 杠，不包含吃)
    static existYiBanGao(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一般高检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        let removeList = new Array();
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        for (let i = 0; i < 7; i++) {
            let mjCardSameIndex = MJComboBase_1.default.getMJIndexByBegin(i, 0);
            if (MJComboBase_1.default.existShunZiBySameIndex(cardsArray, MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, mjCardSameIndex, 2) === true) {
                let cardIndex = MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, mjCardSameIndex);
                removeList.push(cardIndex);
                removeList.push(cardIndex + 1);
                removeList.push(cardIndex + 2);
                removeList.push(cardIndex);
                removeList.push(cardIndex + 1);
                removeList.push(cardIndex + 2);
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一般高检查 -- 成功", MJComboBase_1.default.getHuGamePlayer(params).index);
                return 1;
            }
        }
        for (let i = 0; i < 7; i++) {
            let mjCardSameIndex = MJComboBase_1.default.getMJIndexByBegin(i, 0);
            if (MJComboBase_1.default.existShunZiBySameIndex(cardsArray, MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, mjCardSameIndex, 2) === true) {
                let cardIndex = MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, mjCardSameIndex);
                removeList.push(cardIndex);
                removeList.push(cardIndex + 1);
                removeList.push(cardIndex + 2);
                removeList.push(cardIndex);
                removeList.push(cardIndex + 1);
                removeList.push(cardIndex + 2);
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一般高检查 -- 成功", MJComboBase_1.default.getHuGamePlayer(params).index);
                return 1;
            }
        }
        // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        // console.log(mjCards);
        // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        for (let i = 0; i < 7; i++) {
            let mjCardSameIndex = MJComboBase_1.default.getMJIndexByBegin(i, 0);
            if (MJComboBase_1.default.existShunZiBySameIndex(cardsArray, MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, mjCardSameIndex, 2) === true) {
                let cardIndex = MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, mjCardSameIndex);
                removeList.push(cardIndex);
                removeList.push(cardIndex + 1);
                removeList.push(cardIndex + 2);
                removeList.push(cardIndex);
                removeList.push(cardIndex + 1);
                removeList.push(cardIndex + 2);
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一般高检查 -- 成功", MJComboBase_1.default.getHuGamePlayer(params).index);
                return 1;
            }
        }
        MJComboBase_1.default.removeCards(tempCards, removeList); //移除卡牌后，用于胡检查
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一般高检查 -- 失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
    //夹心五
    static existJiaWuXin(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        let removeList = new Array();
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]夹心五检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        let mjHuaSe;
        let SameIndex;
        let mjCardIndex;
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        mjCardIndex = MJComboBase_1.default.GetHuLastMjCard(params);
        //console.log("最后摸到的牌[%d]",this.Master_.m_PlayerMoPaiMjCode);
        [mjHuaSe, SameIndex] = MJComboBase_1.default.transform2SameIndex(mjCardIndex);
        console.log("花色[%d]同门索引[%d]", mjHuaSe, SameIndex);
        if (MJComboBase_1.default.getPlayerHu(params) === true && SameIndex === (5 - 1)) {
            let mjCardIndex_1 = SameIndex - 1;
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]夹心五检查 -- ------  1", MJComboBase_1.default.getHuGamePlayer(params).index);
            if (MJComboBase_1.default.existShunZiBySameIndex(cardsArray, mjHuaSe, mjCardIndex_1, 1) === true) {
                removeList.push(mjCardIndex_1);
                removeList.push(mjCardIndex_1 + 1);
                removeList.push(mjCardIndex_1 + 2);
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]夹心五检查 -- 成功", MJComboBase_1.default.getHuGamePlayer(params).index);
                return 1;
            }
        }
        MJComboBase_1.default.removeCards(tempCards, removeList); //移除卡牌后，用于胡检查
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]夹心五检查 -- 失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
    //平胡
    static existPingHu(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]平胡检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        console.log("牌码" + tempCards);
        let num = 0;
        let removeList = new Array();
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        for (let i = 0; i < 7; i++) {
            let mjCardSameIndex = MJComboBase_1.default.getMJIndexByBegin(i, 0);
            if (MJComboBase_1.default.existShunZiBySameIndex(cardsArray, MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, mjCardSameIndex, 3) === false) {
                if (MJComboBase_1.default.existShunZiBySameIndex(cardsArray, MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, mjCardSameIndex, 1) === true) {
                    let cardIndex = MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, mjCardSameIndex);
                    removeList.push(cardIndex);
                    removeList.push(cardIndex + 1);
                    removeList.push(cardIndex + 2);
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]平胡检查 -- 成功", MJComboBase_1.default.getHuGamePlayer(params).index);
                    num += 1;
                }
            }
            if (MJComboBase_1.default.existShunZiBySameIndex(cardsArray, MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, mjCardSameIndex, 3) === false) {
                if (MJComboBase_1.default.existShunZiBySameIndex(cardsArray, MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, mjCardSameIndex, 1) === true) {
                    let cardIndex = MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, mjCardSameIndex);
                    removeList.push(cardIndex);
                    removeList.push(cardIndex + 1);
                    removeList.push(cardIndex + 2);
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]平胡检查 -- 成功", MJComboBase_1.default.getHuGamePlayer(params).index);
                    num += 1;
                }
            }
            if (MJComboBase_1.default.existShunZiBySameIndex(cardsArray, MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, mjCardSameIndex, 3) === false) {
                if (MJComboBase_1.default.existShunZiBySameIndex(cardsArray, MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, mjCardSameIndex, 1) === true) {
                    let cardIndex = MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, mjCardSameIndex);
                    removeList.push(cardIndex);
                    removeList.push(cardIndex + 1);
                    removeList.push(cardIndex + 2);
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]平胡检查 -- 成功", MJComboBase_1.default.getHuGamePlayer(params).index);
                    num += 1;
                }
            }
        }
        if (num === 0) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]平胡检查 --- 失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        }
        MJComboBase_1.default.removeCards(tempCards, removeList); //移除卡牌后，用于胡检查
        return num;
    }
    //将将胡
    static existjiangJiangHu(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        if (MJComboBase_1.default.GetChiList(params).length > 0) {
            return 0;
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]将将胡检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        let removeList = new Array();
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, 2));
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, 2));
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, 2));
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, 5));
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, 5));
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, 5));
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, 8));
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, 8));
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, 8));
        MJComboBase_1.default.removeCards(cardsArray, removeList, 3); //移除所有2 5 8 的刻子
        if (MJComboBase_1.default.getCardsCount(cardsArray) === 2) {
            if (MJComboBase_1.default.existPaiBySameIndex(cardsArray, 2, 2) || MJComboBase_1.default.existPaiBySameIndex(cardsArray, 5, 2) || MJComboBase_1.default.existPaiBySameIndex(cardsArray, 8, 2)) {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]将将胡检查成功", MJComboBase_1.default.getHuGamePlayer(params).index);
                return 1;
            }
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]将将胡检查失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
    //一条龙
    static existYiTiaoLong(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一条龙检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        let removeList = new Array();
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        let long_Wan = true;
        let long_Tong = true;
        let long_Tiao = true;
        //万
        for (let i = 0; i < 9; i++) {
            if (cardsArray[MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, i + 1)] == 0) {
                long_Wan = false;
                removeList = [];
                break;
            }
            else {
                removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, i + 1));
            }
        }
        //条
        for (let i = 0; i < 9; i++) {
            if (cardsArray[MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, i + 1)] == 0) {
                long_Tiao = false;
                removeList = [];
                break;
            }
            else {
                removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, i + 1));
            }
        }
        //筒
        for (let i = 0; i < 9; i++) {
            if (cardsArray[MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, i + 1)] == 0) {
                long_Tong = false;
                removeList = [];
                break;
            }
            else {
                removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, i + 1));
            }
        }
        if (long_Wan === true || long_Tong === true || long_Tiao === true) {
            MJComboBase_1.default.removeCards(tempCards, removeList);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一条龙检查成功", MJComboBase_1.default.getHuGamePlayer(params).index);
            return 1;
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]一条龙失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
    //混一色
    static existHuiYiSe(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        let removeList = new Array();
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        //移除风牌
        let num = 0;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]混一色检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        if (removeGang === false) {
            let gangList = MJComboBase_1.default.GetGangList(params);
            for (let i = 0; i < gangList.length; i++) {
                if (MJComboBase_1.default.getHuaSeByMjIndex(gangList[i]) === MJEnum_1.MJHuaSeType.MjHuaSeType_FENG) {
                    cardsArray[gangList[i]] = 0;
                    num++;
                }
            }
        }
        let bJiang = false;
        for (let i = MJConsts.MJ_Feng_Begin; i < MJConsts.Mj_Jian_End; i++) {
            if (bJiang === false && cardsArray[i] == 2) {
                bJiang = true;
                cardsArray[i] = 0;
                num++;
            }
            else if (cardsArray[i] == 3) {
                cardsArray[i] = 0;
                num++;
            }
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>混一色成功" + cardsArray);
        if (num > 0 && this.existQingYiSe(params, cardsArray, removeChi, removePeng, removeGang)) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]混一色成功", MJComboBase_1.default.getHuGamePlayer(params).index);
            return 1;
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]混一色失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
    //大三元
    static existDaSanYuan(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        let num = 0;
        let removeList = new Array();
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]大三元检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        let gangnum = 0;
        if (removeGang === false) {
            let gangList = MJComboBase_1.default.GetGangList(params);
            for (let i = 0; i < gangList.length; i++) {
                if (MJComboBase_1.default.getHuaSeByMjIndex(gangList[i]) === MJEnum_1.MJHuaSeType.MjHuaSeType_FENG) {
                    removeList.push(i);
                    gangnum++;
                }
            }
        }
        if (gangnum > 0) {
            num += gangnum / 4;
        }
        for (let i = MJConsts.Mj_Jian_Begin; i <= MJConsts.Mj_Jian_End; i++) {
            if (cardsArray[i] === 3) {
                num += cardsArray[i] / 3;
                removeList.push(i);
                removeList.push(i);
                removeList.push(i);
            }
        }
        if (num === 3) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]大三元检查 -- 成功", MJComboBase_1.default.getHuGamePlayer(params).index);
            MJComboBase_1.default.removeCards(tempCards, removeList);
            return 1;
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]大三元检查 -- 失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
    //小三元
    static existXiaoSanYuan(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        let num = 0;
        let removeList = new Array();
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]小三元检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        let gangnum = 0;
        if (removeGang === false) {
            let gangList = MJComboBase_1.default.GetGangList(params);
            for (let i = 0; i < gangList.length; i++) {
                if (MJComboBase_1.default.getHuaSeByMjIndex(gangList[i]) === MJEnum_1.MJHuaSeType.MjHuaSeType_FENG) {
                    removeList.push(i);
                    gangnum++;
                }
            }
        }
        if (gangnum > 0) {
            num += gangnum / 4;
        }
        for (let i = MJConsts.Mj_Jian_Begin; i <= MJConsts.Mj_Jian_End; i++) {
            if (cardsArray[i] > 1 && cardsArray[i] < 4) {
                num += Math.ceil(cardsArray[i] / 3);
                if (cardsArray[i] === 3) {
                    removeList.push(i);
                    removeList.push(i);
                    removeList.push(i);
                }
                if (cardsArray[i] === 2) {
                    removeList.push(i);
                    removeList.push(i);
                }
            }
        }
        if (num == 3) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]小三元检查成功", MJComboBase_1.default.getHuGamePlayer(params).index);
            MJComboBase_1.default.removeCards(tempCards, removeList);
            return 1;
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]小三元检查失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
    //十八罗汉
    static existShiBaLuoHan(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        console.log("十八罗汉 杠  ", MJComboBase_1.default.GetGangList(params));
        if (MJComboBase_1.default.getGangCount(params) == 4) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]十八罗汉检查成功", MJComboBase_1.default.getHuGamePlayer(params).index);
            return 1;
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]十八罗汉检查失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
    //十三幺
    static existShiSanYao(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        let removeList = new Array();
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, 1));
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, 9));
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, 1));
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, 9));
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, 1));
        removeList.push(MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, 9));
        for (let i = MJConsts.MJ_Feng_Begin; i < MJConsts.Mj_Jian_End; i++) {
            removeList.push(i);
        }
        MJComboBase_1.default.removeCards(cardsArray, removeList);
        let bExist = false;
        for (let i = 0; i < removeList.length; i++) {
            if (cardsArray[removeList[i]] === 1) {
                bExist = true;
                break;
            }
        }
        if (MJComboBase_1.default.getCardsCount(cardsArray) === 1 && bExist) {
            return 1;
        }
        return 0;
    }
    //十三不靠。
    static existShiSanBuKao(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        //1.4.7   2.5.8  3.6.9  三色牌组成的牌形
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        let removeList = new Array();
        let huaSeAllCombo = [
            [MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, MJEnum_1.MJHuaSeType.MjHuaSeType_TONG],
            [MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO],
            [MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, MJEnum_1.MJHuaSeType.MjHuaSeType_WAN],
            [MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, MJEnum_1.MJHuaSeType.MjHuaSeType_TONG],
            [MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO],
            [MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO],
        ];
        let bExist = false;
        for (let i = 0; i < huaSeAllCombo.length; i++) {
            let bExistA = [false, false, false];
            for (let j = 0; j < huaSeAllCombo[i].length; j++) {
                let bCheck = false;
                let bExistB = [false, false, false];
                if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 1)] === 1) {
                    bExistB[0] = true;
                }
                if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 4)] === 1) {
                    bExistB[1] = true;
                }
                if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 7)] === 1) {
                    bExistB[1] = true;
                }
                if (bExistB[0] === true && bExistB[1] === true && bExistB[2] === true) {
                    bCheck = true;
                    bExistA[0] = true;
                }
                if (bCheck === false) {
                    bExistB = [false, false, false];
                    if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 2)] === 1) {
                        bExistB[0] = true;
                    }
                    if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 5)] === 1) {
                        bExistB[1] = true;
                    }
                    if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 8)] === 1) {
                        bExistB[1] = true;
                    }
                    if (bExistB[0] === true && bExistB[1] === true && bExistB[2] === true) {
                        bExistA[1] = true;
                    }
                }
                if (bCheck === false) {
                    bExistB = [false, false, false];
                    if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 3)] === 1) {
                        bExistB[0] = true;
                    }
                    if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 6)] === 1) {
                        bExistB[1] = true;
                    }
                    if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 9)] === 1) {
                        bExistB[1] = true;
                    }
                    if (bExistB[0] === true && bExistB[1] === true && bExistB[2] === true) {
                        bExistA[2] = true;
                    }
                }
            }
            if (bExistA[0] === true && bExistA[1] === true && bExistA[2] === true) {
                bExist = true;
                break;
            }
        }
        let fengNum = 0;
        for (let i = MJConsts.MJ_Feng_Begin; i < MJConsts.Mj_Jian_End; i++) {
            if (cardsArray[i] === 1) {
                fengNum++;
            }
        }
        if (bExist && fengNum === 5) {
            return 1;
        }
        return 0;
    }
    //软十三不靠
    static existRuanShiSanBuKao(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        //1.4.7   2.5.8  3.6.9  三色牌组成的牌形
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        let removeList = new Array();
        let huaSeAllCombo = [
            [MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, MJEnum_1.MJHuaSeType.MjHuaSeType_TONG],
            [MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO],
            [MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, MJEnum_1.MJHuaSeType.MjHuaSeType_WAN],
            [MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, MJEnum_1.MJHuaSeType.MjHuaSeType_TONG],
            [MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO],
            [MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO],
        ];
        let bExist = false;
        for (let i = 0; i < huaSeAllCombo.length; i++) {
            let bExistA = [0, 0, 0];
            for (let j = 0; j < huaSeAllCombo[i].length; j++) {
                let bExistB = [false, false, false];
                let bExistC = [0, 0, 0];
                let existBIndex = huaSeAllCombo[i][j] - MJEnum_1.MJHuaSeType.MjHuaSeType_WAN;
                if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 1)] === 1) {
                    bExistB[0] = true;
                }
                if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 4)] === 1) {
                    bExistB[1] = true;
                }
                if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 7)] === 1) {
                    bExistB[1] = true;
                }
                if (bExistB[0] === true && bExistB[1] === true && bExistB[2] === true) {
                    bExistC[existBIndex]++;
                }
                bExistB = [false, false, false];
                if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 2)] === 1) {
                    bExistB[0] = true;
                }
                if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 5)] === 1) {
                    bExistB[1] = true;
                }
                if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 8)] === 1) {
                    bExistB[1] = true;
                }
                if (bExistB[0] === true && bExistB[1] === true && bExistB[2] === true) {
                    bExistC[existBIndex]++;
                }
                bExistB = [false, false, false];
                if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 3)] === 1) {
                    bExistB[0] = true;
                }
                if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 6)] === 1) {
                    bExistB[1] = true;
                }
                if (cardsArray[MJComboBase_1.default.transform2Index(huaSeAllCombo[i][j], 9)] === 1) {
                    bExistB[1] = true;
                }
                if (bExistB[0] === true && bExistB[1] === true && bExistB[2] === true) {
                    bExistC[existBIndex]++;
                }
                if (bExistC[existBIndex] > 0) {
                    bExistA[existBIndex] = bExistC[existBIndex];
                }
            }
            let existNum = 0;
            for (let i = 0; i < bExistA.length; i++) {
                existNum += bExistA[i];
            }
            if (existNum === 3) {
                bExist = true;
                break;
            }
        }
        let fengNum = 0;
        for (let i = MJConsts.MJ_Feng_Begin; i < MJConsts.Mj_Jian_End; i++) {
            if (cardsArray[i] === 1) {
                fengNum++;
            }
        }
        if (bExist && fengNum === 5) {
            return 1;
        }
        return 0;
    }
    //带幺九
    static existDaiYaoJiu(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        //检查是否全幺九
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]带幺九检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        if (this.existQuanYaoJiu(params, tempCards, removeChi, removePeng, removeGang) > 0) {
            return 0;
        }
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        let num = 0;
        let tempNum = Math.ceil(cardsArray[MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, 1)] / 3);
        num += tempNum > 1 ? 1 : tempNum;
        tempNum = Math.ceil(cardsArray[MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, 1)] / 3);
        num += tempNum > 1 ? 1 : tempNum;
        tempNum = Math.ceil(cardsArray[MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, 1)] / 3);
        num += tempNum > 1 ? 1 : tempNum;
        tempNum = Math.ceil(cardsArray[MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, 9)] / 3);
        num += tempNum > 1 ? 1 : tempNum;
        tempNum = Math.ceil(cardsArray[MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, 9)] / 3);
        num += tempNum > 1 ? 1 : tempNum;
        tempNum = Math.ceil(cardsArray[MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, 9)] / 3);
        num += tempNum > 1 ? 1 : tempNum;
        let maxNum = 5;
        if (MJComboBase_1.default.getGameType(params) == MJEnum_1.MJGameType.zhang13) {
            maxNum = 5;
        }
        if (MJComboBase_1.default.getGameType(params) == MJEnum_1.MJGameType.zhang10) {
            maxNum = 4;
        }
        if (MJComboBase_1.default.getGameType(params) == MJEnum_1.MJGameType.zhang7) {
            maxNum = 3;
        }
        if (num == maxNum) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]带幺九成功", MJComboBase_1.default.getHuGamePlayer(params).index);
            return 1;
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]带幺九失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
    //全幺九
    static existQuanYaoJiu(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]全幺九检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        let removeList = new Array();
        let wan_1 = MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, 1);
        let tiao_1 = MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, 1);
        let tong_1 = MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, 1);
        let wan_9 = MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_WAN, 9);
        let tiao_9 = MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TIAO, 9);
        let tong_9 = MJComboBase_1.default.transform2Index(MJEnum_1.MJHuaSeType.MjHuaSeType_TONG, 9);
        let num = 0;
        if (cardsArray[wan_1] > 1)
            num += cardsArray[wan_1];
        if (cardsArray[tiao_1] > 1)
            num += cardsArray[tiao_1];
        if (cardsArray[tong_1] > 1)
            num += cardsArray[tong_1];
        if (cardsArray[wan_9] > 1)
            num += cardsArray[wan_9];
        if (cardsArray[tiao_9] > 1)
            num += cardsArray[tiao_9];
        if (cardsArray[tong_9] > 1)
            num += cardsArray[tong_9];
        if (num === MJComboBase_1.default.getCardsCount(cardsArray)) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]全幺九检查成功", MJComboBase_1.default.getHuGamePlayer(params).index);
            return 1;
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]全幺九失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
    //清三搭(这里只算出了三搭，请配合清一色使有)
    static existQingSanDa(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]清三搭检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        let num = 0;
        for (let i = 0; i < cardsArray.length; i++) {
            num += Math.floor(cardsArray[i] / 3);
        }
        if (num === 3) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]清三搭检查成功", MJComboBase_1.default.getHuGamePlayer(params).index);
            return 1;
        }
        return 0;
    }
    //混幺九
    static existHunYaoJiu(params, tempCards, removeChi = false, removePeng = false, removeGang = false) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]混幺九检查", MJComboBase_1.default.getHuGamePlayer(params).index);
        let cardsArray = MJComboBase_1.default.removeCardSelect(params, tempCards, removeChi, removePeng, removeGang);
        let removeList = new Array();
        if (removeGang === false) {
            let gangList = MJComboBase_1.default.GetGangList(params);
            for (let i = 0; i < gangList.length; i++) {
                if (MJComboBase_1.default.getHuaSeByMjIndex(gangList[i]) === MJEnum_1.MJHuaSeType.MjHuaSeType_FENG) {
                    removeList.push(gangList[i]);
                }
            }
        }
        for (let i = MJConsts.MJ_Feng_Begin; i < MJConsts.Mj_Jian_End; i++) {
            if (cardsArray[i] === 3) {
                removeList.push(i);
                removeList.push(i);
                removeList.push(i);
            }
            if (cardsArray[i] === 2) {
                removeList.push(i);
                removeList.push(i);
                removeList.push(i);
            }
        }
        MJComboBase_1.default.removeCards(cardsArray, removeList);
        if (MJComboBase_1.default.getCardsCount(cardsArray) > 5) {
            if (this.existQuanYaoJiu(params, cardsArray)) {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]混幺九检查成功", MJComboBase_1.default.getHuGamePlayer(params).index);
                return 1;
            }
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>[%d]混幺九检查失败", MJComboBase_1.default.getHuGamePlayer(params).index);
        return 0;
    }
}
exports.default = MJComboAlgo;
