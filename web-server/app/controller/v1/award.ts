'use strict';
import { Controller } from 'egg'
import reply from '../../const/reply';
import { AwardService } from '../../service/award';
import DataManager from '../../manager/dataManager';
import * as ulid from 'ulid'
const Duiba = require('duiba-sdk');
import Config from '../../helper/config';

export class AwardController extends Controller {
    /**
     * 分享奖励
     */
    async shareAward() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id: Joi.string().required(),
        }), this.ctx.params);

        const shareAward = Config.SHAREAWARD();
        const count = shareAward.limit;
        const cardNum = shareAward.card;
        const user = await model.User.findShareUser(this.ctx.params.id);
        if (user.shareAward.count >= count) {
            this.ctx.body = reply.err("超出今日奖励次数");
        } else {
            const result = await model.User.updateShareAward(this.ctx.params.id,cardNum);
            if(result.nModified >= 1 ){
                this.ctx.body = reply.success({card:2});
            }else{
                this.ctx.body = reply.err('领取失败');
            }
        }
    }

    /**
     * 幸运抽奖
     */
    async luckAward() {
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
            id: Joi.string().required(),
        }), this.ctx.query);
        const config = this.app.config.duiba;
        const duibaUrl = Duiba.buildUrlWithSign(
            config.appKey,
            config.appSecret,
            {
                'uid': this.ctx.query.id,
                'credits': 10,
                'redirect':'https://activity.m.duiba.com.cn/newtools/preview?id=2713071',
                'timestamp': Date.now() // 可选值，默认为 Date.now()
            }
        );
        console.log('duibaUrl=>',duibaUrl);
        this.ctx.body = reply.success({'redirect':duibaUrl});
    }

    async luckAwardIntegral(){
        const model = this.ctx.model;
        const query = this.ctx.query;
        const config = this.app.config.duiba;
        const verifyRes = Duiba.parseCreditConsume(query, config.appSecret);

        const bizId: any = ulid.ulid();
        const response = Duiba.responseCreditConsume('ok', 10, {
            bizId: bizId
        });
        
        this.ctx.body = response;
    }

    async luckAwardCallback(){
        const model = this.ctx.model;
        const query = this.ctx.query;
        const config = this.app.config.duiba;
        const verifyRes = Duiba.parseCreditConsume(query, config.appSecret);
        const uid = verifyRes.uid;
        const str = Duiba.responseCreditNotify();
        this.ctx.body = str;
    }

    /**
     * 邀请奖励
     */
    async invitedAward(){
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
          id:Joi.string().required(),
          index:Joi.number().required()
        }), this.ctx.request.body);
        const reqBody = this.ctx.request.body as any;
        const result = await this.service.award.invitedReward(reqBody.id,reqBody.index);
        this.ctx.body = result;
    }

    /**
     * 兑奖码奖励
     */
    async codeAward(){
        const model = this.ctx.model;
        const Joi = this.app.Joi;
        this.ctx.validate(Joi.object().keys({
          id:Joi.string().required(),
          code:Joi.number().required()
        }), this.ctx.request.body);

        const reqBody = this.ctx.request.body as any;
        const result = await this.ctx.service.award.codeAward(reqBody.uid,reqBody.code);
        this.ctx.body = result;
    }


}

module.exports = AwardController;