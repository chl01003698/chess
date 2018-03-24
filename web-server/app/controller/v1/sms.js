'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../../const/reply");
const yunpian_sdk_1 = require("yunpian-sdk");
const generate = require("nanoid/generate");
class SmsController extends egg_1.Controller {
    async create() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            phone: Joi.string().required()
        }), this.ctx.request.body);
        const reqBody = this.ctx.request.body;
        const phoneNumber = reqBody.phone;
        const validatePhone = yunpian_sdk_1.phone(phoneNumber);
        if (validatePhone) {
            const authCode = generate('1234567890', 4);
            const sms = this.ctx.service.sms;
            this.ctx.body = reply_1.default.success({ smscode: authCode, mobile: phoneNumber, count: 1 });
            const result = await sms.send(phoneNumber, authCode);
            if (result.code == 0) {
                this.ctx.body = reply_1.default.success({ smscode: authCode, mobile: result.mobile, count: result.count });
            }
            else {
                this.ctx.body = reply_1.default.err(result.detail);
            }
        }
        else {
            this.ctx.body = reply_1.default.err('手机号码校验失败');
        }
    }
    async sendJDAward() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            phone: Joi.string().required()
        }), this.ctx.request.body);
        const reqBody = this.ctx.request.body;
        const result = await this.ctx.service.sms.sendJDAward(reqBody.phone, 'WJFDFJKJ77HFJ', 'SJAKJIJK13');
        this.ctx.body = result;
    }
}
exports.SmsController = SmsController;
module.exports = SmsController;
