'use strict';
import { Controller } from 'egg'
import reply from '../../const/reply';

export class ApprovalController extends Controller{
    async createCuratorApporval(){
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id: Joi.string().required(),
            phone:Joi.string().required()
        }), this.ctx.body);

        const reqBody = this.ctx.request.body as any;
        const selectKey = ' name '
        const user = await model.User.findUserByIdCustomSelect(reqBody.id,selectKey);
        if(user==null){
            this.ctx.body = reply.err('没找到该用户');
            return;
        }
        const approvalId = await model.Approval.createCuratorApproval(user._id,user.nickname,reqBody.phone);
        if(approvalId){
            this.ctx.body = reply.success({'approvalId':approvalId});
            return 
        }
        this.ctx.body = reply.err('创建失败');
    }
}
module.exports = ApprovalController;