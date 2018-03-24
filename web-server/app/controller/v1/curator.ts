'use strict';
import { Controller } from 'egg'
import reply from '../../const/reply'
import MongooseUtil from '../../util/mongooseUtil';

export class CuratorController extends Controller{

    async show(){
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            shortId:Joi.number().required()
        }), this.ctx.params);
        const params = this.ctx.params;
        const chessRoom = await model.Curator.findChessRoomByShortId(params.shortId);
        this.ctx.body = reply.success(chessRoom);
    }
    
    async create(){
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            shortId:Joi.number().required(),
            phone:Joi.string().required(),
            password:Joi.string().required()
        }), this.ctx.body);
        const reqBody = this.ctx.request.body as any;
        const field = {
            "enabled" : true,
            "declaration" : "369棋牌，简简单单，一学就会!"
        }
        const curator = new model.Curator(field);
        const info =  await curator.save();
        const chessRoomId = info.shortId;
        const user = await model.User.findUserByShortId(reqBody.shortId);
        // console.log('user=>',user);
        console.log('curatorId=>',curator._id,curator.shortId);
        const result = await model.User.bindCurator(user._id,info._id,curator.shortId,reqBody.phone,reqBody.password);
        console.log('result=>',result);
        if(MongooseUtil.compareResult(result)){
            this.ctx.body = reply.success({'chessRoomId':chessRoomId});
        }else{
            this.ctx.body = reply.err('创建失败');
        }
    }

    async updateTablet(){
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            shortId:Joi.number().required(),
            tablet:Joi.string().required()
        }), this.ctx.body);
        const reqBody = this.ctx.request.body as any;
        const result = await model.Curator.updateTablet(reqBody.shortId,reqBody.tablet);
        console.log(result);
        if(MongooseUtil.compareResult(result)){
            this.ctx.body = reply.success({});
            return;
        }
        this.ctx.body = reply.err('更新失败');
    }
    
    
}

module.exports = CuratorController;