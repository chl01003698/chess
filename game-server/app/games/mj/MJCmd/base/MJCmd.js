"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MJMsgFillType;
(function (MJMsgFillType) {
    MJMsgFillType[MJMsgFillType["None"] = 0] = "None";
    MJMsgFillType[MJMsgFillType["FillMJMinSettleScores"] = 1] = "FillMJMinSettleScores";
    MJMsgFillType[MJMsgFillType["FillMJMaxSettleScores"] = 2] = "FillMJMaxSettleScores";
})(MJMsgFillType = exports.MJMsgFillType || (exports.MJMsgFillType = {}));
var MjBalanceSocreType;
(function (MjBalanceSocreType) {
    MjBalanceSocreType[MjBalanceSocreType["None"] = 0] = "None";
    MjBalanceSocreType[MjBalanceSocreType["DIANPAO"] = 1] = "DIANPAO";
    MjBalanceSocreType[MjBalanceSocreType["ZIMO"] = 2] = "ZIMO";
    MjBalanceSocreType[MjBalanceSocreType["TUISHUI"] = 3] = "TUISHUI";
    MjBalanceSocreType[MjBalanceSocreType["ZHIGANG"] = 4] = "ZHIGANG";
    MjBalanceSocreType[MjBalanceSocreType["BUGANG"] = 5] = "BUGANG";
    MjBalanceSocreType[MjBalanceSocreType["ANGANG"] = 6] = "ANGANG";
    MjBalanceSocreType[MjBalanceSocreType["CHAHUAZHU"] = 7] = "CHAHUAZHU";
    MjBalanceSocreType[MjBalanceSocreType["CHADAJIAO"] = 8] = "CHADAJIAO";
    MjBalanceSocreType[MjBalanceSocreType["HUJIAOZHUANYI"] = 9] = "HUJIAOZHUANYI";
    MjBalanceSocreType[MjBalanceSocreType["BUYHORSEWIN"] = 10] = "BUYHORSEWIN";
    MjBalanceSocreType[MjBalanceSocreType["BUYHORSELOSE"] = 11] = "BUYHORSELOSE";
    MjBalanceSocreType[MjBalanceSocreType["FOLLOW"] = 12] = "FOLLOW";
    MjBalanceSocreType[MjBalanceSocreType["FENGMINGGANG"] = 13] = "FENGMINGGANG";
    MjBalanceSocreType[MjBalanceSocreType["FENGANGANG"] = 14] = "FENGANGANG";
    MjBalanceSocreType[MjBalanceSocreType["NAOZHUANG"] = 15] = "NAOZHUANG";
    MjBalanceSocreType[MjBalanceSocreType["ZHUANIAO"] = 16] = "ZHUANIAO";
    MjBalanceSocreType[MjBalanceSocreType["ZHAMA"] = 17] = "ZHAMA";
    MjBalanceSocreType[MjBalanceSocreType["YIMAQUANZHONG"] = 18] = "YIMAQUANZHONG";
    MjBalanceSocreType[MjBalanceSocreType["LIUJU"] = 19] = "LIUJU";
    MjBalanceSocreType[MjBalanceSocreType["TIANTING"] = 20] = "TIANTING";
    MjBalanceSocreType[MjBalanceSocreType["ZIMINGGANG"] = 21] = "ZIMINGGANG";
    MjBalanceSocreType[MjBalanceSocreType["ZIANGANG"] = 22] = "ZIANGANG";
    MjBalanceSocreType[MjBalanceSocreType["DUANGANGSUCCESS"] = 23] = "DUANGANGSUCCESS";
    MjBalanceSocreType[MjBalanceSocreType["DUANGANGFAIL"] = 24] = "DUANGANGFAIL";
    MjBalanceSocreType[MjBalanceSocreType["DUANGANGSUCCESSONLY"] = 25] = "DUANGANGSUCCESSONLY";
    MjBalanceSocreType[MjBalanceSocreType["DUANGANGFAILONLY"] = 26] = "DUANGANGFAILONLY";
    MjBalanceSocreType[MjBalanceSocreType["FENGBUGANG"] = 27] = "FENGBUGANG";
    MjBalanceSocreType[MjBalanceSocreType["ZIBUGANG"] = 28] = "ZIBUGANG";
    MjBalanceSocreType[MjBalanceSocreType["DAGUO"] = 29] = "DAGUO";
    MjBalanceSocreType[MjBalanceSocreType["MoYu"] = 30] = "MoYu";
    MjBalanceSocreType[MjBalanceSocreType["XuanFengGang"] = 31] = "XuanFengGang";
    MjBalanceSocreType[MjBalanceSocreType["LuanGang"] = 32] = "LuanGang";
    MjBalanceSocreType[MjBalanceSocreType["DongNanXiBeiGang"] = 33] = "DongNanXiBeiGang";
    MjBalanceSocreType[MjBalanceSocreType["TONGNAO"] = 34] = "TONGNAO";
    MjBalanceSocreType[MjBalanceSocreType["JINGANG"] = 35] = "JINGANG";
    MjBalanceSocreType[MjBalanceSocreType["YINGANG"] = 36] = "YINGANG";
})(MjBalanceSocreType = exports.MjBalanceSocreType || (exports.MjBalanceSocreType = {}));
var MjHu2ClientType;
(function (MjHu2ClientType) {
    MjHu2ClientType[MjHu2ClientType["MjHuType_Gun"] = 1] = "MjHuType_Gun";
    MjHu2ClientType[MjHu2ClientType["MjHuType_Self"] = 2] = "MjHuType_Self";
    MjHu2ClientType[MjHu2ClientType["MjHuType_HaiDiLao"] = 3] = "MjHuType_HaiDiLao";
    MjHu2ClientType[MjHu2ClientType["MjHuType_QiangGangHu"] = 4] = "MjHuType_QiangGangHu";
    MjHu2ClientType[MjHu2ClientType["MjHuType_GangShangHua"] = 5] = "MjHuType_GangShangHua";
    MjHu2ClientType[MjHu2ClientType["MjHuType_GunMany"] = 6] = "MjHuType_GunMany";
    MjHu2ClientType[MjHu2ClientType["MjHuType_HuJiaoZhuanYi"] = 7] = "MjHuType_HuJiaoZhuanYi";
    MjHu2ClientType[MjHu2ClientType["MjHuType_PiCi"] = 8] = "MjHuType_PiCi";
    MjHu2ClientType[MjHu2ClientType["MjHuType_GangCi"] = 9] = "MjHuType_GangCi";
    MjHu2ClientType[MjHu2ClientType["MjHuType_YingFeng"] = 10] = "MjHuType_YingFeng";
    MjHu2ClientType[MjHu2ClientType["MjHuType_RuanFeng"] = 11] = "MjHuType_RuanFeng";
})(MjHu2ClientType = exports.MjHu2ClientType || (exports.MjHu2ClientType = {}));
var MjCodeType;
(function (MjCodeType) {
    MjCodeType[MjCodeType["CodeHands"] = 1] = "CodeHands";
    MjCodeType[MjCodeType["CodeGang_An"] = 2] = "CodeGang_An";
    MjCodeType[MjCodeType["CodeZhiGang"] = 3] = "CodeZhiGang";
    MjCodeType[MjCodeType["CodeBuGang"] = 4] = "CodeBuGang";
    MjCodeType[MjCodeType["CodePeng"] = 5] = "CodePeng";
    MjCodeType[MjCodeType["CodeChi"] = 6] = "CodeChi";
    MjCodeType[MjCodeType["CodeMao"] = 7] = "CodeMao";
    MjCodeType[MjCodeType["CodeNiu"] = 8] = "CodeNiu";
    MjCodeType[MjCodeType["CodeZaPeng"] = 9] = "CodeZaPeng";
    MjCodeType[MjCodeType["CodeZaGang"] = 10] = "CodeZaGang";
    MjCodeType[MjCodeType["CodeBian"] = 11] = "CodeBian";
    MjCodeType[MjCodeType["CodeZuan"] = 12] = "CodeZuan";
    MjCodeType[MjCodeType["CodeXuanFengGang"] = 13] = "CodeXuanFengGang";
    MjCodeType[MjCodeType["CodeLuanGang"] = 14] = "CodeLuanGang";
    MjCodeType[MjCodeType["CodeDongNanXiBeiGang"] = 15] = "CodeDongNanXiBeiGang";
    MjCodeType[MjCodeType["CodeZaGang_An"] = 16] = "CodeZaGang_An";
    MjCodeType[MjCodeType["CodeNiu_DNXB"] = 17] = "CodeNiu_DNXB";
    MjCodeType[MjCodeType["CodeNiu_DNF"] = 18] = "CodeNiu_DNF";
    MjCodeType[MjCodeType["CodeNiu_ZFB"] = 19] = "CodeNiu_ZFB";
    MjCodeType[MjCodeType["CodeJin_Gang"] = 20] = "CodeJin_Gang";
    MjCodeType[MjCodeType["CodeYin_Gang"] = 21] = "CodeYin_Gang";
})(MjCodeType = exports.MjCodeType || (exports.MjCodeType = {}));
var MjCodeSpecial;
(function (MjCodeSpecial) {
    MjCodeSpecial[MjCodeSpecial["MjCodeHunPai"] = 1] = "MjCodeHunPai";
    MjCodeSpecial[MjCodeSpecial["MjCodeJinPai"] = 2] = "MjCodeJinPai";
    MjCodeSpecial[MjCodeSpecial["MjCodeCiPai"] = 3] = "MjCodeCiPai";
    MjCodeSpecial[MjCodeSpecial["MjCodeGuiPai"] = 4] = "MjCodeGuiPai";
    MjCodeSpecial[MjCodeSpecial["MjCodeWangPai"] = 5] = "MjCodeWangPai";
    MjCodeSpecial[MjCodeSpecial["MjCodeLaiPai"] = 6] = "MjCodeLaiPai";
    MjCodeSpecial[MjCodeSpecial["MjCodeFeiPai"] = 7] = "MjCodeFeiPai";
})(MjCodeSpecial = exports.MjCodeSpecial || (exports.MjCodeSpecial = {}));
var MjOpAction;
(function (MjOpAction) {
    MjOpAction[MjOpAction["MjOpPutMj"] = 1] = "MjOpPutMj";
    MjOpAction[MjOpAction["MjOpPeng"] = 2] = "MjOpPeng";
    MjOpAction[MjOpAction["MjOpGang"] = 3] = "MjOpGang";
    MjOpAction[MjOpAction["MjOpTing"] = 4] = "MjOpTing";
    MjOpAction[MjOpAction["MjOpHuPai"] = 5] = "MjOpHuPai";
    MjOpAction[MjOpAction["MjOpPass"] = 6] = "MjOpPass";
    MjOpAction[MjOpAction["MjOpChi"] = 7] = "MjOpChi";
    MjOpAction[MjOpAction["MjOpMao"] = 8] = "MjOpMao";
    MjOpAction[MjOpAction["MjOpDU"] = 9] = "MjOpDU";
    MjOpAction[MjOpAction["MjOpMingLou"] = 10] = "MjOpMingLou";
    MjOpAction[MjOpAction["MjOpTingGang"] = 11] = "MjOpTingGang";
    MjOpAction[MjOpAction["MjOpHunerYou"] = 12] = "MjOpHunerYou";
    MjOpAction[MjOpAction["MjOpZaPeng"] = 13] = "MjOpZaPeng";
    MjOpAction[MjOpAction["MjOpZaGang"] = 14] = "MjOpZaGang";
    MjOpAction[MjOpAction["MjOpBian"] = 15] = "MjOpBian";
    MjOpAction[MjOpAction["MjOpZuan"] = 16] = "MjOpZuan";
    MjOpAction[MjOpAction["MjOpZaGang_An"] = 17] = "MjOpZaGang_An";
    MjOpAction[MjOpAction["MjOpJin_Gang"] = 18] = "MjOpJin_Gang";
    MjOpAction[MjOpAction["MjOpYin_Gang"] = 19] = "MjOpYin_Gang";
})(MjOpAction = exports.MjOpAction || (exports.MjOpAction = {}));
// 麻将馆牌桌信息
var MjTitleType;
(function (MjTitleType) {
    MjTitleType[MjTitleType["dianPaoWang"] = 1] = "dianPaoWang";
    MjTitleType[MjTitleType["ziMoWang"] = 2] = "ziMoWang";
    MjTitleType[MjTitleType["daPaiWang"] = 3] = "daPaiWang";
    MjTitleType[MjTitleType["daYingJia"] = 4] = "daYingJia";
})(MjTitleType = exports.MjTitleType || (exports.MjTitleType = {}));
class MjTingInfo {
}
exports.MjTingInfo = MjTingInfo;
var MjHuType;
(function (MjHuType) {
    MjHuType[MjHuType["Gun"] = 1] = "Gun";
    MjHuType[MjHuType["Self"] = 2] = "Self";
    MjHuType[MjHuType["HaiDiLao"] = 3] = "HaiDiLao";
    MjHuType[MjHuType["QiangGangHu"] = 4] = "QiangGangHu";
    MjHuType[MjHuType["GangShangHua"] = 5] = "GangShangHua";
    MjHuType[MjHuType["GunMany"] = 6] = "GunMany";
    MjHuType[MjHuType["HuJiaoZhuanYi"] = 7] = "HuJiaoZhuanYi";
    MjHuType[MjHuType["PiCi"] = 8] = "PiCi";
    MjHuType[MjHuType["GangCi"] = 9] = "GangCi";
    MjHuType[MjHuType["YingFeng"] = 10] = "YingFeng";
    MjHuType[MjHuType["RuanFeng"] = 11] = "RuanFeng";
})(MjHuType || (MjHuType = {}));
class MjRoundGetBuPai {
}
exports.MjRoundGetBuPai = MjRoundGetBuPai;
class MjRoundGetBuPaiList {
}
exports.MjRoundGetBuPaiList = MjRoundGetBuPaiList;
class MjRulerChange {
}
exports.MjRulerChange = MjRulerChange;
class MjFangMaoData {
}
exports.MjFangMaoData = MjFangMaoData;
class MjBuMaoData {
}
exports.MjBuMaoData = MjBuMaoData;
//扩展
class XExtendData {
}
exports.XExtendData = XExtendData;
//新OP(客户端新需求)
class MjNewOpActionNotify {
}
exports.MjNewOpActionNotify = MjNewOpActionNotify;
class MjOpActionNotify {
}
exports.MjOpActionNotify = MjOpActionNotify;
class MjScore {
}
exports.MjScore = MjScore;
class MjHorse {
}
exports.MjHorse = MjHorse;
//买马
class MjBuyHorseNotify {
}
exports.MjBuyHorseNotify = MjBuyHorseNotify;
//四家买马
class MjParseSiJiaMaiMaData {
}
exports.MjParseSiJiaMaiMaData = MjParseSiJiaMaiMaData;
//序列化玩法信息
//通用
class MjParseCommon {
}
exports.MjParseCommon = MjParseCommon;
class MjParseSiJiaMaiMaCell {
}
exports.MjParseSiJiaMaiMaCell = MjParseSiJiaMaiMaCell;
class MjSiJiaMaiMaNotify {
}
exports.MjSiJiaMaiMaNotify = MjSiJiaMaiMaNotify;
class MjHorseInfo {
}
exports.MjHorseInfo = MjHorseInfo;
//新结算
class MjBalanceNewNotify {
}
exports.MjBalanceNewNotify = MjBalanceNewNotify;
class MjCheckShow {
}
exports.MjCheckShow = MjCheckShow;
class MjTitleInfo {
}
exports.MjTitleInfo = MjTitleInfo;
class MjBureauInfo {
}
exports.MjBureauInfo = MjBureauInfo;
class MjBureauDetialInfo {
}
exports.MjBureauDetialInfo = MjBureauDetialInfo;
class MjUserCostInfo {
}
exports.MjUserCostInfo = MjUserCostInfo;
class MjGameOverNotify {
}
exports.MjGameOverNotify = MjGameOverNotify;
class MjBalancePlayerInfo {
}
exports.MjBalancePlayerInfo = MjBalancePlayerInfo;
class MjSpecialType {
}
exports.MjSpecialType = MjSpecialType;
class MjDetaildedScore {
}
exports.MjDetaildedScore = MjDetaildedScore;
class BestMjRecord {
}
exports.BestMjRecord = BestMjRecord;
class MjPai {
}
exports.MjPai = MjPai;
