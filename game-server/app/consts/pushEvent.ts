const PushEvent = {
  onPlayerJoinGame_       : "onPlayerJoinGame_",
  onPlayerJoinGame        : "onPlayerJoinGame",
  onPlayerSitDown         : "onPlayerSitDown",
  onPlayerStandUp         : "onPlayerStandUp",
  onOnwerLeaveGame        : "onOnwerLeaveGame",
  onPlayerLeaveGame       : "onPlayerLeaveGame",
  onGamePlayerLogin       : "onGamePlayerLogin",
  onGamePlayerLogout      : "onGamePlayerLogout",
  onPlayerEntrust         : "onPlayerEntrust",
  onRestoreGameInfo       : "onRestoreGameInfo",
  onReqSwapSeat           : "onReqSwapSeat",
  onRepSwapSeat           : "onRepSwapSeat",
  onGameInit              : "onGameInit",
  onGameReady             : "onGameReady",
  onGameCancelReady       : 'onGameCancelReady',
  onGameReadyCountDown    : 'onGameReadyCountDown',
  onGameStart             : "onGameStart",
  onGameShuffle           : "onGameShuffle",
  onGameOutput            : "onGameOutput",
  onGameInput             : "onGameInput",
  onGameUpdatePlayersState: "onGameUpdatePlayersState",
  onGameOver              : "onGameOver",
  onGameFinish            : "onGameFinish",
  onRequestGameDissolve   : "onRequestGameDissolve",
  onRefreshGameDissolve   : "onRefreshGameDissolve",
  onGameDissolveResult    : "onGameDissolveResult",
  onChat                  : "onChat",
  onUpdatePlayerCoin      : "onUpdatePlayerCoin",
  onUpdatePlayerPoint     : "onUpdatePlayerPoint",
  onUpdateAgentPoint      : "onUpdateAgentPoint",
  onChatText              : "onChatText",
  onRoomCreate            : "onRoomCreate",
  onRoomChange            : "onRoomChange",
  onRoomDestroy           : "onRoomDestroy",
  onGameDestroy           : "onGameDestroy",
  onNewMail               : "onNewMail",
  onUpdateCoin            : "onUpdateCoin",
  onUpdateRoomConfig      : "onUpdateRoomConfig",
  onUpdateConfig          : "onUpdateConfig",
  onUpdateBroadcast       : "onUpdateBroadcast",
  onStopServer            : "onStopServer",
  onUserPay               : "onUserPay",
  onInviteJoinGame        : "onInviteJoinGame",//邀请好友进入房间
  onRefuseInvite          : "onRefuseInvite", //拒绝好友邀请
  onJoinFriendGame        : "onJoinFriendGame",//进入好友房间
  onRefuseJoinGame        : "onRefuseJoinGame",//拒绝加入房间
  onAgreeJoinGame         : "onAgreeJoinGame",//同意加入房间
  onAddFriend             : "onAddFriend",   //加好友
  onBindChessRoom         : "onBindChessRoom",//绑定棋牌室
  dz_onMultiple           : "dz_onMultiple", //推送倍数
  dz_onOutput_            : "dz_onOutput_",  //发牌
  dz_onShowCard           : "dz_onShowCard", //明牌
  dz_onGameStart          : "dz_onGameStart", //明牌 开始
  dz_onMakeLandlord       : "dz_onMakeLandlord_",
  dz_startInput           : "dz_startInput", //开始打牌
  dz_onInput              : "dz_onInput",
  dz_onCallZhuang         : "dz_onCallZhuang",
  dz_onRadio              : "dz_onRadio", //广播
  dz_onLiuJu              : "dz_onLiuJu",
  dz_kickPush             : "dz_kickPush",
  dz_onResult             : "dz_onResult",
  dz_onJiPaiQi            : "dz_onJiPaiQi",
  dz_onResults            : "dz_onResults",
  dz_onDouble             : "dz_onDouble",
  dz_onShowZhuang         : "",
  dz_onGameOver           : "",
  mj_onDeal_              : "mj_onDeal_",
  sz_onGameStart          : "sz_onGameStart",  //三张游戏开始
  sz_onFirstInput         : "sz_onFirstInput",
  sz_onInput              : "sz_onInput",
  sz_onOutput             : "sz_onOutput",
  sz_onBeatGroup          : "sz_onBeatGroup",
  sz_onPaiCai             : "sz_onPaiCai",
  sz_onGameOver           : "sz_onGameOver",
  sz_onGameResult         : "sz_onGameResult",
  sz_onShowCards_         : "sz_onShowCards_", //三张看牌,
  sz_onRadio              : "sz_onRadio" , //广播
  sz_onBiPai              : "sz_onBiPai", 
  sz_onBiPaiPlayers_      : "sz_onBiPaiPlayers_",
  sz_onQunBi              : "sz_onQunBi",
  sz_onShowCards          : "sz_onShowCards",
  sz_onLeave              : "sz_onLeave",
  sz_onResults            : "sz_onResults",
  sz_onJieSuan            : "sz_onJieSuan",
  dz_onReady              :"dz_onReady",
  mj_onMinSettleScores    :"mj_onMinSettleScores",
  mj_onMaxSettleScores    :"mj_onMaxSettleScores"
}

export default PushEvent
