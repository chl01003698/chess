"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter2_1 = require("eventemitter2");
const _ = require("lodash");
class Channel extends eventemitter2_1.EventEmitter2 {
    constructor(app, channelKey, channelId) {
        super();
        this.app = app;
        this.channelKey = channelKey;
        this.channelId = channelId;
        const channelName = `${this.channelKey}:${this.channelId}`;
        const channelService = this.app.get('channelService');
        this.channel = channelService.getChannel(channelName, true);
    }
    add(uid, sid) {
        const member = this.getChannel().getMember(uid);
        if (!member) {
            this.getChannel().add(uid, sid);
        }
    }
    leave(uid) {
        const member = this.getChannel().getMember(uid);
        if (member)
            this.getChannel().leave(member.uid, member.sid);
    }
    count() {
        return this.getChannel().getUserAmount();
    }
    getChannel() {
        return this.channel;
    }
    pushMessage(route, msg = {}) {
        return new Promise((resolve, reject) => {
            const channel = this.getChannel();
            if (channel.getUserAmount() == 0)
                return resolve();
            channel.pushMessage(route, msg, null, (error) => {
                if (error != null) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
            this.emit('onPushMessage', route, msg);
        });
    }
    pushMessageByIds(route, msg, uids) {
        if (_.isString(uids)) {
            uids = [uids];
        }
        const channelService = this.app.get('channelService');
        const members = [];
        _.forEach(uids, (uid) => {
            if (uid != undefined) {
                const member = this.getChannel().getMember(uid);
                if (member != undefined) {
                    members.push(member);
                }
            }
        });
        if (members.length > 0) {
            this.emit('onPushMessageByIds', route, msg, uids);
            return new Promise((resolve, reject) => {
                channelService.pushMessageByUids(route, msg, members, function (error) {
                    if (error != null) {
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                });
            });
        }
        return Promise.resolve();
    }
    destroy() {
        this.channel.destroy();
    }
}
exports.default = Channel;
