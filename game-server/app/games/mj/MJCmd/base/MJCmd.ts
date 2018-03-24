export enum MJMsgFillType {
  None = 0,
  FillMJMinSettleScores = 1,
  FillMJMaxSettleScores = 2,           //大结算
}


export enum MjBalanceSocreType {
  None = 0,
  DIANPAO = 1,              //点炮
  ZIMO = 2,                 //自摸
  TUISHUI = 3,              //退税
  ZHIGANG = 4,              //直杠
  BUGANG = 5,               //补杠
  ANGANG = 6,               //暗杠
  CHAHUAZHU = 7,            //查花猪
  CHADAJIAO = 8,            //查大叫
  HUJIAOZHUANYI = 9,        //呼叫转移
  BUYHORSEWIN = 10,         //买中赢家
  BUYHORSELOSE = 11,        //买中输家
  FOLLOW = 12,              //跟庄
  FENGMINGGANG = 13,        //风明杠
  FENGANGANG = 14,          //风暗杠
  NAOZHUANG = 15,           //闹庄
  ZHUANIAO = 16,            //抓鸟
  ZHAMA = 17,               //扎码
  YIMAQUANZHONG = 18,       //一码全中
  LIUJU = 19,               //流局
  TIANTING = 20,            //天听
  ZIMINGGANG = 21,          //字明杠
  ZIANGANG = 22,            //字暗杠
  DUANGANGSUCCESS = 23,     //赌暗杠成功
  DUANGANGFAIL = 24,        //赌暗杠失败
  DUANGANGSUCCESSONLY = 25, //赌暗杠成功（不加详细结算）
  DUANGANGFAILONLY = 26,    //赌暗杠失败（不加详细结算）
  FENGBUGANG = 27,          //风补杠
  ZIBUGANG = 28,            //字补杠
  DAGUO = 29,               //打锅
  MoYu = 30,                //摸鱼
  XuanFengGang = 31,        //旋风杠
  LuanGang = 32,            //乱杠
  DongNanXiBeiGang = 33,    //东南西北杠
  TONGNAO = 34,             //通闹
  JINGANG = 35,             //金杠
  YINGANG = 36,             //银杠
}


export enum MjHu2ClientType {
  MjHuType_Gun = 1,              //点炮
  MjHuType_Self = 2,             //自摸
  MjHuType_HaiDiLao = 3,         //海底捞
  MjHuType_QiangGangHu = 4,      //抢杠胡
  MjHuType_GangShangHua = 5,     //杠上花
  MjHuType_GunMany = 6,          //一炮多响
  MjHuType_HuJiaoZhuanYi = 7,    //呼叫转移
  MjHuType_PiCi = 8,             //皮次
  MjHuType_GangCi = 9,           //次
  MjHuType_YingFeng = 10,        //硬风
  MjHuType_RuanFeng = 11,        //软风
}


export enum MjCodeType
{
  CodeHands = 1,
  CodeGang_An = 2,
  CodeZhiGang = 3,
  CodeBuGang = 4,
  CodePeng = 5,
  CodeChi = 6,
  CodeMao = 7,
  CodeNiu = 8,
  CodeZaPeng = 9,
  CodeZaGang = 10,
  CodeBian = 11,
  CodeZuan = 12,
  CodeXuanFengGang = 13,
  CodeLuanGang = 14,
  CodeDongNanXiBeiGang = 15,

  CodeZaGang_An = 16,
  CodeNiu_DNXB = 17,
  CodeNiu_DNF = 18,
  CodeNiu_ZFB = 19,
    
  CodeJin_Gang = 20,	// 金杠
  CodeYin_Gang = 21, // 银杠
}
export enum MjCodeSpecial
{
  MjCodeHunPai = 1, // 混
  MjCodeJinPai = 2, // 金
  MjCodeCiPai  = 3, // 次
  MjCodeGuiPai = 4, // 鬼牌
  MjCodeWangPai = 5, // 王牌
  MjCodeLaiPai = 6,  // 癞牌
  MjCodeFeiPai = 7,  // 飞牌
}

export enum MjOpAction
{
	MjOpPutMj	= 1,	// 打牌
	MjOpPeng	= 2,	// 碰
	MjOpGang	= 3,	// 杠
	MjOpTing	= 4,	// 听牌
	MjOpHuPai	= 5,	// 胡牌
	MjOpPass	= 6,	// 过
	MjOpChi	= 7,	// 吃
	MjOpMao	= 8,	// 毛
	MjOpDU		= 9,	// 赌
	MjOpMingLou	= 10,	// 明楼
	MjOpTingGang	= 11,	// 听杠
	MjOpHunerYou	= 12,	// 混儿悠
	MjOpZaPeng		= 13,	// 砸碰
	MjOpZaGang		= 14,	// 砸杠
	MjOpBian		= 15,	// 边
	MjOpZuan		= 16,	// 钻
	MjOpZaGang_An	= 17,	// 砸暗杠
	MjOpJin_Gang = 18,	// 金杠
	MjOpYin_Gang = 19,	// 银杠
}

