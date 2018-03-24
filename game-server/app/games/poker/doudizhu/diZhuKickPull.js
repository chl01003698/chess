"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diZhuCallZhuang_1 = require("./diZhuCallZhuang");
const diZhuButton_1 = require("./diZhuButton");
function kickDefault() {
    return diZhuButton_1.diZhuButton.kickDefault;
}
function followDefault() {
    return diZhuButton_1.diZhuButton.followDefault;
}
function pull() {
    return diZhuButton_1.diZhuButton.pull;
}
class kickPull {
    constructor(players, roomConfig, sid, gameConfig, landLordPlayer) {
        this.players = "";
        this.roomConfig = "";
        this._with = {}; //跟不跟
        this._pull = {}; //拉不拉
        this.sid = "";
        this.gameConfig = "";
        this.lastSid = "";
        this._player = "";
        this._kick = {};
        this.landLordPlayer = "";
        this.players = players;
        this.roomConfig = roomConfig;
        this._with = followDefault();
        this._pull = pull();
        this._kick = kickDefault();
        this.sid = sid;
        this.gameConfig = gameConfig;
        this.lastSid = diZhuCallZhuang_1.next_player_id(this.sid, this.players);
        this._player = this.players[this.lastSid];
        this.landLordPlayer = landLordPlayer;
    }
    //踢
    kick() {
        if (this._player.identity == "landlord") {
            this.lastSid = diZhuCallZhuang_1.next_player_id(this.lastSid, this.players);
            // return {startPlay:true}
        }
        let _with = this._with;
        _with["sid"] = this.lastSid;
        _with["playerId"] = this.players[this.lastSid].uid;
        _with["multiple"] = this.gameConfig["multiple"]["pushMultiple"];
        _with["kickPullMul"] = this.gameConfig["multiple"]["pushMultiple"];
        _with["grabLandlord"] = false;
        return _with;
    }
    //不踢
    notKick() {
        this.players[this.sid].grabLandlord = false;
        let obj = this._get_kickSid();
        if (obj["sid"] !== undefined) {
            let _kick = this._kick;
            _kick["sid"] = obj["sid"];
            _kick["playerId"] = this.players[obj["sid"]].uid;
            _kick["grabLandlord"] = false;
            return _kick;
        }
        return { startPlay: true };
    }
    //跟 ------>拉
    follow(flag = false) {
        let sid = this.landLordPlayer.index; //寻找地主的位置
        let _pull = {};
        _pull = this._pull;
        if (this.roomConfig["play"][0] == 1) {
            _pull["sid"] = sid;
            _pull["playerId"] = this.players[this.lastSid].uid;
            if (flag == true)
                _pull["multiple"] = this.gameConfig["multiple"]["pushMultiple"], _pull["kickPullMul"] = this.gameConfig["multiple"]["pushMultiple"];
            if (flag == false)
                delete _pull["multiple"], delete _pull["kickPullMul"];
            _pull["grabLandlord"] = false;
            return _pull;
        }
        let obj = this._get_kickSid();
        console.log("======obj====", obj);
        if (obj["sid"] != undefined) {
            let _kick = this._kick;
            _kick["sid"] = obj["sid"];
            _kick["playerId"] = this.players[obj["sid"]].uid;
            return _kick;
        }
        return { startPlay: true };
    }
    //拉  flag:false 不拉  true 拉
    pull(flag = false) {
        let res = { startPlay: true };
        let obj = this._get_kickSid();
        let sid = obj["sid"];
        if (flag == true) {
            res["multiple"] = obj["multiple"];
        }
        if (obj["sid"] != undefined) {
            let _kick = this._kick;
            // res["multiple"] = res["multiple"];
            res["sid"] = sid;
            res["playerId"] = this.players[sid].uid;
            res["action"] = _kick["action"];
            res["state"] = _kick["state"];
            delete res["startPlay"];
        }
        return res;
    }
    _get_kickSid() {
        let multiple = 0;
        let sid = undefined;
        let uid = "";
        for (let i = 0; i < this.players.length; i++) {
            let _player = this.players[i];
            if (_player.identity == "farmers") {
                if (_player.grabLandlord == true) {
                    sid = _player.index;
                    uid = _player.uid;
                }
                multiple += _player.kickPullMul;
            }
        }
        return { sid: sid, multiple: multiple, uid: uid };
    }
}
exports.default = kickPull;
