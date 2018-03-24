'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const code = {
    FAILED: -1,
    SUCCESS: 0
};
exports.default = {
    code: code,
    success: function (data) {
        return { code: 0, msg: 'ok', data: data };
    },
    err: function (msg) {
        return { code: -1, msg: msg };
    }
};
