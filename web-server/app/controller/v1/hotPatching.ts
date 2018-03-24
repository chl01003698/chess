'use strict';
import { Controller } from 'egg'
import DataManager from '../../manager/dataManager'
import reply from '../../const/reply';
import Config from '../../helper/config'
import KeywordManager from '../../manager/keywordManager';
import RCPClient from '../../rpc/client';

export class HotPatchingController extends Controller {
    async updateConfig() {
        const url = this.app.config.json.url;
        await Config.Instance().loadRemoteHotConfig(url);
        const response = await RCPClient.updateConfig();
        this.ctx.body = response;
        if (response.result && response.result.code == 0) {
            this.ctx.body = reply.success(response.result);
        } else {
            this.ctx.body = {
                code: response.error.code,
                msg: response.error.message
            }
        }
    }

    async updateKeywords(){
        const url = this.app.config.keyword.url;
        KeywordManager.loadRomoteKeyword(url);
        this.ctx.body = reply.success({});
    }

}
module.exports = HotPatchingController;