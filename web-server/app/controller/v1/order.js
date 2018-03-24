'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../../const/reply");
class OrderController extends egg_1.Controller {
    async index() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            userId: Joi.string().required(),
        }), this.ctx.params);
        const orders = model.Order.findAllByBuyer(this.ctx.params.userId);
        if (orders) {
            this.ctx.body = reply_1.default.success(orders);
        }
        else {
            this.ctx.body = reply_1.default.err('没有找到此用户任何定单记录');
        }
    }
    async create() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            userId: Joi.string().required(),
            channel: Joi.string().required(),
            platform: Joi.string().required(),
            clientIp: Joi.string().required(),
            count: Joi.number().required(),
            itemId: Joi.string().required()
        }), this.ctx.request.body);
        console.log('order_body=>', this.ctx.request.body);
        const reqBody = this.ctx.request.body;
        const result = await this.ctx.service.order.createCharge(reqBody);
        console.log("result=>", result);
        this.ctx.body = result;
    }
    async callback() {
        const model = this.ctx.model;
        const reqBody = this.ctx.request.body;
        console.log('支付回调=>', reqBody);
        const result = await this.ctx.service.order.callback(reqBody);
        console.log('result=>', result);
        if (result.code == 0) {
            this.ctx.body = result;
        }
        else {
            this.ctx.status = 500;
            this.ctx.body = result;
        }
    }
}
exports.OrderController = OrderController;
module.exports = OrderController;
