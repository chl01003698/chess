import * as _ from 'lodash';
import * as Raven from 'raven';
import { JoiValidate, respError, respOK } from '../../../util/helpers';
import * as Joi from 'joi';
import { CoreComponent } from '../../../components/core';
import Code from '../../../consts/code';
import PushEvent from '../../../consts/pushEvent';
import { UserModel } from '../../../extend/db';
import FriendService from '../../../services/friend';

export = function newHandler(app): FriendHandler {
	return new FriendHandler(app);
};

class FriendHandler {
	constructor(private app) {}

  /**
   * 邀请好友加入房间
   * @param msg 
   * @param session 
   * @param next 
   */
  inviteJoinGame(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
				shortId: Joi.number().required()
			}, next);
      if (!validate) return;
      
      const core = this.app.components.core as CoreComponent;
      const [userSession1, userSession2] = await Promise.all([
        core.container.userCache.findUserSession(session.get('shortId')),
        core.container.userCache.findUserSession(msg.shortId)
      ])
      if (userSession1 == undefined || userSession2 == undefined) return respError(next, Code.NO_EXIST_USER)
      if (userSession2.roomId != "") return respError(next, Code.GAME.ALREADY_JOIN_GAME)
      if (userSession1.roomId == "") return respError(next, Code.GAME.USER_NO_EXIST_IN_GAME)
      const info = {shortId:session.get('shortId'),nickname:userSession1.nickname,roomId:userSession1.roomId};
      this.app.get('statusService').pushByUids([ userSession2.uid ], PushEvent.onInviteJoinGame, info);
      respOK(next)
    })
  }

  /**
   * 拒绝好友邀请
   * @param msg 
   * @param session 
   * @param next 
   */
  refuseInvite(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
				shortId: Joi.number().required()
			}, next);
      if (!validate) return;
      const core = this.app.components.core as CoreComponent;
      const [userSession1, userSession2] = await Promise.all([
        core.container.userCache.findUserSession(session.get('shortId')),
        core.container.userCache.findUserSession(msg.shortId)
      ])
      if (userSession1 == undefined || userSession2 == undefined) return respError(next, Code.NO_EXIST_USER)
      const info = {shortId:session.get('shortId'),nickname:userSession1.nickname};
      this.app.get('statusService').pushByUids([ userSession2.uid ], PushEvent.onRefuseInvite, info);
      respOK(next)
    })
  }

  /**
   * 进入好友房间
   * @param msg 
   * @param session 
   * @param next 
   */
  joinFriendGame(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
				shortId: Joi.number().required()
			}, next);
      if (!validate) return;
      const core = this.app.components.core as CoreComponent;
      const [userSession1, userSession2] = await Promise.all([
        core.container.userCache.findUserSession(session.get('shortId')),
        core.container.userCache.findUserSession(msg.shortId)
      ])
      if (userSession1 == undefined || userSession2 == undefined) return respError(next, Code.FAIL)
      if (userSession2.roomId == "") return respError(next, Code.GAME.USER_NO_EXIST_IN_GAME)
      if (userSession1.roomId != "") return respError(next, Code.GAME.ALREADY_JOIN_GAME)
      const info = {shortId:session.get('shortId'),nickname:userSession1.nickname};
      this.app.get('statusService').pushByUids([ userSession2.uid ], PushEvent.onJoinFriendGame,info);
      respOK(next)
    })
  }

  /**
   * 拒绝加入房间
   * @param msg 
   * @param session 
   * @param next 
   */
  refuseJoinGame(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
				shortId: Joi.number().required()
			}, next);
      if (!validate) return;
      const core = this.app.components.core as CoreComponent;
      const [userSession1, userSession2] = await Promise.all([
        core.container.userCache.findUserSession(session.get('shortId')),
        core.container.userCache.findUserSession(msg.shortId)
      ])
      if (userSession1 == undefined || userSession2 == undefined) return respError(next, Code.NO_EXIST_USER)
      const info = {shortId:session.get('shortId'),nickname:userSession1.nickname};
      this.app.get('statusService').pushByUids([ userSession2.uid ], PushEvent.onRefuseJoinGame, info);
      respOK(next)
    })
  }

  /**
   * 同意加入房间
   * @param msg 
   * @param session 
   * @param next 
   */
  agreeJoinGame(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
				shortId: Joi.number().required()
			}, next);
      if (!validate) return;
      const core = this.app.components.core as CoreComponent;
      const [userSession1, userSession2] = await Promise.all([
        core.container.userCache.findUserSession(session.get('shortId')),
        core.container.userCache.findUserSession(msg.shortId)
      ])
      if (userSession1 == undefined || userSession2 == undefined) return respError(next, Code.NO_EXIST_USER)
      const info = {shortId:session.get('shortId'),nickname:userSession1.nickname,roomId:userSession1.roomId};
      this.app.get('statusService').pushByUids([ userSession2.uid ], PushEvent.onAgreeJoinGame, info);
      respOK(next)
    })
  }


  //##############################################################################################
  //#################################### 下面为好友部分 ###########################################
  //##############################################################################################
  /**
   * 加好友
   * @param msg 
   * @param session 
   * @param next 
   */
  addFriend(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
				shortId: Joi.number().required()
			}, next);
      if (!validate) return;
      
      const core = this.app.components.core as CoreComponent;
      const [userSession1, userSession2] = await Promise.all([
        core.container.userCache.findUserSession(session.get('shortId')),
        core.container.userCache.findUserSession(msg.shortId)
      ])
      if (userSession1 == undefined || userSession2 == undefined) return respError(next, Code.NO_EXIST_USER);
      const result = await FriendService.addFriend(session.uid,userSession2.uid);
      if(result == null) return respError(next,Code.ERROR);
      const info = _.pick(userSession1, ['uid','nickname','sex','headimgurl','status']);
      info.shortId = session.get('shortId');
      this.app.get('statusService').pushByUids([ userSession2.uid ], PushEvent.onAddFriend, info);
      respOK(next)
    })
  }

  /**
   * 同意加为好友
   * @param msg 
   * @param session 
   * @param next 
   */
  agree(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
				shortId: Joi.number().required()
			}, next);
      if (!validate) return;
      const core = this.app.components.core as CoreComponent;
      const [userSession2] = await Promise.all([
        core.container.userCache.findUserSession(msg.shortId)
      ])
      const result = await FriendService.addFriend(session.uid,userSession2.uid);
      if(result == null) return respError(next,Code.ERROR);
      respOK(next)
    })
  }

  /**
   * 好友列表
   * @param msg 
   * @param session 
   * @param next 
   */
  getFriends(msg: any,session: any, next: (error, object) => void) {
    Raven.context(async () => {    
      const result:any = await FriendService.getFriends(session.uid);
      if(result == null) return respError(next,Code.ERROR);
      let friends = new Array();
      const core = this.app.components.core as CoreComponent;
      const length = result.length;
      for(let x=0;x<length;x++){
        const friend = core.container.userCache.findUserAndMerge(result[x].friend);
        if(friend) friends.push(friend);
      }
      const datas = await Promise.all(friends);
      respOK(next,datas);
    })
  }

  /**
   * 好友申请列表
   * @param msg 
   * @param session 
   * @param next 
   */
  getPendings(msg: any,session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const core = this.app.components.core as CoreComponent;
      const result:any = await FriendService.getPendings(session.uid);
      if(result == null) return respError(next,Code.ERROR);
      const friends = new Array();
      const length = result.length;
      for(let x=0;x<length;x++){
        const friend = FriendService._(result[x].friend);
        if(friend) friends.push(friend);
      }
      const datas = await Promise.all(friends);
      respOK(next,datas);
    })
  }

  /**
   * 删除好友
   * @param msg 
   * @param session 
   * @param next 
   */
  removeFriend(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
				shortId: Joi.number().required()
			}, next);
      if (!validate) return;
      const core = this.app.components.core as CoreComponent;
      const userSession2 = await core.container.userCache.findUserSession(msg.shortId);
      const result = await FriendService.removeFriend(session.uid,userSession2.uid);
      if(result == null) return respError(next,Code.ERROR);
      respOK(next);
    })
  }

  /**
   * 获取用户详情
   * @param msg 
   * @param session 
   * @param next 
   */
  getUserDetail(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
        shortId: Joi.number().required()
      }, next);
      if (!validate) return;
      const core = this.app.components.core as CoreComponent;
      const userSession2 = await core.container.userCache.findUserSession(msg.shortId);
      const friend = await UserModel.findUserDetail(msg.shortId);
      if (userSession2 != null) {
        userSession2.shortId = msg.shortId;
        delete userSession2.game;
        delete userSession2.sid;
        delete userSession2.roomId;
        userSession2.loc = friend.loc;
        return respOK(next, userSession2);
      };
      const detail = await core.container.userCache.addUser(friend);
      respOK(next, detail);
    })
  }


}