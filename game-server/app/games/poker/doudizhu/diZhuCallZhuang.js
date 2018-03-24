"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diZhuButton_1 = require("./diZhuButton");
const pzCardFormula_1 = require("./card-formula/pzCardFormula");
function next_player_id(lastTurn, players) {
    let sid = parseInt(lastTurn + 1) % players.length;
    return sid;
}
exports.next_player_id = next_player_id;
class callZhuang {
    constructor(lastTurn, players, state, gameConfig, roomConfig, self) {
        this.lastTurn = lastTurn;
        this.players = players;
        this.state = state; //状态 1叫地主  2抢地主  0不抢/不叫
        this.sid = "";
        this.playerId = "";
        this.gameConfig = gameConfig;
        this.roomConfig = roomConfig;
        this.self = self;
    }
    ;
    get_action() { }
    checkFlow() {
        let landOwners = []; //叫地主
        let landGrabs = []; //抢地主
        let notCalls = []; //不抢
        let _player = "";
        for (var i = 0; i < this.players.length; i++) {
            _player = this.players[i];
            if (_player.state) {
                if (_player.state == "notCall") {
                    notCalls.push(_player); //不抢
                }
                if (_player.state == "landGrab") {
                    landGrabs.push(_player); //抢地主
                }
                if (_player.state == "landOwner") {
                    landOwners.push(_player); //叫地主
                }
            }
        }
        ;
        if (notCalls.length == this.players.length) {
            return false; //流局
        }
        ;
        return { landOwners: landOwners, landGrabs: landGrabs, notCalls: notCalls };
    }
    landOwner() { }
    notCall() { }
    landGrab(letBrandNum) { }
    score() { }
}
//叫地主
class rob extends callZhuang {
    constructor(lastTurn, players, state, gameConfig, roomConfig, self) {
        super(lastTurn, players, state, gameConfig, roomConfig, self);
    }
    ;
    //叫地主
    landOwner() {
        let res = {};
        res["landlord"] = true;
        res["lastTurn"] = this.players[this.lastTurn].index;
        res["playerId"] = this.players[this.lastTurn].uid;
        return res;
    }
    //不叫
    notCall() {
        let _obj = this.checkFlow();
        if (!_obj) {
            return _obj;
        }
        let res = {};
        let sid = next_player_id(this.lastTurn, this.players);
        res = diZhuButton_1.diZhuButton.landOwner;
        res["lastTurn"] = sid;
        res["playerId"] = this.players[sid].uid;
        res["grabLandlord"] = false;
        // console.log("=================this.roomConfig['grabLandlord']", this.roomConfig["grabLandlord"]);
        if (this.roomConfig["grabLandlord"].length > 1 || (this.roomConfig["gsp"] != undefined && (this.roomConfig["gsp"][0] == 1 || this.roomConfig["gsp"][0] == "gsp"))) {
            res["state"] = diZhuButton_1.diZhuButton.grasp.state;
            res["action"] = diZhuButton_1.diZhuButton.grasp.action;
        }
        return res;
    }
    ;
    //默认
    default() {
        let res = {
            "state": "landOwner",
            "action": {
                "landOwner": "landOwner",
                "notCall": "notCall",
                "state": "landOwner",
            }
        };
        return res;
    }
}
exports.rob = rob;
//1分 2分 3分
class frations extends callZhuang {
    constructor(lastTurn, players, state, gameConfig, roomConfig, self) {
        super(lastTurn, players, state, gameConfig, roomConfig, self);
    }
    ;
    score() {
        // console.log("score=====");
        let sid = "";
        let notCall = [];
        let flag = false;
        let _player = "";
        for (let i = 0; i < this.players.length; i++) {
            _player = this.players[i];
            if (_player.state == 3) {
                flag = true;
                sid = _player.index;
                this.playerId = _player.uid;
            }
        }
        if (flag == false) {
            for (let i = 0; i < this.players.length; i++) {
                _player = this.players[i];
                if (_player.state === "" || _player.state === undefined) {
                    sid = next_player_id(this.lastTurn, this.players);
                    break;
                }
                if (_player.state == "notCall") {
                    notCall.push(i);
                }
            }
        }
        if (sid !== "" && flag !== true) {
            let flag = this.roomConfig["grabLandlord"].length == 1 ? false : true;
            let action = this.get_score_action(flag);
            if (this.roomConfig["grabLandlord"] != undefined && this.roomConfig["grabLandlord"].length > 1) {
                action["action"] = diZhuButton_1.diZhuButton.grasp.action;
                action["state"] = diZhuButton_1.diZhuButton.grasp.state;
            }
            return action;
        }
        if (notCall.length == this.players.length) {
            return false; //流局
        }
        if (flag == false && sid === "") {
            sid = this.compare();
        }
        var res = {};
        res["multiple"] = this.players[this.lastTurn]["state"];
        res["landlord"] = true; // 确认地主身份 位置编号
        res["lastTurn"] = sid;
        res["playerId"] = this.players[sid].uid; //确认地主玩家ID
        return res;
    }
    compare() {
        let arr = [];
        let obj = {};
        let _player = "";
        for (let i = 0; i < this.players.length; i++) {
            _player = this.players[i];
            // console.log("======,_player.state", _player.state);
            if (isNaN(_player.state) == false) {
                obj[_player.state.toString()] = _player.index;
                arr.push(parseInt(_player["state"]));
            }
        }
        arr.sort();
        let _max = arr[arr.length - 1];
        // console.log("=========_max", _max);
        // console.log("=======obj===", obj);
        let sid = obj[_max.toString()];
        return sid;
    }
    get_score_action(flag = false) {
        let landOwer = [1, 2, 3];
        let sid = next_player_id(this.lastTurn, this.players);
        let res = {
            "state": "callPoints",
            "action": {
                "landOwer": landOwer,
                "notCall": "notCall",
                "state": "callPoints"
            },
            "lastTurn": sid,
            "playerId": this.players[sid].uid
        };
        let arr = [];
        let _player = "";
        for (var i = 0; i < this.players.length; i++) {
            _player = this.players[i];
            if (_player.state) {
                if (!isNaN(_player.state)) {
                    arr.push(parseInt(_player.state));
                }
            }
        }
        res["action"]["landOwer"] = landOwer.concat(arr).filter(v => !landOwer.includes(v) || !arr.includes(v));
        res["action"]["landOwer"].sort();
        // if (flag == true) {
        //     res["state"] = diZhuButton.grasp.state;
        //     res["action"] = diZhuButton.grasp.action;
        // };
        if (arr.length == 0) {
            return res;
        }
        if (res["action"]["landOwer"][0] == "1") {
            res["action"]["landOwer"] = [3];
        }
        return res;
    }
    default() {
        let landOwer = [1, 2, 3];
        let res = {
            "state": "callPoints",
            "action": {
                "landOwer": landOwer,
                "state": "callPoints",
                "notCall": "notCall"
            },
        };
        return res;
    }
    notCall() {
        let _obj = this.checkFlow();
        if (!_obj) {
            return _obj; //流局  false  标识流局
        }
        let sid = "";
        let action = "";
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (player.state == "" || player.state == undefined) {
                sid = next_player_id(this.lastTurn, this.players); //下一个玩家的位置ID
                break;
            }
        }
        if (sid !== "") {
            let flag = this.roomConfig["grabLandlord"].length == 1 ? false : true;
            action = this.get_score_action(flag);
            if ((this.roomConfig["grabLandlord"] != undefined && this.roomConfig["grabLandlord"].length > 1)
                || (this.roomConfig["gsp"] != undefined && (this.roomConfig["gsp"][0] == 1 || this.roomConfig["gsp"][0] == "gsp"))) {
                action["action"] = diZhuButton_1.diZhuButton.grasp.action;
                action["state"] = diZhuButton_1.diZhuButton.grasp.state;
            }
            action["grabLandlord"] = false;
            return action;
        }
        sid = this.compare();
        var res = {};
        res["multiple"] = this.players[sid]["state"].toString();
        res["landlord"] = true; // 确认地主身份 位置编号
        res["lastTurn"] = sid;
        res["playerId"] = this.players[sid].uid; //确认地主玩家ID
        res["grabLandlord"] = false;
        return res;
    }
}
exports.frations = frations;
//抢地主
class redouble extends callZhuang {
    constructor(lastTurn, players, state, gameConfig, roomConfig, self) {
        super(lastTurn, players, state, gameConfig, roomConfig, self);
    }
    ;
    //叫地主
    landOwner() {
        let _obj = this.checkFlow();
        if (!_obj) {
            return _obj; //流局  false  标识流局
        }
        let res = {};
        let notCalls = _obj["notCalls"]; //不强
        let action = this.get_action();
        if (notCalls.length == this.players.length - 1 || action == true) {
            res["landlord"] = true; // 确认地主身份 位置编号
            res["lastTurn"] = this.players[this.lastTurn].index;
            res["playerId"] = this.players[this.lastTurn].uid; //确认地主玩家ID
            return res;
        }
        ;
        res = {
            action: action["action"],
            lastTurn: action["lastTurn"],
            playerId: this.players[action["lastTurn"]].uid,
            IsLandOwner: true,
        };
        res["state"] = action["state"];
        return res;
    }
    //抢地主
    landGrab(letBrandNum) {
        let action = this.get_action();
        // console.log("====landGrab==",action);
        let res = {};
        let num = parseInt(this.gameConfig.multiple.grabLandlordMultiple) * this.self.tmpMultiple;
        res["multiple"] = num;
        if (action == true) {
            res["landlord"] = true; // 确认地主 位置编号
            res["lastTurn"] = this.players[this.lastTurn].sid;
            res["playerId"] = this.players[this.lastTurn].uid; //确认地主玩家ID
            return res;
        }
        this.self.lastSid = this.lastTurn;
        res["action"] = action["action"]; //按钮
        res["lastTurn"] = action["lastTurn"]; // 下一个人说话位置ID
        res["playerId"] = this.players[action["lastTurn"]].uid; // 说话的用户ID
        res["state"] = action["state"];
        return res;
    }
    //不叫
    notCall() {
        var _obj = this.checkFlow();
        if (!_obj) {
            return _obj; //流局  false  标识流局
        }
        var res = { "grabLandlord": false };
        var landOwners = _obj["landOwners"]; //叫地主
        var landGrabs = _obj["landGrabs"]; //抢地主
        var notCalls = _obj["notCalls"]; //不强
        var action = this.get_action();
        let _player = this.players[this.lastTurn];
        if (((notCalls.length == (this.players.length - 1)) && (landOwners.length > 0 || landGrabs.length > 0))
            || action == true) {
            var player = landOwners.length > 0 ? landOwners[0] : landGrabs[0];
            var sid = player["sid"];
            res["landlord"] = true; // 确认地主身份 位置编号
            res["lastTurn"] = sid;
            res["playerId"] = player.uid; //确认地主玩家ID
            return res;
        }
        ;
        if (_player.IsLandOwner == true) {
            var sid = this.self.lastSid;
            res["landlord"] = true; // 确认地主身份 位置编号
            res["lastTurn"] = sid;
            res["playerId"] = this.players[this.self.lastSid].uid; //确认地主玩家ID
            return res;
        }
        res["action"] = action["action"]; //按钮
        res["lastTurn"] = action["lastTurn"]; // 下一个人说话位置ID
        res["playerId"] = this.players[action["lastTurn"]].uid; // 说话的用户ID
        res["state"] = action["state"];
        // res["grabLandlord"] = false;
        return res;
    }
    get_action() {
        let landGrad = false;
        let sid = this.lastTurn;
        let landOwner = false;
        let _player = "";
        let landGrab = "";
        for (let i = 0; i < this.players.length; i++) {
            _player = this.players[i];
            console.log("=====_player.IsLandOwner=====", _player.IsLandOwner);
            if (_player.IsLandOwner) {
                landOwner = true;
            }
        }
        for (let i = sid, j = 0; i < this.players.length; i = sid, j++) {
            _player = this.players[i];
            if (_player.state !== "") {
                if (_player.state == "landGrab" || _player.state == "landOwner") {
                    if ((this.state == "landOwner" || this.state == "landGrab") && _player.state != "notCall") {
                        return true; //当前人成为地主
                    }
                    landGrab = true; //抢地主
                }
            }
            if (_player.state === "") {
                if (landOwner == true)
                    landGrab = true;
                break;
            }
            sid = next_player_id(_player["index"], this.players);
            // console.log("========sid====,state",sid,this.players[sid].state);
            if (this.players[sid].state === "notCall")
                continue;
            if (this.players[sid].state == "landGrab" || this.players[sid].state == "landOwner")
                break;
        }
        var res = {
            "state": "landOwner",
            "action": {
                "notCall": "notCall",
                "landOwner": "landOwner",
                "state": "landOwner"
            },
            "playerId": this.players[sid]["uid"],
            "lastTurn": sid
        };
        if (landOwner == true) {
            res.action["landGrab"] = "landGrab"; //抢地主
            res.action["state"] = "landGrab";
            res["state"] = "landGrab";
            return res;
        }
        res.action["landOwner"] = "landOwner"; //叫地主
        return res;
    }
    //默认
    default() {
        let res = {
            "state": "landOwner",
            "action": {
                "landOwner": "landOwner",
                "notCall": "notCall",
                "state": "landOwner"
            }
        };
        return res;
    }
}
exports.redouble = redouble;
class ddz2redouble extends callZhuang {
    constructor(lastTurn, players, state, gameConfig, roomConfig, self) {
        super(lastTurn, players, state, gameConfig, roomConfig, self);
    }
    ;
    landOwner() {
        let res = {};
        let _obj = this.checkFlow();
        if (!_obj)
            return _obj; //流局       
        let notCalls = _obj["notCalls"]; //不强
        let action = this.get_action();
        if (notCalls.length == this.players.length - 1 || action == true) {
            res["landlord"] = true; // 确认地主身份 位置编号
            res["lastTurn"] = this.players[this.lastTurn].index;
            res["playerId"] = this.players[this.lastTurn].uid; //确认地主玩家ID
            return res;
        }
        ;
        res = {
            action: action["action"],
            grabLandlord: true,
            lastTurn: action["lastTurn"],
            playerId: this.players[action["lastTurn"]].uid,
            IsLandOwner: true,
        };
        res["state"] = action["state"];
        return res;
    }
    notCall() {
        let _obj = this.checkFlow();
        if (!_obj) {
            return _obj; //流局  false  标识流局
        }
        let res = {};
        let landOwners = _obj["landOwners"]; //叫地主
        let landGrabs = _obj["landGrabs"]; //抢地主
        let notCalls = _obj["notCalls"]; //不强
        let action = this.get_action();
        if (((notCalls.length == (this.players.length - 1)) && (landOwners.length > 0 || landGrabs.length > 0)) || action == true) {
            let player = landOwners.length > 0 ? landOwners[0] : landGrabs[0];
            let sid = player["index"];
            res["landlord"] = true; // 确认地主身份 位置编号
            res["lastTurn"] = sid;
            res["playerId"] = player.uid; //确认地主玩家ID
            return res;
        }
        ;
        res["action"] = action["action"]; //按钮
        res["lastTurn"] = action["lastTurn"]; // 下一个人说话位置ID
        res["playerId"] = this.players[action["lastTurn"]].uid; // 说话的用户ID
        res["state"] = action["state"];
        return res;
    }
    landGrab(letBrandNum) {
        let action = this.get_action();
        let res = {};
        let num = parseInt(this.gameConfig.multiple.grabLandlordMultiple) * this.self.tmpMultiple;
        if (letBrandNum < 4)
            letBrandNum = parseInt(letBrandNum) + 1;
        res["multiple"] = num;
        if (action == true) {
            res["landlord"] = true; // 确认地主 位置编号
            res["lastTurn"] = this.players[this.lastTurn].index;
            res["playerId"] = this.players[this.lastTurn].uid; //确认地主玩家ID
            return res;
        }
        res["action"] = action["action"]; //按钮
        res["lastTurn"] = action["lastTurn"]; // 下一个人说话位置ID
        res["playerId"] = this.players[action["lastTurn"]].uid; // 说话的用户ID
        res["state"] = action["state"];
        res["grabLandlord"] = true;
        res["grabLandlordNum"] = action["grabLandlordNum"];
        res["letBrandNum"] = letBrandNum;
        return res;
    }
    get_action() {
        let landGrab = false; //抢地主
        // var landGrabs = [];
        let sid = this.lastTurn;
        let sid1 = "";
        let landOwner = false;
        let _player = {};
        for (let i = 0; i < this.players.length; i++) {
            _player = this.players[i];
            if (_player.IsLandOwner) {
                landOwner = true;
                break;
            }
        }
        var count = 0;
        for (let i = sid, j = 0; j < this.players.length; i = sid, j++) {
            _player = this.players[i];
            // console.log("=================_player.grabLandlordNum", _player.grabLandlordNum);
            if (!_player.state)
                break; //这个人没交
            if (_player.index == this.lastTurn) {
                _player.grabLandlordNum = parseInt(_player.grabLandlordNum) + 1;
                if (_player.IsLandOwner == true) {
                    count = 1 + parseInt(_player.grabLandlordNum);
                }
            }
            sid = next_player_id(sid, this.players);
        }
        // console.log("=====count,===========", count);
        if (count == 4) {
            return true;
        }
        else {
            sid1 = next_player_id(this.lastTurn, this.players);
            landGrab = true; //抢地主
        }
        // console.log("=========ddz2=====sid1===", sid1);
        var res = {
            "state": "landOwner",
            "action": {
                "notCall": "notCall",
                "state": "landOwner"
            },
            "playerId": this.players[sid1].uid,
            "lastTurn": sid1
        };
        let action = {};
        if (landGrab && landOwner == true) {
            // console.log("====landGrab==landOwner=", landOwner, landOwner);
            res.action["landGrab"] = "landGrab"; //抢地主
            res.action["state"] = "landGrab";
            res["grabLandlordNum"] = this.players[this.lastTurn]["grabLandlordNum"];
            // console.log("grabLandlordNum===============", res["grabLandlordNum"]);
            res["state"] = "landGrab";
            return res;
        }
        res.action["landOwner"] = "landOwner"; //叫地主
        return res;
    }
    default() {
        let res = {
            "state": "landOwner",
            "action": {
                "landOwner": "landOwner",
                "notCall": "notCall",
                "state": "landOwner"
            }
        };
        return res;
    }
}
exports.ddz2redouble = ddz2redouble;
class grasp extends callZhuang {
    constructor(lastTurn, players, state, gameConfig, roomConfig, self) {
        super(lastTurn, players, state, gameConfig, roomConfig, self);
        this._cardForMula = "";
        this._cardForMula = new pzCardFormula_1.default();
    }
    ;
    //闷抓
    grasp() {
        let res = {};
        res["landlord"] = true;
        res["lastTurn"] = this.players[this.lastTurn].index;
        res["playerId"] = this.players[this.lastTurn].uid; //确认地主玩家ID
        if (this.roomConfig["grabLandlord"][0] == "frations") {
            res["multiple"] = 3;
        }
        // res["isPz"] = true;  //是否是皮子
        res["isPzgrasp"] = true; //是否是闷抓
        res["isLookCards"] = true;
        res["isSpeack"] = true;
        return res;
    }
    //抓
    gsp() {
        let res = {};
        res["landlord"] = true; // 确认地主身份 位置编号
        res["lastTurn"] = this.players[this.lastTurn].index;
        res["playerId"] = this.players[this.lastTurn].uid; //确认地主玩家ID
        res["isLookCards"] = true;
        res["isSpeack"] = true;
        return res;
    }
    //看牌  /抓/不抓 需要检查牌型
    lookCards(sid) {
        let res = {};
        let _call = "";
        let _res = {};
        // console.log("grabLandlord=====,sid", this.roomConfig["grabLandlord"], sid);
        if (this.roomConfig["grabLandlord"][0] == "fractions" || this.roomConfig["grabLandlord"][1] == "frations") {
            _call = new frations(sid, this.players, this.state, this.gameConfig, this.roomConfig, this.self);
            _res = _call.get_score_action();
            _res["lastTurn"] = sid;
            _res["playerId"] = this.players[sid].uid;
            _res["isLookCards"] = true;
            _res["isSpeack"] = true;
            return _res;
        }
        res = {
            "state": "landOwner",
            "action": {
                "landOwner": "landOwner",
                "notCall": "notCall" //不叫地主
            }
        };
        res["lastTurn"] = sid;
        res["playerId"] = this.players[sid].uid;
        res["isLookCards"] = true;
        res["isSpeack"] = true;
        // console.log("===dfsdfsdfsdf======_res======", _res);
        return res;
    }
    ;
    //不抓
    notGsp() {
        let notGsp = [];
        var res = {};
        let sid = next_player_id(this.lastTurn, this.players);
        for (var i = 0; i < this.players.length; i++) {
            var _player = this.players[i];
            if (_player.state == "notGsp") {
                notGsp.push(i);
            }
        }
        if (notGsp.length == (this.players.length - 1)) {
            res["landlord"] = true; // 确认地主身份 位置编号
            res["lastTurn"] = sid;
            res["playerId"] = this.players[sid].uid; //确认地主玩家ID
            res["isPz"] = true; //是否是皮子
            return res;
        }
        res = diZhuButton_1.diZhuButton.grasp;
        res["lastTurn"] = sid;
        res["playerId"] = this.players[sid].uid; //确认地主玩家ID
        res["isPz"] = true; //是否是皮子
        res["grabLandlord"] = false;
        return res;
    }
    default() {
        return diZhuButton_1.diZhuButton.grasp;
    }
}
exports.grasp = grasp;
