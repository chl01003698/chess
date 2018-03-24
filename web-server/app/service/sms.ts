import * as sf from 'sf'
import { phone, SMS } from 'yunpian-sdk'
import * as ms from 'ms'
import * as _ from 'lodash'
import { Service } from 'egg'
import reply from '../const/reply';
const qs = require('querystring');

export class SmsService extends Service {

    async send(phoneNumber: string, authCode: string) {
        const config = this.app.config.sms;
        const keyv = this.app.keyv.get('instance');
        const sms = new SMS({
            apikey: config.key
        });
        let sendResult;
        if (phone(phoneNumber)) {
            const minutes = config.minutes
            let content = config.template
            content = content.replace('#code#',authCode)
            content = sf(content, { code: authCode, minutes: minutes })
            sendResult = await sms.singleSend({
                mobile: phoneNumber,
                text: content
            })
            // await keyv.set(`sms:${phoneNumber}`, authCode, ms(`${minutes}m`))
            if (sendResult.code == 0) {
                await keyv.set(`sms:${phoneNumber}`, authCode, ms(`${minutes}m`))
            }
        }
        return sendResult;
    }

    async sendJDAward(phoneNumber:string,cardnum:string,passwrod:string){
        const config = this.app.config.sms;
        const sms = new SMS({
            apikey: config.key
        });
        let content = config.awardTemplate;
        content = content.replace('#cardnum#',cardnum);
        content = content.replace('#password#',passwrod);
        const sendResult = await sms.singleSend({
            mobile: phoneNumber,
            text  : content
        })
        return reply.success(sendResult);
    }

    async sendRegisterMsg(phoneNumber: string, url: string) {
        const config = this.app.config.sms;
        const keyv = this.app.keyv.get('instance');
        const sms = new SMS({
            apikey: config.key
        });
        if (phone(phoneNumber)) {
            const content = sf(config.registerTemplate, { phone: phoneNumber, url: url })
            sms.singleSend({
                mobile: phoneNumber,
                text: content
            })
        }
    }

    async auth(phoneNumber: string, code: string) {
        let result = false
        const keyv = this.app.keyv.get('instance');
        const realCode = await keyv.get(`sms:${phoneNumber}`)
        if (_.isString(realCode) && realCode == code) {
            result = true
        }
        return result
    }

}
module.exports = SmsService;