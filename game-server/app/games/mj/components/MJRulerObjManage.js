"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MJEnum_1 = require("../consts/MJEnum");
const MJGuoShouHu_1 = require("./MJGuoShouHu");
const _ = require("lodash");
// TODO: 如果规则太多，需要拆
class MJRulerObjManage {
    constructor(game, gameConfig) {
        this.game = game;
        this.guoShouHu = new MJGuoShouHu_1.MJGuoShouHu(game, _.defaultTo(gameConfig.guoshou, {}));
    }
    cancelHandle(gamePlayer, handleManage) {
        console.log("ruler obj manage cancelHandle");
        if (this.guoShouHu) {
            // 记录过手胡
            const handle = handleManage.findHandleByTypeAndSub(gamePlayer.uid, MJEnum_1.MJCardGroupType.HU);
            console.log("find hu handle ");
            //console.log(handle)
            if (handle) {
                const card = handle.testData.card;
                const score = this.game.container.mjformulaManage.preCalcScoreByPlayer(gamePlayer, undefined, card);
                const triggerUid = this.game.getCurrGamePlayer().uid;
                this.guoShouHu.setInfo({ index: gamePlayer.index, card, score, triggerUid });
                console.log(gamePlayer.index);
                console.log(score);
                console.log(card);
                console.log(triggerUid);
            }
        }
    }
    onDaPai(gamePlayer) {
        if (this.guoShouHu)
            this.guoShouHu.reset(gamePlayer.index);
    }
    canHu(gamePlayer, params) {
        console.log("ruler obj manage canhu");
        if (this.guoShouHu) {
            const card = params.card;
            const score = this.game.container.mjformulaManage.preCalcScoreByPlayer(gamePlayer, params.triggerPlayer, card);
            console.log(card);
            console.log(score);
            console.log(gamePlayer.index);
            return this.guoShouHu.canHu({ index: gamePlayer.index, card, score });
        }
        else {
            return true;
        }
    }
}
exports.MJRulerObjManage = MJRulerObjManage;
