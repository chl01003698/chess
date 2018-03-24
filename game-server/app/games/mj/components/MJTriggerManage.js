"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const math = require("mathjs");
const MJHandleManage_1 = require("./MJHandleManage");
const MJTriggerAPI_1 = require("../mjapi/triggers/MJTriggerAPI");
function getScopeGamePlayers(scope, game, gamePlayer) {
    let gamePlayers = [];
    if (scope == 'self') {
        gamePlayers = [gamePlayer];
    }
    else if (scope == 'all') {
        gamePlayers = _.concat(_.slice(game.gamePlayers, game.currentIndex, game.gamePlayers.length), _.slice(game.gamePlayers, 0, game.currentIndex));
    }
    else if (scope == 'others') {
        gamePlayers = _.concat(_.slice(game.gamePlayers, game.currentIndex + 1, game.gamePlayers.length), _.slice(game.gamePlayers, 0, game.currentIndex));
    }
    return gamePlayers;
}
class MJTriggerCache {
    constructor(handles, gamePlayer, cardGroupType) {
        this.handles = handles;
        this.gamePlayer = gamePlayer;
        this.cardGroupType = cardGroupType;
    }
}
exports.MJTriggerCache = MJTriggerCache;
class MJTrigger {
    constructor(data) {
        this.handleManage = new MJHandleManage_1.MJHandleManage();
        if (!_.isEmpty(data.hookExpr)) {
            this.hookExpr = math.compile(data.hookExpr);
        }
        this.scope = data.scope;
        this.actions = data.actions;
        this.scoreData = data.score;
        this.nextTrigger = data.nextTrigger;
        this.needHook = _.defaultTo(data.needHook, false);
    }
    clear() {
        this.lastTrigger = undefined;
        this.lastTriggerCache = undefined;
        this.handleManage.clear();
    }
    evalHookExpr(params) {
        let result = true;
        if (this.hookExpr != undefined && _.isFunction(this.hookExpr.eval)) {
            result = this.hookExpr.eval({ mjapi: MJTriggerAPI_1.mjapi, params });
        }
        return result;
    }
}
exports.MJTrigger = MJTrigger;
class MJTriggerManage {
    constructor(mjactionManage, triggers) {
        this.mjactionManage = mjactionManage;
        this.triggers = new Map();
        _.forEach(triggers, (v, k) => {
            this.triggers.set(k, new MJTrigger(v));
        });
    }
    triggerTest(triggerName, params) {
        if (this.triggers.has(triggerName)) {
            const { gamePlayer, game, card } = params;
            const trigger = this.triggers.get(triggerName);
            const gamePlayers = getScopeGamePlayers(trigger.scope, game, gamePlayer);
            const actions = trigger.actions;
            if (actions.length >= gamePlayers.length) {
                let priority = gamePlayers.length;
                _.forEach(gamePlayers, (v, i) => {
                    const handles = this.mjactionManage.evalTestExprs(actions[i], { card, game, triggerPlayer: gamePlayer, gamePlayer: v }, --priority);
                    trigger.handleManage.handles.push(...handles);
                });
                trigger.handleManage.sortHandlesByPriority();
            }
        }
    }
    triggerAction(handles, params) {
        this.mjactionManage.evalActionExprs(handles, params);
    }
    getTrigger(triggerName) {
        return this.triggers.get(triggerName);
    }
    clearTriggerHandles(triggerName) {
        if (_.isEmpty(triggerName)) {
            this.triggers.forEach(v => {
                v.handleManage.clear();
            });
        }
        else if (this.triggers.get(triggerName) != undefined) {
            this.triggers.get(triggerName).handleManage.clear();
        }
    }
}
exports.MJTriggerManage = MJTriggerManage;
