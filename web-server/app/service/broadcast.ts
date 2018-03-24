'use strict';
import { Service } from 'egg'
import Wechat from '../helper/wechat'
import Type from '../const/type'
import reply from '../const/reply'

export class BroadcastService extends Service {

    async getSystemBroadcast(game: string) {
        const model  = this.ctx.model;
        const query  = { 'type': 1, 'activeGame': game };
        const select = { 'activeGame': 0, 'isDeleted': 0 };
        const broadcasts = await model.AdminBroadcast.find(query, select);
        if (broadcasts) {
            return reply.success(broadcasts);
        }
        return reply.err('系统错误');
    }

    async getHallBroadcast(game: string) {
        const model  = this.ctx.model;
        const query  = { 'type': 2, 'activeGame': game };
        const select = { 'activeGame': 0, 'isDeleted': 0 };
        const broadcasts = await model.AdminBroadcast.find(query, select);
        if (broadcasts) {
            return reply.success(broadcasts);
        }
        return reply.err('系统错误');
    }
    
}
module.exports = BroadcastService;