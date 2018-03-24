"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const generate = require("nanoid/generate");
const sf = require("sf");
const config = require("config");
const yunpian_sdk_1 = require("yunpian-sdk");
const ms = require("ms");
const _ = require("lodash");
class Sms {
    constructor(keyv) {
        this.keyv = keyv;
        this.sms = new yunpian_sdk_1.SMS({
            apikey: config.get('smsConfig.key')
        });
    }
    send(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = false;
            if (yunpian_sdk_1.phone(phoneNumber)) {
                const authCode = generate('1234567890', 4);
                const minutes = config.get('smsConfig.minutes');
                const content = sf(config.get('smsConfig.template'), { code: authCode, minutes: minutes });
                const sendResult = yield this.sms.singleSend({
                    mobile: phoneNumber,
                    text: content
                });
                if (sendResult.code == 0) {
                    this.keyv.set(`sms:${phoneNumber}`, authCode, ms(`${minutes}m`));
                    result = true;
                }
            }
            return result;
        });
    }
    sendRegisterMsg(phoneNumber, url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yunpian_sdk_1.phone(phoneNumber)) {
                const content = sf(config.get('smsConfig.registerTemplate'), { phone: phoneNumber, url: url });
                this.sms.singleSend({
                    mobile: phoneNumber,
                    text: content
                });
            }
        });
    }
    auth(phoneNumber, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = false;
            const realCode = yield this.keyv.get(`sms:${phoneNumber}`);
            if (_.isString(realCode) && realCode == code) {
                result = true;
            }
            return result;
        });
    }
}
exports.default = Sms;
