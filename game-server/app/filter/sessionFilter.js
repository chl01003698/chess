"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function sessionFilter() {
    return new SessionFilter();
}
exports.default = sessionFilter;
class SessionFilter {
    before(msg, session, next) {
        if (!_.isString(session.uid)) {
            next(new Error('玩家不存在'));
            return;
        }
        next();
    }
}
