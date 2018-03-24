'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../../const/reply");
class RecordController extends egg_1.Controller {
    async index() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id: Joi.string().required(),
            game: Joi.string().required(),
        }), this.ctx.params);
        const params = this.ctx.params;
        const records = await model.Record.findRecordBriefsByUserIdAndGame(params.id, params.game);
        console.log('records', records);
        if (records) {
            this.ctx.body = reply_1.default.success(records);
        }
        else {
            this.ctx.body = reply_1.default.err('没找到此用户任何战绩');
        }
    }
    async create() {
        const model = this.ctx.model;
        const reqBody = this.ctx.request.body;
        const record = new model.Record(reqBody);
        const newRecord = await record.save();
        if (newRecord) {
            this.ctx.body = reply_1.default.success(newRecord);
        }
        else {
            this.ctx.body = reply_1.default.err('创建失败');
        }
    }
    async getOwnerRecords() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id: Joi.string().required(),
            game: Joi.string().required(),
        }), this.ctx.params);
        const params = this.ctx.params;
        const records = await model.Record.findRecordBriefsByOwnerId(params.id, params.game);
        if (records) {
            this.ctx.body = reply_1.default.success(records);
        }
        else {
            this.ctx.body = reply_1.default.err('没找到任何代开战绩');
        }
    }
    async getChessRoomRecords() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id: Joi.string().required(),
            game: Joi.string().required(),
        }), this.ctx.params);
        const params = this.ctx.params;
        const records = await model.Record.findRecordBriefsByChessRoomId(params.id, params.game);
        if (records) {
            this.ctx.body = reply_1.default.success(records);
        }
        else {
            this.ctx.body = reply_1.default.err('没找到任何代开战绩');
        }
    }
}
exports.RecordController = RecordController;
module.exports = RecordController;
