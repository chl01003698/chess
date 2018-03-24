export enum MJCardGroupType {
  ZHANG = 0,
  CHI,
  PENG,
  GANG,
  HU,
  BAIPAI
}

export enum MJGangSubType{
	ANGANG = 0,
	DIANGANG = 1,
	BUGANG = 2
}

export enum MJHuQueKou {
  chi_you = 1,
  chi_zuo = 2,
  chi_zhong = 3,
  hu_jiang = 4,
  hu_ke = 5,
}

export enum MJHandleState {
  NONE = 0,
  CONFIRM,
  CANCEL
}

export enum MJHuHandleType {
  SINGLE = 0,
  MULTIPLE
}

export enum MJGangType {
  ANGANG = 0,
  DIANGANG,
  BUGANG,
  LUANGANG
}

export enum MJCardOriginType {
  NONE = 0,
  OUTPUT,
  INPUT
}

export enum MJHuType {
  None = 0,
  ZiMo,
  DianPao
}

export enum MJScoreScopeType {
  None = 0,
  One,
  All,
  OnePayAll
}

export enum MJSignType {
  None = 0,
  Plus,
  Minus
}


export const MJHandleMap = {
  "zhang": MJCardGroupType.ZHANG,
  "chi": MJCardGroupType.CHI,
  "peng": MJCardGroupType.PENG,
  "gang": MJCardGroupType.GANG,
  "hu": MJCardGroupType.HU
}

export const MJHuTypeMap = {
  "zimo": MJHuType.ZiMo,
  "dianpao": MJHuType.DianPao
}

export const MJScoreScopeTypeMap = {
  "one": MJScoreScopeType.One,
  "all": MJScoreScopeType.All,
  "chengbao": MJScoreScopeType.OnePayAll
}

export const MJSignTypeMap = {
  "jia": MJSignType.Plus,
  "jian": MJSignType.Minus
}

//麻将花色类型
export enum MJHuaSeType {
  MjHuaSeType_NONE = 0,
  MjHuaSeType_FENG = 1,          //风牌//中发白       
  MjHuaSeType_WAN = 2,           //万
  MjHuaSeType_TIAO = 3,          //条
  MjHuaSeType_TONG = 4,          //筒
  MjHuaSeType_HUA = 5,           //花
}
export enum MJGameType {
  zhang13,                //13张玩法
  zhang10,                //10张玩法
  zhang7,                 //7张玩法
}
export enum MJCostType
{
  None = 0,
  OpenCost = 1,              //开桌人扣卡
  WinnerCost =2,             //赢家扣卡
}