// 麻将馆牌桌信息
export enum MjTitleType
{
  dianPaoWang   = 1,   //点炮王
  ziMoWang   = 2,   //自摸王
  daPaiWang   = 3,   //大牌王
  daYingJia   = 4,   //大赢家
}

export class MjTingInfo
{
   tingcode:number;//打出那个牌听
   hucode:Array<number>;//胡的牌
   somenumber:Array<number>;//番数
   hucodenum:Array<number>;//胡的牌还剩多少张
}

enum MjHuType
{
	Gun				= 1,			//点炮
	Self				= 2,			//自摸
	HaiDiLao			= 3,			//海底捞
	QiangGangHu		= 4,			//抢杠胡
	GangShangHua		= 5,			//杠上花
	GunMany			= 6,			//一炮多响
	HuJiaoZhuanYi		= 7,			//呼叫转移
	PiCi				= 8,			//皮次
	GangCi				= 9,			//次
	YingFeng			= 10,			//硬风
	RuanFeng			= 11,			//软风
}

export class MjRoundGetBuPai
{
   nvalue:Array<number>;//新抓的牌补的花
   nput:Array<number>;//丢掉的牌
   ntype:number;//补牌类型
}


export class MjRoundGetBuPaiList
{
   round:Array<MjRoundGetBuPai>//新抓的牌补的次数
}


export class MjRulerChange
{
   rulertype:number;//规则
   type:number;//MjRulerChangeType
}
export class MjFangMaoData
{
   bhave:boolean;//是否有
   bjumbled:boolean;//是否乱毛
   nfangmaobtn:Array<number>;//放锚1东南西北2中发白32组4过
}
export class MjBuMaoData
{
   bhave:boolean;//是否有
   nbuputcode:Array<number>;//补锚打出的牌
   nbucount:number;//补了几次
}
//扩展
export class XExtendData
{
   playtype:Array<number>;//玩法类型列表
   pailist:Array<number>;//牌的ID列表
}

//新OP(客户端新需求)
export class MjNewOpActionNotify
{
   seatid:number;//座位ID
   playtype:number;//玩法类型
   chitype:Array<number>;//吃的类型（左吃1右吃2中吃3）
   bupailist:MjRoundGetBuPaiList//补牌
   changelist:Array<MjRulerChange>//规则展示替换列表
   nplaytype:Array<number>;//出牌限制
   lastputseatid:number;//上次出牌ID
   rulerresult:number;//基本规则列表
   MjCode:number;//触发的牌
   cilist:Array<number>;//次牌列表
   tinglist:Array<MjTingInfo>//听相关展示信息
   ganglist:Array<number>;//杠列表
   xdatalist:Array<XExtendData>//新的牌类型列表
}

export class MjOpActionNotify
{
   userid:number;
   seatid:Array<number>;
   opcode:MjOpAction;
   MjCode:number;
   mjrulerresult:number;接收方收到该麻将牌可能会进行的操作结果类型
   mjgangtype:number;6;
   lastputseatid:number;7;
   tinglist:Array<MjTingInfo>//听相关展示信息
   chilist:Array<number>;//吃成功的3张牌
   hutype:MjHuType//胡的类型
   ngangseatid:number;//抢的杠的ID
   nmjcodetype:number;//牌型
   maolist:Array<number>;//放的三张
   bupailist:MjRoundGetBuPaiList//新抓的牌补的次数
   isindependent:boolean;//是否独立
   independentcount:number;//独立牌数
   ganglist:Array<number>;17;
   codelist:Array<number>;//明楼牌
   ishavemao:boolean;//是否可以放毛
   isqianggang:boolean;//是否抢杠
   nmocode:number;//抹牌
   isdark:boolean;//是否暗牌
   nplaytype:Array<number>;//玩法类型
   changelist:Array<MjRulerChange>//规则展示替换列表
   cilist:Array<number>;//次牌列表
   fangmao:MjFangMaoData//放锚
   bumao:MjBuMaoData//补锚
   newnotify:MjNewOpActionNotify//新的客户端需求
   bmingangang:boolean;//明楼亮暗杠
}


export class MjScore
{
  seatid:number;
  score:number;
  isdianpao:boolean;
  ischengbao:boolean;
}

export class MjHorse
{
  seatid:number;1;
  nvalue:Array<number>;//买马
  gettype:Array<number>;//中马
}

