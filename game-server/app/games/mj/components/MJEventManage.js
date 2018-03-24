"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const math = require("mathjs");
const MJEventAPI_1 = require("../mjapi/events/MJEventAPI");
class MJEvent {
    constructor(data) {
        this.name = data.name;
        this.event = data.event;
        this.time = data.time;
        this.scoreData = data.score;
        if (!_.isEmpty(data.filterExpr)) {
            this.filterExpr = math.compile(data.filterExpr);
        }
        if (!_.isEmpty(data.funcExpr)) {
            this.funcExpr = math.compile(data.funcExpr);
        }
    }
}
class MJEventManage {
    constructor(game, emitter, mjscoreManage, events) {
        this.game = game;
        this.emitter = emitter;
        this.mjscoreManage = mjscoreManage;
        this.events = new Array();
        this.handles = new Array();
        _.forEach(events, (v) => {
            this.events.push(new MJEvent(v));
        });
    }
    bindEvents() {
        _.forEach(this.events, (v) => {
            console.log("this.bindEvents 1");
            const on = _.defaultTo(v.time, 'on');
            const callback = (data, params) => {
                console.log("this.bindEvents 2");
                if (v.filterExpr != undefined && _.isFunction(v.filterExpr.eval)) {
                    if (!v.filterExpr.eval({ mjapi: MJEventAPI_1.mjapi, params }))
                        return;
                }
                if (v.scoreData != undefined) {
                    console.log("增加事件分项", v.scoreData.name);
                    this.mjscoreManage.addScore(params.curGamePlayer, v.scoreData, params.uids);
                }
                else if (v.funcExpr != undefined && _.isFunction(v.funcExpr.eval)) {
                    v.funcExpr.eval({ mjapi: MJEventAPI_1.mjapi, data, params });
                }
            };
            this.emitter[on](v.event, callback);
            this.handles.push({ event: v.event, callback });
        });
    }
    // 所有事件判断重写
    calcEvents(params) {
        let result = {};
        _.forEach(this.events, (v) => {
            if (v.filterExpr != undefined && _.isFunction(v.filterExpr.eval)) {
                const data = v.filterExpr.eval({ mjapi: MJEventAPI_1.mjapi, params });
                let v2 = _.cloneDeep(v);
                v2.result = data;
                result[v2.name] = v2;
            }
        });
        return result;
    }
    reset() {
        _.forEach(this.handles, (v) => {
            this.emitter.removeListener(v.event, v.callback);
        });
    }
}
exports.MJEventManage = MJEventManage;
