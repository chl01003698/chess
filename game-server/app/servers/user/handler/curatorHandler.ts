import * as _ from 'lodash';
import * as Raven from 'raven';
import { JoiValidate, respError, respOK } from '../../../util/helpers';
import * as Joi from 'joi';
import { CoreComponent } from '../../../components/core';
import Code from '../../../consts/code';
import PushEvent from '../../../consts/pushEvent';

export = function newHandler(app): CuratorHandler {
	return new CuratorHandler(app);
};

class CuratorHandler {
  constructor(private app) {}
  
  // 获取牌桌详情
  getRoomDetail(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
				roomId: Joi.string().required()
			}, next);
      if (!validate) return;
      const coreComponent = this.app.components.core as CoreComponent
      const roomCache = coreComponent.container.roomCache
      const roomInfo = await roomCache.getRoomInfoByRoomId(msg.roomId);
      if(roomInfo==null) return respError(next,Code.GAME.NO_EXIST_GAME);
      respOK(next,roomInfo);
    })
  }

  // 获取代开桌列表
  getRoomsInfo(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const coreComponent = this.app.components.core as CoreComponent
      const roomCache = coreComponent.container.roomCache
      const roomsInfo = await roomCache.getRoomsInfoByPlayerId(session.get('shortId'));
      respOK(next,roomsInfo);
    })
  }

  

}