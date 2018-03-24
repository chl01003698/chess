"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateMachine = require("javascript-state-machine");
const _ = require("lodash");
const pushEvent_1 = require("../../../consts/pushEvent");
const sanZhangGamePlayer_1 = require("./sanZhangGamePlayer");
const friendGame_1 = require("../../friendGame");
const pokerAlgo_1 = require("../pokerAlgo/pokerAlgo");
const sanzhangAlgo_1 = require("../pokerAlgo/sanzhang/sanzhangAlgo");
const sanZhangBeat_1 = require("../pokerAlgo/sanzhang/sanZhangBeat");
const Raven = require("raven");
class SanZhangGame extends friendGame_1.default {
    constructor(...args) {
        super(...args);
        this.zhuangId = "";
        this.baseScore = 1;
        this.onceScore = 0;
        this.sumScore = 0; // 总筹码
        this.scores = []; //座子下注的筹码
        this.beatPlayers = [];
        this.sitdownPlayers = [];
        this.currBetRound = 0;
        this.maxBetRound = 19;
        this.timeout = 0;
        this.addBets = [];
        this.beatIds = [];
        this.zhuangIndex = undefined;
        this.playerIds = [];
        this.LzCards = [];
        this.nextPlayer = ""; //下一个用户的情况
        this.wheelNum = 0;
        this.tmpzhuanIndex = 0;
        this.topPlayer = undefined; //上一个用户 下注情况 及其是否是闷牌
        this.betArray = []; //下注数量  每一轮下注数量
        this.chip = 1;
        this.isBrand = false; //是否有人
        this.tmpZhuanPlayer = undefined;
        this.zhuanQiCards = false;
        this._sidIds = [];
        this.qiongbi = false;
        this.isErSanWuEatBaoZi = false;
        this.sChip = 0;
        this.mChip = 0;
        this.sAddBets = [];
        this.mAddBets = [];
        this.disPlayer = [];
        this.gameResults = [];
        this._results = [];
        this.victoryPlayer = [];
        this.isInitiateHuoPin = false;
        this.DaXiPlayer = undefined;
        this.peiCards = [];
        this.chips = [];
        this.biPaiPlayerList = [];
        this.watchPlayerList = [];
        this.watchArr = [];
        this.huoPinPlayer = [];
    }
    initFSM() {
        this.fsm = new StateMachine({
            observeUnchangedState: true,
            init: "init",
            transitions: [
                { name: "readyTrans", from: ["over", "init"], to: "ready" },
                { name: "startTrans", from: "ready", to: "start" },
                { name: "shuffleTrans", from: "start", to: "shuffle" },
                { name: "outputTrans", from: "shuffle", to: "output" },
                { name: "inputTrans", from: ["output", "input"], to: "input" },
                { name: "overTrans", from: "input", to: "over" },
                { name: "finishTrans", from: "*", to: "finish" },
                { name: 'dissolveTrans', from: "*", to: "dissolve" }
            ],
            methods: {
                onTransition: this.onTransition.bind(this),
                onEnterState: this.onEnterState.bind(this),
                onAfterTransition: this.onAfterTransition.bind(this),
                onBeforeDissolveTrans: this.onBeforeDissolveTrans.bind(this),
                onEnterInit: this.onEnterInit.bind(this),
                onEnterStart: this.onEnterStart.bind(this),
                onEnterReady: this.onEnterReady.bind(this),
                onEnterShuffle: this.onEnterShuffle.bind(this),
                onEnterOutput: this.onEnterOutput.bind(this),
                onEnterInput: this.onEnterInput.bind(this),
                onBeforeOverTrans: this.onBeforeOverTrans.bind(this),
                onEnterOver: this.onEnterOver.bind(this),
                onLeaveOver: this.onLeaveOver.bind(this),
                onEnterFinish: this.onEnterFinish.bind(this),
                onEnterDissolve: this.onEnterDissolve.bind(this),
                onInvalidTransition: this.onInvalidTransition.bind(this)
            }
        });
    }
    bindKeyMessage(gamePlayer, evetName, cb = undefined) {
        gamePlayer.emitter.once(evetName, (data, gamePlayer) => {
            this.container.channel.pushMessage(this.gameConfig['prefix'] + evetName, data);
            if (_.isFunction(cb)) {
                cb(data, gamePlayer);
            }
        });
    }
    onEnterInit(lifecycle, arg1, arg2) {
        super.onEnterInit(lifecycle, arg1, arg2);
        this.baseScore = 1;
        this.maxBetRound = 19;
        this.disPlayer = [];
        this._results = [];
        this.sumScore = 0;
        this.isErSanWuEatBaoZi = false;
    }
    onEnterStart(lifecycle, arg1, arg2) {
        // console.log("====onEnterStart==this.readyIds====",this.readyIds);
        super.onEnterStart(lifecycle, arg1, arg2);
        if ((this.roomConfig.wanfa != undefined && this.roomConfig.wanfa[0] == 1) ||
            (this.roomConfig.type != undefined && this.roomConfig.type == "sd")) {
            this.cards = pokerAlgo_1.PokerAlgo.initCards(10, 15, false); //10--->A
        }
        else {
            this.cards = pokerAlgo_1.PokerAlgo.initCards(2, 15, false); // 2--->A
        }
        this.onceScore = this.gameConfig.initOnceScore;
        // this.beatPlayers = _.clone(this.gamePlayers) as [SanZhangGamePlayer]
        this.getBeatPlayers();
        this.sitdownPlayers = _.clone(this.beatPlayers);
        this.addBets = this.gameConfig["addBets"][0];
        if (this.roomConfig["menpai"] != undefined && this.roomConfig["menpai"][0] == 10) {
            this.addBets = this.gameConfig["addBets"][0];
            this.mAddBets = this.gameConfig["addBets"][0];
            this.sAddBets = this.gameConfig["addBets"][4];
        }
        if (this.roomConfig["menpai"] != undefined && this.roomConfig["menpai"][0] == 5) {
            this.addBets = this.gameConfig["addBets"][1];
            this.mAddBets = this.gameConfig["addBets"][1];
            this.sAddBets = this.gameConfig["addBets"][5];
        }
        this._beatCards = new sanZhangBeat_1.default(this);
        let playerInfos = [];
        let _daxiPlayer = undefined;
        if (this.DaXiPlayer != undefined)
            _daxiPlayer = _.find(this.getAllGamePlayers(), { uid: this.DaXiPlayer.uid });
        let flag = false;
        let zhuangFlag = false;
        _.forEach(this.beatPlayers, (v, i) => {
            this.beatIds.push(v.uid);
            this._sidIds.push(v.index);
            this.chips.push(1);
            if (this.zhuangIndex != undefined) {
                if (zhuangFlag == false) {
                    if (v.index == this.zhuangIndex)
                        zhuangFlag = true;
                }
            }
            if (_daxiPlayer == undefined || _daxiPlayer == "") {
                v.score = v.score - 1;
                v.chip = v.chip - 1;
            }
            else {
                if (_daxiPlayer.uid == v.uid) {
                    if (flag == false) {
                        v.score = v.score - (this.beatPlayers.length * this.baseScore);
                        v.chip = v.chip - (this.beatPlayers.length * this.baseScore);
                        flag = true;
                    }
                }
            }
            let obj = {
                "uid": v.uid,
                "score": v.score,
                "sid": v.index,
                "chip": v.chip
            };
            playerInfos.push(obj);
        });
        if (this.zhuangIndex == undefined || zhuangFlag == false)
            this.zhuangIndex = this._sidIds[0];
        this.currentIndex = this.zhuangIndex;
        let uid = this.beatIds[this.zhuangIndex];
        this.tmpzhuanIndex = this.zhuangIndex;
        this.sumScore = this.beatPlayers.length * this.baseScore;
        let _msg = {
            beatIds: this.beatIds,
            betInfo: this.getBetInfo(),
            zhuangId: this.beatIds[0],
            round: this.currentRound,
            zhuangSid: this.zhuangIndex,
            sumScore: this.sumScore,
            sidIds: this._sidIds,
            playerInfos: playerInfos,
            maxBetRound: this.maxBetRound,
            wheelNum: this.wheelNum,
            watchArr: this.watchArr,
            mAddBets: this.mAddBets,
            sAddBets: this.sAddBets,
        };
        if (this.roomConfig["lanzi"] != undefined && this.roomConfig["lanzi"][0] == 1) {
            let cards = pokerAlgo_1.PokerAlgo.pickCardIds(this.cards);
            this.LzCards = sanzhangAlgo_1.SanZhangAlgo.getLzCards(cards);
            // this.LzCards = ["0.14"];
            let tmpCards = this.LzCards.slice();
            _msg["LzCards"] = sanzhangAlgo_1.SanZhangAlgo.getPlayerCards(tmpCards, tmpCards[0]);
            // _msg["LzCards"] = this.LzCards;  //懒子牌
        }
        this.DaXiPlayer = undefined;
        this.container.channel.pushMessage(pushEvent_1.default.sz_onGameStart, _msg);
        process.nextTick(() => {
            this.fsm.shuffleTrans();
        });
    }
    onEnterOutput(lifecycle, arg1, arg2) {
        let temCards = pokerAlgo_1.PokerAlgo.pickCardIds(this.cards);
        // let num = _.random(2, 3);
        let _cards = this.clearCards(temCards);
        this.cards = pokerAlgo_1.PokerAlgo.createCardsFromIds(_cards);
        const dealCards = pokerAlgo_1.PokerAlgo.dealCards(this.cards, 3);
        let sid = 0;
        if (dealCards.length > 0 && this.sitdownPlayers.length <= dealCards.length) {
            let cards = [];
            _.forEach(this.sitdownPlayers, (v, i) => {
                cards = pokerAlgo_1.PokerAlgo.pickCardIds(dealCards[i]);
                if (this.roomConfig["lanzi"] != undefined && this.roomConfig["lanzi"][0] == 1)
                    cards = sanzhangAlgo_1.SanZhangAlgo.getPlayerCards(cards, this.LzCards[0]);
                if (v.cards.length == 0)
                    v.cards = this._beatCards.sortCardsPlayer(cards);
                this.container.channel.pushMessageByIds(pushEvent_1.default.sz_onOutput, { cards: ["-1", "-1", "-1"], sid: v.index, uid: v.uid, addBets: this.addBets }, v.uid);
            });
            process.nextTick(() => {
                this.fsm.inputTrans();
            });
        }
    }
    clearCards(temCards) {
        let clearCards = [];
        // let num = _.random(2, 3);
        // let _cards = _.difference(temCards, this.gameConfig.randomCards[num.toString()]);
        for (let i = 0; i < this.gamePlayers.length; i++) {
            let player = this.gamePlayers[i];
            clearCards = clearCards.concat(player.cards);
        }
        return _.difference(temCards, clearCards);
    }
    onEnterInput(lifecycle, gamePlayer, msg) {
        console.log("onEnterInput====ddddd==", gamePlayer == undefined && msg == undefined);
        if (gamePlayer == undefined && msg == undefined) {
            this.getPlayerAction();
            return true;
        }
        if (gamePlayer != undefined && msg != undefined) {
            gamePlayer.action = {};
            if (gamePlayer.isSpeck == false)
                return true;
            gamePlayer.isSpeck = false;
            const type = msg['type'];
            const param = msg['param'];
            if (type == 0) {
                this.follow(gamePlayer, type);
                return true;
            }
            else if (type == 1) {
                this.bet(gamePlayer, type, param);
                return true;
            }
            else if (type == 2) {
                let targetGamePlayer = _.find(this.beatPlayers, { uid: param }); //和这个player比牌
                if (targetGamePlayer != undefined && targetGamePlayer.uid != gamePlayer.uid && targetGamePlayer.loser == false) {
                    if (this.roomConfig["bipai"] != undefined && this.roomConfig["bipai"][0] == 1) {
                        this.chip = gamePlayer.betNum * 2;
                        if (gamePlayer.showCards == true && targetGamePlayer.showCards == false) {
                            if (gamePlayer.betNum / 2 != targetGamePlayer.betNum) {
                                this.chip = this.chip * 2;
                            }
                        }
                    }
                    else {
                        this.chip = gamePlayer.betNum;
                    }
                    //if (this.roomConfig["bipai"] == undefined || this.roomConfig["bipai"][0] == 2) this.chip = gamePlayer.betNum;
                    gamePlayer.score = gamePlayer.score - this.chip;
                    gamePlayer.chip = gamePlayer.chip - this.chip;
                    this.sumScore = this.sumScore + this.chip;
                    gamePlayer.addBets.push(this.chip);
                    this.pushRadio(gamePlayer, "bipai", type);
                    this.thanCard(gamePlayer, targetGamePlayer, type);
                }
                return true;
            }
            else if (type == 3) {
                gamePlayer.huopin = true;
                if (this.beatPlayers[0].uid == gamePlayer.uid)
                    this.beatPlayers[0] = gamePlayer;
                if (this.beatPlayers[1].uid == gamePlayer.uid)
                    this.beatPlayers[1] = gamePlayer;
                let gamePlayer_1 = this.beatPlayers[0];
                let gamePlayer_2 = this.beatPlayers[1];
                this.huoPinPlayer.push(gamePlayer);
                if (gamePlayer.showCards == true) {
                    this.chip = 200;
                }
                else {
                    this.chip = 100;
                }
                gamePlayer.score = gamePlayer.score - this.chip;
                gamePlayer.chip = gamePlayer.chip - this.chip;
                this.sumScore = this.sumScore + this.chip;
                if (this.isInitiateHuoPin == true) {
                    this.isInitiateHuoPin = false;
                }
                else {
                    this.isInitiateHuoPin = true;
                }
                ;
                gamePlayer.addBets.push(this.chip);
                this.pushRadio(gamePlayer, "huopin", type);
                if (gamePlayer_1.huopin == true && gamePlayer_2.huopin == true) {
                    this.thanCard(this.huoPinPlayer[0], this.huoPinPlayer[1], type);
                }
                else {
                    if (gamePlayer.showCards == false) {
                        this.getPlayerAction(false, gamePlayer, this, true);
                    }
                    else {
                        this.getPlayerAction(false, gamePlayer);
                    }
                }
                return true;
            }
        }
    }
    getBeatPlayers() {
        let objArr = [];
        for (let i = 0; i < this.readyIds.length; i++) {
            let obj = { "uid": this.readyIds[i] };
            objArr.push(obj);
        }
        for (let i = 0; i < this.gamePlayers.length; i++) {
            let player = this.gamePlayers[i];
            for (let j = 0; j < this.readyIds.length; j++) {
                if (player.uid == this.readyIds[j]) {
                    player.watcher = false;
                    this.beatPlayers.push(player);
                }
            }
        }
        this.watchPlayerList = _.differenceBy(this.gamePlayers, objArr, "uid");
        for (let i = 0; i < this.watchPlayerList.length; i++) {
            let player = this.watchPlayerList[i];
            let obj = {
                "uid": player.uid,
                "sid": player.index
            };
            this.watchArr.push(obj);
            player.watcher = true;
        }
    }
    qunBi() {
        this.qiongbi = true;
        let result = this._beatCards.qunbiBeat();
        console.log("========onEnterInput===result", result);
        let kanPaiList = [];
        for (let i = 0; i < this.beatPlayers.length; i++) {
            if (this.beatPlayers[i].showCards == false)
                kanPaiList.push({ sid: this.beatPlayers[i].index, uid: this.beatPlayers[i].uid });
        }
        this.container.channel.pushMessage(pushEvent_1.default.sz_onQunBi, { results: result, "kanPaiList": kanPaiList, state: "qunbi" });
        for (let i = 0; i < this.beatPlayers.length; i++) {
            let _player = this.beatPlayers[i];
            if (_player.giveup != true && _player.thanCards != true && _player.leave != true) {
                this.victoryPlayer = _player;
                break;
            }
        }
        this.timing(this.gameOver, 2000, true);
    }
    thanCard(gamePlayer, targetGamePlayer, type) {
        console.log("=====thanCard==");
        //推送比牌对应人的比牌信息
        let _obj = this._beatCards.beat(gamePlayer, targetGamePlayer);
        console.log("=======_obj====", _obj);
        let successPlayer = this.findPlayerByUid(_obj["victory"].uid);
        let failurePlayer = this.findPlayerByUid(_obj["failure"].uid);
        this.get_CardsType(successPlayer);
        successPlayer.cardsType = _obj["victory"].type;
        failurePlayer.cardsType = _obj["failure"].type;
        let arr = ["-1", "-1", "-1"];
        _obj["victory"]["cards"] = arr;
        _obj["failure"]["cards"] = arr;
        gamePlayer.action = {};
        targetGamePlayer.action = {};
        let kanPaiList = [];
        // if(type == 2){
        //   if (this.beatPlayers.length == 2) {
        //     for (let i = 0; i < this.beatPlayers.length; i++) {
        //       if (this.beatPlayers[i].showCards == false) kanPaiList.push({ sid: this.beatPlayers[i].index, uid: this.beatPlayers[i].uid });
        //     }
        //   }
        // }
        let obj = {
            players: [{ sid: gamePlayer.index, uid: gamePlayer.uid }, { sid: targetGamePlayer.index, uid: targetGamePlayer.uid }],
            result: _obj,
            state: type == 2 ? "bipai" : "huopin",
            kanPaiList: kanPaiList,
            count: this.beatPlayers.length
        };
        if (type == 2) {
            for (let i = 0; i > this.gamePlayers.length; i++) {
                let _uid = this.gamePlayers[i].uid;
                if (_uid == successPlayer.uid) {
                    if (successPlayer.showCards == true) {
                        this.container.channel.pushMessageByIds(pushEvent_1.default.sz_onBiPai, obj, _uid);
                        obj["result"]["victory"]["cards"] = arr;
                        continue;
                    }
                    if (failurePlayer.showCards == true) {
                        this.container.channel.pushMessageByIds(pushEvent_1.default.sz_onBiPai, obj, _uid);
                        obj["result"]["failure"]["cards"] = arr;
                        continue;
                    }
                }
                this.container.channel.pushMessageByIds(pushEvent_1.default.sz_onBiPai, obj, _uid);
            }
        }
        this.container.channel.pushMessage(pushEvent_1.default.sz_onBiPai, obj);
        let player = this.findPlayerByUid(_obj["failure"].uid);
        player.thanCards = true; //比牌输了
        let flag = this.removeBeatPlayer(player, true);
        return true;
    }
    //广播协议
    pushRadio(gamePlayer, state, type, playerIds = false, flagType = false) {
        let chip = this.chip;
        let chips = [];
        for (let i = 0; i < this.beatPlayers.length; i++) {
            chips.push({ sid: this.beatPlayers[i].index, uid: this.beatPlayers[i].uid, chip: this.beatPlayers[i].chip });
        }
        let _obj = {
            "state": state,
            sid: gamePlayer.index,
            uid: gamePlayer.uid,
            score: gamePlayer.score,
            type: type,
            sumScore: this.sumScore,
            chip: chip,
            chips: chips,
            wheelNum: this.wheelNum,
            isInitiateHuoPin: this.isInitiateHuoPin,
            count: this.beatPlayers.length
        };
        if (type == 5 || type == 6)
            delete _obj["chip"];
        if (type == 5)
            if (gamePlayer.showCards == false)
                _obj["liangpai"] = 1;
        if (_obj["chip"] != undefined)
            this.chips.push(this.chip);
        this.container.channel.pushMessage(pushEvent_1.default.sz_onRadio, _obj); //推送跟组广播
    }
    checkGameOver() {
        if (this.beatPlayers.length == 1) {
            this.victoryPlayer = this.beatPlayers[0];
            this.timing(this.gameOver, 2000, true);
            return true;
        }
        return false;
    }
    gameOver(flag = false, gamePlayer = false, self) {
        process.nextTick(() => {
            self.fsm.overTrans();
        });
    }
    timing(fun, times, gameOver = false) {
        let self = this;
        if (gameOver == true)
            this.container.channel.pushMessage(pushEvent_1.default.sz_onJieSuan, { "jieSuan": true });
        setTimeout(function () {
            fun(false, false, self);
        }, times);
    }
    //加注
    bet(gamePlayer, type, index) {
        console.log("gamePlayer.score==bet=dddd==,index", gamePlayer.score, index);
        this.chip = this.gameConfig.addBets[0][parseInt(index)]; //第一个人说话跟注  1
        gamePlayer.isBiPai = true;
        if (gamePlayer.showCards == true) {
            console.log("====this.gameConfig.addBets[4]===", this.gameConfig.addBets[4]);
            this.chip = this.gameConfig.addBets[4][parseInt(index)];
            gamePlayer.betNum = this.chip;
            this.addBets = this.getAddBets(gamePlayer.betNum, true); //获取加注的筹码 暗柱   
        }
        else {
            gamePlayer.menpai += 1;
            gamePlayer.betNum = this.chip;
            this.addBets = this.getAddBets(gamePlayer.betNum); //获取加注的筹码 暗柱    
        }
        console.log("===bet===this.addBets", this.addBets);
        this.topPlayer = gamePlayer;
        this.sumScore = this.chip + this.sumScore;
        gamePlayer.score = gamePlayer.score - this.chip;
        gamePlayer.chip = gamePlayer.chip - this.chip;
        this.setWheelRound(gamePlayer.index);
        gamePlayer.addBets.push(this.chip);
        this.pushRadio(gamePlayer, "bet", type);
        gamePlayer.action = {};
        return true;
    }
    setWheelRound(sid) {
        if (this.zhuanQiCards == false)
            if (sid == this.tmpzhuanIndex)
                this.wheelNum += 1;
        this.zhuanQiCards = false;
        if (this.wheelNum == this.maxBetRound) {
            this.qunBi();
            return true; //群比
        }
        this.getPlayerAction();
        return false;
    }
    //获取筹码
    getAddBets(betNum, flag = false) {
        //获取第二个人的筹码
        let arr = [];
        let _chips = flag == false ? this.mAddBets : this.sAddBets;
        console.log("==getAddBets===betNum==", betNum, "====flag==", flag, "====_chips=", _chips);
        for (let i = 0; i < _chips.length; i++) {
            let tmp = _chips[i];
            if (tmp > betNum) {
                arr.push(tmp);
            }
        }
        arr = _.uniq(arr);
        return arr;
    }
    ;
    //跟注
    follow(gamePlayer, type) {
        // this.checkMenPai();
        gamePlayer.isBiPai = false;
        if (gamePlayer.showCards == false)
            gamePlayer.menpai += 1;
        if (this.topPlayer == undefined) {
            if (gamePlayer.showCards == true)
                this.chip = this.chip * 2;
            gamePlayer.betNum = this.chip;
        }
        else {
            if (this.topPlayer.showCards == true) {
                if (this.isBrand == true)
                    this.chip = this.mChip; //Math.ceil(this.sChip / 2); //这个玩家 有人闷牌 
                if (gamePlayer.showCards == true)
                    this.chip = this.sChip; // this.topPlayer.betNum;  //两个玩家都看牌了
            }
            if (this.topPlayer.showCards == false) {
                if (this.isBrand == true)
                    this.chip = this.mChip; //this.topPlayer.betNum;
                if (gamePlayer.showCards == true)
                    this.chip = this.sChip; //this.topPlayer.betNum * 2;
            }
            gamePlayer.betNum = this.chip;
            this.topPlayer = gamePlayer;
        }
        this.sumScore = this.chip + this.sumScore;
        gamePlayer.score = gamePlayer.score - this.chip;
        gamePlayer.chip = gamePlayer.chip - this.chip;
        this.setWheelRound(gamePlayer.index);
        gamePlayer.addBets.push(this.chip);
        this.topPlayer = gamePlayer;
        this.pushRadio(gamePlayer, "follow", type);
        gamePlayer.action = {};
        //return false;
    }
    checkMenPai() {
        this.isBrand = false;
        let player = _.find(this.beatPlayers, (v) => { return v.showCards == false; });
        if (player != undefined)
            this.isBrand = true;
        let mChip = 1;
        let sChip = 2;
        for (let i = 0; i < this.beatPlayers.length; i++) {
            if (this.beatPlayers[i].showCards == true) {
                if (this.beatPlayers[i].betNum > sChip)
                    sChip = this.beatPlayers[i].betNum;
            }
            if (this.beatPlayers[i].showCards == false) {
                if (this.beatPlayers[i].betNum > mChip)
                    mChip = this.beatPlayers[i].betNum;
            }
        }
        this.sChip = sChip;
        this.mChip = mChip;
        if (this.mChip * 2 > this.sChip)
            this.sChip = mChip * 2;
        if (this.sChip / 2 > this.mChip)
            this.mChip = sChip / 2;
    }
    getPlayerAction(isQiPai = false, gamePlayer = false, self = this, isHuoPin = false) {
        self.turnNext();
        self.checkMenPai();
        if (self.nextPlayer) {
            self.nextPlayer.isSpeck = true;
            self.nextPlayer.isBiPai = false;
        }
        let kanPai = [];
        if (isQiPai == true) {
            if (gamePlayer.index == self.tmpzhuanIndex) {
                self.tmpzhuanIndex = self.nextPlayer.index;
            }
        }
        if (self.nextPlayer.showCards == true)
            self.addBets = self.getAddBets(self.sChip, self.nextPlayer.showCards);
        if (self.nextPlayer.showCards == false)
            self.addBets = self.getAddBets(self.mChip, self.nextPlayer.showCards);
        let _msg = {
            "jiazhu": 1,
            "genzhu": 1,
            speakUid: self.nextPlayer.uid,
            speakSid: self.nextPlayer.index,
            wheelNum: self.wheelNum,
        };
        if (self.wheelNum >= 1)
            _msg["bipai"] = 1;
        _msg["addBets"] = self.addBets;
        if (self.addBets.length == 0)
            delete _msg["jiazhu"];
        if (self.roomConfig["zhongtu"] != undefined && self.roomConfig["zhongtu"][0] == 1) {
            if (this.beatPlayers.length > 2)
                delete _msg["bipai"];
        }
        if (self.beatPlayers.length == 2) {
            _msg["huopin"] = 1; //有火拼
        }
        _msg["kanpai"] = 1;
        for (let i = 0; i < self.gamePlayers.length; i++) {
            if (self.gamePlayers[i].watcher == false) {
                if (self.gamePlayers[i].showCards == false && self.gamePlayers[i].giveup == false)
                    kanPai.push({ sid: self.gamePlayers[i].index, uid: self.gamePlayers[i].uid });
            }
        }
        _msg["kanPaiList"] = kanPai;
        if (self.roomConfig["mensanlun"] != undefined && self.roomConfig["mensanlun"][0] == 1) {
            if (self.wheelNum < 3) {
                delete _msg["kanpai"];
                delete _msg["kanPaiList"];
                delete _msg["bipai"];
            }
        }
        if (self.nextPlayer.showCards == true)
            delete _msg["kanpai"];
        if (gamePlayer != false && isQiPai == false) {
            _msg = {
                "huopin": 1,
                speakUid: this.nextPlayer.uid,
                speakSid: this.nextPlayer.index,
                wheelNum: this.wheelNum,
                "kanpai": 1,
                "kanPaiList": kanPai
            };
        }
        if (isHuoPin == true) {
            delete _msg["kanpai"];
            delete _msg["kanPaiList"];
        }
        if (_msg["bipai"]) {
            if (self.checkIsBiPai() == false) {
                delete _msg["bipai"];
            }
        }
        if (self.nextPlayer)
            self.nextPlayer.action = _msg;
        self.container.channel.pushMessage(pushEvent_1.default.sz_onFirstInput, _msg);
        return _msg;
    }
    checkIsBiPai() {
        for (let i = 0; i < this.beatPlayers.length; i++) {
            if (this.beatPlayers[i].isBiPai == true)
                return false;
        }
        return true;
    }
    //弃牌
    removeBeatPlayer(beatPlayer, status = false) {
        console.log("removeBeatPlayer====", status);
        if (status != true) {
            beatPlayer.giveup = true; //棋牌
            this.pushRadio(beatPlayer, 'qipai', 5);
        }
        beatPlayer.action = {};
        _.remove(this.beatPlayers, (v) => {
            return v == beatPlayer;
        });
        this.disPlayer.push(beatPlayer);
        let flag = this.checkGameOver();
        if (flag != false)
            return true;
        console.log("=removeBeatPlayer==beatPlayer.index ==", beatPlayer.index, "this.tmpzhuanIndex===", this.tmpzhuanIndex);
        if (beatPlayer.index == this.tmpzhuanIndex) {
            console.log("beatPlayer.index", beatPlayer.index, "this.nextPlayer.index", this.nextPlayer.index);
            if (this.nextPlayer != "" && this.nextPlayer != undefined && beatPlayer.index == this.nextPlayer.index) {
                this.wheelNum += 1;
                this.getZhuangNext(true);
            }
            else {
                this.getZhuangNext(true);
            }
        }
        else {
            if (status == true)
                this.timing(this.getPlayerAction, 3000);
        }
        if (status != true) {
            // this.pushRadio(beatPlayer, 'qipai', 5);
            if (beatPlayer.uid == this.nextPlayer.uid) {
                if (this.wheelNum == this.maxBetRound) {
                    this.qiongbi();
                }
                else {
                    this.getPlayerAction();
                }
                return true;
            }
            if (this.beatPlayers.length == 2) {
                let _msg = this.nextPlayer.action;
                _msg["huopin"] = 1;
                _msg["kanpai"] = 1;
                let kanPaiList = [];
                for (let i = 0; i < this.gamePlayers.length; i++) {
                    if (this.gamePlayers[i].watcher == false) {
                        if (this.gamePlayers[i].showCards == false && this.gamePlayers[i].giveup == false)
                            kanPaiList.push({ sid: this.gamePlayers[i].index, uid: this.gamePlayers[i].uid });
                    }
                }
                _msg["kanPaiList"] = kanPaiList;
                this.nextPlayer.action = _msg;
                this.container.channel.pushMessage(pushEvent_1.default.sz_onFirstInput, _msg);
            }
        }
        return false;
    }
    getZhuangNext(falg = false) {
        console.log("=======getZhuangNext====flag=", falg);
        this.turnZhuanNext(); //庄家到下一个玩家
        // this.zhuanQiCards = true;
        if (this.wheelNum == this.maxBetRound) {
            this.qiongbi();
            return;
        }
        if (falg == true) {
            let self = this;
            this.timing(this.getPlayerAction, 3000);
        } //this.getPlayerAction();
    }
    leave(userId, session) {
        const gamePlayer = _.find(this.getAllGamePlayers(), { uid: userId });
        if (gamePlayer == undefined)
            return;
        if (gamePlayer.watcher) {
            _.remove(this.gameWatchers, { uid: userId });
        }
        else {
            _.pull(this.readyIds, userId);
            this.gamePlayers[gamePlayer.index] = null;
        }
        _.remove(this.beatPlayers, (v) => {
            return v == gamePlayer;
        });
        gamePlayer.leave = true;
        let player = _.find(this.disPlayer(), { uid: userId });
        if (!player)
            this.disPlayer.push(gamePlayer);
        if (player)
            player.leave = true;
        let obj = {
            sid: gamePlayer.sid,
            uid: gamePlayer.uid,
            'state': 'leave'
        };
        this.container.channel.pushMessage(pushEvent_1.default.sz_onLeave, { leave: obj }); //通知离开
        if (this.beatPlayers == undefined || this.beatPlayers.length == 0) {
            session.set('roomId', null);
            session.set('gameServerId', null);
            session.pushAll(function (error) {
                if (error != null) {
                    Raven.captureException(error);
                }
            });
            this.onLeave(gamePlayer);
            return true;
        }
        if (gamePlayer.index = this.tmpzhuanIndex) {
            this.getZhuangNext(); //庄家离开房间
            return true;
        }
        if (gamePlayer.uid == this.nextPlayer.uid) {
            this.getPlayerAction(); //轮到下一个人
            return true;
        }
    }
    turnZhuanNext() {
        let ObjSid = [];
        let sid = 0;
        if (this.tmpzhuanIndex == 0) {
            this.zhuangPlayer();
            return true;
        }
        for (let i = 0; i < this.gamePlayers.length; i++) {
            ObjSid.push(this.gamePlayers[i].index);
        }
        ObjSid.sort((a, b) => { return a > b; });
        while (true) {
            this.tmpzhuanIndex -= 1;
            if (this.tmpzhuanIndex == 0) {
                this.zhuangPlayer(true);
                return true;
            }
            let index = this.tmpzhuanIndex % ObjSid.length;
            sid = ObjSid[index];
            let nextPlayer = _.find(this.beatPlayers, (v) => v.index == sid);
            if (nextPlayer == undefined)
                continue;
            this.tmpZhuanPlayer = nextPlayer;
            this.tmpzhuanIndex = this.tmpZhuanPlayer.index;
            return true;
        }
        // let nextPlayer = _.find(this.beatPlayers, (v) => v.index > this.tmpzhuanIndex)
        // if (nextPlayer == undefined) {
        //   this.currBetRound++
        //   nextPlayer = _.find(this.beatPlayers, (v) => v.index >= 0)
        // }
        // if (nextPlayer != undefined) {
        //   this.tmpZhuanPlayer = nextPlayer;
        // }
    }
    zhuangPlayer(flag = false) {
        let ObjSid = [];
        let sid = 0;
        for (let i = 0; i < this.beatPlayers.length; i++) {
            ObjSid.push(this.beatPlayers[i].index);
        }
        ObjSid.sort((a, b) => { return a > b; });
        sid = flag == false ? ObjSid.pop() : ObjSid[0];
        this.tmpZhuanPlayer = _.find(this.beatPlayers, (v) => v.index == sid);
        this.tmpzhuanIndex = this.tmpZhuanPlayer.index;
    }
    peiPai(uid, msg) {
        let player = this.findPlayerByUid(uid);
        if (_.isArray(msg["type"])) {
            if (this.LzCards.length > 0) {
                msg["type"] = sanzhangAlgo_1.SanZhangAlgo.getPlayerCards(msg["type"], this.LzCards[0]);
            }
            player.cards = msg["type"];
        }
        else {
            if (this.gameConfig["peipai"][msg["type"]])
                player.cards = this.gameConfig["peipai"][msg["type"]];
        }
        return true;
    }
    //看牌
    lookCards(uid) {
        let player = this.findPlayerByUid(uid);
        player.isMenPai = false;
        player.checked = true;
        player.showCards = true;
        let action = player.action;
        this.pushRadio(player, 'kanpai', 6);
        if (action["kanpai"] != undefined)
            delete action["kanpai"];
        player.action = action;
        if (this.beatPlayers.length == 2)
            action["huoping"] = 1; //有火拼
        this.addBets = this.getAddBets(this.mChip * 2, true);
        player.betNum = this.mChip * 2;
        action["addBets"] = this.addBets;
        player.addBets = this.addBets;
        this.get_CardsType(player);
        this.container.channel.pushMessageByIds(pushEvent_1.default.sz_onShowCards_, { cards: player.cards, action: action, type: player.type, isRuan: player.isRuan }, uid);
        // this.pushMsg(uid,{ cards: player.cards, action: action },pushEvent.sz_onShowCards_);
    }
    get_CardsType(player) {
        if (this.roomConfig["lanzi"] != undefined && this.roomConfig["lanzi"][0] == 1) {
            let cardsObj = this._beatCards.LzShowCards(player);
            if (cardsObj["LzCards"]) {
                // player.cards = cardsObj["cards"];
                player.LzCards = cardsObj["LzCards"];
                player.type = cardsObj["type"];
                player.isRuan = true;
                if (player.type == "baozi") {
                    let flag = false;
                    for (let i = 0; i < player.cards.length; i++) {
                        if (player.cards[i].split(".").length < 4) {
                            flag = true;
                            break;
                        }
                    }
                    if (flag == false)
                        player.isRuan = false;
                }
                return true;
            }
        }
        let cards = pokerAlgo_1.PokerAlgo.createCardsFromIds(player.cards);
        let info = this._beatCards.getCheckCards(cards, player);
        player.type = info["info"];
        player.cards = this._beatCards.sortCardsPlayer(player.cards);
        return true;
    }
    //选择牌型 {cards}
    chooseCards(uid, msg) {
        let player = this.findPlayerByUid(uid);
        player.cards = msg["cards"];
        let cards = [];
        for (let i = 0; i < msg.cards.length; i++) {
            let card = msg.cards[i];
            if (card.split(".").length == 4) {
                let str = card[2].toString() + card[3].toString();
                cards.push(str);
                continue;
            }
            cards.push(card);
        }
        player.LzCards = cards;
        return true;
    }
    //亮牌
    showCards(uid) {
        let player = _.find(this.gamePlayers, { uid: uid }); // this.findPlayerByUid(uid);
        console.log("=========showCards==player=", player == undefined);
        this.get_CardsType(player);
        this.container.channel.pushMessage(pushEvent_1.default.sz_onShowCards, { cards: player.cards, sid: player.index, uid: player.uid, type: player.type, isRuan: player.isRuan });
        player.brightBrand = true;
        return true;
    }
    turnNext() {
        let nextPlayer = _.find(this.beatPlayers, (v) => v.index > this.currentIndex);
        if (nextPlayer == undefined) {
            this.currBetRound++;
            nextPlayer = _.find(this.beatPlayers, (v) => v.index >= 0);
        }
        if (nextPlayer != undefined) {
            console.log("=====nextPlayer.index===", nextPlayer.index);
            this.currentIndex = nextPlayer.index;
            this.nextPlayer = nextPlayer;
        }
    }
    getBiPaiPlayers(uid) {
        let players = [];
        for (let i = 0; i < this.beatPlayers.length; i++) {
            let player = this.beatPlayers[i];
            if (player.uid != uid) {
                let obj = {
                    sid: player.index,
                    uid: player.uid,
                    score: player.score
                };
                players.push(obj);
            }
        }
        this.biPaiPlayerList = players;
        this.container.channel.pushMessageByIds(pushEvent_1.default.sz_onBiPaiPlayers_, { players: players }, uid);
    }
    getBetInfo() {
        return { once: this.onceScore, sum: this.sumScore, round: this.currBetRound };
    }
    onBeforeOverTrans(lifecycle, arg1, arg2) {
        if (this.roomConfig.paicai == true && this.beatPlayers.length == 1) {
            const gamePlayer = this.beatPlayers[0];
            const [type, multiple] = sanzhangAlgo_1.SanZhangAlgo.getPaiCaiResult(gamePlayer.cards);
            if (type >= 0) {
                let sumScore = 0;
                let score = this.baseScore * multiple;
                _.forEach(this.sitdownPlayers, (v) => {
                    if (v.uid != gamePlayer.uid) {
                        v.roundScore += -score;
                        sumScore += score;
                    }
                });
                gamePlayer.roundScore += sumScore;
                this.container.channel.pushMessage(pushEvent_1.default.sz_onPaiCai, {
                    uid: gamePlayer.uid,
                    cards: pokerAlgo_1.PokerAlgo.pickCardIds(gamePlayer.cards),
                    score: sumScore,
                    type: type,
                    multiple: multiple
                });
            }
        }
    }
    onEnterOver(lifecycle, arg1, arg2) {
        let players = this.beatPlayers.concat(this.disPlayer);
        let results = [];
        let num = this._beatCards.checkFond(this.victoryPlayer);
        console.log("==onEnterOver==this.sumScore======players.length", this.sumScore, players.length);
        for (let i = 0; i < players.length; i++) {
            let _player = players[i];
            if (_player.watcher != true) {
                let obj = {
                    win: _player.chip,
                    sid: _player.index,
                    uid: _player.uid,
                    giveup: _player.giveup,
                    thanCards: _player.thanCards,
                    victory: 0,
                    cards: ["-1", "-1", "-1"],
                    currentRound: this.currentRound,
                    roundCount: this.roomConfig.roundCount,
                    showCards: _player.showCards,
                    score: _player.score,
                    leave: _player.leave,
                    watcher: _player.watcher,
                    brightBrand: _player.brightBrand
                };
                this.get_CardsType(_player);
                if (_player.brightBrand == true) {
                    obj["cards"] = _player.cards;
                    obj["cards"] = _player.cards;
                    obj["type"] = _player.type;
                    obj["isRuan"] = _player.isRuan;
                    obj["cardsType"] = _player.cardsType;
                }
                if (_player.giveup == true || _player.thanCards == true || _player.leave == true) {
                    _player.score = _player.score - parseInt(num);
                    obj["score"] = _player.score;
                    obj["win"] = obj["win"] - parseInt(num);
                    results.push(obj);
                    this._results.push(obj);
                    continue;
                }
                obj["win"] = this.sumScore + parseInt(obj["win"]) + (parseInt(num) * (players.length - 1));
                obj["victory"] = 1;
                console.log("===onEnterOver====_player.showCards===", _player.showCards);
                if (_player.showCards == true) {
                    obj["cards"] = _player.cards;
                    obj["type"] = _player.type;
                    obj["isRuan"] = _player.isRuan;
                    obj["cardsType"] = _player.cardsType;
                }
                _player.score = parseInt(_player.score) + this.sumScore + (parseInt(num) * (players.length - 1));
                this.currentIndex = _player.index;
                this.turnNext();
                this.zhuangIndex = this.nextPlayer.index;
                obj["score"] = _player.score;
                if (num > 0) {
                    obj["daxi"] = num;
                    this.DaXiPlayer = _player;
                    obj["cards"] = _player.cards;
                }
                results.push(obj);
                this._results.push(obj);
            }
            this.gameResults.push(results);
        }
        this.container.channel.pushMessage(pushEvent_1.default.sz_onGameResult, {
            "results": results, currentRound: this.currentRound, roundCount: this.roomConfig.roundCount
        });
        super.onEnterOver(lifecycle, arg1, arg2);
    }
    getFinishData(data) {
        data.results = this.gameResults;
    }
    getResults(uid) {
        this.container.channel.pushMessageByIds(pushEvent_1.default.sz_onResults, { results: this.gameResults, round: this.currentRound }, uid);
    }
    saveCurrentRoundGamePlayer(roundObject, GamePlayer, index) {
        if (index >= 0)
            if (this._results)
                _.assign(roundObject, this._results[index]);
    }
    clientInfo(uid) {
        let clientInfo = super.clientInfo(uid);
        // if(this.isStart == true) clientInfo["watcher"] = true;
        if (this.container.countDown.existTime("ready"))
            clientInfo["redayTimes"] = this.container.countDown.getRemainingDuration("ready");
        for (let i = 0; i < clientInfo.gamePlayers.length; i++) {
            clientInfo.gamePlayers[i].score = this.gamePlayers[i].score;
            if (clientInfo.gamePlayers[i].id == this.owner.id)
                clientInfo.gamePlayers[i].isOwner = true;
            for (let j = 0; j < clientInfo.readyIds.length; j++) {
                if (clientInfo.gamePlayers[i].id == clientInfo.readyIds[j])
                    clientInfo.gamePlayers[i].ready = true;
            }
        }
        if (this.roomConfig["menpai"] != undefined && this.roomConfig["menpai"][0] == 10) {
            clientInfo['mAddBets'] = this.gameConfig["addBets"][0];
            clientInfo['sAddBets'] = this.gameConfig["addBets"][4];
        }
        if (this.roomConfig["menpai"] != undefined && this.roomConfig["menpai"][0] == 5) {
            clientInfo['mAddBets'] = this.gameConfig["addBets"][1];
            clientInfo['sAddBets'] = this.gameConfig["addBets"][5];
        }
        let player = {};
        if (uid) {
            player = this.findPlayerByUid(uid);
            clientInfo["sid"] = player.index;
        }
        if (uid && this.isStart == true && this.fsm.is('ready') != true) {
            if (player.cards.length == 0)
                player.watcher = true;
            clientInfo["watcher"] = player.watcher;
            let players = this.gamePlayers;
            let playerInfos = [];
            let saySid = 0;
            let sayUid = "";
            let action = "";
            for (let i = 0; i < players.length; i++) {
                let _player = players[i];
                // if (_player.leave == true) continue;
                let obj = {
                    sid: _player.index,
                    score: _player.score,
                    showCards: _player.showCards,
                    giveup: _player.giveup,
                    thanCards: _player.thanCards,
                    chip: _player.chip,
                    addBets: _player.addBets,
                };
                if (Object.keys(_player.action).length != 0) {
                    saySid = _player.index;
                    sayUid = _player.uid;
                    action = _player.action;
                    if (_player.action["genzhu"] == undefined)
                        if (_player.action["huopin"] != undefined)
                            clientInfo["isHuoPin"] = true;
                }
                if (_player.cards.length == 0)
                    obj["watcher"] = true;
                playerInfos.push(obj);
            }
            clientInfo["action"] = action;
            clientInfo["saySid"] = saySid;
            clientInfo["sayUid"] = sayUid;
            clientInfo["playerInfos"] = playerInfos;
            if (player.cards.length > 0) {
                if (player.showCards == true) {
                    clientInfo["cards"] = player.cards;
                    clientInfo["type"] = player.type;
                    clientInfo["isRuan"] = player.isRuan;
                }
                else {
                    clientInfo["cards"] = ["-1", "-1", "-1"];
                }
            }
            clientInfo["sid"] = player.index;
            clientInfo["uid"] = player.uid;
            clientInfo["thanCards"] = player.thanCards;
            clientInfo["giveup"] = player.giveup;
            clientInfo["sumScore"] = this.sumScore;
            clientInfo["chips"] = this.chips;
            clientInfo["wheelNum"] = this.wheelNum;
            clientInfo["zhuangJiaSid"] = this.zhuangIndex;
            clientInfo["mAddBets"] = this.mAddBets;
            clientInfo["sAddBets"] = this.sAddBets;
            clientInfo["biPaiPlayerList"] = [];
            if (this.LzCards.length > 0) {
                let tmpCards = this.LzCards.slice();
                clientInfo["LzCards"] = sanzhangAlgo_1.SanZhangAlgo.getPlayerCards(tmpCards, tmpCards[0]);
            }
            if (this.biPaiPlayerList.length > 0) {
                if (clientInfo["isHuoPin"] == true) {
                    if (this.huoPinPlayer[0].showCards == true) {
                        clientInfo["biPaiPlayerList"] = this.biPaiPlayerList;
                    }
                }
            }
            if (this._results != undefined && this._results.length > 0)
                clientInfo["results"] = this._results;
        }
        return clientInfo;
    }
    reset() {
        super.reset();
        this.onceScore = 0;
        this.sumScore = 0;
        this.scores = [];
        this.beatPlayers = [];
        this.sitdownPlayers = [];
        this.currBetRound = 0;
        this.beatIds = [];
        this.nextPlayer = "";
        this.topPlayer = undefined;
        this.tmpzhuanIndex = 0;
        this.betArray = []; //下注数量  每一轮下注数量
        this.chip = 1;
        this.isBrand = false; //是否有人
        this.tmpZhuanPlayer = undefined;
        this.zhuanQiCards = false;
        this._sidIds = [];
        this._beatCards = "";
        this.qiongbi = false;
        this.isInitiateHuoPin = false;
        this.disPlayer = [];
        this.wheelNum = 0;
        this.chips = [];
        this.watchPlayerList = [];
        this.watchArr = [];
        this.addBets = [];
        this.mAddBets = [];
        this.sAddBets = [];
        this.huoPinPlayer = [];
    }
    getPlayerType() {
        return sanZhangGamePlayer_1.default;
    }
    resortBeatPlayers(nextIndex) {
        if (nextIndex > 0) {
            this.beatPlayers = _.concat(_.slice(this.beatPlayers, nextIndex, this.beatPlayers.length), _.slice(this.beatPlayers, 0, nextIndex));
        }
        _.forEach(this.beatPlayers, (v, i) => {
            v.index = i;
        });
    }
}
exports.default = SanZhangGame;
