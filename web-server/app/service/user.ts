'use strict';
import { Service } from 'egg';
import Wechat from '../helper/wechat';
import Type from '../const/type';
import reply from '../const/reply';
import MongooseUtil from '../util/mongooseUtil';
import * as querystring from 'querystring';
import { phone } from 'yunpian-sdk';
import type from '../const/type';
import UserCache from '../cache/user';
import JWTUtil from '../util/jwtUtil';
import KeywordManager from '../manager/keywordManager';
import CardUtil from '../util/cardUtil';
const IDValidator = require('id-validator');
const GB2260 = require('id-validator/src/GB2260');


export class UserService extends Service {
    async create(reqBody: any) {
        const code = reqBody.code;
        const platform = reqBody.platform;
        const device = reqBody.device;
        const shortId = reqBody.shortId;
        if (platform == Type.platform.WECHAT) {
            if (shortId) return await this.wechatInvite(code, shortId, device);
            return await this.wechat(code, device);
        } else if (platform == Type.platform.WECHAT_WEB) {

        } else if (platform == Type.platform.QQ) {

        } else if (platform == Type.platform.COMPANY) {
            return await this.company(code, device);
        }
    }

    async wechat(code: string, device: string) {
        const model = this.ctx.model;
        const jwt = this.app.jwt;
        const body = await Wechat.getToken(code, this.ctx, this.app.config.wechat);
        if (!body.data) {
            return body;
        }
        const info = await this.registerWechat(Type.platform.WECHAT, body.data, device);
        const userId = info.userId;
        if (!userId) {
            return reply.err('服务器繁忙请重新创建');
        }
        const token = jwt.sign({ _id: userId }, this.app.config.jwt.secret, { expiresIn: 60 * 60 * 24 * 30 });
        const user = await model.User.findAndUpdateToken(userId, token);
        if (user) {
            return reply.success(user);
        }
        return reply.err('创建失败');
    }

    async wechatInvite(code: string, shortId: number, device: string) {
        const model = this.ctx.model;
        const jwt = this.app.jwt;
        const body = await Wechat.getToken(code, this.ctx, this.app.config.wechat);
        if (!body.data) {
            return body;
        }
        const result = await this.registerWechat(Type.platform.WECHAT, body.data, device);
        const userId = result.userId;
        if (!userId) {
            return reply.err('服务器繁忙请重新创建');
        }
        const token = jwt.sign({ _id: userId }, this.app.config.jwt.secret, { expiresIn: 60 * 60 * 24 * 30 });
        const user = await model.User.findAndUpdateToken(userId, token);
        const inviter = await this.ctx.model.User.byShortId(shortId);
        if (result.new) await this.addInvited(inviter._id, user._id);
        if (user) {
            return reply.success(user);
        }
        return reply.err('创建失败');
    }

    async registerWechat(platform, info, device) {
        const model = this.ctx.model;
        const wechatUser = await model.User.findUserByUnionid(info.unionid);
        if (wechatUser) {
            return { userId: wechatUser._id, new: false };
        }
        const wechatAuth = {
            auth: true,
            openid: info.openid,
            unionid: info.unionid,
            nickname: info.nickname,
            sex: info.sex,
            language: info.language,
            province: info.province,
            city: info.city,
            country: info.country,
            headimgurl: info.headimgurl
        }

        const userField = {
            nickname: info.nickname,
            headimgurl: info.headimgurl,
            wechatAuth: wechatAuth,
            platform:   platform,
            device:     device,
            coin:       this.app.config.user.coin
        }
        let user = new model.User(userField);
        user = await user.save();
        if (user) {
            this.ctx.service.eventHandler.registerEvent(user._id, platform, device);
            return { userId: user._id, new: true };
        }
        return null;
    }

