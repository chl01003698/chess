"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const StateMachine = require("javascript-state-machine");
const diZhuSendCard_1 = require("./diZhuSendCard");
const _ = require("lodash");
const pushEvent_1 = require("../../../consts/pushEvent");
const pokerAlgo_1 = require("../pokerAlgo/pokerAlgo");
const scoreManage_1 = require("../../components/scoreManage");
const diZhuCallZhuang_1 = require("./diZhuCallZhuang");
const diZhuKickPull_1 = require("./diZhuKickPull");
const diZhuButton_1 = require("./diZhuButton");
const diZhuHelper_1 = require("./diZhuHelper");
const diZhuAddBei_1 = require("./diZhuAddBei");
const diZhuPlay_1 = require("./diZhuPlay");
const axios = require("axios");
var DiZhuMultipleType;
(function (DiZhuMultipleType) {
    DiZhuMultipleType[DiZhuMultipleType["INIT"] = 0] = "INIT";
    DiZhuMultipleType[DiZhuMultipleType["MING_PAI_QIAN"] = 1] = "MING_PAI_QIAN";
    DiZhuMultipleType[DiZhuMultipleType["MING_PAI_ZHONG"] = 2] = "MING_PAI_ZHONG";
    DiZhuMultipleType[DiZhuMultipleType["MING_PAI_HOU"] = 3] = "MING_PAI_HOU";
    DiZhuMultipleType[DiZhuMultipleType["QIANG_DI_ZHU"] = 4] = "QIANG_DI_ZHU";
    DiZhuMultipleType[DiZhuMultipleType["DI_PAI"] = 5] = "DI_PAI";
    DiZhuMultipleType[DiZhuMultipleType["ZHA_DAN"] = 6] = "ZHA_DAN";
    DiZhuMultipleType[DiZhuMultipleType["CHUN_TIAN"] = 7] = "CHUN_TIAN";
    DiZhuMultipleType[DiZhuMultipleType["JIA_BEI"] = 8] = "JIA_BEI";
})(DiZhuMultipleType = exports.DiZhuMultipleType || (exports.DiZhuMultipleType = {}));
function DiZhuGame(Base) {
    return class extends Base {
        constructor(...args) {
            super(...args);
            this.baseScore = 0;
            this.zhuangId = "";
            this.zhuangIndex = 0;
            this.zhuangCards = [];
            this.currentGroup = null;
            this.remainCards = {};
            this.dropCardsNumber = 0;
            this.beatIndex = 0;
            this._landLordPlayer = "";
            this.recordBeats = [];
            this.callCount = 0;
            this.winId = "";
            this.algorithm = null;
            this.playerIds = "";
            this._dealcards = "";
            this.ddz2ClearCards = [];
            this.showCards = [];
            this.lastCards = [];
            this.CardsType = "";
            this.grabLandlordNum = "";
            this.letBrandNum = 0;
            this.tmpMultiple = 1;
            this.gameResults = [];
            this._currentIndex = 0;
            this._results = [];
            this._landlordCards = [];
            this.peiCards = [];
            this.diZhuMul = [];
            this.farmers = [];
            this.showMultiple = 1;
            this.__LzCards = [];
            this.lastSid = undefined;
            this.liuju = false;
            this.isLandLordState = false;
            this.statistical = {
                grabLandlord: 1,
                bomb: 1,
                spring: 1,
                brandCard: 1,
                lowCard: 1,
                friedBomb: 1,
                tilagen: 1,
                jiabei: 1,
                rockets: 1,
            };
        }
        initFSM() {
            console.log('initFSM');
            this.get_res();
            this.fsm = new StateMachine({
                observeUnchangedState: true,
                init: "init",
                transitions: [
                    { name: "readyTrans", from: ['init', 'over'], to: "ready" },
                    { name: "startTrans", from: ["callZhuang", "ready"], to: "start" },
                    { name: "gameShowCardsTrans", from: "start", to: "gameShowCards" },
                    { name: "showCardsTrans", from: ["gameShowCards", "showCards"], to: "showCards" },
                    { name: "shuffleTrans", from: ["gameShowCards", "showCards"], to: "shuffle" },
                    { name: "outputTrans", from: "shuffle", to: "output" },
                    { name: "callZhuangTrans", from: ["callZhuang", "output"], to: "callZhuang" },
                    { name: "landOwnerTrans", from: ["callZhuang"], to: "landOwner" },
                    { name: "kickPullTrans", from: ["landOwner", "kickPull"], to: "kickPull" },
                    { name: "inputTrans", from: ["landOwner", "kickPull", "input"], to: "input" },
                    { name: "overTrans", from: "input", to: "over" },
                    { name: "finishTrans", from: "*", to: "finish" },
                    { name: 'dissolveTrans', from: "*", to: "dissolve" },
                ],
                methods: {
                    onTransition: this.onTransition.bind(this),
                    onAfterTransition: this.onAfterTransition.bind(this),
                    onBeforeDissolveTrans: this.onBeforeDissolveTrans.bind(this),
                    onEnterState: this.onEnterState.bind(this),
                    onLeaveState: this.onLeaveState.bind(this),
                    onEnterInit: this.onEnterInit.bind(this),
                    onLeaveInit: this.onLeaveInit.bind(this),
                    onEnterReady: this.onEnterReady.bind(this),
                    onEnterStart: this.onEnterStart.bind(this),
                    onEnterGameShowCards: this.onEnterGameShowCards.bind(this),
                    onEnterShowCards: this.onEnterShowCards.bind(this),
                    onEnterShuffle: this.onEnterShuffle.bind(this),
                    onEnterOutput: this.onEnterOutput.bind(this),
                    onEnterCallZhuang: this.onEnterCallZhuang.bind(this),
                    onEnterLandOwner: this.onEnterLandOwner.bind(this),
                    onEnterKickPull: this.onEnterkickPull.bind(this),
                    onEnterInput: this.onEnterInput.bind(this),
                    onEnterOver: this.onEnterOver.bind(this),
                    onLeaveOver: this.onLeaveOver.bind(this),
                    onEnterFinish: this.onEnterFinish.bind(this),
                    onEnterDissolve: this.onEnterDissolve.bind(this),
                    onInvalidTransition: this.onInvalidTransition.bind(this)
                }
            });
        }
        onEnterStart(lifecycle, arg1, arg2) {
            super.onEnterStart(lifecycle, arg1, arg2);
            _.once(() => {
                this.playerIds = this.getPlayerIds();
                this.container.playerStateManage.registerState("callZhuang", this.playerIds);
            })();
            this.grabLandlordNum = 0;
            this.showCards = [];
            this._results = [];
            // this.cards = PokerAlgo.pickCardIds(this.cards);
            if (this.roomConfig["type"] == "sd3")
                this._dealcards = new diZhuSendCard_1.DealCards(this, this.playerIds, 13, 3, this.gameConfig["ridSdCards"]);
            if (this.roomConfig["type"] == "ddz2")
                this._dealcards = new diZhuSendCard_1.DealCards(this, this.playerIds, 17, 3, this.gameConfig["ridDDZ2Cards"]);
            if (this.roomConfig["type"] == "ddz2")
                this.letBrandNum = this.roomConfig["letCards"] == undefined ? 0 : this.roomConfig["letCards"][0];
            if (this.roomConfig["type"] == "ddz4")
                this._dealcards = new diZhuSendCard_1.DealCards(this, this.playerIds, 25, 8, [], 2);
            if (this.roomConfig["type"] == "lz3")
                this._dealcards = new diZhuSendCard_1.DealCards(this, this.playerIds, 17, 3);
            if (this.roomConfig["type"] == "tdlz3")
                this._dealcards = new diZhuSendCard_1.DealCards(this, this.playerIds, 17, 3, [], 1, true);
            if (this.roomConfig["type"] == "pz3")
                this._dealcards = new diZhuSendCard_1.DealCards(this, this.playerIds, 17, 4, [], 1, false, true);
            if (this.roomConfig["type"] == "ddz3")
                this._dealcards = new diZhuSendCard_1.DealCards(this, this.playerIds, 17, 3);
            this.roomConfig["remaining"] = [1];
            this._playCard = new diZhuPlay_1.default(this, this.roomConfig, this.gameConfig);
            this.currentIndex = this._currentIndex;
            process.nextTick(() => {
                this.fsm.gameShowCardsTrans();
            });
        }
        get_res(currentRound = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                this.peiCards = [];
                // this.roomConfig["peipai"] = ["6"];
                let url = "http://192.168.221.38:5800/ddz/";
                if (this.roomConfig["peipai"] != undefined && this.roomConfig["peipai"].length > 0) {
                    if (this.roomConfig["peipai"][currentRound] != undefined) {
                        url = url + this.roomConfig["peipai"][currentRound];
                        console.log("====get_res=url=======", url);
                        let res = yield axios.default.get(url);
                        if (typeof res.data == "string")
                            res.data = JSON.parse(res.data);
                        if (typeof res.data.des == "string")
                            res.data.des = JSON.parse(res.data.des);
                        this.peiCards = res.data.des;
                    }
                }
                // return result;
            });
        }
        onEnterGameShowCards(lifecycle, arg1, arg2) {
            let gameReady = this.roomConfig["showCard"];
            let _uid = "";
            if (gameReady != undefined && gameReady[0] == 1 && this.liuju == false) {
                let action = {
                    "state": "showCard",
                    "showCard": 1,
                    "gameStart": 2,
                    "multiple": this.gameConfig["multiple"]["showMultiple"]
                };
                for (let i = 0; i < this.playerIds.length; i++) {
                    _uid = this.playerIds[i];
                    let _player = this.findPlayerByUid(_uid);
                    _player.action = action;
                }
                this.container.channel.pushMessage(pushEvent_1.default.dz_onGameStart, action); //推送明牌开始按钮
                process.nextTick(() => {
                    this.fsm.showCardsTrans();
                });
            }
            else {
                process.nextTick(() => {
                    this.fsm.shuffleTrans();
                });
            }
        }
        //明牌
        onEnterShowCards(lifecycle, uid, msg) {
            let cards = [];
            let _player = uid ? this.findPlayerByUid(uid) : "";
            let sid = "";
            let count = 0;
            let _uid = "";
            let _playerinfo = "";
            this.container.channel.pushMessage(pushEvent_1.default.dz_onReady, { sid: _player.index, uid: _player.uid });
            if (msg) {
                if (msg.state == 3) {
                    cards = _player.cards;
                    sid = _player.index;
                    if (this.showMultiple < msg.multiple) {
                        this.showMultiple = msg.multiple;
                    }
                    this.showCards.push({ cards: cards, sid: _player.index, playerId: _player.uid, cardCount: cards.length });
                    this.container.channel.pushMessage(pushEvent_1.default.dz_onShowCard, { "showCards": [{ cards: cards, sid: _player.index, playerId: _player.uid, cardCount: cards.length }] });
                    process.nextTick(() => {
                        this.fsm.shuffleTrans();
                    });
                    //  return true;
                }
                if (msg.state == 1) {
                    _player.isBrightBrand = true;
                    this.showMultiple = this.gameConfig["multiple"]["showMultiple"];
                }
                if (msg.state == 2) {
                    _player.gameStart = true;
                }
                for (let i = 0; i < this.playerIds.length; i++) {
                    _uid = this.playerIds[i];
                    _player = this.findPlayerByUid(_uid);
                    if (_player.gameStart == true || _player.isBrightBrand == true) {
                        count += 1;
                    }
                }
                if (count == this.playerIds.length) {
                    process.nextTick(() => {
                        this.fsm.shuffleTrans();
                    });
                }
            }
        }
        //洗牌
        onEnterShuffle(lifecycle, arg1, arg2) {
            // console.log("onEnterShuffle");
            super.onEnterShuffle(lifecycle, arg1, arg2);
            this.remainCards = this._dealcards.SendCards();
            process.nextTick(() => {
                this.fsm.onEnterOutput();
            });
        }
        //发牌
        onEnterOutput(lifecycle, arg1, arg2) {
            // console.log("onEnterOutput");
            let dealCards = this.remainCards["cards"];
            let _player = "";
            let _uid = "";
            let _cards = this._dealcards.defaultCards();
            this.showCards = [];
            let _num = 0;
            this.liuju = false;
            if (this.roomConfig.type == "ddz2")
                _num = 1;
            for (let i = 0; i < this.playerIds.length + _num; i++) {
                _uid = this.playerIds[i];
                if (_uid == undefined) {
                    this.ddz2ClearCards = dealCards[i];
                    continue;
                }
                _player = this.findPlayerByUid(_uid);
                _player.action = {};
                _player.cards = dealCards[i];
                _player.tmpCards = dealCards[i];
                if (_player.isBrightBrand == true) {
                    let _obj = {
                        cards: _player.cards,
                        sid: _player.index,
                        uid: _player.uid,
                        cardCount: _player.cards.length
                    };
                    this.showCards.push(_obj);
                }
                if (_player.isBrightBrand == false) {
                    if (this.roomConfig["showCard"] != undefined && this.roomConfig["showCard"][0] == 1)
                        this.container.channel.pushMessageByIds(pushEvent_1.default.dz_onGameStart, { showCard: 1 }, _uid); // 发送明牌协议
                }
            }
            diZhuHelper_1.pushMultiple(1, this, '', '');
            for (let i = 0; i < this.playerIds.length; i++) {
                _uid = this.playerIds[i];
                _player = this.findPlayerByUid(_uid);
                let _msg = {
                    cards: _cards,
                    cardsCount: _cards.length,
                };
                if (this.roomConfig["type"] == "tdlz3") {
                    _msg["LzCards"] = this.remainCards["LzCards"].slice();
                    this.__LzCards = this.remainCards["LzCards"];
                    _msg["LzCards"] = this._dealcards.getLzCards(_msg["LzCards"], _msg["LzCards"]);
                }
                if (this.roomConfig["grabLandlord"] == undefined ||
                    (this.roomConfig["grabLandlord"] != undefined &&
                        this.roomConfig["grabLandlord"].length == 1)) {
                    if (this.roomConfig["gsp"] == undefined || (this.roomConfig["gsp"][0] != 1 && this.roomConfig["gsp"][0] != "gsp")) {
                        _msg["cards"] = _player.cards;
                        _player.isFlip = false;
                    }
                }
                if (this.roomConfig["remaining"] != undefined && this.roomConfig["remaining"][0] == 2)
                    delete _msg["cardsCount"];
                if (this.roomConfig["JiPaiQi"] != undefined && this.roomConfig["JiPaiQi"][0] == 1)
                    _msg["JiPaiQI"] = this._playCard.JiPaiQi();
                _msg["currentRound"] = this.currentRound;
                _msg["roundCount"] = this.roomConfig.roundCount;
                _msg["sid"] = _player.index;
                this.container.channel.pushMessageByIds(pushEvent_1.default.dz_onOutput_, _msg, _uid);
            }
            if (this.showCards.length > 0)
                this.container.channel.pushMessage(pushEvent_1.default.dz_onShowCard, { "showCards": this.showCards });
            this.zhuangCards = this.remainCards["lordCards"];
            this._landlordCards = this.zhuangCards.slice(0);
            process.nextTick(() => {
                this.fsm.callZhuangTrans(this.playerIds[this.currentIndex]);
            });
            if (this['gameRecord'] != undefined)
                this['gameRecord'].setPlayers(this.playerIds, pokerAlgo_1.PokerAlgo.pickCardIds(this.zhuangCards));
        }
        //叫地主
        onEnterCallZhuang(lifecycle, uid, msg) {
            // console.log("onEnterCallZhuang", uid, msg);
            let action = diZhuHelper_1.callZhuang(this, uid, msg);
            if (!action) {
                this.liuJuTemplate();
                return true;
            }
            if (action["landlord"] == true) {
                process.nextTick(() => {
                    this.fsm.landOwnerTrans(action);
                });
                return true;
            }
            return true;
        }
        //确定地主
        onEnterLandOwner(lifecycle, action, arg2) {
            // console.log("onEnterLandOwner", action);
            this.isLandLordState = true;
            let players = [];
            let cards = "";
            let _uid = "";
            let _player = "";
            let _sid = "";
            let _kickPull = "";
            let _addTimes = "";
            let _kickObj = {};
            let _msg = "";
            let speakSid = "";
            let speakUid = "";
            this.tmpMultiple = 1;
            let landlordCount = 0;
            let farmers = [];
            for (let i = 0; i < this.playerIds.length; i++) {
                _uid = this.playerIds[i];
                _player = this.findPlayerByUid(_uid);
                _player.action = {};
                if (_uid == action["playerId"])
                    if (action["grabLandlord"] == false)
                        _player.grabLandlord = action["grabLandlord"];
                if (_uid == action["playerId"]) {
                    _player.identity = "landlord";
                    _player.cards = _.concat(_player.cards, this.zhuangCards);
                    landlordCount = _player.cards.length;
                    this._landLordPlayer = _player;
                    if ((this.roomConfig["play"] != undefined && this.roomConfig["play"][0] == 3)
                        || (this.roomConfig["add_multiple"] != undefined && this.roomConfig["add_multiple"] == 2) ||
                        (this.roomConfig["play"] == undefined && this.roomConfig["add_multiple"] == undefined)) {
                        speakSid = _player.index;
                        speakUid = _player.uid;
                        _player.action = diZhuButton_1.diZhuButton.sendCard;
                    }
                    players.push(_player);
                    continue;
                }
                _player.identity = "farmers";
                let obj = {
                    sid: _player.index,
                    multiple: _player.multiple,
                    uid: _player.uid
                };
                this.farmers.push(_player);
                this.diZhuMul.push({
                    sid: _player.index,
                    multiple: _player.multiple,
                    uid: _player.uid
                });
                players.push(_player);
            }
            if (this.roomConfig["type"] != "ddz2") {
                let diZhuMul = this.diZhuMul[0]["multiple"] * (this.gamePlayers.length - 1);
                this._landLordPlayer.multiple = diZhuMul;
                this.diZhuMul.push({
                    sid: this._landLordPlayer.index,
                    multiple: this._landLordPlayer.multiple,
                    uid: this._landLordPlayer.uid
                });
                diZhuHelper_1.pushMultiple("", this);
            }
            this.diZhuMul = [];
            if (this.roomConfig["play"] != undefined && this.roomConfig["play"][0] != 3 && this.roomConfig["play"][0] != undefined) {
                _kickPull = new diZhuKickPull_1.default(players, this.roomConfig, this._landLordPlayer.index, this.gameConfig, this._landLordPlayer);
                _kickObj = _kickPull._get_kickSid();
                if (_kickObj["sid"] != undefined) {
                    _player = this.findPlayerByUid(_kickObj["uid"]);
                    _player.action = diZhuButton_1.diZhuButton.kickDefault.action;
                }
                else {
                    this._landLordPlayer.action = diZhuButton_1.diZhuButton.sendCard;
                }
            }
            if (this.roomConfig["add_multiple"] != undefined && this.roomConfig["add_multiple"][0] == 1) {
                _addTimes = new diZhuAddBei_1.AddMultiple(this.gameConfig, players, this._landLordPlayer.uid, this._landLordPlayer);
                this.container.channel.pushMessage(pushEvent_1.default.dz_onDouble, diZhuButton_1.diZhuButton.addTimes.action);
                for (let i = 0; i < this.gamePlayers.length; i++) {
                    this.gamePlayers[i]["action"] = diZhuButton_1.diZhuButton.addTimes.action;
                    this.gamePlayers[i].isDouble = true;
                }
                // let _addTimes_sid = next_player_id(this._landLordPlayer.index, players);
                // let __uid = this.playerIds[_addTimes_sid];
                // let __player = this.findPlayerByUid(__uid);
                // __player.action = diZhuButton.addTimes.action;
                // speakSid = __player.index;
                // speakUid = __player.uid;
            }
            let LzCards = [];
            let __tmpLzCards = [];
            if (this.roomConfig["type"] == "lz3" || this.roomConfig["type"] == "tdlz3") {
                let _tmpLzCards = this._dealcards.generateLz(this.remainCards["LzCards"]);
                this.__LzCards = _tmpLzCards.slice();
                let tmpLzCards = _tmpLzCards.pop();
                LzCards.push(tmpLzCards);
                // LzCards = ["04"]
                __tmpLzCards = LzCards.slice();
                LzCards = this._dealcards.getLzCards(LzCards, LzCards);
            }
            if (this.roomConfig["graspBottom"] != undefined && this.roomConfig["graspBottom"][0] == 2) {
                this._playCard.checkLowCardAsync(this.zhuangCards);
            }
            for (var i = 0; i < this.playerIds.length; i++) {
                _uid = this.playerIds[i];
                _player = this.findPlayerByUid(_uid);
                _msg = {};
                if (this.roomConfig["letCards"] != undefined) {
                    _msg["letBrandNum"] = this.letBrandNum;
                }
                _msg["isFlip"] = _player.isFlip;
                _msg["cards"] = _player.cards;
                if (_uid == action["playerId"])
                    _msg["cards"] = _player.cards;
                if (LzCards.length > 0) {
                    _player.cards = this._dealcards.getLzCards(_player.cards, __tmpLzCards);
                    _msg["cards"] = _player.cards;
                    _msg["LzCards"] = LzCards;
                }
                if (this.roomConfig["JiPaiQi"] != undefined && this.roomConfig["JiPaiQi"][0] == 1)
                    _msg["JiPaiQI"] = this._playCard.JiPaiQi();
                if (this.roomConfig["add_multiple"] == undefined || this.roomConfig["add_multiple"][0] != 1) {
                    if (_player.action.state) {
                        speakSid = _player.index;
                        speakUid = _player.uid;
                        _msg["action"] = _player.action;
                        _msg["state"] = _player.action.state;
                    }
                }
                _msg["speakSid"] = _kickObj["sid"] != undefined ? _kickObj["sid"] : speakSid;
                _msg["speakUid"] = _kickObj["sid"] != undefined ? this.playerIds[_kickObj["sid"]] : speakUid;
                if (_player.identity == "landlord")
                    _msg["cards"] = _player.cards;
                _msg["zhuangCards"] = this.zhuangCards;
                _msg["identity"] = _player.identity;
                _msg["landlordSid"] = this._landLordPlayer.index;
                _msg["landlordUid"] = this._landLordPlayer.uid;
                if (this.roomConfig["remaining"] == undefined || this.roomConfig["remaining"][0] == undefined || this.roomConfig["remaining"][0] == 1)
                    _msg["cardsCount"] = _player.cards.length;
                _msg["landlordCount"] = landlordCount;
                _msg["uid"] = _player.uid;
                _msg["sid"] = _player.sid;
                this.container.channel.pushMessageByIds(pushEvent_1.default.dz_onMakeLandlord, _msg, _uid);
            }
            this._landlordCards = [];
            if (_kickObj["sid"] != undefined || (this.roomConfig["add_multiple"] != undefined && this.roomConfig["add_multiple"][0] == 1)) {
                process.nextTick(() => {
                    this.fsm.kickPullTrans();
                });
            }
            else {
                process.nextTick(() => {
                    this.fsm.inputTrans();
                });
            }
        }
        //踢拉
        onEnterkickPull(lifecycle, uid, msg) {
            // console.log("onEnterkickPull", uid);
            if (uid) {
                let _action = diZhuHelper_1.kickFollow(this, uid, msg);
                console.log("====_action=", _action);
                if (_action["startPlay"] == true) {
                    this._landLordPlayer.action = diZhuButton_1.diZhuButton.sendCard;
                    let _msg = {
                        action: diZhuButton_1.diZhuButton.sendCard.action,
                        sid: this._landLordPlayer.index,
                        playerId: this._landLordPlayer.uid,
                        state: diZhuButton_1.diZhuButton.sendCard.state
                    };
                    this.container.channel.pushMessage(pushEvent_1.default.dz_startInput, _msg);
                    process.nextTick(() => {
                        this.fsm.inputTrans();
                    });
                }
            }
        }
        //打牌
        onEnterInput(lifecycle, uid, msg) {
            // console.log("onEnterInput", uid, msg);
            if (uid) {
                let _player = this.findPlayerByUid(uid);
                _player.action = {};
                let sendCards = this._playCard.play(msg, uid);
                if (sendCards == false) {
                    process.nextTick(() => {
                        this.fsm.inputTrans();
                    });
                }
                else {
                    process.nextTick(() => {
                        this.fsm.overTrans(uid);
                    });
                }
            }
        }
        //結算
        onEnterOver(lifecycle, uid, arg2) {
            // console.log("onEnterOver");
            this.pushResult(uid);
            let _uid = "";
            let _player = {};
            for (let i = 0; i < this.playerIds.length; i++) {
                _uid = this.playerIds[i];
                _player = this.findPlayerByUid(_uid);
            }
            super.onEnterOver(lifecycle, uid, arg2);
        }
        getFinishData(data) {
            data.results = this.gameResults;
        }
        pushResult(uid, isFlowBureau = 0) {
            console.log("======pushResult=====");
            this.get_res(this.currentRound + 1);
            let isSpring = this._playCard.checkspringAsync();
            let player = this.findPlayerByUid(uid);
            let landowner = false;
            let _uid = "";
            let _player = {};
            let res = {};
            let isLandlord = false;
            let isFenDin = false;
            let _poins = 0;
            let tempObj = {};
            if (this.roomConfig["cardLandlord"] != undefined && this.roomConfig["cardLandlord"][0] == 2) {
                this._currentIndex = player.index;
            }
            else {
                this._currentIndex = diZhuCallZhuang_1.next_player_id(this.currentIndex, this.playerIds);
            }
            // this.currentIndex = "";
            if (player["identity"] == "landlord")
                landowner = true;
            if (isSpring == true)
                diZhuHelper_1.pushMultiple(this.gameConfig.multiple.spring, this, "spring");
            this.points(landowner);
            this._results = [];
            let results = [];
            for (let i = 0; i < this.playerIds.length; i++) {
                _uid = this.playerIds[i];
                _player = this.findPlayerByUid(_uid);
                let _msg = {
                    playerId: _uid,
                    type: _player["identity"],
                    win: _player.points,
                    victory: 0,
                    sid: _player.index,
                    cards: _player.cards,
                    isFlowBureau: isFlowBureau,
                    isFenDing: _player.isFenDing,
                    tmpCards: _player.tmpCards,
                    bomb: _player.bomb,
                    multiple: _player.multiple,
                    score: _player.score,
                };
                if (isSpring == true)
                    _msg["isSpring"] = isSpring;
                if (landowner == true) {
                    if (_player["identity"] == "landlord")
                        _msg["victory"] = 1;
                }
                else {
                    _msg["victory"] = 0;
                }
                res = Object.assign(_msg, _player.statistical);
                results.push(res);
                this._results.push(res);
            }
            this.gameResults.push(results);
            this.container.channel.pushMessage(pushEvent_1.default.dz_onResult, {
                results: results,
                currentRound: this.currentRound,
                roundCount: this.roomConfig.roundCount,
                successPlayer: {
                    uid: player.uid,
                    sid: player.index,
                    lastCards: this.lastCards,
                    cardsType: this.CardsType
                }
            });
        }
        //算分
        points(isLandlord = false) {
            this.roomConfig["baseScore"].sort((a, b) => a - b);
            let diZhuScore = 0;
            for (let i = 0; i < this.farmers.length; i++) {
                let _player = this.farmers[i];
                let score = 0;
                if (this.roomConfig["baseScore"].length != 0 &&
                    this.roomConfig["baseScore"].indexOf(0) == -1
                    && this._landLordPlayer["multiple"] > this.roomConfig["baseScore"][0]) {
                    score = Math.round(parseInt(_player.multiple) / parseInt(this._landLordPlayer.multiple) * parseInt(this.roomConfig["baseScore"][0]));
                    this._landLordPlayer.isFenDing = true;
                }
                else {
                    score = _player.multiple;
                }
                diZhuScore = diZhuScore + score;
                if (isLandlord == true)
                    score = parseInt("-" + score);
                _player.score += score;
                _player.points = score;
            }
            if (isLandlord == false)
                diZhuScore = parseInt("-" + diZhuScore);
            this._landLordPlayer.score += diZhuScore;
            this._landLordPlayer.points += diZhuScore;
            return true;
        }
        saveCurrentRoundGamePlayer(roundObject, GamePlayer, index) {
            if (index >= 0) {
                _.assign(roundObject, this._results[index]);
            }
        }
        onJiPaiQi(uid, msg) {
            if (uid) {
                let _player = this.findPlayerByUid(uid);
                _player.JiPaiQI = msg["choosed"];
                if (_player.JiPaiQi == true)
                    this.container.channel.pushMessageByIds(pushEvent_1.default.dz_onJiPaiQi, { JiPaiQI: this._playCard.JiPaiQi(), sid: _player.index, uid: uid, JiPaiQi: msg["choosed"] }, uid);
                if (_player.JiPaiQi == false)
                    this.container.channel.pushMessageByIds(pushEvent_1.default.dz_onJiPaiQi, { sid: _player.index, uid: uid, JiPaiQi: msg["choosed"] }, uid);
            }
        }
        onShowCards(uid, msg) {
            let cards = [];
            let _player = uid ? this.findPlayerByUid(uid) : "";
            let sid = "";
            let count = 0;
            let _uid = "";
            console.log("this.showMultiple", this.showMultiple, "===msg.multiple===", msg.multiple);
            if (msg) {
                if (msg.state == 3) {
                    cards = _player.cards;
                    sid = _player.index;
                    _player.isBrightBrand = true;
                    if (this.showMultiple < msg.multiple) {
                        this.showMultiple = msg.multiple;
                        diZhuHelper_1.pushMultiple(this.showMultiple, this, "brandCard"); //明牌
                    }
                    this.showCards.push({ cards: cards, sid: _player.index, playerId: _player.uid, cardCount: cards.length });
                    this.container.channel.pushMessage(pushEvent_1.default.dz_onShowCard, { "showCards": [{ cards: cards, sid: _player.index, playerId: _player.uid, cardCount: cards.length }] });
                    return true;
                }
            }
        }
        getResults(uid) {
            this.container.channel.pushMessageByIds(pushEvent_1.default.dz_onResults, { results: this.gameResults }, uid);
        }
        liuJuTemplate() {
            this.container.channel.pushMessage(pushEvent_1.default.dz_onLiuJu, { flowBureau: 1 }); // 流局
            // this.pushResult(uid,1);            
            this._currentIndex = diZhuCallZhuang_1.next_player_id(this.currentIndex, this.playerIds);
            this.reset();
            this.liuju = true;
            diZhuHelper_1.pushMultiple(1, this);
            process.nextTick(() => {
                this.fsm.startTrans();
            });
        }
        getFirstCallGamePlayer() {
            if (this.winId == "") {
                return this.gamePlayers[_.random(0, this.playerCount - 1)];
            }
            return this.findPlayerByUid(this.winId);
        }
        takeCurrentBeat() {
            return _.takeRight(_.clone(this.recordBeats), this.playerCount - 1);
        }
        getSumScore() {
            return this.container.scoreManage.sumScoresByMultiple(2);
        }
        clientInfo(uid) {
            let clientInfo = super.clientInfo(uid);
            for (let i = 0; i < clientInfo.gamePlayers.length; i++) {
                if (this.owner) {
                    if (clientInfo.gamePlayers[i].id == this.owner.id)
                        clientInfo.gamePlayers[i].isOwner = true;
                }
                for (let j = 0; j < clientInfo.readyIds.length; j++) {
                    if (clientInfo.gamePlayers[i].id == clientInfo.readyIds[j])
                        clientInfo.gamePlayers[i].ready = true;
                }
            }
            clientInfo['baseScore'] = this.baseScore;
            clientInfo['zhuangId'] = this._landLordPlayer.uid;
            clientInfo["zhuanSid"] = this._landLordPlayer.index;
            clientInfo['beatCards'] = [];
            if (this.currentGroup != null) {
                clientInfo['beatCards'] = pokerAlgo_1.PokerAlgo.pickCardIds(this.currentGroup.cards);
            }
            clientInfo['beatIndex'] = this.beatIndex;
            clientInfo['recordBeats'] = this.takeCurrentBeat();
            if (this._landLordPlayer) {
                clientInfo['zhuangId'] = this._landLordPlayer.uid;
                clientInfo["zhuanSid"] = this._landLordPlayer.index;
            }
            clientInfo["showCards"] = this.showCards;
            clientInfo["lastCards"] = this.lastCards;
            clientInfo["cardsType"] = this.CardsType;
            if (this.roomConfig.type == "tdlz3" || this.roomConfig.type == "lz3") {
                if (this.__LzCards.length > 0) {
                    clientInfo["LzCards"] = this.__LzCards;
                }
            }
            if (uid && this.isStart == true) {
                let flag = this.checkDouble();
                let player = this.findPlayerByUid(uid);
                clientInfo["sid"] = player.index;
                clientInfo["cards"] = player.cards;
                let _player = "";
                let _uid = "";
                let playerInfos = [];
                let action = {};
                let saySid = 0;
                let sayUid;
                if (this.isLandLordState == true) {
                    clientInfo["zhuangCards"] = this.zhuangCards;
                }
                else {
                    clientInfo["zhuangCards"] = [];
                    for (let i = 0; i < this.zhuangCards.length; i++) {
                        clientInfo["zhuangCards"].push("-1");
                    }
                    if ((this.roomConfig["grabLandlord"] && this.roomConfig["grabLandlord"].length > 1) ||
                        (this.roomConfig["gsp"] != undefined && (this.roomConfig["gsp"][0] == 1 || this.roomConfig["gsp"][0] == "gsp"))) {
                        if (player.isSpeack == false) {
                            clientInfo["cards"] = [];
                            for (let i = 0; i < player.cards.length; i++) {
                                clientInfo["cards"].push("-1");
                            }
                        }
                    }
                }
                clientInfo["lastCards"] = this.lastCards;
                clientInfo["cardsType"] = this.CardsType;
                if (this.roomConfig["JiPaiQi"] != undefined && this.roomConfig["JiPaiQi"][0] == 1)
                    clientInfo["JiPaiQi"] = this._playCard.JiPaiQi();
                for (let i = 0; i < this.playerIds.length; i++) {
                    _uid = this.playerIds[i];
                    _player = this.findPlayerByUid(_uid);
                    let obj = {
                        "cardsStack": _player.cardsStack,
                        "sid": _player.index,
                        "multiple": _player.multiple,
                        "integral": _player.score,
                        "uid": _player.uid,
                    };
                    if (this.roomConfig["remaining"] != 2)
                        obj["cardsCount"] = _player.cards.length;
                    if (flag == false) {
                        if (_player["action"]["state"]) {
                            action = _player.action;
                            saySid = _player.index;
                            sayUid = _player.uid;
                        }
                    }
                    obj["landlordSid"] = this._landLordPlayer.index;
                    obj["landlordUid"] = this._landLordPlayer.uid;
                    if (_player.isBrightBrand == true)
                        obj["showCards"] = _player.cards;
                    playerInfos.push(obj);
                }
                if (player.isDouble == false && flag == false) {
                    clientInfo["action"] = action;
                }
                if (flag == true) {
                    clientInfo["isDouble"] = true;
                }
                clientInfo["saySid"] = player["action"]["state"] == "showCard" ? player.index : saySid;
                clientInfo["sayUid"] = player["action"]["state"] == "showCard" ? player.uid : sayUid;
                clientInfo["playerInfos"] = playerInfos;
                clientInfo["statistical"] = this.statistical;
                if (this._results != undefined && this._results.length > 0)
                    clientInfo["results"] = this._results;
            }
            return clientInfo;
        }
        //检查是否有加倍
        checkDouble() {
            for (let i = 0; i < this.gamePlayers.length; i++) {
                if (this.gamePlayers[i].isDouble == true)
                    return true;
            }
            return false;
        }
        reset() {
            super.reset();
            this.baseScore = 0;
            this.zhuangId = "";
            this.zhuangCards = [];
            this.beatIndex = 0;
            this.recordBeats = [];
            this.callCount = 0;
            this._dealcards = "";
            this.letBrandNum = 0;
            this.lastCards = [];
            this.CardsType = "";
            this.tmpMultiple = 1;
            this.lastSid = undefined;
            this.isLandLordState = false;
            this.statistical = {
                grabLandlord: 1,
                bomb: 1,
                spring: 1,
                brandCard: 1,
                lowCard: 1,
                friedBomb: 1,
                rockets: 1,
            };
            this.ddz2ClearCards = [];
            this.showCards = [];
            this.farmers = [];
            this.showMultiple = 1;
            this._landLordPlayer = "";
            this._landlordCards = [];
        }
        getOverResult(gamePlayer) {
            let chuntian = false;
            if (gamePlayer.uid == this.zhuangId) {
                chuntian = _.chain(this.gamePlayers).filter((v) => v.uid != this.zhuangId).every((v) => v.inputCount == 0).value();
            }
            else {
                chuntian = _.chain(this.gamePlayers).find({ 'uid': this.zhuangId }).get('inputCount').eq(1).value();
            }
            if (chuntian) {
                this.container.scoreManage.pushScore(scoreManage_1.createMultipleScore(2, null, DiZhuMultipleType.CHUN_TIAN));
            }
            const sumScore = this.getSumScore();
            let zhuangScore = 0;
            let sentScore = 0;
            if (gamePlayer.uid == this.zhuangId) {
                zhuangScore = sumScore * (this.playerCount - 1);
                sentScore = -sumScore;
            }
            else {
                zhuangScore = -sumScore * (this.playerCount - 1);
                sentScore = sumScore;
            }
            return [chuntian, zhuangScore, sentScore];
        }
    };
}
exports.default = DiZhuGame;
