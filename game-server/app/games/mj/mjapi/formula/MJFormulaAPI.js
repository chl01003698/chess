"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MJFormula_1 = require("../../sichuan/nanchong/MJFormula");
var mjapi;
(function (mjapi) {
    let formula;
    (function (formula) {
        function nanchongMJFormula(params) {
            return MJFormula_1.default.getScore(params);
        }
        formula.nanchongMJFormula = nanchongMJFormula;
        function nanchongPreFormula(params) {
            return MJFormula_1.default.getPreScore(params);
        }
        formula.nanchongPreFormula = nanchongPreFormula;
    })(formula = mjapi.formula || (mjapi.formula = {}));
})(mjapi = exports.mjapi || (exports.mjapi = {}));
