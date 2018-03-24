"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MJCardGroupType;
(function (MJCardGroupType) {
    MJCardGroupType[MJCardGroupType["ZHANG"] = 0] = "ZHANG";
    MJCardGroupType[MJCardGroupType["CHI"] = 1] = "CHI";
    MJCardGroupType[MJCardGroupType["PENG"] = 2] = "PENG";
    MJCardGroupType[MJCardGroupType["GANG"] = 3] = "GANG";
    MJCardGroupType[MJCardGroupType["HU"] = 4] = "HU";
    MJCardGroupType[MJCardGroupType["BAIPAI"] = 5] = "BAIPAI";
})(MJCardGroupType = exports.MJCardGroupType || (exports.MJCardGroupType = {}));
var MJGangSubType;
(function (MJGangSubType) {
    MJGangSubType[MJGangSubType["ANGANG"] = 0] = "ANGANG";
    MJGangSubType[MJGangSubType["DIANGANG"] = 1] = "DIANGANG";
    MJGangSubType[MJGangSubType["BUGANG"] = 2] = "BUGANG";
})(MJGangSubType = exports.MJGangSubType || (exports.MJGangSubType = {}));
var MJHuQueKou;
(function (MJHuQueKou) {
    MJHuQueKou[MJHuQueKou["chi_you"] = 1] = "chi_you";
    MJHuQueKou[MJHuQueKou["chi_zuo"] = 2] = "chi_zuo";
    MJHuQueKou[MJHuQueKou["chi_zhong"] = 3] = "chi_zhong";
    MJHuQueKou[MJHuQueKou["hu_jiang"] = 4] = "hu_jiang";
    MJHuQueKou[MJHuQueKou["hu_ke"] = 5] = "hu_ke";
})(MJHuQueKou = exports.MJHuQueKou || (exports.MJHuQueKou = {}));
var MJHandleState;
(function (MJHandleState) {
    MJHandleState[MJHandleState["NONE"] = 0] = "NONE";
    MJHandleState[MJHandleState["CONFIRM"] = 1] = "CONFIRM";
    MJHandleState[MJHandleState["CANCEL"] = 2] = "CANCEL";
})(MJHandleState = exports.MJHandleState || (exports.MJHandleState = {}));
var MJHuHandleType;
(function (MJHuHandleType) {
    MJHuHandleType[MJHuHandleType["SINGLE"] = 0] = "SINGLE";
    MJHuHandleType[MJHuHandleType["MULTIPLE"] = 1] = "MULTIPLE";
})(MJHuHandleType = exports.MJHuHandleType || (exports.MJHuHandleType = {}));
var MJGangType;
(function (MJGangType) {
    MJGangType[MJGangType["ANGANG"] = 0] = "ANGANG";
    MJGangType[MJGangType["DIANGANG"] = 1] = "DIANGANG";
    MJGangType[MJGangType["BUGANG"] = 2] = "BUGANG";
    MJGangType[MJGangType["LUANGANG"] = 3] = "LUANGANG";
})(MJGangType = exports.MJGangType || (exports.MJGangType = {}));
var MJCardOriginType;
(function (MJCardOriginType) {
    MJCardOriginType[MJCardOriginType["NONE"] = 0] = "NONE";
    MJCardOriginType[MJCardOriginType["OUTPUT"] = 1] = "OUTPUT";
    MJCardOriginType[MJCardOriginType["INPUT"] = 2] = "INPUT";
})(MJCardOriginType = exports.MJCardOriginType || (exports.MJCardOriginType = {}));
var MJHuType;
(function (MJHuType) {
    MJHuType[MJHuType["None"] = 0] = "None";
    MJHuType[MJHuType["ZiMo"] = 1] = "ZiMo";
    MJHuType[MJHuType["DianPao"] = 2] = "DianPao";
})(MJHuType = exports.MJHuType || (exports.MJHuType = {}));
var MJScoreScopeType;
(function (MJScoreScopeType) {
    MJScoreScopeType[MJScoreScopeType["None"] = 0] = "None";
    MJScoreScopeType[MJScoreScopeType["One"] = 1] = "One";
    MJScoreScopeType[MJScoreScopeType["All"] = 2] = "All";
    MJScoreScopeType[MJScoreScopeType["OnePayAll"] = 3] = "OnePayAll";
})(MJScoreScopeType = exports.MJScoreScopeType || (exports.MJScoreScopeType = {}));
var MJSignType;
(function (MJSignType) {
    MJSignType[MJSignType["None"] = 0] = "None";
    MJSignType[MJSignType["Plus"] = 1] = "Plus";
    MJSignType[MJSignType["Minus"] = 2] = "Minus";
})(MJSignType = exports.MJSignType || (exports.MJSignType = {}));
exports.MJHandleMap = {
    "zhang": MJCardGroupType.ZHANG,
    "chi": MJCardGroupType.CHI,
    "peng": MJCardGroupType.PENG,
    "gang": MJCardGroupType.GANG,
    "hu": MJCardGroupType.HU
};
exports.MJHuTypeMap = {
    "zimo": MJHuType.ZiMo,
    "dianpao": MJHuType.DianPao
};
exports.MJScoreScopeTypeMap = {
    "one": MJScoreScopeType.One,
    "all": MJScoreScopeType.All,
    "chengbao": MJScoreScopeType.OnePayAll
};
exports.MJSignTypeMap = {
    "jia": MJSignType.Plus,
    "jian": MJSignType.Minus
};
//麻将花色类型
var MJHuaSeType;
(function (MJHuaSeType) {
    MJHuaSeType[MJHuaSeType["MjHuaSeType_NONE"] = 0] = "MjHuaSeType_NONE";
    MJHuaSeType[MJHuaSeType["MjHuaSeType_FENG"] = 1] = "MjHuaSeType_FENG";
    MJHuaSeType[MJHuaSeType["MjHuaSeType_WAN"] = 2] = "MjHuaSeType_WAN";
    MJHuaSeType[MJHuaSeType["MjHuaSeType_TIAO"] = 3] = "MjHuaSeType_TIAO";
    MJHuaSeType[MJHuaSeType["MjHuaSeType_TONG"] = 4] = "MjHuaSeType_TONG";
    MJHuaSeType[MJHuaSeType["MjHuaSeType_HUA"] = 5] = "MjHuaSeType_HUA";
})(MJHuaSeType = exports.MJHuaSeType || (exports.MJHuaSeType = {}));
var MJGameType;
(function (MJGameType) {
    MJGameType[MJGameType["zhang13"] = 0] = "zhang13";
    MJGameType[MJGameType["zhang10"] = 1] = "zhang10";
    MJGameType[MJGameType["zhang7"] = 2] = "zhang7";
})(MJGameType = exports.MJGameType || (exports.MJGameType = {}));
var MJCostType;
(function (MJCostType) {
    MJCostType[MJCostType["None"] = 0] = "None";
    MJCostType[MJCostType["OpenCost"] = 1] = "OpenCost";
    MJCostType[MJCostType["WinnerCost"] = 2] = "WinnerCost";
})(MJCostType = exports.MJCostType || (exports.MJCostType = {}));
