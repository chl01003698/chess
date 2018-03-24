'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const type_1 = require("../const/type");
const reply_1 = require("../const/reply");
const mongooseUtil_1 = require("../util/mongooseUtil");
class MailService extends egg_1.Service {
    async update(id, type) {
        if (type == type_1.default.mail.READ) {
            return await this.read(id);
        }
        else if (type == type_1.default.mail.DRAW) {
            return await this.draw(id);
        }
        return reply_1.default.err('参数错误');
    }
    async read(id) {
        const result = await this.ctx.model.Mail.read(id);
        if (result.nModified >= 1) {
            return reply_1.default.success({});
        }
        return reply_1.default.err('没找到此消息');
    }
    async draw(id) {
        const mail = await this.ctx.model.Mail.findById(id);
        if (!mail) {
            return reply_1.default.err('没找到此消息');
        }
        if (mail.draw) {
            return reply_1.default.err('已领取');
        }
        const userId = mail.to;
        const user = await this.ctx.model.User.findClientUser(userId);
        const items = mail.items;
        let flag;
        for (let x = 0; x < items.length; x++) {
            let item = items[x];
            if (item.type == 0) {
                if (item.itemId == 'card') {
                    await this.ctx.model.User.updateUserCardById(userId, item.count);
                    await this.ctx.service.eventHandler.receiveMsgRewardEvent(userId, id, item.type, item.num);
                }
            }
            else if (item.type == 1) {
            }
        }
        await this.ctx.model.Mail.read(id);
        const result = await this.ctx.model.Mail.draw(id);
        if (mongooseUtil_1.default.compareResult(result)) {
            return reply_1.default.success({});
        }
        return reply_1.default.err('没找到此消息');
    }
    async receiveAll(ids) {
        const model = this.ctx.model;
        const length = ids.length;
        for (let x = 0; x < length; x++) {
            await this.draw(ids[x]);
            await this.read(ids[x]);
        }
        return reply_1.default.success({});
    }
}
exports.MailService = MailService;
module.exports = MailService;
