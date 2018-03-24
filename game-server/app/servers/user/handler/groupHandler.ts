import * as _ from 'lodash';
import * as Raven from 'raven';
import { JoiValidate, respError, respOK } from '../../../util/helpers';
import * as Joi from 'joi';
import { CoreComponent } from '../../../components/core';
import Code from '../../../consts/code';
import PushEvent from '../../../consts/pushEvent';
import { UserModel, CuratorGroupModel } from '../../../extend/db';

export = function newHandler(app): GroupHandler {
	return new GroupHandler(app);
};

class GroupHandler {
  constructor(private app) {}

  // 创建群组
  createGroup(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
				name: Joi.string().required()
			}, next);
      if (!validate) return;
      const curatorUser = await UserModel.findCuratorByShortId(session.get('shortId'));
      if(curatorUser == null)           return respError(next, Code.NO_EXIST_USER);
      if(curatorUser.curator == null)   return respError(next,Code.USER.NOT_CURATOR);
      const groupId = await CuratorGroupModel.createCommonGroup(curatorUser._id,msg.name);
      if(groupId == null)               return respError(next,Code.ERROR);
      respOK(next,groupId);
    })
  }

  // 修改群组名称
  changeGroupName(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
        groupId: Joi.string().required(),
        name: Joi.string().required()
      }, next);
      if (!validate) return;
      const result = await CuratorGroupModel.updateGroupName(msg.groupId,msg.name); 
      if(result.nModified==0) return respError(next,Code.GROUP.NOT_EXIST_GROUP);
      respOK(next,{});
    })
  }

  // 获取群组列表
  groupList(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const core = this.app.components.core as CoreComponent;
      const [userSession1] = await Promise.all([
        core.container.userCache.findUserSession(session.get('shortId')),
      ])
      if(userSession1 == null) respError(next,Code.NO_EXIST_USER); 
      const groups = await CuratorGroupModel.getGroups(userSession1.uid);
      if(groups==null) respError(next,Code.GROUP.ERROR);
      respOK(next,groups);
    })
  }

  // 获取某群组成员列表
  memberList(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
				groupId: Joi.string().required()
			}, next);
      if (!validate) return;
      const members = await CuratorGroupModel.getGroupMembers(msg.groupId);
      if(members==null) return respError(next,Code.GROUP.NOT_EXIST_GROUP);
      respOK(next,members);
    })
  }

  // 获取某群组游戏列表
  gameList(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
				groupId: Joi.string().required()
			}, next);
      if (!validate) return;
      const coreComponent = this.app.components.core as CoreComponent
      const roomCache = coreComponent.container.roomCache
      const roomsInfo = await roomCache.getRoomsInfoByGroupId(msg.groupId)
      respOK(next,roomsInfo);
    })
  }

  // 解散群组
  destroyGroup(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
				groupId: Joi.string().required()
			}, next);
      if (!validate) return;
      const result = await CuratorGroupModel.removeGroup(msg.groupId);
      if(result == null) return respError(next,Code.GROUP.NOT_EXIST_GROUP);
      respOK(next,{});
    })
  }

  // 分配某些成员到某群组
  assignMembersToGroup(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
        uids: Joi.array().items(Joi.string()).required(),
        groupId: Joi.string().required()
			}, next);
      if (!validate) return;
      const members = await CuratorGroupModel.insertMembers(msg.groupId,msg.uids);
      if(members == null) return respError(next,Code.GROUP.NOT_EXIST_GROUP);
      respOK(next,members);
    })
  }

  // 把某些成员从群组移除
  removeMembersFromGroup(msg: any, session: any, next: (error, object) => void) {
    Raven.context(async () => {
      const validate = JoiValidate(msg, {
        uids: Joi.array().items(Joi.string()).required(),
        groupId: Joi.string().required()
			}, next);
      if (!validate) return;
      const members = await CuratorGroupModel.removeMembers(msg.groupId,msg.uids);
      if(members == null) return respError(next,Code.GROUP.NOT_EXIST_GROUP);
      respOK(next);
    })
  }

  
}