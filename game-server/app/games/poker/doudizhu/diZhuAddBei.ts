import { ddz2redouble, next_player_id } from "./diZhuCallZhuang";
import { diZhuButton } from './diZhuButton';

export class AddMultiple  {
    player: any;
    players: any;
    sid: any;
    gameConfig: any;
    playerId: any;
    farmers: any;
    count: any;
    landlordPlayer: any;
    constructor(gameConfig: any, players: any, playerId: any, player: any) {
        this.gameConfig = gameConfig;
        this.players = players;
        this.playerId = playerId;
        this.player = player
        this.farmers = [];
        this.count = 0;
        this.landlordPlayer = "";
    }

    addTimes() {
        if(this.checkAddTimes() == true) return  {startPlay:true,multiple:this.gameConfig["multiple"]["pushMultiple"]}
        this.sid = next_player_id(this.player.index, this.players);
        let nextPlayer: any = "";
        let multiple:any = "";
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
                    multiple =  parseInt(this.gameConfig["multiple"]["pushMultiple"]);
                    // _player.kickPullMul =  parseInt(this.gameConfig["multiple"]["pushMultiple"]);
                    this.farmers.push(_player);
                }
                this.landlordPlayer = this.player;
                continue
            }
            if (_player.uid == this.player.uid) {
                // _player.kickPullMul =  parseInt(this.gameConfig["multiple"]["pushMultiple"]);
                multiple =  parseInt(this.gameConfig["multiple"]["pushMultiple"]);
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
        res["action"] = diZhuButton.addTimes.action
        res["state"] = diZhuButton.addTimes.state;
        res["sid"] = nextPlayer.index;
        res["grabLandlord"] = false;            
        res["playerId"] = nextPlayer.uid;
        res["multiple"] = multiple;      
        return res;
    }

    notAddTimes() {
        if(this.checkAddTimes() == true) return  {startPlay:true}
        let sid:any = next_player_id(this.player.index, this.players);
        var res = {};
        res["action"] = diZhuButton.addTimes.action
        res["state"] = diZhuButton.addTimes.state;  //加倍
        res["sid"] = sid;
        res["playerId"] = this.players[sid].uid
        res["grabLandlord"] = false;
        return res;
    }

    checkAddTimes(){
         let flag:boolean = true;
         let _player:any = {};
         for(let i = 0;i<this.players.length;i++){
            _player  = this.players[i];
            if(_player.grabLandlord == true) return false   
        }
        return flag;
    }
    default() {
        let res: any = {
            "state": diZhuButton.addTimes.state,
            "action": diZhuButton.addTimes.action,
        }
        return res;
    }
}