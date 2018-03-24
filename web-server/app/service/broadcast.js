'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../const/reply");
class BroadcastService extends egg_1.Service {
    async getSystemBroadcast(game) {
        const model = this.ctx.model;
        const query = { 'type': 1, 'activeGame': game };
        const select = { 'activeGame': 0, 'isDeleted': 0 };
        const broadcasts = await model.AdminBroadcast.find(query, select);
        if (broadcasts) {
            return reply_1.default.success(broadcasts);
        }
        return reply_1.default.err('系统错误');
    }
    async getHallBroadcast(game) {
        const model = this.ctx.model;
        const query = { 'type': 2, 'activeGame': game };
        const select = { 'activeGame': 0, 'isDeleted': 0 };
        const broadcasts = await model.AdminBroadcast.find(query, select);
        if (broadcasts) {
            return reply_1.default.success(broadcasts);
        }
        return reply_1.default.err('系统错误');
    }
}
exports.BroadcastService = BroadcastService;
module.exports = BroadcastService;
