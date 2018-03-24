'use strict';
const JWT = require( 'jsonwebtoken');
import Reply from '../const/reply';

export default class JWTUtil{

    public static verify(token:string){
        const SECRET_KEY = 'd90289cc2e92c046b5f15f9a6ef747b9';
        return new Promise((resolve, reject) => {
            JWT.verify(token, SECRET_KEY, function (err, decode) {
                if (err) {
                    reject(err);
                } else {
                    resolve(decode);
                }
            })
        }).then((decode:any)=>{
            console.log('decode=>',decode);
            const result = {
                code:0,
                uid:decode.uid,
                shortId:decode.shortId,
            }
            return result;
        }).catch((err:any)=>{   
            if(err.name == 'TokenExpiredError'){
                return Reply.err('token过了有效期')
            }else if(err.name == 'JsonWebTokenError'){
                return Reply.err('无效的token')
            }
        });
    }

    public static sign(uid:string,shortId:string){
        const SECRET_KEY = 'd90289cc2e92c046b5f15f9a6ef747b9';
        return JWT.sign({ uid: uid,shortId:shortId }, SECRET_KEY);
    }

    public static signWithTime(uid:string,shortId:string){
        const SECRET_KEY = 'd90289cc2e92c046b5f15f9a6ef747b9';
        return JWT.sign({ uid: uid,shortId:shortId }, SECRET_KEY,{ expiresIn: 60 * 60 * 24 * 30 });
    }

}