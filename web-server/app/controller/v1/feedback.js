'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../../const/reply");
class FeedbackController extends egg_1.Controller {
    async index() {
        const feedbacks = await this.ctx.model.Feedback.findAll();
        if (feedbacks) {
            this.ctx.body = reply_1.default.success(feedbacks);
        }
        else {
            this.ctx.body = reply_1.default.err('没有找到任何反馈');
        }
    }
    async create() {
        console.log('############################');
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            game: Joi.string().required(),
            type: Joi.string().required(),
            reporter: Joi.string().required(),
            desc: Joi.string().required(),
            contact: Joi.string().required(),
        }), this.ctx.request.body);
        const reqBody = this.ctx.request.body;
        let feedback = new model.Feedback(reqBody);
        feedback = await feedback.save();
        if (feedback) {
            this.ctx.body = reply_1.default.success(feedback);
        }
        else {
            this.ctx.body = reply_1.default.err('创建失败');
        }
    }
}
exports.FeedbackController = FeedbackController;
module.exports = FeedbackController;
