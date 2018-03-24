'use strict';
import { Service } from 'egg'
import reply from '../const/reply'

export class AliOssService extends Service{
    async uploadCard(md5id:string,mergePath:any){
        const config = this.app.config.oss;
        const result = await this.ctx.oss.put(config.client.nameCardPath + md5id, mergePath);
        return result.url;
    }
}
module.exports = AliOssService;