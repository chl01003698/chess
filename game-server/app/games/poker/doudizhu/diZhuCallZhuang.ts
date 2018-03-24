import { diZhuButton } from './diZhuButton';
import PzCardForMula from './card-formula/pzCardFormula';

export function next_player_id(lastTurn: any, players: any) {
    let sid = parseInt(lastTurn + 1) % players.length;
    return sid;
}

class callZhuang {
    lastTurn: any;
    players: any;
    state: any;
    sid: any;
    playerId: any;
    gameConfig: any;
    roomConfig: any;
    self: any;
    constructor(lastTurn: number, players: any, state: any, gameConfig: any, roomConfig: any, self: any) {
        this.lastTurn = lastTurn;
        this.players = players;
        this.state = state   //状态 1叫地主  2抢地主  0不抢/不叫
        this.sid = "";
        this.playerId = "";
        this.gameConfig = gameConfig;
        this.roomConfig = roomConfig;
        this.self = self;
    };

    get_action() { }
    checkFlow() {
        let landOwners: any = []; //叫地主
        let landGrabs: any = []; //抢地主
        let notCalls: any = []; //不抢
        let _player: any = ""
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
    landGrab(letBrandNum: number) { }
    score() { }
}
//叫地主
export class rob extends callZhuang {
    constructor(lastTurn: number, players: any, state: any, gameConfig: any, roomConfig: any, self: any) {
        super(lastTurn, players, state, gameConfig, roomConfig, self)
    };

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
        let res: any = {};
        let sid: any = next_player_id(this.lastTurn, this.players);
        res = diZhuButton.landOwner;
        res["lastTurn"] = sid;
        res["playerId"] = this.players[sid].uid;
        res["grabLandlord"] = false;
        // console.log("=================this.roomConfig['grabLandlord']", this.roomConfig["grabLandlord"]);
        if (this.roomConfig["grabLandlord"].length > 1|| (this.roomConfig["gsp"] != undefined && (this.roomConfig["gsp"][0] ==1 || this.roomConfig["gsp"][0] == "gsp"))) {
            res["state"] = diZhuButton.grasp.state;
            res["action"] = diZhuButton.grasp.action
        }
        return res;
    };

    //默认
    default() {
        let res = {
            "state": "landOwner",
            "action": {
                "landOwner": "landOwner",  //叫地主
                "notCall": "notCall",    //不叫地主
                "state": "landOwner",
            }
        }
        return res;
    }
}

//1分 2分 3分
export class frations extends callZhuang {
    constructor(lastTurn: number, players: any, state: any, gameConfig: any, roomConfig: any, self: any) {
        super(lastTurn, players, state, gameConfig, roomConfig, self)
    };
    score() {
        // console.log("score=====");
        let sid: any = "";
        let notCall: any = [];
        let flag: boolean = false;
        let _player: any = "";
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
            let flag: any = this.roomConfig["grabLandlord"].length == 1 ? false : true
            let action = this.get_score_action(flag);
            if (this.roomConfig["grabLandlord"] != undefined && this.roomConfig["grabLandlord"].length > 1) {
                action["action"] = diZhuButton.grasp.action;
                action["state"] = diZhuButton.grasp.state;
            }
            return action;
        }
        if (notCall.length == this.players.length) {
            return false;  //流局
        }
        if (flag == false && sid === "") {
            sid = this.compare();
        }
        var res = {};
        res["multiple"] = this.players[this.lastTurn]["state"]
        res["landlord"] = true; // 确认地主身份 位置编号
        res["lastTurn"] = sid;
        res["playerId"] = this.players[sid].uid; //确认地主玩家ID
        return res;
    }

    compare() {
        let arr: any = [];
        let obj: any = {};
        let _player: any = ""
        for (let i = 0; i < this.players.length; i++) {
            _player = this.players[i];
            // console.log("======,_player.state", _player.state);
            if (isNaN(_player.state) == false) {
                obj[_player.state.toString()] = _player.index;
                arr.push(parseInt(_player["state"]));
            }
        }
        arr.sort()
        let _max = arr[arr.length - 1];
        // console.log("=========_max", _max);
        // console.log("=======obj===", obj);
        let sid = obj[_max.toString()];
        return sid;
    }


    get_score_action(flag = false) {
        let landOwer: any = [1, 2, 3];
        let sid = next_player_id(this.lastTurn, this.players)
        let res: any = {
            "state": "callPoints",
            "action": {
                "landOwer": landOwer,
                "notCall": "notCall",
                "state": "callPoints"
            },
            "lastTurn": sid,
            "playerId": this.players[sid].uid
        }
        let arr: any = [];
        let _player: any = "";
        for (var i = 0; i < this.players.length; i++) {
            _player = this.players[i];
            if (_player.state) {
                if (!isNaN(_player.state)) {
                    arr.push(parseInt(_player.state));
                }
            }

        }
        res["action"]["landOwer"] = landOwer.concat(arr).filter(v => !landOwer.includes(v) || !arr.includes(v));
        res["action"]["landOwer"].sort()
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
        let landOwer: any = [1, 2, 3];
        let res = {
            "state": "callPoints",
            "action": {
                "landOwer": landOwer,
                "state": "callPoints",
                "notCall": "notCall"
            },
        }
        return res;
    }

    notCall() {
        let _obj = this.checkFlow();
        if (!_obj) {
            return _obj;  //流局  false  标识流局
        }

        let sid: any = "";
        let action: any = "";
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (player.state == "" || player.state == undefined) {
                sid = next_player_id(this.lastTurn, this.players); //下一个玩家的位置ID
                break;
            }
        }
        if (sid !== "") {
            let flag: any = this.roomConfig["grabLandlord"].length == 1 ? false : true
            action = this.get_score_action(flag);
            if ((this.roomConfig["grabLandlord"] != undefined&& this.roomConfig["grabLandlord"].length > 1)
            || (this.roomConfig["gsp"] != undefined && (this.roomConfig["gsp"][0] ==1 || this.roomConfig["gsp"][0] == "gsp"))) {
                action["action"] = diZhuButton.grasp.action;
                action["state"] = diZhuButton.grasp.state;
            }
            action["grabLandlord"] = false;
            return action;
        }
        sid = this.compare();
        var res = {};
        res["multiple"] = this.players[sid]["state"].toString()
        res["landlord"] = true; // 确认地主身份 位置编号
        res["lastTurn"] = sid;
        res["playerId"] = this.players[sid].uid; //确认地主玩家ID
        res["grabLandlord"] = false;
        return res;
    }

}

