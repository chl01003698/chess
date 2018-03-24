'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../../const/reply");
class ActivityController extends egg_1.Controller {
    async index() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            app: Joi.string().required()
        }), this.ctx.params);
        const params = this.ctx.params;
        const activities = await model.Activity.findLast7DaysActivities(params.app);
        if (activities) {
            this.ctx.body = reply_1.default.success(activities);
        }
        else {
            this.ctx.body = reply_1.default.err('没找到此用户任何活动');
        }
    }
    async create() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        const reqBody = this.ctx.request.body;
        let activity = new model.Activity(reqBody);
        const newActivity = await activity.save();
        if (newActivity) {
            this.ctx.body = reply_1.default.success(newActivity);
        }
        else {
            this.ctx.body = reply_1.default.err('创建失败');
        }
    }
}
exports.ActivityController = ActivityController;
module.exports = ActivityController;
