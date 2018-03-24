'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const JPush = require("jpush-sdk");
class PushController extends egg_1.Controller {
    constructor() {
        super(...arguments);
        this.client = null;
    }
    getClient() {
        const config = this.app.config.jpush;
        if (this.client == null) {
            this.client = JPush.buildClient(config.appKey, config.appSecret, null, true);
        }
        return this.client;
    }
    async pushAll() {
        const client = this.getClient();
        client.push().setPlatform(JPush.ALL)
            .setAudience(JPush.ALL)
            .setNotification('Hi, JPush', JPush.ios('ios alert', 'happy', 5))
            .send(function (err, res) {
            if (err) {
                console.log('jpush_err=>', err.message);
            }
            else {
                console.log('Sendno: ' + res.sendno);
                console.log('Msg_id: ' + res.msg_id);
            }
        });
        this.ctx.body = 'jpush';
    }
    async pushOne() {
        const client = this.getClient();
        client.push().setPlatform('ios', 'android')
            .setAudience(JPush.tag('555', '666'), JPush.alias('666,777'))
            .setNotification('Hi, JPush', JPush.ios('ios alert'), JPush.android('android alert', null, 1))
            .setMessage('msg content')
            .setOptions(null, 60)
            .send(function (err, res) {
            if (err) {
                console.log(err.message);
            }
            else {
                console.log('Sendno: ' + res.sendno);
                console.log('Msg_id: ' + res.msg_id);
            }
        });
        this.ctx.body = 'jpush';
    }
}
exports.PushController = PushController;
module.exports = PushController;