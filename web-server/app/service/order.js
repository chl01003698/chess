'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../const/reply");
const ulid = require("ulid");
const key_1 = require("../const/key");
const rankManager_1 = require("../manager/rankManager");
class OrderService extends egg_1.Service {
    async createCharge(reqBody) {
        const orderNo = ulid.ulid();
        const feilds = this.getChangeField(reqBody);
        //ping++ 产生charges发送给前台
        const pingppResult = await this.ctx.service.pingpp.create(feilds);
        console.log('pingppResult=>', pingppResult);
        if (pingppResult.id == undefined) {
            const errmsg = pingppResult.stack;
            return reply_1.default.err(errmsg);
        }
        const orderFeilds = await this.getOrderField(reqBody, pingppResult);
        console.log('orderFeilds=>', orderFeilds);
        const order = new this.ctx.model.Order(orderFeilds);
        await order.save();
        return reply_1.default.success(pingppResult);
    }
    getChangeField(reqBody) {
        const count = reqBody.count;
        const itemId = reqBody.itemId;
        const config = this.app.config.pingxx;
        const orderNo = ulid.ulid();
        const feilds = {
            order_no: orderNo,
            app: { id: config.appid },
            channel: reqBody.channel,
            amount: 1,
            client_ip: reqBody.clientIp,
            currency: "cny",
            subject: "369代理系统",
            body: "房卡购买",
            extra: { "result_url": config.resultUrl }
        };
        return feilds;
    }
    async getOrderField(reqBody, pingppResult) {
        const model = this.ctx.model;
        // const config: any = this.config;
        const user = await model.User.findUserById(reqBody.userId);
        if (user == null)
            return reply_1.default.err('该用户不存在');
        const orderFeilds = {
            buyer: reqBody.userId,
            platform: reqBody.platform,
            channel: pingppResult.channel,
            orderNo: pingppResult.order_no,
            transaction_id: pingppResult.id,
            amount: pingppResult.amount,
            client_ip: pingppResult.client_ip,
            rmb: pingppResult.amount,
            coinType: 'card',
            baseCoin: 1,
            extraCoin: 0,
            coin: 1,
            purchased: false,
            item_id: 0,
        };
        if (user.curatorParent) {
            const curator = model.Curator.findCuratorByIdCustomSelect(user.user.curatorParent, '_id block award');
            if (curator && curator.block == false) {
                orderFeilds.curator = curator._id;
                orderFeilds.cward = curator.award;
            }
        }
        if (user.agentParent) {
            const agent = model.Agent.findCuratorByIdCustomSelect(user.agentParent, '_id block award');
            if (agent && agent.block == false) {
                orderFeilds.agent = agent._id;
                orderFeilds.aAward = agent.award;
            }
        }
        return orderFeilds;
    }
    async callback(reqBody) {
        const model = this.ctx.model;
        const order = await model.Order.findByTransactionId(reqBody.id);
        if (!order) {
            return reply_1.default.err('没有找到此订单');
        }
        const user = await this.ctx.model.User.findBuyer(order.buyer);
        let card = order.baseCoin;
        if (user.sumPay == 0) {
            card = order.coin;
        }
        const result = await this.ctx.model.User.findAndUpdateUserCoin(order.buyer, card, order.rmb);
        const redis = this.app.redis.get('payRank');
        const rank = new rankManager_1.default(redis);
        rank.incrBy(key_1.default.PAY_DAY, user._id, order.rmb, key_1.default.DAY);
        rank.incrBy(key_1.default.PAY_MONTH, user._id, order.rmb, key_1.default.MONTH);
        rank.incrBy(key_1.default.PAY_TOTAL, user._id, order.rmb, key_1.default.TOTAL);
        this.ctx.service.eventHandler.userPayEvent(user._id, order.rmb, order.curator, order.agent);
        // const day = await rank.revrange(KEY.PAY_DAY,0,10,true,KEY.DAY,0);
        // console.log('day',day);
        // const month = await rank.revrange(KEY.PAY_DAY,0,10,true,KEY.DAY,0);
        // console.log('month',month);
        // const total = await rank.revrange(KEY.PAY_TOTAL,0,10,true,KEY.TOTAL,0);
        // console.log('total',total);
        if (order.curator) {
            const cAward = order.rmb * order.cAward;
            const cw = await model.User.findAndUpdateCuratorMoney(order.curator, cAward);
            rank.incrBy(key_1.default.CAWARD_DAY, order.curator, cAward, key_1.default.DAY);
            rank.incrBy(key_1.default.CAWARD_MONTH, order.curator, cAward, key_1.default.MONTH);
            rank.incrBy(key_1.default.CAWARD_TOTAL, order.curator, cAward, key_1.default.TOTAL);
            this.ctx.service.eventHandler.curatorAwardEvent(cAward, order.curator);
            // const cday = await rank.revrange(KEY.CAWARD_DAY,0,10,true,KEY.DAY,0);
            // console.log('cday',cday);
            // const cmonth = await rank.revrange(KEY.CAWARD_MONTH,0,10,true,KEY.MONTH,0);
            // console.log('cmonth',cmonth);
            // const ctotal = await rank.revrange(KEY.CAWARD_TOTAL,0,10,true,KEY.TOTAL,0);
            // console.log('ctotal',ctotal);
        }
        if (order.agent) {
            const aAward = order.rmb * order.aAward;
            const aw = await model.User.findAndUpdateAgentMoney(order.agent, aAward);
            rank.incrBy(key_1.default.AAWARD_DAY, order.agent, aAward, key_1.default.DAY);
            rank.incrBy(key_1.default.AAWARD_MONTH, order.agent, aAward, key_1.default.MONTH);
            rank.incrBy(key_1.default.AAWARD_TOTAL, order.agent, aAward, key_1.default.TOTAL);
            this.ctx.service.eventHandler.agentAwardEvent(aAward, order.agent);
        }
        return reply_1.default.success({});
    }
}
exports.OrderService = OrderService;
module.exports = OrderService;