//抢地主
export class redouble extends callZhuang {
    constructor(lastTurn: number, players: any, state: any, gameConfig: any, roomConfig: any, self: any) {
        super(lastTurn, players, state, gameConfig, roomConfig, self)
    };

    //叫地主
    landOwner() {
        let _obj = this.checkFlow();
        if (!_obj) {
            return _obj;  //流局  false  标识流局
        }
        let res: any = {};
        let notCalls = _obj["notCalls"]; //不强
        let action: any = this.get_action();
        if (notCalls.length == this.players.length - 1 || action == true) {   //确定地主身份
            res["landlord"] = true; // 确认地主身份 位置编号
            res["lastTurn"] = this.players[this.lastTurn].index;
            res["playerId"] = this.players[this.lastTurn].uid; //确认地主玩家ID
            return res;
        }
        ;
        res = {
            action: action["action"],  //按钮
            lastTurn: action["lastTurn"], //下一个人的说话位置
            playerId: this.players[action["lastTurn"]].uid, //说话的用户ID
            IsLandOwner: true,
        };
        res["state"] = action["state"]
        return res;
    }

    //抢地主
    landGrab(letBrandNum: number) {
        let action = this.get_action();
        // console.log("====landGrab==",action);
        let res: any = {};
        let num: any = parseInt(this.gameConfig.multiple.grabLandlordMultiple) * this.self.tmpMultiple;
        res["multiple"] = num;
        if (action == true) {  //确定地主
            res["landlord"] = true; // 确认地主 位置编号
            res["lastTurn"] = this.players[this.lastTurn].sid;
            res["playerId"] = this.players[this.lastTurn].uid; //确认地主玩家ID
            return res;
        }
        this.self.lastSid = this.lastTurn;
        res["action"] = action["action"];  //按钮
        res["lastTurn"] = action["lastTurn"];// 下一个人说话位置ID
        res["playerId"] = this.players[action["lastTurn"]].uid;// 说话的用户ID
        res["state"] = action["state"]
        return res;
    }

