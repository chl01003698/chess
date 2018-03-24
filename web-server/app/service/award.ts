'use strict';
import { Service } from 'egg'
import reply from '../const/reply'

export class AwardService extends Service{
    async invitedReward(id: string, index: number) {
        const model = this.ctx.model;
        let user = await model.User.findUserAwardIndex(id,index);
        console.log('user=>',user);
        if(user) return reply.err('已领取该奖励');
        user = await model.User.findInviter(id);
        if(user == null) return reply.err('没找到此用户');
        const length = user.invited.friends.length;
        console.log('user=>',user);
        if(index == 1 && length>=1){
            const result = await model.User.findAndUpdateInviteAward(id,2,index);
            console.log('result=>',result);
            return reply.success({index:index,card:2});
        }
        if(index == 2 && length>=5){
            await model.User.findAndUpdateInviteAward(id,2,index);
            return reply.success({index:index,card:12});
        }
        if(index == 3 && length>=10){
            await model.User.findAndUpdateInviteAward(id,2,index);
            return reply.success({index:index,card:0});
        }
        return reply.err('不符合领取条件');
    }

    async codeAward(uid:string,code:string){
        
    }

}
module.exports = AwardService;