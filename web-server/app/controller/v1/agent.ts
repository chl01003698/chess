'use strict';
import { Controller } from 'egg'
import reply from '../../const/reply'

export class AgentController extends Controller{

    async create(){
        const model = this.ctx.model;
        const reqBody = this.ctx.request.body;
        const agent = new model.Agent(reqBody);
        const result =  await agent.save();
        this.ctx.body = reply.success(result);
    }


}
module.exports = AgentController;