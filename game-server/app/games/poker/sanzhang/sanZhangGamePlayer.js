"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const mobx_1 = require("mobx");
const eventemitter2_1 = require("eventemitter2");
const pokerGamePlayer_1 = require("../pokerGamePlayer");
class SanZhangGamePlayer extends pokerGamePlayer_1.default {
    constructor() {
        super(...arguments);
        this.checked = false;
        this.giveup = false;
        this.loser = false;
        this.pkPlayers = [];
        this.pkIndex = 0;
        this.action = {};
        this.addBets = [];
        this.emitter = new eventemitter2_1.EventEmitter2();
        this.disposers = [];
        this.showCards = false; //看牌
        this.menpai = 0;
        this.isMenPai = true;
        this.speckNum = 0;
        this.betNum = 0; //加注的数量
        this.huopin = false; //true 发起火拼 
        this.chip = 0;
        this.thanCards = false; //比牌输的
        this.leave = false;
        this.brightBrand = false;
        this.cardsType = "";
        this.isSpeck = false; //是否说话
        this.LzCards = [];
        this.isLz = false;
        this.type = "";
        this.isRuan = false;
        this.isBiPai = false;
    }
    reset() {
        super.reset();
        _.forEach(this.disposers, function (v) {
            if (_.isFunction(v)) {
                v();
            }
        });
        this.brightBrand = false;
        this.huopin = false;
        this.checked = false;
        this.giveup = false;
        this.loser = false;
        this.pkIndex = 0;
        this.pkPlayers = [];
        this.action = {};
        this.addBets = [];
        this.showCards = false;
        this.huopinAddBets = [];
        this.menpai = 0;
        this.isMenPai = true;
        this.speckNum = 0;
        this.betNum = 0; //加注的数量
        this.chip = 0;
        this.thanCards = false;
        this.leave = false;
        this.cardsType = "";
        this.LzCards = [];
        this.isSpeck = false;
        this.isLz = false;
        this.type = "";
        this.isRuan = false;
        this.cards = [];
        this.isBiPai = false;
    }
    bindKey(key, autoDisposer = true) {
        if (_.has(this, key)) {
            const disposer = mobx_1.observe(this, key, () => {
                this.emitter.emit('on' + _.upperFirst(key) + 'Changed', { uid: this.uid }, this);
                disposer();
            });
            if (!autoDisposer) {
                this.disposers.push(disposer);
            }
        }
    }
    clientInfo(needEntire = false) {
        return _.assign(_.pick(this, ['checked', 'giveup', 'loser']), super.clientInfo(needEntire));
    }
    getDeductScore(onceScore) {
        return this.checked == false ? onceScore : onceScore * 2;
    }
}
__decorate([
    mobx_1.observable,
    __metadata("design:type", Boolean)
], SanZhangGamePlayer.prototype, "checked", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Boolean)
], SanZhangGamePlayer.prototype, "giveup", void 0);
exports.default = SanZhangGamePlayer;
