'use strict';
import { Controller } from 'egg'
import reply from '../../const/reply';

export class ActivityController extends Controller{

    async index(){
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            app:Joi.string().required()
        }), this.ctx.params);
        const params = this.ctx.params;
        const activities = await model.Activity.findLast7DaysActivities(params.app);
        if(activities){
            this.ctx.body = reply.success(activities);
        }else{
            this.ctx.body = reply.err('没找到此用户任何活动');
        }
    }

    async create(){
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        const reqBody = this.ctx.request.body as any;
        let activity = new model.Activity(reqBody);
        const newActivity = await activity.save();
        if(newActivity){
            this.ctx.body = reply.success(newActivity);
        }else{
            this.ctx.body = reply.err('创建失败');
        }
    }

    
}

module.exports =  ActivityController;