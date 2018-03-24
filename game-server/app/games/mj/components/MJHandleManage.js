"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MJEnum_1 = require("../consts/MJEnum");
const _ = require("lodash");
class MJHandle {
    constructor(action, uid, testData, type, priority = type, subType = 0, triggerUid = "") {
        this.state = MJEnum_1.MJHandleState.NONE;
        this.selectIndex = 0;
        this.action = action;
        this.uid = uid;
        this.triggerUid = triggerUid;
        this.testData = testData;
        this.type = type;
        this.priority = priority;
        this.subType = subType;
    }
    getCard() {
        if (_.isArray(this.testData['data'])) {
            return this.testData['data'][this.selectIndex];
        }
    }
}
exports.MJHandle = MJHandle;
class MJHandleManage {
    constructor() {
        this.handles = new Array();
        this.huType = MJEnum_1.MJHuHandleType.MULTIPLE;
    }
    sortHandlesByPriority() {
        this.handles.sort((a, b) => {
            return b.priority - a.priority;
        });
    }
    canHandle(uid) {
        return _.some(this.handles, (v) => {
            return v.uid == uid && v.state == MJEnum_1.MJHandleState.NONE;
        });
    }
    pushHandle(handle) {
        this.handles.push(handle);
    }
    selectHandle(game, gamePlayer, handleState, type, subType = 0, selectIndex = 0) {
        if (handleState == MJEnum_1.MJHandleState.CONFIRM) {
            console.log(this.handles);
            const handle = _.find(this.handles, (v) => { return v.uid == gamePlayer.uid && v.type == type && v.subType == subType; });
            console.log(handle);
            if (handle != null) {
                handle.state = MJEnum_1.MJHandleState.CONFIRM;
                handle.selectIndex = selectIndex;
            }
        }
        else {
            game.container.mjrulerobjManage.cancelHandle(gamePlayer, this);
        }
        this.cancelHandleByUid(gamePlayer.uid);
    }
    findHandleByTypeAndSub(uid, type, subType = 0) {
        return _.find(this.handles, (v) => { return v.uid == uid && v.type == type && v.subType == subType; });
    }
    findHandleResult() {
        const result = {
            state: MJEnum_1.MJHandleState.NONE,
            handles: new Array(),
            type: -1
        };
        if (_.every(this.handles, (v) => { return v.state == MJEnum_1.MJHandleState.CANCEL; })) {
            console.log(" xxx  1  xx");
            result.state = MJEnum_1.MJHandleState.CANCEL;
        }
        else if (this.huType == MJEnum_1.MJHuHandleType.SINGLE) {
            console.log(" xxx  2  xx");
            console.log(this.handles);
            const filterHandles = _.filter(this.handles, (v) => { return v.state != MJEnum_1.MJHandleState.CANCEL; });
            console.log(filterHandles);
            const firstHandle = _.first(filterHandles);
            console.log(firstHandle);
            if (firstHandle != undefined && firstHandle.state == MJEnum_1.MJHandleState.CONFIRM) {
                result.handles.push(firstHandle);
            }
        }
        else if (this.huType == MJEnum_1.MJHuHandleType.MULTIPLE) {
            console.log(" xxx  3  xx");
            const filterHuHandles = _.filter(this.handles, (v) => { return v.type == MJEnum_1.MJCardGroupType.HU; });
            if (filterHuHandles.length == 0 || _.every(filterHuHandles, (v) => { return v.state == MJEnum_1.MJHandleState.CANCEL; })) {
                const filterHandles = _.filter(this.handles, (v) => { return v.type != MJEnum_1.MJCardGroupType.HU && v.state != MJEnum_1.MJHandleState.CANCEL; });
                const firstHandle = _.first(filterHandles);
                if (firstHandle != undefined && firstHandle.state == MJEnum_1.MJHandleState.CONFIRM) {
                    result.handles.push(firstHandle);
                }
            }
            else if (_.every(filterHuHandles, (v) => { return v.type == MJEnum_1.MJCardGroupType.HU && v.state != MJEnum_1.MJHandleState.NONE; })) {
                result.handles = _.filter(filterHuHandles, (v) => { return v.type == MJEnum_1.MJCardGroupType.HU && v.state == MJEnum_1.MJHandleState.CONFIRM; });
            }
        }
        if (result.handles.length != 0) {
            result.state = MJEnum_1.MJHandleState.CONFIRM;
            result.type = result.handles[0].type;
        }
        return result;
    }
    cancelHandleByUid(uid) {
        _.forEach(this.handles, (v) => {
            if (v.uid == uid && v.state == MJEnum_1.MJHandleState.NONE) {
                v.state = MJEnum_1.MJHandleState.CANCEL;
            }
        });
    }
    filterHandlesByUid(uid) {
        return _.filter(this.handles, (v) => { return v.uid == uid && v.state == MJEnum_1.MJHandleState.NONE; });
    }
    clear() {
        this.handles = [];
    }
    isEmpty() {
        return _.isEmpty(this.handles);
    }
}
exports.MJHandleManage = MJHandleManage;
