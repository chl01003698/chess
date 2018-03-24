'use strict';
import { Service } from 'egg'
import Wechat from '../helper/wechat'
import Type from '../const/type'
import reply from '../const/reply'
import MongooseUtil from '../util/mongooseUtil';

export class MailService extends Service {
    async update(id: string, type: string) {
        if (type == Type.mail.READ) {
            return await this.read(id);
        } else if (type == Type.mail.DRAW) {
            return await this.draw(id);
        }
        return reply.err('参数错误');
    }

    async read(id: string) {
        const result = await this.ctx.model.Mail.read(id);
        if(result.nModified >=1){
            return reply.success({});
        }
        return reply.err('没找到此消息');
    }

    async draw(id: string) {
        const mail = await this.ctx.model.Mail.findById(id);
        if(!mail){
            return reply.err('没找到此消息');
        }
        if(mail.draw){
            return reply.err('已领取');
        }
        const userId = mail.to;
        const user = await this.ctx.model.User.findClientUser(userId);
        const items = mail.items;
        let flag;
        for(let x=0;x<items.length;x++){
            let item = items[x];
            if(item.type==0){
                if(item.itemId == 'card'){
                    await this.ctx.model.User.updateUserCardById(userId,item.count);
                    await this.ctx.service.eventHandler.receiveMsgRewardEvent(userId,id,item.type,item.num);
                }
            }else if(item.type == 1){

            }
        }
        await this.ctx.model.Mail.read(id);
        const result = await this.ctx.model.Mail.draw(id);
        if(MongooseUtil.compareResult(result)){
            return reply.success({});
        }
        return reply.err('没找到此消息');
    }

    async receiveAll(ids: Array<string>){
        const model = this.ctx.model;
        const length = ids.length;
        for(let x=0;x<length;x++){
            await this.draw(ids[x]);
            await this.read(ids[x]);
        }
        return reply.success({});
    }
    
    

}
module.exports = MailService;