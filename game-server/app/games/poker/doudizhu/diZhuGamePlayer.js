"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as _ from 'lodash'
const pokerGamePlayer_1 = require("../pokerGamePlayer");
// import { DiZhuAlgo } from '../pokerAlgo/doudizhu/diZhuAlgo';
// import { SanRenDiZhuAlgo } from '../pokerAlgo/doudizhu/sanRenDiZhuAlgo';
// import { PokerCard, PokerAlgo } from '../pokerAlgo/pokerAlgo';
class DiZhuGamePlayer extends pokerGamePlayer_1.default {
    constructor() {
        super(...arguments);
        this.inputCount = 0;
        this.zhaDanCount = 0;
        this.side = 0;
        this.multiple = 1;
        this.identity = ""; //landlord  farmers
        this.state = ""; //状态
        this.isBrightBrand = false; //是否是明牌
        this.grabLandlord = true; //是否叫过地主 true 是  false 否
        this.kickPullMul = 1; //踢拉倍数
        this.isFlip = true; //是否翻拍 true 是 false 
        this.cardsStack = []; //打出去的手牌
        this.action = {};
        this.IsLandOwner = false; //叫地主 true 叫地主
        this.gameStart = false;
        this.grabLandlordNum = 0;
        this.sendCard = 0;
        this.JiPaiQI = false; // true 开启记牌器
        this.isFenDing = false;
        this.points = 0;
        this.tmpCards = [];
        this.isDouble = false;
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
        this.isSpeack = false;
        this.bomb = 0;
    }
    reset() {
        super.reset();
        this.inputCount = 0;
        this.zhaDanCount = 0;
        this.multiple = 1;
        this.identity = "";
        this.state = "";
        this.isBrightBrand = false;
        this.grabLandlord = true;
        this.kickPullMul = 1;
        this.isFlip = true;
        this.cardsStack = [];
        this.action = {};
        this.IsLandOwner = false;
        this.gameStart = false;
        this.grabLandlordNum = 0;
        this.sendCard = 0;
        this.JiPaiQI = false;
        this.bomb = 0;
        this.tmpCards = [];
        this.isFenDing = false;
        this.isDouble = false;
        this.isSpeack = false;
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
        this.points = 0;
    }
    incrInputCount() {
        ++this.inputCount;
    }
    clientInfo(needEntire = false) {
        let result = super.clientInfo(needEntire);
        result['zhaDanCount'] = this.zhaDanCount;
        result.integral = this.score;
        result.multiple = this.multiple;
        return result;
    }
}
exports.default = DiZhuGamePlayer;