//买马
export class MjBuyHorseNotify
{
  horse:Array<MjHorse>;
  ntype:number;//买马类型
  score:Array<MjScore>//中马分数
}
//四家买马
export class MjParseSiJiaMaiMaData
{
  nmjcode:Array<number>;//摸的牌
  ntype:Array<number>;//是否中(买中赢家，买中输家，未中)
  nhitseatid:Array<number>;//买中玩家
  nscore:Array<number>;//分数
}
//序列化玩法信息
//通用
export class MjParseCommon
{
  seatid:number;1;
  bopset:boolean;//是否设置
}
export class  MjParseSiJiaMaiMaCell
{
  comnonvalue:MjParseCommon//通用数据
  DataConfirm:MjParseSiJiaMaiMaData//特有数据
}
export class  MjSiJiaMaiMaNotify
{
nselectsubtype:number;//状态(MjSelectSubType)
datacell:Array<MjParseSiJiaMaiMaCell>//数据单元
nrulerid:number;//玩法ID
}
export class MjHorseInfo
{
  jiangma:MjBuyHorseNotify//奖马
  zhuama:MjBuyHorseNotify//抓马
  sijiamaima:MjSiJiaMaiMaNotify//四家买马
}
//新结算
export class  MjBalanceNewNotify
{
  showtype:number;//显示类型
  gametype:number;//游戏类型
  rulertype:Array<number>;
  deskid:number;//牌桌ID
  dealerseatid:number;//庄ID
  deskmgrseatid:number;//桌主ID
  balanceplayerinfo:Array<MjBalancePlayerInfo>//玩家信息
  isdraw:boolean//是否流局
  ncurbureau:number;//当前局数
  nmaxbureau:number;//最大局数
  ntime:number;//时间
  configid:number;//配置唯一ID
  horseinfo:MjHorseInfo//马信息
  timestamp:number;//小结算时间戳，格林威治时间
  winseatid:Array<number>;
}
export class  MjCheckShow
{
  nchecktype:number;//特殊类型MjCheckBaseType
  nvalue:number;//特殊值
}
export class MjTitleInfo
{
   seatid:number;//座位ID
   ntitle:Array<MjTitleType>;//称号
   nscore:number;//总分
}
export class MjBureauInfo
{
   nbureaucount:number;//第几局
   ndetailscore:Array<MjScore>//详细信息
   nwinseatid:Array<number>;//胡的玩家座位
}
export class MjBureauDetialInfo
{
   bureauinfo:MjBureauInfo//局基本信息
   nmaxsomenum:number;//最大番数
   nsomenumseatid:Array<number>;//最大番的玩家
   ndianpaocount:Array<number>;//点炮次数
   nzimocount:Array<number>;//自摸次数
   mjrecords:BestMjRecord//最佳战绩
}
export class MjUserCostInfo
{
   seatid:number;
   costticket:number;
   joinroomtime:number;
}
export class MjGameOverNotify
{
   showtype:number;//显示类型
   gametype:number;//玩法类型
   oddscount:number;//多少番
   titleinfo:Array<MjTitleInfo>;//称号信息
   bureauinfo:Array<MjBureauDetialInfo>;//局信息
   deskid:number;6;
   isshow:boolean;//是否展示
   configid:number;//配置唯一ID
   recordtime:number;//开局日期
   deskmgrid:number;//桌主ID
   urinfo:Array<MjUserCostInfo>;//玩家扣卡及进入房间时间信息
   desktype:number;//房卡类型
   bigwinneruid:number;//付卡大赢家
   islastuser:boolean;//大赢家是否最后进入房间
}
export class MjBalancePlayerInfo
{
  userid:number;//UID
  seatid:number;//座位号
  name:string//名字
  headurl:string//头像
  mjrecords:BestMjRecord//结算时手牌
  nhucode:Array<number>;
  nscore:number;//总分数
  nbureauscore:number;//当前局分数
  detailscorelist:Array<MjDetaildedScore>//分数详细
  ndianpao:number;//点炮
  nzimo:number;//自摸
  bchengbao:boolean//是否承包
  ncheck:Array<MjCheckShow>//特殊类型MjCheckBaseType
  nmatchscore:number;//积分赛分数
  nguoscore:number;//锅分[北京打锅]
  bshowguoscore:boolean//是否显示打锅分
}
export class MjSpecialType
{
  type:number;//特殊类型
  value:number;//值
}
export class MjDetaildedScore
{
  scoretype:number;//积分类型
  score:number;//分值
  seatid:Array<number>;//座位ID
  paitype:Array<number>;//牌型
  hutype:number;//胡型
  sptype:Array<MjSpecialType>//特殊胡型
}

export class BestMjRecord
{
  mjtype:number;                //玩法类型
  mjlist:Array<MjPai>           //麻将牌列表
  mjspeciallist:Array<MjPai>    //牌局特殊牌
  oddscount:number;            //多少番
  scorechange:Array<number>;//总分
  paitype:Array<number>;//牌型
  configid:number;//配置唯一ID
}
export class MjPai
{
  mjcode:number;
  codetype:MjCodeType;
  nseatid:number;
}
