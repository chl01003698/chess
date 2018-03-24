"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mjapi;
(function (mjapi) {
    let rule;
    (function (rule) {
        function genAndGang(params) {
            const algo = params.game.algo;
            return algo.genAndGang(params);
        }
        rule.genAndGang = genAndGang;
        function genRemoveGang(params) {
            const algo = params.game.algo;
            return algo.genRemoveGang(params);
        }
        rule.genRemoveGang = genRemoveGang;
    })(rule = mjapi.rule || (mjapi.rule = {}));
})(mjapi = exports.mjapi || (exports.mjapi = {}));
