'use strict';
import { Controller } from 'egg'
import reply from '../../const/reply';
import KEY from '../../const/key'
import RankManager from '../../manager/rankManager'

export class OrderController extends Controller{
    async index(){
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            userId:Joi.string().required(),
        }),this.ctx.params);

        const orders = model.Order.findAllByBuyer(this.ctx.params.userId);
        if(orders){
            this.ctx.body =  reply.success(orders);
        }else{
            this.ctx.body = reply.err('没有找到此用户任何定单记录');
        }
    }

    async create(){
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            userId:     Joi.string().required(),
            channel:    Joi.string().required(),
            platform:   Joi.string().required(),
            clientIp:   Joi.string().required(),
            count:      Joi.number().required(),
            itemId:     Joi.string().required()
        }),this.ctx.request.body);
        console.log('order_body=>',this.ctx.request.body);
        const reqBody = this.ctx.request.body as any;
        const result = await this.ctx.service.order.createCharge(reqBody);
        console.log("result=>",result);
        this.ctx.body = result;
    }
    
    async callback(){
        const model = this.ctx.model;
        const reqBody = this.ctx.request.body as any;
        console.log('支付回调=>',reqBody);
        const result = await this.ctx.service.order.callback(reqBody);
        console.log('result=>',result);
        if(result.code==0){
            this.ctx.body = result;
        }else{
            this.ctx.status = 500;
            this.ctx.body = result;
        }
    }
    
}

module.exports = OrderController;