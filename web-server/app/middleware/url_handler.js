'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const signUrl = require('sign-url');
const reply_1 = require("../const/reply");
const urlUtil_1 = require("../util/urlUtil");
const QueryString = require('querystring');
const Url = require('url');
module.exports = (option, app) => {
    return async function (ctx, next) {
        // http://my.superproject.io?confirm=username@somewhere.com&expiry=1392305771282&signature=SrO0X9p27LHFIe7xITBOpetZSpM%3D
        const request = ctx.request;
        //过滤验证的url
        const isMatch = urlUtil_1.default.match(request.path);
        if (isMatch == null) {
            await next();
            return;
        }
        const query = ctx.query;
        // console.log('query=>',query);
        const timestamp = query.expiry || 0;
        if (timestamp > (Date.now() + 30000) || timestamp < (Date.now() - 30000)) {
            ctx.body = reply_1.default.err('请求已过期');
            return;
        }
        const confirm = query.confirm;
        //替换signature中的空格
        let signStr = query.signature;
        signStr = signStr.replace(/\s/g, '+');
        query.signature = signStr;
        ctx.query = query;
        const url = `${request.protocol}://${request.host}${request.url}`;
        console.log('url=>', url);
        let u = Url.parse(url, true);
        let querys = u.query;
        let signature = querys.signature;
        delete (querys.signature);
        u.search = QueryString.stringify(querys);
        const strSign = signUrl.signature(u.format(), confirm, {});
        console.log("strSign=>", strSign);
        if (!signUrl.check(url, confirm)) {
            ctx.body = reply_1.default.err('签名验证失败');
            return;
        }
        delete query.confirm;
        delete query.expiry;
        delete query.signature;
        ctx.query = query;
        const url2 = `${request.protocol}://${request.host}${request.url}`;
        console.log('url2=>', url2);
        // const authorization = ctx.get('Authorization');
        // console.log('authorization=>',authorization);
        // if(authorization){
        //   const token = authorization.replace('Bearer ','');
        //   const result:any = await JWTUtil.verify(token);
        //   console.log('info=>',result);
        //   if(result.code==0){
        //     query.uid = result.uid;
        //     query.shortId = result.shortId;
        //   }
        // }
        // console.log(query);
        await next();
    };
};
