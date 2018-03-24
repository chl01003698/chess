'use strict';
import { Controller } from 'egg'
import reply from '../../const/reply';

export class BroadcastController extends Controller{

    async index(){
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            game:Joi.string().required()
        }), this.ctx.params);
        const params  = this.ctx.params;
        const systems = await this.ctx.service.broadcast.getSystemBroadcast(params.game);
        const hall    = await this.ctx.service.broadcast.getHallBroadcast(params.game);
        const result  = reply.success({'system':systems,'hall':hall});
        this.ctx.body = result;
    }

    

}
module.exports = BroadcastController