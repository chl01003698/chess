'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const qs = require('querystring');
exports.default = {
    async getToken(code, ctx, config) {
        const params = {
            appid: config.appId,
            secret: config.appSecret,
            code: code,
            grant_type: 'authorization_code'
        };
        const options = {
            method: 'Get',
            dataType: 'json'
        };
        const url = config.tokenReqUrl + qs.stringify(params);
        const response = await ctx.curl(url, options);
        const res = response.res;
        if (res.statusCode == 200) {
            const data = res.data;
            if (!data.errcode) {
                const body = await this.getUserInfo(data.access_token, data.openid, ctx, config);
                return body;
            }
            else {
                const body = { code: data.errcode, msg: data.errmsg };
                return body;
            }
        }
    },
    async getUserInfo(accessToken, openId, ctx, config) {
        const params = {
            access_token: accessToken,
            openid: openId,
            lang: 'zh_CN'
        };
        const options = { method: 'GET', dataType: 'json' };
        const url = config.userReqUrl + qs.stringify(params);
        const response = await ctx.curl(url, options);
        const res = response.res;
        if (res.statusCode == 200) {
            const data = res.data;
            if (data.error == undefined) {
                const body = { code: 0, msg: 'ok', data: data };
                return body;
            }
            else {
                const body = { code: data.errcode, msg: data.errmsg };
                return body;
            }
        }
    }
};
