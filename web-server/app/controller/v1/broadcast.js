'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../../const/reply");
class BroadcastController extends egg_1.Controller {
    async index() {
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            game: Joi.string().required()
        }), this.ctx.params);
        const params = this.ctx.params;
        const systems = await this.ctx.service.broadcast.getSystemBroadcast(params.game);
        const hall = await this.ctx.service.broadcast.getHallBroadcast(params.game);
        const result = reply_1.default.success({ 'system': systems, 'hall': hall });
        this.ctx.body = result;
    }
}
exports.BroadcastController = BroadcastController;
module.exports = BroadcastController;