    //不叫
    notCall() {
        var _obj: any = this.checkFlow();
        if (!_obj) {
            return _obj;  //流局  false  标识流局
        }
        var res = {"grabLandlord":false};
        var landOwners = _obj["landOwners"];//叫地主
        var landGrabs = _obj["landGrabs"]; //抢地主
        var notCalls = _obj["notCalls"]; //不强
        var action = this.get_action();
        let _player: any = this.players[this.lastTurn];
        if (((notCalls.length == (this.players.length - 1)) && (landOwners.length > 0 || landGrabs.length > 0))
            || action == true) {   //确定地主身份
            var player = landOwners.length > 0 ? landOwners[0] : landGrabs[0];
            var sid = player["sid"]
            res["landlord"] = true; // 确认地主身份 位置编号
            res["lastTurn"] = sid;
            res["playerId"] = player.uid; //确认地主玩家ID
            return res;
        }
        ;
        if (_player.IsLandOwner == true) {
            var sid = this.self.lastSid
            res["landlord"] = true; // 确认地主身份 位置编号
            res["lastTurn"] = sid;
            res["playerId"] = this.players[this.self.lastSid].uid; //确认地主玩家ID
            return res;
        }
        res["action"] = action["action"];  //按钮
        res["lastTurn"] = action["lastTurn"]; // 下一个人说话位置ID
        res["playerId"] = this.players[action["lastTurn"]].uid;// 说话的用户ID
        res["state"] = action["state"]
        // res["grabLandlord"] = false;

        return res;
    }
    get_action() {
        let landGrad: any = false;
        let sid: any = this.lastTurn;
        let landOwner: any = false;
        let _player: any = "";
        let landGrab: any = "";
        for (let i = 0; i < this.players.length; i++) {
            _player = this.players[i];
            console.log("=====_player.IsLandOwner=====",_player.IsLandOwner);
            if (_player.IsLandOwner) {
                landOwner = true;
            }
        }
        for (let i = sid, j = 0; i < this.players.length; i = sid, j++) {
            _player = this.players[i];
            if (_player.state !== "") {
                if (_player.state == "landGrab" || _player.state == "landOwner") {
                    if ((this.state == "landOwner" || this.state == "landGrab") && _player.state != "notCall") {  //当前人叫过地主 再一次抢地主
                        return true; //当前人成为地主
                    }                    
                    landGrab = true;  //抢地主
                }
            }
            if (_player.state === ""){
                if(landOwner == true) landGrab = true;
                break;
            } 
            sid = next_player_id(_player["index"], this.players);
            // console.log("========sid====,state",sid,this.players[sid].state);
            if(this.players[sid].state === "notCall") continue
            if(this.players[sid].state == "landGrab" || this.players[sid].state == "landOwner") break;           
        }
        var res = {
            "state": "landOwner",
            "action": {
                "notCall": "notCall",//不叫 不抢
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
        res.action["landOwner"] = "landOwner";  //叫地主
        return res;
    }
    //默认
    default() {
        let res = {
            "state": "landOwner",
            "action": {
                "landOwner": "landOwner",  //叫地主
                "notCall": "notCall",  //不叫地主
                "state": "landOwner"
            }
        }
        return res;
    }


}
export class ddz2redouble extends callZhuang {
    constructor(lastTurn: number, players: any, state: any, gameConfig: any, roomConfig: any, self: any) {
        super(lastTurn, players, state, gameConfig, roomConfig, self);
    };
    landOwner() {
        let res: object = {}
        let _obj: any = this.checkFlow();
        if (!_obj) return _obj; //流局       
        let notCalls = _obj["notCalls"]; //不强
        let action = this.get_action();
        if (notCalls.length == this.players.length - 1 || action == true) {   //确定地主身份
            res["landlord"] = true; // 确认地主身份 位置编号
            res["lastTurn"] = this.players[this.lastTurn].index;
            res["playerId"] = this.players[this.lastTurn].uid; //确认地主玩家ID
            return res;
        }
        ;
        res = {
            action: action["action"],  //按钮
            grabLandlord: true,
            lastTurn: action["lastTurn"], //下一个人的说话位置
            playerId: this.players[action["lastTurn"]].uid, //说话的用户ID
            IsLandOwner: true,
        };

        res["state"] = action["state"]
        return res;
    }
    notCall() {
        let _obj = this.checkFlow();
        if (!_obj) {
            return _obj;  //流局  false  标识流局
        }
        let res = {};
        let landOwners = _obj["landOwners"];//叫地主
        let landGrabs = _obj["landGrabs"]; //抢地主
        let notCalls = _obj["notCalls"]; //不强
        let action = this.get_action();
        if (((notCalls.length == (this.players.length - 1)) && (landOwners.length > 0 || landGrabs.length > 0)) || action == true) {   //确定地主身份
            let player = landOwners.length > 0 ? landOwners[0] : landGrabs[0];
            let sid = player["index"]
            res["landlord"] = true; // 确认地主身份 位置编号
            res["lastTurn"] = sid;
            res["playerId"] = player.uid; //确认地主玩家ID
            return res;
        }
        ;
        res["action"] = action["action"];  //按钮
        res["lastTurn"] = action["lastTurn"]; // 下一个人说话位置ID
        res["playerId"] = this.players[action["lastTurn"]].uid;// 说话的用户ID
        res["state"] = action["state"]
        return res;
    }
    landGrab(letBrandNum: any) {
        let action = this.get_action();
        let res = {};
        let num: any = parseInt(this.gameConfig.multiple.grabLandlordMultiple) * this.self.tmpMultiple;
        if (letBrandNum < 4) letBrandNum = parseInt(letBrandNum) + 1;
        res["multiple"] = num;
        if (action == true) {  //确定地主
            res["landlord"] = true; // 确认地主 位置编号
            res["lastTurn"] = this.players[this.lastTurn].index;
            res["playerId"] = this.players[this.lastTurn].uid; //确认地主玩家ID
            return res;
        }

        res["action"] = action["action"];  //按钮
        res["lastTurn"] = action["lastTurn"];// 下一个人说话位置ID
        res["playerId"] = this.players[action["lastTurn"]].uid;// 说话的用户ID
        res["state"] = action["state"]
        res["grabLandlord"] = true;
        res["grabLandlordNum"] = action["grabLandlordNum"];
        res["letBrandNum"] = letBrandNum;
        return res;
    }
    get_action() {
        let landGrab = false;  //抢地主
        // var landGrabs = [];
        let sid: any = this.lastTurn;
        let sid1: any = ""
        let landOwner = false;
        let _player: any = {};
        for (let i = 0; i < this.players.length; i++) {
            _player = this.players[i];
            if (_player.IsLandOwner) {  //有人叫地主
                landOwner = true;
                break;
            }
        }
        var count = 0;
        for (let i = sid, j = 0; j < this.players.length; i = sid, j++) {
            _player = this.players[i];
            // console.log("=================_player.grabLandlordNum", _player.grabLandlordNum);
            if (!_player.state) break; //这个人没交
            if (_player.index == this.lastTurn) {
                _player.grabLandlordNum = parseInt(_player.grabLandlordNum) + 1;
                if (_player.IsLandOwner == true) {
                    count = 1 + parseInt(_player.grabLandlordNum);
                }
            }
            sid = next_player_id(sid, this.players);
        }
        // console.log("=====count,===========", count);
        if (count == 4) {  //第一个人说话3次确定第一个人地主
            return true;
        } else {
            sid1 = next_player_id(this.lastTurn, this.players);
            landGrab = true;  //抢地主
        }
        // console.log("=========ddz2=====sid1===", sid1);
        var res = {
            "state": "landOwner",
            "action": {
                "notCall": "notCall",//不叫 不抢
                "state": "landOwner"
            },
            "playerId": this.players[sid1].uid,
            "lastTurn": sid1
        }
        let action: any = {};
        if (landGrab && landOwner == true) {
            // console.log("====landGrab==landOwner=", landOwner, landOwner);
            res.action["landGrab"] = "landGrab"; //抢地主
            res.action["state"] = "landGrab";
            res["grabLandlordNum"] = this.players[this.lastTurn]["grabLandlordNum"];
            // console.log("grabLandlordNum===============", res["grabLandlordNum"]);
            res["state"] = "landGrab";
            return res;
        }
        res.action["landOwner"] = "landOwner";  //叫地主
        return res;
    }
    default() {
        let res = {
            "state": "landOwner",
            "action": {
                "landOwner": "landOwner",  //叫地主
                "notCall": "notCall",   //不叫地主
                "state": "landOwner"
            }
        }
        return res;
    }


}

export class grasp extends callZhuang {
    private _cardForMula: any = ""
    constructor(lastTurn: number, players: any, state: any, gameConfig: any, roomConfig: any, self: any) {
        super(lastTurn, players, state, gameConfig, roomConfig, self);
        this._cardForMula = new PzCardForMula();
    };
    //闷抓
    grasp() {
        let res: object = {};
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
        let res: object = {};
        res["landlord"] = true; // 确认地主身份 位置编号
        res["lastTurn"] = this.players[this.lastTurn].index;
        res["playerId"] = this.players[this.lastTurn].uid; //确认地主玩家ID
        res["isLookCards"] = true;
        res["isSpeack"] = true;
        return res;
    }
    //看牌  /抓/不抓 需要检查牌型
    lookCards(sid) {
        let res: object = {};
        let _call: any = "";
        let _res: any = {};
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
                "landOwner": "landOwner",  //叫地主
                "notCall": "notCall"    //不叫地主
            }
        };
        res["lastTurn"] = sid;
        res["playerId"] = this.players[sid].uid;
        res["isLookCards"] = true;
        res["isSpeack"] = true;
        // console.log("===dfsdfsdfsdf======_res======", _res);
        return res;
    };
    //不抓
    notGsp() {
        let notGsp: Array<number> = [];
        var res = {};
        let sid: number = next_player_id(this.lastTurn, this.players);
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
            res["isPz"] = true;  //是否是皮子
            return res;
        }
        res = diZhuButton.grasp;
        res["lastTurn"] = sid;
        res["playerId"] = this.players[sid].uid; //确认地主玩家ID
        res["isPz"] = true;  //是否是皮子
        res["grabLandlord"] = false;
        return res;
    }
    default() {
        return diZhuButton.grasp;
    }
}