'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const JWT = require('jsonwebtoken');
const reply_1 = require("../const/reply");
class JWTUtil {
    static verify(token) {
        const SECRET_KEY = 'd90289cc2e92c046b5f15f9a6ef747b9';
        return new Promise((resolve, reject) => {
            JWT.verify(token, SECRET_KEY, function (err, decode) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(decode);
                }
            });
        }).then((decode) => {
            console.log('decode=>', decode);
            const result = {
                code: 0,
                uid: decode.uid,
                shortId: decode.shortId,
            };
            return result;
        }).catch((err) => {
            if (err.name == 'TokenExpiredError') {
                return reply_1.default.err('token过了有效期');
            }
            else if (err.name == 'JsonWebTokenError') {
                return reply_1.default.err('无效的token');
            }
        });
    }
    static sign(uid, shortId) {
        const SECRET_KEY = 'd90289cc2e92c046b5f15f9a6ef747b9';
        return JWT.sign({ uid: uid, shortId: shortId }, SECRET_KEY);
    }
    static signWithTime(uid, shortId) {
        const SECRET_KEY = 'd90289cc2e92c046b5f15f9a6ef747b9';
        return JWT.sign({ uid: uid, shortId: shortId }, SECRET_KEY, { expiresIn: 60 * 60 * 24 * 30 });
    }
}
exports.default = JWTUtil;
