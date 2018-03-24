'use strict';
import { Service } from 'egg'
import reply from '../const/reply'

export class RedPacketService extends Service{
    
    async receive(id:string,uid:string){
        const model = this.ctx.model;
        const redPacket = await model.RedPacket.findRedPacketById(id);
        if(redPacket == null) return reply.err('该红包不存在');
        if(redPacket.receivers.length >= redPacket.count) return reply.err('该红包已领取完');
        if(redPacket.state == false) return reply.err('该红包无法领取');
        const user = await model.User.findUserByIdCustomSelect(uid,'shortId');
        if(user == null) return reply.err('该用户不存在');
        const data = await model.RedPacket.findReceiverById(id,uid);
        if(data) return reply.err('该用户已领取');
        const result = await model.RedPacket.receiveRedPacket(id,uid);
        console.log('receivers=>',result.receivers.length);
        console.log('redPacket.count=>',redPacket.count);
        if(result.receivers.length >= redPacket.count){
            console.log('*************************')
           const d = await model.RedPacket.updateStateById(id);
           console.log('d=>',d);
        }
        await model.User.updateUserCardById(uid,redPacket.every);
        return reply.success({'card':redPacket.every});
    }

}
module.exports = RedPacketService;