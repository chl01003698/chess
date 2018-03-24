"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const qs = require('querystring');
// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD hh:mm:ss');
// 处理成功响应
exports.success = ({ ctx, res = null, msg = '请求成功' }) => {
    ctx.body = {
        code: 0,
        data: res,
        msg
    };
    ctx.status = 200;
};
