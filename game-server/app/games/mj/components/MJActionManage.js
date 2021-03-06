"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math = require("mathjs");
const _ = require("lodash");
const MJHandleManage_1 = require("./MJHandleManage");
const MJActionAPI_1 = require("../mjapi/actions/MJActionAPI");
class MJAction {
    constructor(data) {
        // this.name = data.name
        if (!_.isEmpty(data.filterExpr)) {
            this.filterExpr = math.compile(data.filterExpr);
        }
        if (!_.isEmpty(data.testExpr)) {
            this.testExpr = math.compile(data.testExpr);
        }
        if (!_.isEmpty(data.actionExpr)) {
            this.actionExpr = math.compile(data.actionExpr);
        }
        this.enabled = _.defaultTo(data.enabled, true);
        this.type = data.type;
        this.subType = data.subType;
        this.scoreData = data.score;
    }
    evalFilterExpr(params) {
        let result = true;
        if (this.filterExpr != undefined && _.isFunction(this.filterExpr.eval)) {
            result = this.filterExpr.eval({ mjapi: MJActionAPI_1.mjapi, params });
        }
        //console.log("xxxxxxxxxxxxxxxxxx evalFilterExpr end")
        return result;
    }
    evalTestExpr(params) {
        let result = undefined;
        if (this.testExpr != undefined && _.isFunction(this.testExpr.eval)) {
            result = this.testExpr.eval({ mjapi: MJActionAPI_1.mjapi, params });
        }
        console.log(result);
        console.log("xxxxxxxxxxxxxxxxxx evalTestExpr end");
        return result;
    }
    evalActionExpr(params) {
        let result = undefined;
        if (this.actionExpr != undefined && _.isFunction(this.actionExpr.eval)) {
            result = this.actionExpr.eval({ mjapi: MJActionAPI_1.mjapi, params });
        }
        console.log("xxxxxxxxxxxxxxxxxx evalActionExpr end");
        return result;
    }
}
exports.MJAction = MJAction;
class MJActionManage {
    constructor(mjscoreManage, emitter, actions) {
        this.mjscoreManage = mjscoreManage;
        this.emitter = emitter;
        this.actions = new Map();
        _.forEach(actions, (v, k) => {
            this.actions.set(k, new MJAction(v));
        });
    }
    evalTestExprs(actions, params, priority = 0) {
        const handles = new Array();
        _.forEach(actions, (v, k) => {
            const action = this.actions.get(v);
            //console.log("xxxxxxxxxxxxxxxxxx evalFilterExpr " + v + " xxxx "+params.gamePlayer.index)
            if (action != undefined && action.enabled && action.evalFilterExpr(params) && action.testExpr != undefined) {
                console.log("xxxxxxxxxxxxxxxxxx evalTestExpr " + v + " xxxx " + params.gamePlayer.index);
                const testData = action.evalTestExpr(params);
                if (testData.ok == true) {
                    handles.push(new MJHandleManage_1.MJHandle(v, params.gamePlayer.uid, testData, action.type, action.type * 10 + priority, action.subType, params.triggerPlayer.uid));
                }
            }
        });
        return handles;
    }
    evalActionExprs(handles, params) {
        const curGamePlayer = params.curGamePlayer;
        _.forEach(handles, (v, k) => {
            const action = this.actions.get(v.action);
            if (action != undefined) {
                params.testData = v.testData;
                params.selectIndex = v.selectIndex;
                params.gamePlayer = params.game.findPlayerByUid(v.uid);
                console.log("xxxxxxxxxxxxxxxxxx evalActionExpr " + v + " xxxx " + params.gamePlayer.index);
                const data = action.evalActionExpr(params);
                if (action.scoreData != undefined) {
                    //let uids
                    //if (!(handles.length == 1 && handles[0].uid == curGamePlayer.uid)) {
                    //  uids = _.map(handles, 'uid')
                    //}
                    //if(data){
                    // TODO:
                    //}
                    //else{
                    this.mjscoreManage.addScoreV2({ uid: params.gamePlayer.uid, triggerUid: v.triggerUid, type: v.action, data: _.cloneDeep(action) });
                    //}
                    //this.mjscoreManage.addScore(params.curGamePlayer, action.scoreData, uids)
                }
            }
        });
    }
}
exports.MJActionManage = MJActionManage;
