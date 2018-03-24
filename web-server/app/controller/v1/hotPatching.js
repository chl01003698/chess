'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../../const/reply");
const config_1 = require("../../helper/config");
const keywordManager_1 = require("../../manager/keywordManager");
const client_1 = require("../../rpc/client");
class HotPatchingController extends egg_1.Controller {
    async updateConfig() {
        const url = this.app.config.json.url;
        await config_1.default.Instance().loadRemoteHotConfig(url);
        const response = await client_1.default.updateConfig();
        this.ctx.body = response;
        if (response.result && response.result.code == 0) {
            this.ctx.body = reply_1.default.success(response.result);
        }
        else {
            this.ctx.body = {
                code: response.error.code,
                msg: response.error.message
            };
        }
    }
    async updateKeywords() {
        const url = this.app.config.keyword.url;
        keywordManager_1.default.loadRomoteKeyword(url);
        this.ctx.body = reply_1.default.success({});
    }
}
exports.HotPatchingController = HotPatchingController;
module.exports = HotPatchingController;
