import * as _ from 'lodash';
import * as Raven from 'raven';
import { JoiValidate, respError, respOK } from '../../../util/helpers';
import * as Joi from 'joi';
import { CoreComponent } from '../../../components/core';
import Code from '../../../consts/code';
import PushEvent from '../../../consts/pushEvent';
import { UserModel } from '../../../extend/db';
import FriendService from '../../../services/friend';

export = function newHandler(app): UserHandler {
    return new UserHandler(app);
};

class UserHandler {
    constructor(private app) { }

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

    /**
     * 绑定棋牌室
     * @param msg 
     * @param session 
     * @param next 
     */
    bindChessRoom(msg: any, session: any, next: (error, object) => void) {
        Raven.context(async () => {
            const validate = JoiValidate(msg, {
                shortId: Joi.number().required() //馆长shorId
            }, next);
            if (!validate) return;
            const user = await UserModel.findUserByShortIdCustomSelect(session.get('shortId'),'_id nickname shortId chessRoomId');
            const curatorUser = await UserModel.findCuratorByShortId(msg.shortId);
            if (user == null)                   return respError(next, Code.NO_EXIST_USER);
            if (user.chessRoomId != 0)          return respError(next, Code.USER.ALREADY_BINDCHESSROOM);
            if (curatorUser == null)            return respError(next, Code.NO_EXIST_USER);
            if (curatorUser.curator == null)    return respError(next, Code.USER.NOT_CURATOR);
            const chessRoomId = curatorUser.curator.shortId;
            const curatorId = curatorUser._id;
            const agentId = curatorUser.agentParent;
            const result = await UserModel.bindChessRoom(user._id,curatorUser._id,chessRoomId,agentId);
            if(result.nModified=0) return respError(next,Code.ERROR);
            const info = { shortId: session.get('shortId'), nickname: user.nickname };
            this.app.get('statusService').pushByUids([user._id], PushEvent.onBindChessRoom, info);
            respOK(next)
        })
    }

    /**
     * 获取用户游戏(chess)
     * @param msg 
     * @param session 
     * @param next 
     */
    getUserGame(msg: any, session: any, next: (error, object) => void){
        Raven.context(async () => {
            const core = this.app.components.core as CoreComponent;
            const [userSession1] = await Promise.all([
              core.container.userCache.findUserSession(session.get('shortId'))
            ])
            if (userSession1 == undefined) return respError(next, Code.NO_EXIST_USER)
            const selectKey = 'game.chess';
            const result = await UserModel.findUserByIdCustomSelect(userSession1.uid,selectKey);
            respOK(next,result.game);
        })
    }

    /**
     * 添加用户游戏
     * @param msg 
     * @param session 
     * @param next 
     */
    addUserGame(msg: any, session: any, next: (error, object) => void){
        Raven.context(async () => {
            const validate = JoiValidate(msg, {
                game: Joi.string().required()
            }, next);
            if (!validate) return;
            const core = this.app.components.core as CoreComponent;
            const [userSession1] = await Promise.all([
              core.container.userCache.findUserSession(session.get('shortId'))
            ])
            if (userSession1 == undefined) return respError(next, Code.NO_EXIST_USER)
            const result = await UserModel.addUserGameById(userSession1.uid,msg.game);
            if(result.nModified==0) return respError(next,Code.ERROR);
            respOK(next);
        })
    }

    /**
     * 删除用户游戏
     * @param msg 
     * @param session 
     * @param next 
     */
    removeUserGame(msg: any, session: any, next: (error, object) => void){
        Raven.context(async () => {
            const validate = JoiValidate(msg, {
                game: Joi.string().required()
            }, next);
            if (!validate) return;
            const core = this.app.components.core as CoreComponent;
            const [userSession1] = await Promise.all([
              core.container.userCache.findUserSession(session.get('shortId'))
            ])
            if (userSession1 == undefined) return respError(next, Code.NO_EXIST_USER)
            const result = await UserModel.removeUserGameById(userSession1.uid,msg.game);
            if(result.nModified==0) return respError(next,Code.ERROR);
            respOK(next);
        })
    }


}