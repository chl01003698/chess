'use strict';
import { Service } from 'egg'
import Wechat from '../helper/wechat'
import Type from '../const/type'
import reply from '../const/reply'
import * as ulid from 'ulid'
import KEY from '../const/key'
import RankManager from '../manager/rankManager'
import { Promise } from 'mongoose';
import curator from '../model/curator';
import Config from '../helper/config';

export class OrderService extends Service{

    async createCharge(reqBody : any){
        const orderNo: any = ulid.ulid();
        const feilds = this.getChangeField(reqBody);
        //ping++ 产生charges发送给前台
        const pingppResult = await this.ctx.service.pingpp.create(feilds);
        console.log('pingppResult=>',pingppResult);
        if(pingppResult.id == undefined){
            const errmsg = pingppResult.stack;
            return reply.err(errmsg);
        }
        const orderFeilds = await this.getOrderField(reqBody,pingppResult);
        console.log('orderFeilds=>',orderFeilds);
        const order = new this.ctx.model.Order(orderFeilds);
        await order.save();
        return reply.success(pingppResult);
    }

    getChangeField(reqBody:any){
        const count = reqBody.count;
        const itemId = reqBody.itemId;
        const config : any = this.app.config.pingxx;
        const orderNo: any = ulid.ulid();
        const feilds = {
            order_no:   orderNo,
            app:        { id: config.appid },
            channel:    reqBody.channel,
            amount:     1,
            client_ip:  reqBody.clientIp,
            currency:   "cny",
            subject:    "369代理系统",
            body:       "房卡购买",
            extra: { "result_url": config.resultUrl }
        };
        return feilds;
    }

    async getOrderField(reqBody:any,pingppResult:any){
        const model = this.ctx.model;
        // const config: any = this.config;
        const user = await model.User.findUserById(reqBody.userId);
        if(user==null) return reply.err('该用户不存在');
        const orderFeilds:any = {
            buyer:          reqBody.userId,
            platform:       reqBody.platform,
            channel:        pingppResult.channel,
            orderNo:        pingppResult.order_no,
            transaction_id: pingppResult.id,
            amount:         pingppResult.amount,
            client_ip:      pingppResult.client_ip,
            rmb:            pingppResult.amount,
            coinType:       'card',
            baseCoin:       1,
            extraCoin:      0,
            coin:           1,
            purchased:      false,
            item_id:        0,
        };
        if(user.curatorParent){
            const curator = model.Curator.findCuratorByIdCustomSelect(user.user.curatorParent,'_id block award');
            if(curator && curator.block == false){
                orderFeilds.curator = curator._id;
                orderFeilds.cward = curator.award;
            }
        }
        if(user.agentParent){
            const agent = model.Agent.findCuratorByIdCustomSelect(user.agentParent,'_id block award');
            if(agent && agent.block == false){
                orderFeilds.agent = agent._id;
                orderFeilds.aAward = agent.award;
            }
        }
        return orderFeilds;
    }

    async callback(reqBody:any){
        const model = this.ctx.model;
        const order = await model.Order.findByTransactionId(reqBody.id);
        if(!order){
            return reply.err('没有找到此订单');
        }
        const user = await this.ctx.model.User.findBuyer(order.buyer);
        let card = order.baseCoin;
        if(user.sumPay == 0){
            card = order.coin;
        }
        const result = await this.ctx.model.User.findAndUpdateUserCoin(order.buyer,card,order.rmb);

        const redis = this.app.redis.get('payRank');
        const rank = new RankManager(redis);

        rank.incrBy(KEY.PAY_DAY,  user._id,order.rmb,KEY.DAY);
        rank.incrBy(KEY.PAY_MONTH,user._id,order.rmb,KEY.MONTH);
        rank.incrBy(KEY.PAY_TOTAL,user._id,order.rmb,KEY.TOTAL);

        this.ctx.service.eventHandler.userPayEvent(user._id,order.rmb,order.curator,order.agent);

        // const day = await rank.revrange(KEY.PAY_DAY,0,10,true,KEY.DAY,0);
        // console.log('day',day);
        // const month = await rank.revrange(KEY.PAY_DAY,0,10,true,KEY.DAY,0);
        // console.log('month',month);
        // const total = await rank.revrange(KEY.PAY_TOTAL,0,10,true,KEY.TOTAL,0);
        // console.log('total',total);

        if(order.curator){
            const cAward = order.rmb * order.cAward;
            const cw =  await model.User.findAndUpdateCuratorMoney(order.curator,cAward);
            rank.incrBy(KEY.CAWARD_DAY,  order.curator,cAward,KEY.DAY);
            rank.incrBy(KEY.CAWARD_MONTH,order.curator,cAward,KEY.MONTH);
            rank.incrBy(KEY.CAWARD_TOTAL,order.curator,cAward,KEY.TOTAL);
            this.ctx.service.eventHandler.curatorAwardEvent(cAward,order.curator);

            // const cday = await rank.revrange(KEY.CAWARD_DAY,0,10,true,KEY.DAY,0);
            // console.log('cday',cday);
            // const cmonth = await rank.revrange(KEY.CAWARD_MONTH,0,10,true,KEY.MONTH,0);
            // console.log('cmonth',cmonth);
            // const ctotal = await rank.revrange(KEY.CAWARD_TOTAL,0,10,true,KEY.TOTAL,0);
            // console.log('ctotal',ctotal);
        }

        if(order.agent){
            const aAward = order.rmb * order.aAward;
            const aw = await model.User.findAndUpdateAgentMoney(order.agent,aAward);
            rank.incrBy(KEY.AAWARD_DAY,  order.agent,aAward,KEY.DAY);
            rank.incrBy(KEY.AAWARD_MONTH,order.agent,aAward,KEY.MONTH);
            rank.incrBy(KEY.AAWARD_TOTAL,order.agent,aAward,KEY.TOTAL);
            this.ctx.service.eventHandler.agentAwardEvent(aAward,order.agent);
        }
        return reply.success({});
    }
    

}


module.exports = OrderService;
// -authtoken=77645052a4ec8e85 