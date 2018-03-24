'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../../const/reply");
const mongooseUtil_1 = require("../../util/mongooseUtil");
class CuratorController extends egg_1.Controller {
    async show() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            shortId: Joi.number().required()
        }), this.ctx.params);
        const params = this.ctx.params;
        const chessRoom = await model.Curator.findChessRoomByShortId(params.shortId);
        this.ctx.body = reply_1.default.success(chessRoom);
    }
    async create() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            shortId: Joi.number().required(),
            phone: Joi.string().required(),
            password: Joi.string().required()
        }), this.ctx.body);
        const reqBody = this.ctx.request.body;
        const field = {
            "enabled": true,
            "declaration": "369棋牌，简简单单，一学就会!"
        };
        const curator = new model.Curator(field);
        const info = await curator.save();
        const chessRoomId = info.shortId;
        const user = await model.User.findUserByShortId(reqBody.shortId);
        // console.log('user=>',user);
        console.log('curatorId=>', curator._id, curator.shortId);
        const result = await model.User.bindCurator(user._id, info._id, curator.shortId, reqBody.phone, reqBody.password);
        console.log('result=>', result);
        if (mongooseUtil_1.default.compareResult(result)) {
            this.ctx.body = reply_1.default.success({ 'chessRoomId': chessRoomId });
        }
        else {
            this.ctx.body = reply_1.default.err('创建失败');
        }
    }
    async updateTablet() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            shortId: Joi.number().required(),
            tablet: Joi.string().required()
        }), this.ctx.body);
        const reqBody = this.ctx.request.body;
        const result = await model.Curator.updateTablet(reqBody.shortId, reqBody.tablet);
        console.log(result);
        if (mongooseUtil_1.default.compareResult(result)) {
            this.ctx.body = reply_1.default.success({});
            return;
        }
        this.ctx.body = reply_1.default.err('更新失败');
    }
}
exports.CuratorController = CuratorController;
module.exports = CuratorController;
