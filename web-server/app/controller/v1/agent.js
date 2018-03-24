'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../../const/reply");
class AgentController extends egg_1.Controller {
    async create() {
        const model = this.ctx.model;
        const reqBody = this.ctx.request.body;
        const agent = new model.Agent(reqBody);
        const result = await agent.save();
        this.ctx.body = reply_1.default.success(result);
    }
}
exports.AgentController = AgentController;
module.exports = AgentController;
