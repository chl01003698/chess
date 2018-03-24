
import logger from '../../../util/logger';
import { PokerAlgo, PokerCard } from '../pokerAlgo/pokerAlgo';
import { DiZhuAlgo } from '../pokerAlgo/doudizhu/diZhuAlgo';
import CardFormula from './card-formula/cardFormula';
import FourCardFormula from './card-formula/fourCardFormula';
import PzCardForMula from './card-formula/pzCardFormula';
import { pushMultiple } from './diZhuHelper';
import TdLzCardFormula from './card-formula/tdlzCardFormula';

export default class CheckCardType {
    roomConfig: any;
    gameConfig: any;
    _cardFormula: any
    _gameType: any;
    cards: any;
    self: any;
    playerInfo: any
    constructor(self: any, roomConfig: any, gameConfig: any, uid: any = false) {
        this.roomConfig = roomConfig;
        this.gameConfig = gameConfig;
        this._gameType = roomConfig["type"]
        if (this._gameType == "ddz4") this._cardFormula = new FourCardFormula();
        if (this._gameType == "pz3") this._cardFormula = new PzCardForMula();
        if (this._gameType == "lz3" || this._gameType == "tdlz3") this._cardFormula = new TdLzCardFormula();
        if (this._gameType == "ddz2" || this._gameType == "ddz3" || this._gameType == "sd3") this._cardFormula = new CardFormula();
        this.cards = [];
        this.self = self;
        if (uid != false) this.playerInfo = this.self.findOne

    };
    checkCardType(cards: any, bombNum: any) {
        let LzCards = cards.slice();
        cards = this._cardFormula.getCardsType(cards)
        if (cards.length < 0) {
            return true;
        }
        if (this._cardFormula.isHandRocket(cards)) {
            let multiple: number = this.gameConfig["multiple"].rockets;
            if (cards.length == 3) {
                multiple = this.gameConfig["multiple"].zmul;
            }
            if (cards.length == 4) multiple = this.gameConfig["multiple"].fourRocket;

            pushMultiple(multiple, this.self, "rockets");
        }
        ;
        if (this._cardFormula.isHandBomb(cards)) {
            bombNum += 1;
            if (this._gameType === "ddz4") {
                if (cards.length == 8) {
                    pushMultiple(this.gameConfig["multiple"].zmul, this.self, "bomb")
                }else{
                    pushMultiple(this.gameConfig["multiple"].bomb, this.self, "bomb")
                }
        
            } else {
                if(this._gameType == "lz3" || this._gameType == "tdlz3" ){
                    let num = this.checkLz(LzCards);
                    pushMultiple(num,this.self,"bomb");
                }else{
                    if(cards.length>4){
                        pushMultiple(this.gameConfig["multiple"].yingzha,this.self,"bomb");
                    }else{
                        pushMultiple(this.gameConfig["multiple"].bomb, this.self, "bomb");

                    }

                }
            }
            return bombNum;
        }
        ;
        if (this._gameType == "pz3") {
            if (this._cardFormula.isHandFried(cards)) {
                pushMultiple(this.gameConfig["multiple"].lianzha, this.self, "bomb");
            }
        }
        return false;
    }
    checkLz(cards:any){
        let num:number = 0;
        for(let i = 0;i<cards.length;i++){
            let card:string = cards[i];
            if(card.length ==4){
                num+=1;
            }
        }
        if(num === 0) return this.gameConfig["multiple"].yingzha;
        if(num === cards.length) return this.gameConfig["multiple"].lanzhua;
        if(num !== 0) return  this.gameConfig["multiple"].ruanzha;
        if(cards.length>4) return this.gameConfig["multiple"].yingzha;
    }
    checkLowCardAsync(cards: any) {
        //检查是否是三条
        if (this._cardFormula.isHandTrio(cards)) {
            pushMultiple(this.gameConfig["multiple"].graspBottomMultiple.article3, this.self, "lowCard");
            return true;
        }
        //检查是否是同花
        if (this._cardFormula.isHandFlowers(cards)) {
            pushMultiple(this.gameConfig["multiple"].graspBottomMultiple.flowers, this.self, "lowCard");
            return true;
        }
        //检查是否是顺子
        if (this._cardFormula.isHandThree(cards, cards.length)) {
            pushMultiple(this.gameConfig["multiple"].graspBottomMultiple.flowers, this.self, "lowCard");
            return true;
        }
        //检查是否是双王或者是对子 或者是单王
        for (let i = 0; i < cards.length; i++) {
            let _arr: any = [cards[i], cards[i + 1] ? cards[i + 1] : cards[0]];
            if (this._cardFormula.isHandRocket(_arr)) {
                pushMultiple(this.gameConfig["multiple"].graspBottomMultiple.flowers, this.self, "lowCard");
                return true;
            }
        }
        for (var i = 0; i < cards.length; i++) {
            var _arr = [cards[i], cards[i + 1] ? cards[i + 1] : cards[0]];
            if (this._cardFormula.isHandPair(_arr)) {
                pushMultiple(this.gameConfig["multiple"].graspBottomMultiple.pairs, this.self, "lowCard");
                return true;
            }
            if (this._cardFormula.isHandKing([cards[i]])) {
                pushMultiple(this.gameConfig["multiple"].graspBottomMultiple.king, this.self, "lowCard");
                return true;
            }
        }

        return false;
    }
    //检查是否是春天
    checkspringAsync() {
        var count = 0;
        for (let i = 0; i < this.self.playerIds.length; i++) {
            let _playerId = this.self.playerIds[i];
            let player = this.self.findPlayerByUid(_playerId);
            if (player["identity"] == "landlord") {
                if (player["sendCard"] == 1) {  //证明地主只出过一次牌
                    return true;             // 农民春天
                }
            }
            if (player["identity"] == "farmers") {
                count += parseInt(player["sendCard"]);
            }
        }
        if (count == 0) {
            return true;  //地主春天
        }
        return false;
    }
    //检查牌型并且去除牌型
    checkSendCardsType(playerCards, Cards) {
        let article3: any = this.roomConfig["article3"]; //检查三张
        let plane: any = this.roomConfig["plane"];//检查飞机
        let four: any = this.roomConfig["four"]; //检查4张
        let pzPw: any = this.roomConfig["pzPw"]; //检查皮子
        // console.log("========article3=", article3, "plane", plane, "four==", four, "pzPw==", pzPw, "this.cards=", this.cards);
        for (let i = 0; i < article3.length; i++) {
            let a: any = article3[i];
            if (playerCards.length != this.cards) if (this._cardFormula.isHandTrio(this.cards)) return true;
            if (a == 1) if (this._cardFormula.isHandTrioSolo(this.cards)) return false;
            if (a == 2) if (this._cardFormula.isHandTrioPair(this.cards)) return false;
            if (a == 3) {
                if (this._cardFormula.isHandTrio(this.cards)) {
                    if (playerCards.length == this.cards) return true;
                    return false;
                }
            }
        }
        for (let i = 0; i < plane.length; i++) {
            let p: any = plane[i];
            if (playerCards != this.cards) if (this._cardFormula.isHandAirplane(this.cards)) return true;
            if (p == 1) if (this._cardFormula.isHandAirplaneSolo(this.cards)) return false;
            if (p == 2) if (this._cardFormula.isHandAirplanePair(this.cards)) return false;
            if (p == 3) {
                if (this._cardFormula.isHandAirplane(this.cards)) {
                    if (playerCards == this.cards) return true;
                    return false;
                }
            }
        }
        for (let i = 0; i < four.length; i++) {
            let f: any = four[i];
            if (this._cardFormula.isHandBomb(this.cards)) return true;
            // console.log("this._cardFormula.isHandAirplaneSolo(this.cards)", this._cardFormula.isHandAirplaneSolo(this.cards));
            // console.log("this._cardFormula.isHandAirplanePair(this.cards)", this._cardFormula.isHandAirplanePair(this.cards));
            if (f == 1) if (this._cardFormula.isHandAirplaneSolo(this.cards)) return false;
            if (f == 2) if (this._cardFormula.isHandAirplanePair(this.cards)) return false;
        }
        if (pzPw != undefined) {
            for (let i = 0; i < pzPw.length; i++) {
                let z: any = pzPw[i];
                if (z == 1) {
                    if (this._cardFormula.isHandRocket(this.cards)) {
                        if (this.cards.length == 3) {
                            return false
                        }
                    }
                }
                if (z == 2) {
                    if (this._cardFormula.isHandRocket(this.cards)) {
                        if (Cards.indexOf("PLY") || Cards.indexOf("PLX")) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

}