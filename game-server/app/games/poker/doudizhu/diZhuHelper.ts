import kickPull from './diZhuKickPull';
import { rob, frations, redouble, next_player_id, ddz2redouble, grasp } from './diZhuCallZhuang';
import { AddMultiple } from './diZhuAddBei';
import PushEvent from '../../../consts/pushEvent';

export function pushMultiple(multiple: any, self: any, type: any = false, uid: any = false, playerMul: any = false) {
    let _uid: any = "";
    let _player: any = "";
    let arr: any = [];
    if (isNaN(multiple) == false && multiple != "") {
        let diZhuPlayer: any = ""
        for (let i = 0; i < self.playerIds.length; i++) {
            _uid = self.playerIds[i];
            _player = self.findPlayerByUid(_uid);
            if (_player["identity"] == "landlord") diZhuPlayer = _player;
            if (playerMul != false) if (_player.identity == "landlord") continue;
            if (uid == false) {
                if (type != false) _player.statistical[type] = self.roomConfig["suanFen"] != undefined && self.roomConfig["suanFen"][0] == 2 ? _player.statistical[type] + parseInt(multiple) : _player.statistical[type] * parseInt(multiple)
                _player.multiple = self.roomConfig["suanFen"] != undefined && self.roomConfig["suanFen"][0] == 2 ? parseInt(_player.multiple) + parseInt(multiple) : parseInt(_player.multiple) * parseInt(multiple);
            } else {
                if (typeof uid == "string") {
                    if (uid == _uid) _player.multiple = self.roomConfig["suanFen"] != undefined && self.roomConfig["suanFen"][0] == 2 ?
                        parseInt(_player.multiple) + parseInt(multiple) : parseInt(_player.multiple) * parseInt(multiple);
                    if (type != false && uid == _uid) {
                        _player.statistical[type] = self.roomConfig["suanFen"] != undefined && self.roomConfig["suanFen"][0] == 2 ?
                            _player.statistical[type] + parseInt(multiple) : _player.statistical[type] * parseInt(multiple);
                    }
                } else {
                    for (let j = 0; j < uid.length; j++) {
                        if (uid[j] == _uid) {
                            _player.multiple = self.roomConfig["suanFen"] != undefined && self.roomConfig["suanFen"][0] == 2 ?
                                parseInt(_player.multiple) + parseInt(multiple) : parseInt(_player.multiple) * parseInt(multiple);
                            if (type != false) {
                                _player.statistical[type] = self.roomConfig["suanFen"] != undefined && self.roomConfig["suanFen"][0] == 2 ?
                                    _player.statistical[type] + parseInt(multiple) : _player.statistical[type] * parseInt(multiple)
                            }
                        }
                    }
                }
            }
            let _obj = {
                sid: _player.index,
                multiple: _player.multiple,
                uid: _player.uid
            }
            arr.push(_obj);
        }
        if (playerMul != false) {
            let diZhuMul: number = 0;
            let tlg: number = 0;
            for (let i = 0; i < self.farmers.length; i++) {
                let _player = self.farmers[i]
                diZhuMul = parseInt(_player.multiple) + diZhuMul;
                tlg = parseInt(_player.statistical[type]) + tlg;
            }
            diZhuPlayer.multiple = diZhuMul;
            diZhuPlayer.statistical[type] = tlg;
            arr.push({
                sid: diZhuPlayer.index,
                multiple: diZhuPlayer.multiple,
                uid: diZhuPlayer.uid
            });
        }
    }
    if (self.diZhuMul.length != 0) arr = self.diZhuMul;

    if (uid != true) self.container.channel.pushMessage(PushEvent.dz_onMultiple, { playerInfo: arr, type: type, multiple: multiple });
    if (type != false) self.statistical[type] = self.statistical[type] * parseInt(multiple);
}
//踢拉
export function kickFollow(self, uid, msg) {
    let _players: any = [];
    let _landLordPlayer: any = "";
    let _msg: any = "";
    let _uid: any = "";
    let _player: any = {};
    let _sid: any = ""
    let _kickPull: any = "";
    let _action: any = "";
    let _addTimes: any = "";
    let _playerInfo: any = "";
    for (let i = 0; i < self.playerIds.length; i++) {
        _uid = self.playerIds[i];
        _player = self.findPlayerByUid(_uid);
        _player.action = {};
        if (_player.identity == "landlord") _landLordPlayer = _player;
        if (uid == _uid) {
            _sid = _player.index;
            _playerInfo = _player;
        }
        _players.push(_player);
    }
    self.container.channel.pushMessage(PushEvent.dz_onRadio, { choosed: msg["choosed"], sid: _sid, playerId: uid });  //广播叫庄
    if (self.roomConfig["add_multiple"] != undefined) {
        _playerInfo.state = msg.choosed;
        _playerInfo.grabLandlord = false;
    }
    if (self.roomConfig["add_multiple"] != undefined) _addTimes = new AddMultiple(self.gameConfig, _players, uid, _playerInfo);
    if (self.roomConfig["play"] != undefined) _kickPull = new kickPull(_players, self.roomConfig, _sid, self.gameConfig, _landLordPlayer);
    if (msg["choosed"] == "kick") _action = _kickPull.kick();
    if (msg["choosed"] == "notKick") _action = _kickPull.notKick();
    console.log("======msg[choosed]", msg["choosed"])
    if (msg["choosed"] == "follow" || msg["choosed"] == "notFollow") {
        _action = msg["choosed"] === "follow" ? _kickPull.follow(true) : _kickPull.follow(false);
    }
    if (msg["choosed"] == "pull" || msg["choosed"] == "notPull") _action = msg["choosed"] == "pull" ? _kickPull.pull(true) : _kickPull.pull(false);
    if (msg["choosed"] == "addTimes") _action = _addTimes.addTimes();
    if (msg["choosed"] == "notAddTimes") _action = _addTimes.notAddTimes();
    if (_action["multiple"]) {
        let type = msg["choosed"] != "addTimes" && msg["choosed"] != "notAddTimes" ? "tilagen" : "jiabei";
        if (_playerInfo["identity"] == "farmers") {
            pushMultiple(_action["multiple"], self, type, [uid, self._landLordPlayer.uid], true);
        } else {
            if (self.roomConfig["suanFen"] != undefined && self.roomConfig["suanFen"][0] == 2) {
                if (msg["choosed"] == "pull" || (msg["choosed"] == "addTimes"  && uid == self._landLordPlayer.uid)) {
                    pushMultiple(_action["multiple"], self, type, self.playerIds, true);
                }
            } else {
                pushMultiple(_action["multiple"], self, type, false);
            }
        }
    }
    if (msg["choosed"] != "addTimes" && msg["choosed"] != "notAddTimes") {
        if (_action["action"]) {
            _action["timely"] = true;
            if (_action["grabLandlord"] == false) _playerInfo["grabLandlord"] = _action["grabLandlord"]
            _player = self.findPlayerByUid(self.playerIds[_action["sid"]])
            _player.action = _action["action"];
            self.container.channel.pushMessage(PushEvent.dz_kickPush, _action);
        }
        return _action;
    } else {
        _player = self.findPlayerByUid(uid);
        _player.isDouble = false;
        let flag = self.checkDouble();
        console.log("======flag===", flag);
        if (flag == false) return { startPlay: true }
    }
    return {};

    // if (_action["action"]) {
    //     _action["timely"] = true;
    //     if (_action["grabLandlord"] == false) _playerInfo["grabLandlord"] = _action["grabLandlord"]
    //     _player = self.findPlayerByUid(self.playerIds[_action["sid"]])
    //     _player.action = _action["action"];
    //     self.container.channel.pushMessage(PushEvent.dz_kickPush, _action);
    //     return {};
    // }
    // return _action;
}
//叫地主
export function callZhuang(self, uid, msg) {
    let callLandlord: any = "";
    let _players: any = [];
    let _player: any = "";
    let _uid: any = "";
    let state: any = "";
    let lastTurn: any = self.currentIndex;
    let action: any = {};
    let _msg: Object = {};
    let gsp: any = undefined;
    let _state = 1 //不叫
    for (let i = 0; i < self.playerIds.length; i++) {
        _uid = self.playerIds[i];
        _player = self.findPlayerByUid(_uid);
        _player.action = {};
        if (_player.uid == uid) {
            state = _player.state;
            _player.state = msg && msg.choosed ? msg.choosed : "";
            lastTurn = _player.index;
            if (msg) if (msg["choosed"] == "landOwner") _player.IsLandOwner = true;
        }
        if (_player.IsLandOwner == true) _state = 2; //抢地主
        _players.push(_player);
    }
    if (self.roomConfig["grabLandlord"] && self.roomConfig["grabLandlord"].length > 1) {
        gsp = new grasp(lastTurn, _players, state, self.gameConfig, self.roomConfig, self);
    }
    if (self.roomConfig["gsp"] != undefined && (self.roomConfig["gsp"][0] == 1 || self.roomConfig["gsp"][0] == "gsp")) {
        if (gsp == undefined) {
            gsp = new grasp(lastTurn, _players, state, self.gameConfig, self.roomConfig, self);
        }
    }
    if (self.roomConfig["type"] == "ddz2") {
        callLandlord = new ddz2redouble(lastTurn, _players, state, self.gameConfig, self.roomConfig, self);
    } else {
        if (self.roomConfig["grabLandlord"][0] == "rob" ||
            (self.roomConfig["grabLandlord"].length > 1
                && (self.roomConfig["grabLandlord"][0] == "rob"
                    || self.roomConfig["grabLandlord"][1] == "rob"))) {
            callLandlord = new rob(lastTurn, _players, state, self.gameConfig, self.roomConfig, self);
        }
        if (self.roomConfig["grabLandlord"][0] == "fractions" ||
            (self.roomConfig["grabLandlord"].length > 1 &&
                (self.roomConfig["grabLandlord"][0] == "fractions" ||
                    self.roomConfig["grabLandlord"][1] == "fractions"))) {
            callLandlord = new frations(lastTurn, _players, state, self.gameConfig, self.roomConfig, self);
        }
        if (self.roomConfig["grabLandlord"][0] == "redouble") {
            callLandlord = new redouble(lastTurn, _players, state, self.gameConfig, self.roomConfig, self);
        }
    }
    if (callLandlord == "") callLandlord = new redouble(lastTurn, _players, state, self.gameConfig, self.roomConfig, self);
    if (msg == undefined) {
        pushMultiple(self.showMultiple, self, "brandCard", false);
        self.tmpMultiple = 1;
        action = ((self.roomConfig["grabLandlord"] && self.roomConfig["grabLandlord"].length > 1) || gsp != undefined) ? gsp.default() : callLandlord.default();
        _player = self.findPlayerByUid(uid);
        _player.action = action.action;
        _msg = action;
        _msg["sid"] = lastTurn;
        self.container.channel.pushMessage(PushEvent.dz_onCallZhuang, _msg);
        return true;
    }
    self.container.channel.pushMessage(PushEvent.dz_onRadio, { choosed: msg["choosed"], sid: lastTurn, playerId: uid, state: _state });  //广播叫庄
    action = getAction(msg, callLandlord, self.letBrandNum, gsp, self.roomConfig["grabLandlord"], lastTurn);
    if (action["multiple"]) {
        self.tmpMultiple = action["multiple"];
        if (self.roomConfig["grabLandlord"] != undefined && self.roomConfig["grabLandlord"][0] == "fractions") {
            pushMultiple(action["multiple"], self, "grabLandlord", false);
        } else {
            pushMultiple(self.gameConfig["multiple"]["grabLandlordMultiple"], self, "grabLandlord", false);
        }
    }
    if (!action) return false;
    if (action["landlord"] == true) {
        if (action["grabLandlord"] == false) {
            let playerInfo = self.findPlayerByUid(uid);
            playerInfo.grabLandlord = action["grabLandlord"];
        }
        return action;  //确认地主身份
    }
    if (action["letBrandNum"] != undefined) self.letBrandNum = action["letBrandNum"];
    for (let i = 0; i < self.playerIds.length; i++) {
        _uid = self.playerIds[i];
        _player = self.findPlayerByUid(_uid);
        if (_player.index == action["lastTurn"]) {
            _player.action = action["action"];
            _msg["action"] = action["action"];
            _msg["playerId"] = action["playerId"];
            _msg["sid"] = _player.index;
            _msg["timely"] = true;
            _msg["state"] = action["state"];
        }
        if (uid == _uid) {
            if (action["IsLandOwner"]) _player.IsLandOwner = action["IsLandOwner"];
            if (self.roomConfig["add_multiple"] == undefined) {
                if (action["grabLandlord"] == false) _player.grabLandlord = action["grabLandlord"];
            }
            if (action["grabLandlordNum"] != undefined) _player.grabLandlordNum = action["grabLandlordNum"];
            if (action["isLookCards"] == true) {
                _msg["cards"] = _player.cards;
                _msg["isFlip"] = _player.isFlip
            }
            if (action["isSpeack"] != undefined) _player.isSpeack = action["isSpeack"];
        }
        self.container.channel.pushMessageByIds(PushEvent.dz_onCallZhuang, _msg, _uid);
    }
    return action;
}
function getAction(msg, callLandlord, letBrandNum, gsp, grabLandlord, sid) {
    let action: any = "";
    switch (msg["choosed"]) {
        case "landOwner":
            action = callLandlord.landOwner();
            break;
        case "notCall":
            action = callLandlord.notCall();
            break;
        case "landGrab":
            action = callLandlord.landGrab(letBrandNum);
            break;
        case "grasp":
            action = gsp.grasp();
            break;
        case "lookCards":
            action = gsp.lookCards(sid);
            break;
        default:
            if (isNaN(msg["choosed"]) == false) {
                action = callLandlord.score();
            }
            break;
    }
    return action;
}
