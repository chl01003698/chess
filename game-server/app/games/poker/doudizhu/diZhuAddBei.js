"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diZhuCallZhuang_1 = require("./diZhuCallZhuang");
const diZhuButton_1 = require("./diZhuButton");
class AddMultiple {
    constructor(gameConfig, players, playerId, player) {
        this.gameConfig = gameConfig;
        this.players = players;
        this.playerId = playerId;
        this.player = player;
        this.farmers = [];
        this.count = 0;
        this.landlordPlayer = "";
    }
    addTimes() {
        if (this.checkAddTimes() == true)
            return { startPlay: true, multiple: this.gameConfig["multiple"]["pushMultiple"] };
        this.sid = diZhuCallZhuang_1.next_player_id(this.player.index, this.players);
        let nextPlayer = "";
        let multiple = "";
        // let isComplete: any = true; //完成
        for (let i = 0; i < this.players.length; i++) {
            let _player = this.players[i];
            if (_player.state == "") {
                // isComplete = false;
            }
            if (this.sid == _player.index) {
                nextPlayer = _player;
            }
            if (this.player.identity == "landlord") {
                if (_player.identity == "farmers") {
                    multiple = parseInt(this.gameConfig["multiple"]["pushMultiple"]);
                    // _player.kickPullMul =  parseInt(this.gameConfig["multiple"]["pushMultiple"]);
                    this.farmers.push(_player);
                }
                this.landlordPlayer = this.player;
                continue;
            }
            if (_player.uid == this.player.uid) {
                // _player.kickPullMul =  parseInt(this.gameConfig["multiple"]["pushMultiple"]);
                multiple = parseInt(this.gameConfig["multiple"]["pushMultiple"]);
                this.farmers.push(_player);
                continue;
            }
            if (_player.identity == "landlord") {
                this.landlordPlayer = _player;
                continue;
            }
            if (_player.identity == "farmers" && _player.uid != this.player.uid) {
                this.farmers.push(_player);
                continue;
            }
        }
        var res = {};
        res["action"] = diZhuButton_1.diZhuButton.addTimes.action;
        res["state"] = diZhuButton_1.diZhuButton.addTimes.state;
        res["sid"] = nextPlayer.index;
        res["grabLandlord"] = false;
        res["playerId"] = nextPlayer.uid;
        res["multiple"] = multiple;
        return res;
    }
    notAddTimes() {
        if (this.checkAddTimes() == true)
            return { startPlay: true };
        let sid = diZhuCallZhuang_1.next_player_id(this.player.index, this.players);
        var res = {};
        res["action"] = diZhuButton_1.diZhuButton.addTimes.action;
        res["state"] = diZhuButton_1.diZhuButton.addTimes.state; //加倍
        res["sid"] = sid;
        res["playerId"] = this.players[sid].uid;
        res["grabLandlord"] = false;
        return res;
    }
    checkAddTimes() {
        let flag = true;
        let _player = {};
        for (let i = 0; i < this.players.length; i++) {
            _player = this.players[i];
            if (_player.grabLandlord == true)
                return false;
        }
        return flag;
    }
    default() {
        let res = {
            "state": diZhuButton_1.diZhuButton.addTimes.state,
            "action": diZhuButton_1.diZhuButton.addTimes.action,
        };
        return res;
    }
}
exports.AddMultiple = AddMultiple;
