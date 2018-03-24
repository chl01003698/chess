'use strict';
import { Controller } from 'egg'
import reply from '../../const/reply';

export class FeedbackController extends Controller{
    async index(){
        const feedbacks = await this.ctx.model.Feedback.findAll();
        if(feedbacks){
            this.ctx.body = reply.success(feedbacks);
        }else{
            this.ctx.body = reply.err('没有找到任何反馈');
        }
    }

    async create(){
        console.log('############################');
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            game:Joi.string().required(),
            type: Joi.string().required(),
            reporter: Joi.string().required(),
            desc:Joi.string().required(),
            contact:Joi.string().required(),
        }), this.ctx.request.body);
        const reqBody = this.ctx.request.body as any;
        let feedback = new model.Feedback(reqBody);
        feedback = await feedback.save();
        if(feedback){
            this.ctx.body = reply.success(feedback);
        }else{
            this.ctx.body = reply.err('创建失败');
        }
    }

}

module.exports = FeedbackController;