"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter2_1 = require("eventemitter2");
const pushEvent_1 = require("../../consts/pushEvent");
const _ = require("lodash");
class Chat extends eventemitter2_1.EventEmitter2 {
    constructor(channel) {
        super();
        this.channel = channel;
        this.chatRecords = [];
    }
    chat(gamePlayer, msg) {
        this.channel.pushMessage(pushEvent_1.default.onChat, _.assign(msg, { uid: gamePlayer.uid }));
    }
    chatText(gamePlayer, text) {
        this.chatRecords.push({ n: gamePlayer.user.nickname, t: text });
        this.channel.pushMessage(pushEvent_1.default.onChatText, { uid: gamePlayer.uid, text: text });
    }
    recentChatRecords() {
        return _.takeRight(this.chatRecords, 20);
    }
}
exports.default = Chat;