    async company(code: string, device: string) {
        const model = this.ctx.model;
        const jwt = this.app.jwt;

        let defaultUser = this.app.config.user;
        defaultUser.device = device;
        let user = new this.ctx.model.User(defaultUser);
        user = await user.save();
        const userName = user.nickname + user.shortId;
        user.nickname = userName;
        user = await user.save();
        const userId = user._id;
        const token = JWTUtil.sign(user._id, user.shortId);
        user = await model.User.findAndUpdateToken(userId, token);
        if (user) {
            return reply.success(user);
        } else {
            return reply.err('创建失败');
        }
    }

    async createByPhone(phone:string,password:string,device:string){
        const model = this.ctx.model;
        const userConfig = this.app.config.user;
        const mobileAuth = {
            'auth': true,
            'phone': phone,
            'password': password
        }
        const userField = {
            'mobileAuth': mobileAuth,
            'coin': userConfig.coin
        }
        let user = new model.User(userField);
        const userId = user._id;
        user = await user.save();

        const token = JWTUtil.sign(user._id, user.shortId);
        user = await model.User.findAndUpdateToken(userId, token);
        this.ctx.service.eventHandler.registerEvent(user._id, 'phone', device);
        return reply.success(user);
    }

    async bindPhone(id: string, phoneNumber, code: string) {
        const model = this.ctx.model;
        const validatePhone = phone(phoneNumber);
        if (!validatePhone) {
            return reply.err('手机号码校验失败');
        }
        const userInfo = await model.User.findClientUserByPhone(phoneNumber);
        if (userInfo) {
            return reply.err('手机号已绑定');
        }
        const sms = this.ctx.service.sms;
        const authSmsCode = await sms.auth(phoneNumber, code);
        if (!authSmsCode) {
            return reply.err('验证码错误');
        }
        let user = await model.User.findClientUser(id);
        if (user) {
            user.mobileAuth.phone = phoneNumber;
            user.mobileAuth.auth = true;
            await user.save();
            this.ctx.service.eventHandler.bindPhoneEvent(id, user.mobileAuth.phone);
            await this.updateNameCard(id);
            return reply.success({"mobileAuth":{"auth":true}});
        }
        return reply.err('没找到此用户');
    }

    async realName(id: string, realname: string, identity: string) {
        const model = this.ctx.model;
        let user = await model.User.findUserById(id);
        if (user) {
            const Validator = new IDValidator(GB2260);
            //JS中长数字有精度丢失问题, 请使用字符串传值
            //合法号码return true, 不合法return false
            const isId = Validator.isValid(identity);
            if (!isId) {
                return reply.err('身份证号验证失败');
            }
            const info = Validator.getInfo(identity);
            const realAuth = {
                auth: true,
                identity: identity,
                realname: realname,
                sex: info.sex,
                addrCode: info.addrCode,
                addr: info.addr,
                birth: info.birth,
                province: '',
                city: ''
            };
            user.realAuth = realAuth;
            await user.save();
            this.ctx.service.eventHandler.realAuthEvent(user._id, realAuth.sex, realAuth.identity);
            await this.updateNameCard(id);
            return reply.success(realAuth);
        }
        return reply.err('没找到此用户');
    }

    async nickname(id:string,nickname:string){
        const model = this.ctx.model;
        if(KeywordManager.hasKeyword(nickname)){
            return reply.err('昵称不合法');
        }
        const result = await model.User.updateUserNickname(id,nickname);
        if(MongooseUtil.compareResult(result) == false) return reply.err('修改失败');
        
        await this.updateNameCard(id);
        return reply.success({});
    }   

    async updateNameCard(id:string){
        const model = this.ctx.model;
        const customSelectKey = 'shortId nickname wechatNumber realAuth mobileAuth nameCard';
        const user = await model.User.findCuratorCustomSelect(id,customSelectKey);
        if(user.curator == null) return reply.success({});
        let name = user.realAuth.realname || user.nickname;
        if(name.length > 5) name = name.substring(0,5);
        const chessRoomName = name + ' 棋牌室';
        const field:any = {
            'shortId'   :user.shortId,
            'wechat'    :user.wechatNumber || ' ',
            'phone'     :user.mobileAuth.phone || ' ',
            'name'      :name,
            'chessRoom' :chessRoomName,
            'url'       :'http://www.369qipai.cn/'
        }
        await this.updateFriendCard(field);
        await this.updateCuratorCard(field);
    }

