import * as generate from 'nanoid/generate'
import * as sf from 'sf'
import * as config from 'config'
import { phone, SMS } from 'yunpian-sdk'
import * as ms from 'ms'
import * as _ from 'lodash'

export default class Sms {
  sms: SMS
  
  constructor(private keyv) {
    this.sms = new SMS({
      apikey: config.get('smsConfig.key')
    });
  }

  async send(phoneNumber: number | string) {
    let result = false
    if (phone(phoneNumber)) {
      const authCode = generate('1234567890', 4)
      const minutes = config.get('smsConfig.minutes')
      const content = sf(config.get('smsConfig.template'), { code: authCode, minutes: minutes})
      const sendResult = await this.sms.singleSend({
        mobile: phoneNumber,
        text: content
      })
      if (sendResult.code == 0) {
        this.keyv.set(`sms:${phoneNumber}`, authCode, ms(`${minutes}m`))
        result = true
      }
    }
    return result
  }

  async sendRegisterMsg(phoneNumber: number | string, url: string) {
    if (phone(phoneNumber)) {
      const content = sf(config.get('smsConfig.registerTemplate'), { phone: phoneNumber, url: url})
      this.sms.singleSend({
        mobile: phoneNumber,
        text: content
      })
    }
  }

  async auth(phoneNumber: number | string, code: string) {
    let result = false
    const realCode = await this.keyv.get(`sms:${phoneNumber}`)
    if (_.isString(realCode) && realCode == code) {
      result = true
    }
    return result
  }
}