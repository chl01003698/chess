"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pushEvent_1 = require("../../../consts/pushEvent");
const diZhuCallZhuang_1 = require("./diZhuCallZhuang");
const code_1 = require("../../../consts/code");
const diZhuCardsType_1 = require("./diZhuCardsType");
const diZhuButton_1 = require("./diZhuButton");
class PlayCard extends diZhuCardsType_1.default {
    constructor(self, roomConfig, gameConfig) {
        super(self, roomConfig, gameConfig);
        this._actual = [];
        this._dCards = [];
        this._SCards = [];
        this.soundRestart = undefined;
        this._lastCards = [];
        this._cardsType = "";
        this._actual = [];
    }
    ;
    play(msg, playerId) {
        let cards = msg["cards"].slice();
        this._dCards = msg["cards"].slice();
        let _tmpCards = msg["cards"].slice();
        this._SCards = msg["cards"].slice();
        this.soundRestart = msg["soundRestart"];
        this._playerInfo = this.self.findPlayerByUid(playerId);
        this._playerInfo.action = {};
        if (!this._playerInfo["cards"].length) {
            this.self.container.channel.pushMessageByIds(pushEvent_1.default.dz_onInput, code_1.default.GAME.USER_NOT_CARDS, playerId);
            return false;
        }
        if (cards.length > 0)
            this._playerInfo["sendCard"] = parseInt(this._playerInfo["sendCard"]) + 1;
        if (cards.length == 0) {
            this.CardOutAsync();
            return false;
        }
        let lastCards_ = this.self.lastCards.slice();
        let __lastCards = this._cardFormula.getCardsType(lastCards_);
        let __cards = this._cardFormula.getCardsType(cards);
        if (__cards === false) {
            this.self.container.channel.pushMessageByIds(pushEvent_1.default.dz_onInput, code_1.default.GAME.USER_CARDS_ERROR, playerId);
            return false;
        }
        if (this._gameType == "sd3") {
            if (!this._cardFormula.isSDCardsValid(__cards)) {
                this.self.container.channel.pushMessageByIds(pushEvent_1.default.dz_onInput, code_1.default.GAME.USER_CARDS_ERROR, playerId);
                return false;
            }
        }
        else {
            if (!this._cardFormula.isCardsValid(__cards)) {
                this.self.container.channel.pushMessageByIds(pushEvent_1.default.dz_onInput, code_1.default.GAME.USER_CARDS_ERROR, playerId);
                return false;
            }
        }
        this.cards = __cards;
        // if (!this.checkSendCardsType(this._playerInfo.cards, __cards)) {
        //     this.self.container.channel.pushMessageByIds(PushEvent.dz_onInput, Code.GAME.USER_CARDS_ERROR, playerId);
        //     return false;
        // }
        this.self.lastCards.sort();
        let tmpCardsStack = this._playerInfo["cardsStack"].slice();
        tmpCardsStack.sort();
        if (!this.self.lastCards.length || this.self.lastCards.toString() == tmpCardsStack.toString()) {
            this.self.lastCards = cards;
            this.self.CardsType = msg["cardsType"];
        }
        else {
            if (this._gameType == "sd3") {
                if (!this._cardFormula.isSDCardsGreater(__cards, __lastCards)) {
                    this.self.container.channel.pushMessageByIds(pushEvent_1.default.dz_onInput, code_1.default.GAME.USER_CARDS_ERROR, playerId);
                    return false;
                }
            }
            else {
                if (!this._cardFormula.isCardsGreater(_tmpCards, lastCards_)) {
                    this.self.container.channel.pushMessageByIds(pushEvent_1.default.dz_onInput, code_1.default.GAME.USER_CARDS_ERROR, playerId);
                    return false;
                }
            }
        }
        this.self.lastCards = cards.length > 0 ? cards : this.self.lastCards;
        this.self.CardsType = cards.length > 0 ? msg["cardsType"] : this.self.CardsType;
        this._actual = this._cardFormula.getLzCardsType(cards);
        let union = this._actual.filter(v => this._playerInfo["cards"].includes(v));
        if ((union.toString() == this._actual.toString()) == false) {
            this.self.container.channel.pushMessageByIds(pushEvent_1.default.dz_onInput, code_1.default.GAME.XING_CARDS_ERROR, playerId);
            return false;
        }
        let difference = this._actual.length > 0 ? this.get_diff() : this._playerInfo["cards"];
        this._playerInfo["cardsStack"] = msg["cards"];
        this._playerInfo["cards"] = difference;
        this.cards = cards;
        this.CardOutAsync();
        if (this._playerInfo["identity"] == "farmers") {
            if (difference.length <= this.self.letBrandNum) {
                return true; //结算
            }
        }
        else {
            if (difference.length <= 0) {
                return true; //结算
            }
        }
        return false;
    }
    CardOutAsync() {
        let bomb = this.checkCardType(this._dCards, this._playerInfo["bomb"]);
        if (bomb != false)
            this._playerInfo["bomb"] = bomb;
        let sid = diZhuCallZhuang_1.next_player_id(this._playerInfo.index, this.self.playerIds);
        let lookCard = [];
        let _msg = {};
        if (this._playerInfo.isBrightBrand == true) {
            lookCard = [{
                    sid: this._playerInfo.index,
                    cards: this._playerInfo.cards,
                    uid: this._playerInfo.uid
                }];
        }
        for (let i = 0; i < this.self.playerIds.length; i++) {
            let _uid = this.self.playerIds[i];
            _msg = {
                top: {
                    playerId: _uid,
                    cards: this._SCards,
                    lastCards: this.self.lastCards,
                    cardType: this.self.CardsType,
                    sid: this._playerInfo.index,
                    nextSid: sid,
                    soundRestart: this.soundRestart
                }
            };
            if (this.roomConfig["remaining"][0] != 2) {
                _msg["top"]["cardsCount"] = this._playerInfo.cards.length;
            }
            if (lookCard.length > 0)
                _msg["top"]["lookCard"] = lookCard;
            let player = this.self.findPlayerByUid(_uid);
            player.action = {};
            if (this.roomConfig["JiPaiQi"] != undefined && this.roomConfig["JiPaiQi"][0] == 1)
                _msg["JiPaiQI"] = this.JiPaiQi();
            console.log("======_uid", _uid, "this.playerInfo.uid", this._playerInfo.uid);
            if (_uid == this._playerInfo.uid)
                _msg["top"]["topCards"] = this._playerInfo.cards;
            if (sid == player.index) {
                _msg["next"] = {
                    cards: player["cards"],
                    sid: player.index,
                };
                _msg["next"]["action"] = diZhuButton_1.diZhuButton.notSendCard.action;
                _msg["next"]["state"] = diZhuButton_1.diZhuButton.notSendCard.state;
                player.action = diZhuButton_1.diZhuButton.notSendCard;
                let tempCardsStack_1 = player.cardsStack.slice();
                tempCardsStack_1.sort();
                this.self.lastCards.sort();
                console.log("=========tempCardsStack_1", tempCardsStack_1);
                if (tempCardsStack_1.toString() === this.self.lastCards.toString() && this._SCards.length == 0) {
                    player.action = diZhuButton_1.diZhuButton.sendCard;
                    _msg["next"]["action"] = diZhuButton_1.diZhuButton.sendCard.action;
                    _msg["next"]["state"] = diZhuButton_1.diZhuButton.sendCard.state;
                    _msg["next"]["restart"] = true;
                }
                this.self.container.channel.pushMessageByIds(pushEvent_1.default.dz_onInput, _msg, _uid);
                continue;
            }
            this.self.container.channel.pushMessageByIds(pushEvent_1.default.dz_onInput, _msg, _uid);
        }
    }
    get_diff() {
        let obj = {};
        let card = "";
        for (let i = 0; i < this._playerInfo["cards"].length; i++) {
            card = this._playerInfo["cards"][i];
            if (obj[card]) {
                obj[card].cards.push(card);
                continue;
            }
            obj[card] = {
                cards: [card]
            };
        }
        for (let i = 0; i < this._actual.length; i++) {
            card = this._actual[i];
            if (obj[card])
                obj[card].cards.pop();
        }
        let _cards = [];
        for (var key in obj) {
            _cards = _cards.concat(obj[key].cards);
        }
        return _cards;
    }
    JiPaiQi(uid = false) {
        let _uid;
        let _player;
        let obj = {};
        let cards;
        let card;
        let _num = 0;
        if (this.roomConfig.type == "ddz2")
            _num = 1;
        for (let i = 0; i < this.self.playerIds.length + _num; i++) {
            _uid = this.self.playerIds[i];
            if (_uid == uid)
                continue;
            if (_uid != undefined) {
                _player = this.self.findPlayerByUid(_uid);
                cards = _player.cards.slice(0);
            }
            else {
                cards = this.self.ddz2ClearCards;
            }
            console.log("JiPaiQi===this.roomConfig.type", this.roomConfig.type != "ddz2" && this.self._landLordPlayer == "");
            if (this.roomConfig.type != "ddz2" && this.self._landLordPlayer == "") {
                if (i == (this.self.playerIds.length + _num) - 1)
                    cards = cards.concat(this.self._landlordCards);
            }
            if (cards != undefined) {
                for (let j = 0; j < cards.length; j++) {
                    card = cards[j][1];
                    if (obj[card]) {
                        obj[card].push(cards[j]);
                        continue;
                    }
                    obj[card] = [cards[j]];
                }
            }
        }
        return obj;
    }
}
exports.default = PlayCard;
