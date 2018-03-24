'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../../const/reply");
class ApprovalController extends egg_1.Controller {
    async createCuratorApporval() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id: Joi.string().required(),
            phone: Joi.string().required()
        }), this.ctx.body);
        const reqBody = this.ctx.request.body;
        const selectKey = ' name ';
        const user = await model.User.findUserByIdCustomSelect(reqBody.id, selectKey);
        if (user == null) {
            this.ctx.body = reply_1.default.err('没找到该用户');
            return;
        }
        const approvalId = await model.Approval.createCuratorApproval(user._id, user.nickname, reqBody.phone);
        if (approvalId) {
            this.ctx.body = reply_1.default.success({ 'approvalId': approvalId });
            return;
        }
        this.ctx.body = reply_1.default.err('创建失败');
    }
}
exports.ApprovalController = ApprovalController;
module.exports = ApprovalController;
