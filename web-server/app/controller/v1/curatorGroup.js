'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../../const/reply");
class CuratorGroup extends egg_1.Controller {
    async index() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id: Joi.string().required(),
        }), this.ctx.params);
        const groups = await model.CuratorGroup.getGroups(this.ctx.params.id);
        this.ctx.body = reply_1.default.success(groups);
    }
    async create() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id: Joi.string().required(),
            name: Joi.string().required()
        }), this.ctx.body);
        const reqBody = this.ctx.request.body;
        const group = await model.CuratorGroup.createCommonGroup(reqBody.id, reqBody.name);
        this.ctx.body = reply_1.default.success(group);
    }
    async insertMember() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            groupId: Joi.string().required(),
            ids: Joi.array().required()
        }), this.ctx.body);
        const reqBody = this.ctx.request.body;
        const result = await model.CuratorGroup.insertMembers(reqBody.groupId, reqBody.ids);
        await model.CuratorGroup.updateMemberCount(reqBody.groupId);
        this.ctx.body = reply_1.default.success(result);
    }
    async removeMember() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            groupId: Joi.string().required(),
            ids: Joi.array().required()
        }), this.ctx.body);
        const reqBody = this.ctx.request.body;
        const result = await model.CuratorGroup.removeMembers(reqBody.groupId, reqBody.ids);
        await model.CuratorGroup.updateMemberCount(reqBody.groupId);
        this.ctx.body = reply_1.default.success(result);
    }
    async getGroupMembers() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            groupId: Joi.string().required()
        }), this.ctx.params);
        const result = await model.CuratorGroup.getGroupMembers(this.ctx.params.groupId);
        this.ctx.body = reply_1.default.success(result);
    }
    async removeMemerInAllGroup() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            curator: Joi.string().required(),
            id: Joi.string().required()
        }), this.ctx.body);
        const reqBody = this.ctx.request.body;
        const result = await model.CuratorGroup.removeMemerInAllGroup(reqBody.curator, reqBody.id);
        await model.CuratorGroup.updateMemberCount();
        this.ctx.body = reply_1.default.success(result);
    }
    async remvoeGroup() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            groupId: Joi.string().required()
        }), this.ctx.params);
        const params = this.ctx.params;
        const result = await model.CuratorGroup.removeGroup(params.groupId);
        this.ctx.body = reply_1.default.success(result);
    }
    async updateGroupName() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            groupId: Joi.string().required(),
            name: Joi.string().required()
        }), this.ctx.body);
        const reqBody = this.ctx.request.body;
        const result = await model.CuratorGroup.updateGroupName(reqBody.groupId, reqBody.name);
        this.ctx.body = reply_1.default.success(result);
    }
}
exports.CuratorGroup = CuratorGroup;
module.exports = CuratorGroup;
