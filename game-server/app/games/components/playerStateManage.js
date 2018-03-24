"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
var PlayerStateEnum;
(function (PlayerStateEnum) {
    PlayerStateEnum[PlayerStateEnum["None"] = 0] = "None";
    PlayerStateEnum[PlayerStateEnum["AGREE"] = 1] = "AGREE";
    PlayerStateEnum[PlayerStateEnum["REJECT"] = 2] = "REJECT";
})(PlayerStateEnum = exports.PlayerStateEnum || (exports.PlayerStateEnum = {}));
class PlayerState {
    constructor(uids) {
        this.states = [];
        _.forEach(uids, (v) => {
            this.states.push({ uid: v, state: PlayerStateEnum.None });
        });
    }
    reset() {
        _.forEach(this.states, (v) => {
            v['state'] = PlayerStateEnum.None;
            delete v['data'];
        });
    }
    updateState(uid, state, data = undefined) {
        const findObject = _.find(this.states, { uid: uid });
        if (findObject != undefined) {
            findObject['state'] = state;
            if (data != undefined) {
                findObject['data'] = data;
            }
        }
    }
    getState(uid) {
        const findObject = _.find(this.states, { uid: uid });
        if (findObject != undefined) {
            return findObject['state'];
        }
        return undefined;
    }
    updateStateByIndex(index, state, data) {
        if (index >= 0 && index < this.states.length) {
            this.states[index]['state'] = state;
            if (data != undefined) {
                this.states[index]['data'] = data;
            }
        }
    }
    isAgree() {
        return _.every(this.states, { 'state': PlayerStateEnum.AGREE });
    }
    isReject() {
        return _.every(this.states, { 'state': PlayerStateEnum.REJECT });
    }
    getAgreeCount() {
        return _.filter(this.states, { 'state': PlayerStateEnum.AGREE }).length;
    }
    getRejectCount() {
        return _.filter(this.states, { 'state': PlayerStateEnum.REJECT }).length;
    }
    clientInfo() {
        return this.states;
    }
}
exports.PlayerState = PlayerState;
class PlayerStateManage {
    constructor() {
        this.gameStates = new Map();
    }
    registerState(gameState, uids) {
        this.gameStates[gameState] = new PlayerState(uids);
    }
    isStateAgree(gameState) {
        let agree = false;
        if (this.gameStates.has(gameState)) {
            agree = this.gameStates.get(gameState).isAgree();
        }
        return agree;
    }
    isStateReject(gameState) {
        let reject = false;
        if (this.gameStates.has(gameState)) {
            reject = this.gameStates[gameState].isReject();
        }
        return reject;
    }
    updateState(gameState, uid, state, data = undefined) {
        if (this.gameStates.has(gameState)) {
            this.gameStates[gameState].updateState(uid, state, data);
        }
    }
    getState(gameState) {
        return this.gameStates[gameState];
    }
    clientInfo(gameState) {
        if (this.gameStates.has(gameState)) {
            return this.gameStates[gameState].clientInfo();
        }
        return undefined;
    }
    getStateByUid(gameState, uid) {
        if (this.gameStates.has(gameState)) {
            return this.gameStates[gameState].getState(uid);
        }
        return undefined;
    }
    resetState(gameState) {
        if (this.gameStates.has(gameState)) {
            this.gameStates[gameState].reset();
        }
    }
    resetAllStates() {
        _.forEach(this.gameStates, (v) => {
            v.reset();
        });
    }
}
exports.PlayerStateManage = PlayerStateManage;
