'use strict';
import { Controller } from 'egg'
import TypeConst from '../../const/type'
import reply from '../../const/reply'
import {phone} from 'yunpian-sdk';
import * as generate from 'nanoid/generate'

export class SmsController extends Controller {

    async create() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            phone: Joi.string().required()
        }), this.ctx.request.body);

        const reqBody = this.ctx.request.body as any;
        const phoneNumber = reqBody.phone;
        const validatePhone = phone(phoneNumber);
        if(validatePhone){
            const authCode = generate('1234567890', 4);
            const sms = this.ctx.service.sms;
            this.ctx.body = reply.success({smscode:authCode,mobile:phoneNumber,count:1});
            const result = await sms.send(phoneNumber,authCode);
            if(result.code == 0){
                this.ctx.body = reply.success({smscode:authCode,mobile:result.mobile,count:result.count});
            }else{
                this.ctx.body = reply.err(result.detail);
            }
        }else{
            this.ctx.body = reply.err('手机号码校验失败');
        }
    }

    async sendJDAward(){
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            phone: Joi.string().required()
        }), this.ctx.request.body);
        const reqBody = this.ctx.request.body as any;
        const result = await this.ctx.service.sms.sendJDAward(reqBody.phone,'WJFDFJKJ77HFJ','SJAKJIJK13');
        this.ctx.body = result;
    }
    
}
module.exports = SmsController;