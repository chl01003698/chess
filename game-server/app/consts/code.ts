const Code = {
  OK: {code: 200 },
  MATCH_READY_OK: {code: 201},
  FAIL: { code: 500 },
  PARAMS_ERROR: {code: 501, msg: "参数错误!"},
  NOT_EXIST_CMD: {code: 502, msg: "不存在的命令"},
  NO_EXIST_USER: {code: 503, msg: "不存在的玩家"},
  PERMISSION_ERROR: {code: 504, msg: "此用户权限不足"},
  ERROR: {code: 505, msg: "系统错误,请联系客服"},
  QUERY_NO_RESULT: {code: 506, msg: "没有查询结果"},
  NO_EXIST_SESSION: {code: 507, msg: '回话丢失, 请重新连接'},
  GATE: {
    NO_SERVER_AVAILABLE: {code: 1000, msg: "没有可用服务器"}
  },
  CONNECTOR: {
    NO_EXIST_USER: {code: 2000, msg: "不存在的玩家"},
    ALEADY_LOGIN_USER: {code: 2001, msg: "此玩家已经在其他设备登录"}
  },
  AGENT: {
    EXIST_INVITE_CODE: {code: 3000, msg: "您已绑定邀请码,不能重复绑定"},
    CAN_NOT_BIND_SELF: {code: 3001, msg: "不能绑定自己作为邀请人"},
    INVALID_INVITE_CODE: {code: 3002, msg: "无效的邀请码"},
    ALREADY_AGENT_LEVEL: {code: 3003, msg: "邀请人已经是推广员身份"}
  },
  GAME: {
    ALREADY_CREATE_GAME: {code: 4000, msg: "已经创建了房间"},
    GAME_FULL: {code: 4001, msg: "房间已满,请与房主联系!"},
    NO_EXIST_GAME: {code: 4002, msg: "房间已解散!"},
    ALREADY_JOIN_GAME: {code: 4003, msg: "已经加入房间"},
    ALREADY_EXIST_OTHER_GAME: {code: 4004, msg: "已经加入其他房间"},
    USER_NO_EXIST_IN_GAME: {code: 4005, msg: "玩家不存在房间中"},
    CREATE_GAME_ERROR: {code: 4006, msg: "创建游戏失败" },
    NO_AVAILABLE_GAME_NUMBER: { code: 4007, msg: "没有可用的房间号" },
    NOT_ENOUGH_GAMECARDS: { code: 4008, msg: "房卡数量不足,无法创建房间" },
    NEED_WAITTING_OTHERS_HANDLE: { code: 4009, msg: "等待其他玩家操作" },
    ERROR_CARD_NUMBER: { code: 4010, msg: "错误的卡牌数量" },
    NO_EXIST_CARDS: { code: 4011, msg: "不存在的卡牌" },
    NOT_HERE: {code: 4012, msg: "还没有轮到你" },
    NOT_ENOUGH_AA_GAMECARDS: { code: 4013, msg: "房间为AA消费制,钻石数量不足" },
    GAME_COUNT_LIMIT: { code: 4014, msg: "达到创建房间上限" },
    WILL_STOP_SERVER: { code: 4015, msg: "服务器即将停服维护,无法创建/加入房间" },
    MEN_PAI_ERROR: {code: 4016, msg: "闷牌不允许看牌"},
    STATE_ERROR: {code: 4017, msg: "游戏状态错误"},
    NOT_CURRENT_INDEX:  {code: 4018, msg: "不是当前操作玩家"},
    IS_LOSER: {code: 4019, msg: "比牌失败,无法再进行操作"},
    IS_GIVEUP: {code: 4020, msg: "已经弃牌,无法再进行操作"},
    NOT_ALLOW_SWAP: {code: 4021, msg: "不允许交换座位"},
    IS_ABOUT_TO_FINISH: {code: 4022, msg: "游戏即将结束,无法参加游戏"},
    MEN_PAI_ERROR1: {code: 4023, msg: "闷牌不允许比牌"},
    ZUO_BI_ERROR: {code: 4024, msg: "看牌之后只能比牌"},
    USER_NOT_CARDS: {code: 4025, msg: "用户手牌已出完"},
    USER_CARDS_ERROR: {code: 4026, msg: "卡牌不符合标准"},
    XING_CARDS_ERROR:{code: 4027, msg: "行牌错误"},
    MJ_CAN_NOT_HANDLE: { code: 4028, msg: "操作错误" },
    MJ_CARD_NUMBER_ERROR: { code: 4029, msg: "错误的手牌数量" }
  },
  USER: {
    RESPONSE_INVALID_RECEIPT: {code: 5000, msg: "认证失败,请联系客服"},
    RESPONSE_ALREADY_USED: {code: 5001, msg: "已经使用过"},
    RESPONSE_INVALID_ITEM: {code: 5002, msg: "无效的商品"},
    RESPONSE_NO_ITEM_PURCHASED: {code: 5004, msg: "没有购买的商品"},
    NO_EXIST_GAME_RESULTS: {code: 5005, msg: "还没有任何战绩"},
    INVALID_IDENTITY: { code: 5006, msg: "无效的身份证号码" },
    ALREADY_VERIFY: { code: 5007, msg: "已经完成过身份认证" },
    INVALID_REALNAME: { code: 5008, msg: "无效的姓名" },
    INVALID_PHONE_NUMBER: { code: 5009, msg: "无效的手机号码" },
    INVALID_SMS_CODE: {code: 5010, msg: "错误的验证码信息"},
    NOT_ENOUGH_SILVER: {code: 5011, msg: "没有足够的金币"},
    ALREADY_BINDCHESSROOM:{code:5012,msg:"用户已绑定棋牌室"},
    NOT_CURATOR:{code:5013,msg:"该用户不是馆长"}
  },
  DIAL: {
    ALREADY_GET_AWARD: { code: 6000, msg: "今日奖品已经领取"},
    NOT_GOLD_TYPE: { code: 6001, msg: "非钻石类奖品,请与客服联系" },
    NEED_SHARED: {code: 6002, msg: "需要先分享才能领取奖品"}
  },
  MATCH: {
    NOT_ENOUGH_SILVER: { code: 7000, msg: ""},
    IN_GAMING: {code: 7001, msg: "正在进行其他游戏,是否回去?"},
    RECOVER_GAME: {code: 7002, msg: "重新回到游戏"},
    ALREADY_QUEUING: { code: 7003, msg: "已经在排队中"},
    ALREADY_GAME_OVER: {code: 7004, msg: "游戏已经结束"}
  },
  GROUP:{
    NOT_EXIST_GROUP:{code:8000,msg:"不存在的群组"},
    ERROR:{code:8001,msg:""},
  }
}

export default Code
