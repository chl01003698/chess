"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const pushEvent_1 = require("../../consts/pushEvent");
const db_1 = require("../../extend/db");
class RoomPay {
    constructor(game) {
        this.game = game;
        this.payUsers = new Set();
    }
    userExpend(user, card, needPush = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (_.isNumber(card) && card != 0) {
                user = yield db_1.UserModel.findUserAndUpdateCard(user.id, card);
                if (card < 0) {
                    this.payUsers.add(user.id);
                }
                this.game.app.get('statusService').pushByUids([user.id], pushEvent_1.default.onUpdateCoin, {
                    coin: user.coin,
                    msg: ''
                });
            }
            return user.coin.card;
        });
    }
    pay(user) {
    }
    refund() {
    }
}
exports.RoomPay = RoomPay;
class FreeRoomPay extends RoomPay {
}
exports.FreeRoomPay = FreeRoomPay;
class AARoomPay extends RoomPay {
    pay(user) {
        const gameConfig = this.game.gameConfig;
        const roomConfig = this.game.roomConfig;
        const gameExpend = gameConfig.gameExpend;
        const expend = -gameExpend['AA'][roomConfig.expendIndex].expend;
        if (!_.isNumber(expend))
            return;
        if (user != undefined) {
            this.userExpend(user, expend);
        }
        else {
            _.forEach(this.game.gamePlayers, (gamePlayer) => {
                if (gamePlayer != undefined) {
                    this.userExpend(gamePlayer.user, expend);
                }
            });
        }
    }
}
exports.AARoomPay = AARoomPay;
class OwnerRoomPay extends RoomPay {
    pay(user) {
        const gameConfig = this.game.gameConfig;
        const roomConfig = this.game.roomConfig;
        const gameExpend = gameConfig.gameExpend;
        const expend = -gameExpend['owner'][roomConfig.expendIndex].expend;
        this.userExpend(this.game.owner, expend);
    }
    refund() {
        const gameConfig = this.game.gameConfig;
        const roomConfig = this.game.roomConfig;
        const gameExpend = gameConfig.gameExpend;
        const expend = gameExpend['owner'][roomConfig.expendIndex].expend;
        this.userExpend(this.game.owner, expend);
    }
}
exports.OwnerRoomPay = OwnerRoomPay;
class WinnerRoomPay extends RoomPay {
    constructor() {
        super(...arguments);
        this.payState = false;
    }
    pay(user) {
        const winnerPlayer = this.game.findWinnerPlayer();
        const gameConfig = this.game.gameConfig;
        const roomConfig = this.game.roomConfig;
        const gameExpend = gameConfig.gameExpend;
        const expend = -gameExpend['owner'][roomConfig.expendIndex].expend;
        this.userExpend(winnerPlayer.user, expend);
        this.payState = true;
    }
    refund() {
    }
}
exports.WinnerRoomPay = WinnerRoomPay;