    async updateFriendCard(field:any){
        const model = this.ctx.model;
        const cardResult:any  = await CardUtil.createFriendCard(field);
        if(cardResult == null){
            return null;
        }
        const mergeResult = await CardUtil.mergeImage(cardResult);
        if(mergeResult == null){
            return null;
        }
        const cardUrl = await this.ctx.service.alioss.uploadCard(mergeResult.md5id,mergeResult.mergePath);
        if(cardUrl == null){
            return null;
        } 
        await model.User.findUpdateFriendCardUrl(field.shortId,cardUrl);
        CardUtil.deleteFile(cardResult.cardPath);
        CardUtil.deleteFile(cardResult.qrcodePath);
        CardUtil.deleteFile(mergeResult.mergePath);
        console.log('cardUrl=>',cardUrl);
        return cardUrl;
    }

    async updateCuratorCard(field:any){
        const model = this.ctx.model;
        const cardResult:any  = await CardUtil.createCuratorCard(field);
        if(cardResult == null){
            return null;
        }
        const mergeResult = await CardUtil.mergeImage(cardResult);
        if(mergeResult == null){
            return null;
        }
        const cardUrl = await this.ctx.service.alioss.uploadCard(mergeResult.md5id,mergeResult.mergePath);
        if(cardUrl == null){
            return null;
        } 
        await model.User.findUpdateCuratorCardUrl(field.shortId,cardUrl);
        CardUtil.deleteFile(cardResult.cardPath);
        CardUtil.deleteFile(cardResult.qrcodePath);
        CardUtil.deleteFile(mergeResult.mergePath);
        console.log('cardUrl=>',cardUrl);
        return cardUrl;
    }
    
    async addInvited(userId: string, friendId: string) {
        const model = this.ctx.model;
        const user = await model.User.findInvitedChildById(userId, friendId);
        if (user) return reply.err('无法重复插入邀请好友');
        const result = await model.User.addInvited(userId, friendId);
        if (MongooseUtil.compareResult(result) == false) return reply.err('添加失败,请重新添加');
        this.ctx.service.eventHandler.addInvitedEvent(userId, friendId);
        return reply.success('邀请成功');
    }

    async bindChessRoom(reqBody: any) {
        const model = this.ctx.model;
        const id = reqBody.id;
        const curatorId = reqBody.curatorId;
        const user = await model.User.findUserByIdCustomSelect(id,'_id shortId chessRoomId');
        console.log('user=>',user);
        const curatorUser = await model.User.findCuratorById(curatorId);
        if (user == null)                   return reply.err('找不到该用户');
        if (user.chessRoomId != 0)          return reply.err('该用户已绑定棋牌室');
        if (curatorUser == null)            return reply.err('找不到该馆长用户');
        if (curatorUser.curator == null)    return reply.err('该用户不是馆长');
        
        const chessRoomId = curatorUser.curator.shortId;
        const agentId = curatorUser.agentParent || '';
        const result = await model.User.bindChessRoom(id, curatorId, chessRoomId, agentId);
        this.ctx.service.eventHandler.chessRoomAddUserEvent(id, curatorId, chessRoomId, agentId);

        await model.Curator.insertChild(chessRoomId,id);
        await model.CuratorGroup.insertDefaultGroupMember(curatorId,id);

        if (MongooseUtil.compareResult(result)) return reply.success('绑定成功');
        return reply.err('系统繁忙，绑定失败，请重新绑定');
    }

}
module.exports = UserService;

