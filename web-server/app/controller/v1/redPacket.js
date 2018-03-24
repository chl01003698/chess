'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../../const/reply");
class RedPacketController extends egg_1.Controller {
    async show() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id: Joi.string().required()
        }), this.ctx.params);
        const params = this.ctx.params;
        const redPacket = await model.RedPacket.findRedPacketById(params.id);
        if (redPacket) {
            this.ctx.body = reply_1.default.success(redPacket);
            return;
        }
        this.ctx.body = reply_1.default.err('此红包不存在');
    }
    async create() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            uid: Joi.string().required(),
            every: Joi.number().required(),
            count: Joi.number().required(),
            desc: Joi.string().required()
        }), this.ctx.body);
        const reqBody = this.ctx.request.body;
        const user = await model.User.findUserByIdCustomSelect(reqBody.uid, 'coin');
        if (user == null) {
            this.ctx.body = reply_1.default.err('该用户不存在');
            return;
        }
        const card = reqBody.every * reqBody.count;
        if (user.coin.card < card) {
            this.ctx.body = reply_1.default.err('桌卡数量不足,请充值');
        }
        const field = {
            'sender': reqBody.uid,
            'card': card,
            'every': reqBody.every,
            'count': reqBody.count,
            'desc': reqBody.desc
        };
        const redPacket = new model.RedPacket(field);
        const redPacketId = redPacket._id;
        await redPacket.save();
        await model.User.updateUserCardById(reqBody.uid, card);
        this.ctx.body = reply_1.default.success({ 'redPacketId': redPacketId });
    }
    async receive() {
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id: Joi.string().required(),
            uid: Joi.string().required()
        }), this.ctx.body);
        const reqBody = this.ctx.request.body;
        const result = await this.ctx.service.redPacket.receive(reqBody.id, reqBody.uid);
        this.ctx.body = result;
    }
}
exports.RedPacketController = RedPacketController;
module.exports = RedPacketController;
