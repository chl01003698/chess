'use strict';
import { Controller } from 'egg'
import reply from '../../const/reply';

export class RecordController extends Controller {
    async index() {
        const model = this.ctx.model;
        const Joi   = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id:    Joi.string().required(),
            game:  Joi.string().required(),
        }),this.ctx.params);

        const params  = this.ctx.params;
        const records = await model.Record.findRecordBriefsByUserIdAndGame(params.id,params.game);
        console.log('records',records);
        if(records){
            this.ctx.body = reply.success(records);
        }else{
            this.ctx.body = reply.err('没找到此用户任何战绩');
        }
    }


    async create(){
        const model = this.ctx.model;
        const reqBody = this.ctx.request.body;
        const record = new model.Record(reqBody);
        const newRecord = await record.save();
        if(newRecord){
            this.ctx.body = reply.success(newRecord);
        }else {
            this.ctx.body = reply.err('创建失败')
        }
    }


    async getOwnerRecords(){
        const model = this.ctx.model;
        const Joi   = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id:   Joi.string().required(),
            game: Joi.string().required(),
        }),this.ctx.params);

        const params = this.ctx.params;
        const records = await model.Record.findRecordBriefsByOwnerId(params.id,params.game);
        if(records){
            this.ctx.body = reply.success(records);
        }else{
            this.ctx.body = reply.err('没找到任何代开战绩');
        }
    }


    async getChessRoomRecords(){
        const model = this.ctx.model;
        const Joi   = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id:   Joi.string().required(),
            game: Joi.string().required(),
        }),this.ctx.params);

        const params  = this.ctx.params;
        const records = await model.Record.findRecordBriefsByChessRoomId(params.id,params.game);
        if(records){
            this.ctx.body = reply.success(records);
        }else{
            this.ctx.body = reply.err('没找到任何代开战绩');
        }
    }

}
module.exports = RecordController;