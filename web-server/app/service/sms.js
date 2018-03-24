"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sf = require("sf");
const yunpian_sdk_1 = require("yunpian-sdk");
const ms = require("ms");
const _ = require("lodash");
const egg_1 = require("egg");
const reply_1 = require("../const/reply");
const qs = require('querystring');
class SmsService extends egg_1.Service {
    async send(phoneNumber, authCode) {
        const config = this.app.config.sms;
        const keyv = this.app.keyv.get('instance');
        const sms = new yunpian_sdk_1.SMS({
            apikey: config.key
        });
        let sendResult;
        if (yunpian_sdk_1.phone(phoneNumber)) {
            const minutes = config.minutes;
            let content = config.template;
            content = content.replace('#code#', authCode);
            content = sf(content, { code: authCode, minutes: minutes });
            sendResult = await sms.singleSend({
                mobile: phoneNumber,
                text: content
            });
            // await keyv.set(`sms:${phoneNumber}`, authCode, ms(`${minutes}m`))
            if (sendResult.code == 0) {
                await keyv.set(`sms:${phoneNumber}`, authCode, ms(`${minutes}m`));
            }
        }
        return sendResult;
    }
    async sendJDAward(phoneNumber, cardnum, passwrod) {
        const config = this.app.config.sms;
        const sms = new yunpian_sdk_1.SMS({
            apikey: config.key
        });
        let content = config.awardTemplate;
        content = content.replace('#cardnum#', cardnum);
        content = content.replace('#password#', passwrod);
        const sendResult = await sms.singleSend({
            mobile: phoneNumber,
            text: content
        });
        return reply_1.default.success(sendResult);
    }
    async sendRegisterMsg(phoneNumber, url) {
        const config = this.app.config.sms;
        const keyv = this.app.keyv.get('instance');
        const sms = new yunpian_sdk_1.SMS({
            apikey: config.key
        });
        if (yunpian_sdk_1.phone(phoneNumber)) {
            const content = sf(config.registerTemplate, { phone: phoneNumber, url: url });
            sms.singleSend({
                mobile: phoneNumber,
                text: content
            });
        }
    }
    async auth(phoneNumber, code) {
        let result = false;
        const keyv = this.app.keyv.get('instance');
        const realCode = await keyv.get(`sms:${phoneNumber}`);
        if (_.isString(realCode) && realCode == code) {
            result = true;
        }
        return result;
    }
}
exports.SmsService = SmsService;
module.exports = SmsService;
