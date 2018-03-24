'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../const/reply");
class RedPacketService extends egg_1.Service {
    async receive(id, uid) {
        const model = this.ctx.model;
        const redPacket = await model.RedPacket.findRedPacketById(id);
        if (redPacket == null)
            return reply_1.default.err('该红包不存在');
        if (redPacket.receivers.length >= redPacket.count)
            return reply_1.default.err('该红包已领取完');
        if (redPacket.state == false)
            return reply_1.default.err('该红包无法领取');
        const user = await model.User.findUserByIdCustomSelect(uid, 'shortId');
        if (user == null)
            return reply_1.default.err('该用户不存在');
        const data = await model.RedPacket.findReceiverById(id, uid);
        if (data)
            return reply_1.default.err('该用户已领取');
        const result = await model.RedPacket.receiveRedPacket(id, uid);
        console.log('receivers=>', result.receivers.length);
        console.log('redPacket.count=>', redPacket.count);
        if (result.receivers.length >= redPacket.count) {
            console.log('*************************');
            const d = await model.RedPacket.updateStateById(id);
            console.log('d=>', d);
        }
        await model.User.updateUserCardById(uid, redPacket.every);
        return reply_1.default.success({ 'card': redPacket.every });
    }
}
exports.RedPacketService = RedPacketService;
module.exports = RedPacketService;
