'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
class AliOssService extends egg_1.Service {
    async uploadCard(md5id, mergePath) {
        const config = this.app.config.oss;
        const result = await this.ctx.oss.put(config.client.nameCardPath + md5id, mergePath);
        return result.url;
    }
}
exports.AliOssService = AliOssService;
module.exports = AliOssService;
