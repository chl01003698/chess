"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MJEnum_1 = require("../../consts/MJEnum");
const _ = require("lodash");
var mjapi;
(function (mjapi) {
    let trigger;
    (function (trigger) {
        function qiangganghu(params) {
            const handle = _.find(params.currentHandles, (v) => { return v.action == 'bugang' && v.state == MJEnum_1.MJHandleState.CONFIRM; });
            if (handle) {
                return true;
            }
            return false;
        }
        trigger.qiangganghu = qiangganghu;
    })(trigger = mjapi.trigger || (mjapi.trigger = {}));
})(mjapi = exports.mjapi || (exports.mjapi = {}));
