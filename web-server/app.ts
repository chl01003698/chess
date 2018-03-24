import Config  from './app/helper/config'
import { UserService } from './app/service/user'
import { MailService } from './app/service/mail'
import { SmsService } from './app/service/sms'
import { EventHandlerService } from './app/service/eventHandler'
import { PingppService } from './app/service/pingpp'
import { OrderService } from './app/service/order'
import { InstanceService } from './app/service/instance'
import { AwardService } from './app/service/award'
import { RedPacketService } from './app/service/redPacket'
import { AliOssService } from './app/service/alioss'
import { BroadcastService } from './app/service/broadcast'
import * as Keyv from 'keyv'
import * as Joi from 'joi'
import KeywordManager from './app/manager/keywordManager';
import RCPClient from './app/rpc/client';
import RCPServer from './app/rpc/server';



declare module "egg" {
  interface IService {
    user          : UserService,
    mail          : MailService,
    sms           : SmsService,
    eventHandler  : EventHandlerService,
    pingpp        : PingppService,
    order         : OrderService,
    instance      : InstanceService,
    award         : AwardService,
    redPacket     : RedPacketService,
    alioss        : AliOssService,
    broadcast     : BroadcastService
  }
  class Application {
    redis : any
    Joi   : Joi
    jwt   : any
    keyv  : Keyv
  }
}

module.exports = app => {
  app.beforeStart(async () => {
    await Config.Instance().initLoadData();
    await KeywordManager.loadKeyword();
    RCPClient.init(app);
    RCPServer.init(app);
  });
};