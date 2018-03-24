"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class MJGuoShouData {
    constructor(params) {
        this.guoCard = -1;
        this.guoScore = 0;
        this.triggerUid = "";
        this.guoCard = params.card;
        this.guoScore = params.score;
        this.triggerUid = params.uid;
    }
    reset() {
        this.guoCard = -1;
        this.triggerUid = "";
        this.guoScore = 0;
    }
    setInfo(params) {
        console.log("guoshoudata ");
        console.log(params);
        this.guoCard = params.card;
        this.guoScore = params.score;
        this.triggerUid = params.uid;
    }
}
exports.MJGuoShouData = MJGuoShouData;
class MJGuoShouHu {
    constructor(game, params) {
        this.game = game;
        this.guoData = {};
        // 分数限制，默认加分也不可胡
        this.scoreLimit = false;
        // 限制单张，还是所有，默认限制所有
        this.cardLimit = false;
        this.scoreLimit = _.defaultTo(params.scoreLimit, false);
        this.cardLimit = _.defaultTo(params.cardLimit, false);
    }
    reset(idx) {
        console.log("guoshouhu reset");
        console.log(idx);
        delete this.guoData[idx];
    }
    setInfo(params) {
        this.guoData[params.index] = new MJGuoShouData(params);
    }
    //canHu(params){
    //	if(this.guoCard == -1){
    //		return true
    //	}
    //	
    //	if(this.guoLimit1){
    //		return false
    //	}
    //}
    // 是否存在限制
    // 还是已经清除，还是初始状态
    canHu(params) {
        console.log("guoshouhu canhu");
        console.log(params);
        const data = this.guoData[params.index];
        if (!data)
            return true;
        console.log(data);
        if (data.guoCard == -1) {
            return true;
        }
        if (this.scoreLimit == false) {
            // 针对所有
            if (this.cardLimit == false) {
                return false;
            }
            else {
                return data.guoCard != params.card;
            }
        }
        else {
            if (params.score <= data.guoScore) {
                return false;
            }
            if (this.cardLimit == true) {
                return data.guoCard != params.card;
            }
            else {
                return true;
            }
        }
    }
}
exports.MJGuoShouHu = MJGuoShouHu;
