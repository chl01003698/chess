'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../../const/reply");
class MailController extends egg_1.Controller {
    async index() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id: Joi.string().required(),
        }), this.ctx.params);
        const params = this.ctx.params;
        console.log('params', params);
        const mails = await model.Mail.findLast7DaysSystemMails(params.id);
        if (mails) {
            this.ctx.body = reply_1.default.success(mails);
        }
        else {
            this.ctx.body = reply_1.default.err('没找到此用户任何消息');
        }
    }
    async create() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        const reqBody = this.ctx.request.body;
        const mail = new model.Mail(reqBody);
        const newMail = await mail.save();
        if (newMail) {
            this.ctx.body = reply_1.default.success(newMail);
        }
        else {
            this.ctx.body = reply_1.default.err('创建失败');
        }
    }
    async update() {
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id: Joi.string().required(),
            type: Joi.string().required()
        }), this.ctx.request.body);
        const reqBody = this.ctx.request.body;
        const result = await this.ctx.service.mail.update(reqBody.id, reqBody.type);
        this.ctx.body = result;
    }
    async removeMail() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            ids: Joi.string().required()
        }), this.ctx.body);
        const reqBody = this.ctx.request.body;
        const ids = reqBody.ids.split(",");
        await model.Mail.removeMails(ids);
        this.ctx.body = reply_1.default.success({});
    }
    async receiveAll() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            ids: Joi.string().required()
        }), this.ctx.body);
        const reqBody = this.ctx.request.body;
        const ids = reqBody.ids.split(",");
        this.ctx.body = await this.ctx.service.mail.receiveAll(ids);
    }
}
exports.MailController = MailController;
module.exports = MailController;
