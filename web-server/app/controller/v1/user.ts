'use strict';
import { Controller } from 'egg'
import TypeConst from '../../const/type'
import reply from '../../const/reply'
import type from '../../const/type'
import DateUtil from '../../util/dateUtil'
import { MongooseDocument } from 'mongoose';
import MongooseUtil from '../../util/mongooseUtil';
import { phone } from 'yunpian-sdk';
import KeywordManager from '../../manager/keywordManager';


export class UserController extends Controller {
  async create() {
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      code     : Joi.string().min(3).required(),
      platform : Joi.string().min(5).required(),
      device   : Joi.string().required(),
      shortId  : Joi.number()
    }), this.ctx.request.body);
    const reqBody = this.ctx.request.body as any;
    const result = await this.ctx.service.user.create(reqBody);
    this.ctx.body = result;
  }

  async show() {
    const model = this.ctx.model;
    const Joi = this.app.Joi;
    const reqPath = this.ctx.request.path as any;
    this.ctx.validate(Joi.object().keys({
      id: Joi.string().required(),
    }), this.ctx.params);
    this.ctx.validate(Joi.object().keys({
      device: Joi.string().required()
    }), this.ctx.query);
    const query = this.ctx.query;
    const params = this.ctx.params;
    const user = await model.User.findUserById(params.id,query.device);  
    if(!DateUtil.compareDate(user.shareAward.date)){
      await model.User.resetShareAward(this.ctx.params.id);
    }
    if(user == null){
      this.ctx.body = reply.err('没有找到此用户');
      return;
    }
    if(user.block){
      this.ctx.body = reply.err('该用户被封号');
      return;
    }
    this.ctx.body = reply.success(user);
    this.ctx.service.eventHandler.loginEvent(user._id,'wechat',query.device);
  }

  async byShortId(){
    const model = this.ctx.model;
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      shortId: Joi.number().required()
    }), this.ctx.params);
    this.ctx.validate(Joi.object().keys({
      device: Joi.string().required(),
    }), this.ctx.query);
    const user = await model.User.findUserByShortId(this.ctx.params.shortId,this.ctx.query.device);
    if(!DateUtil.compareDate(user.shareAward.date)){
      await model.User.resetShareAward(this.ctx.params.id);
    }
    if(user == null){
      this.ctx.body = reply.err('没有找到此用户');
      return;
    }
    if(user.block){
      this.ctx.body = reply.err('该用户被封号');
      return;
    }
    this.ctx.body = reply.success(user);
  }

  async createByPhone(){
    const model = this.ctx.model;
    const Joi = this.app.Joi;
    const query = this.ctx.query;
    const reqBody = this.ctx.request.body as any;
    this.ctx.validate(Joi.object().keys({
      phone: Joi.string().min(11).required(),
      password: Joi.string().min(3).required(),
      smscode: Joi.number().min(3).required(),
    }), this.ctx.body);
    this.ctx.validate(Joi.object().keys({
      device: Joi.string().required()
    }), this.ctx.query);
    
    const validatePhone = phone(reqBody.phone);
    const sms = this.ctx.service.sms;
    const authSmsCode = await sms.auth(reqBody.phone, reqBody.smscode);
    if (!authSmsCode) {
      this.ctx.body = reply.err('验证码错误');
      return;
    }
    let user = await model.User.findUserByPhone(reqBody.phone);
    if(user){
      this.ctx.body = reply.err("手机号已绑定");
      return;
    }
    const result = await this.ctx.service.user.createByPhone(reqBody.phone,reqBody.password,query.device);
    this.ctx.body = result;
  }

  async loginBySmsCode(){
    const model = this.ctx.model;
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      phone: Joi.string().min(11).required(),
      smscode: Joi.string().min(3).required(),
    }), this.ctx.request.body);
    this.ctx.validate(Joi.object().keys({
      device: Joi.string().required(),
    }), this.ctx.query);
    const reqBody = this.ctx.request.body as any;
    const query = this.ctx.query;
    const validatePhone = phone(reqBody.phone);
    const sms = this.ctx.service.sms;
    const authSmsCode = await sms.auth(reqBody.phone, reqBody.smscode);
    if (!authSmsCode) {
      this.ctx.body = reply.err('验证码错误');
      return;
    }
    const user = await model.User.findUserByPhone(reqBody.phone);
    if(user){
      this.ctx.body = reply.success(user);
      if(!DateUtil.compareDate(user.shareAward.date)){
        await model.User.resetShareAward(this.ctx.params.id);
      }
      this.ctx.service.eventHandler.loginEvent(user._id,'smsCode',query.device);
      return;
    }
    this.ctx.body = reply.err('该手机号未绑定');
  }

  async loginByPasswrod(){
    const model = this.ctx.model;
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      phone: Joi.string().min(11).required(),
      password: Joi.string().min(3).required(),
    }), this.ctx.request.body);
    this.ctx.validate(Joi.object().keys({
      device: Joi.string().required()
    }), this.ctx.query);
    const reqBody = this.ctx.request.body as any;
    const query = this.ctx.query;
    const result = await model.User.findUserPhonePassword(reqBody.phone);
    if(result==null){
      this.ctx.body = reply.err('该手机号未绑定');
      return;
    }
    if(result.mobileAuth.password == reqBody.password){
      const user = await model.User.findUserByPhone(reqBody.phone);
      this.ctx.body = reply.success(user);
      if(!DateUtil.compareDate(user.shareAward.date)){
        await model.User.resetShareAward(this.ctx.params.id);
      }
      this.ctx.service.eventHandler.loginEvent(user._id,'password',query.device);
      return;
    }
    this.ctx.body = reply.err('密码错误');
  }

  async addCard(){
    const model = this.ctx.model;
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      id: Joi.string().required()
    }), this.ctx.body);
    const reqBody = this.ctx.request.body as any;
    const resutl = await model.User.updateUserCardById(reqBody.id,100);
    if(MongooseUtil.compareResult(resutl)){
      this.ctx.body = reply.success({card:100});
    }else{
      this.ctx.body = reply.err('增加失败');
    }
  }

  async bindPhone() {
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      id: Joi.string().required(),
      phone: Joi.string().min(11).required(),
      smscode: Joi.string().min(3).required(),
    }), this.ctx.request.body);
    const reqBody = this.ctx.request.body as any;
    const result = await this.ctx.service.user.bindPhone(reqBody.id, reqBody.phone, reqBody.smscode);
    this.ctx.body = result;
  }

  async realName() {
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      id: Joi.string().required(),
      realName: Joi.string().required(),
      identity: Joi.string().required()
    }), this.ctx.request.body);
    const reqBody = this.ctx.request.body as any;
    const result = await this.ctx.service.user.realName(reqBody.id, reqBody.realName, reqBody.identity);
    this.ctx.body = result;
  }

  async nickname(){
    const model = this.ctx.model;
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      id:Joi.string().required(),
      nickname: Joi.string().min(3).max(16).required()
    }), this.ctx.request.body);
    const reqBody = this.ctx.request.body as any; 
    const regExp = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]");
    const res = regExp .exec(reqBody.nickname);
    if(res){
      this.ctx.body = reply.err('昵称不合法');
      return;
    }
    const result = await this.ctx.service.user.nickname(reqBody.id,reqBody.nickname);
    this.ctx.body = result;
  }

  //地理位置
  async location(){
    const model = this.ctx.model;
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      id:Joi.string().required(),
      lat:Joi.number().required(),
      long: Joi.number().required()
    }), this.ctx.request.body);
    const reqBody = this.ctx.request.body as any; 
    const loc = {
      lat:reqBody.lat,
      long:reqBody.long
    }
    const result = await model.User.findAndUpdateLocation(reqBody.id,loc);
    if(MongooseUtil.compareResult){
      this.ctx.body = reply.success({});
    }else{
      this.ctx.body = reply.err('没找到此用户');
    }
  }

  async getInvited(){
    const model = this.ctx.model;
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      id:Joi.string().required(),
    }), this.ctx.params);
    const inviteds = await model.User.findInvitedById(this.ctx.params.id);
    if(inviteds){
      this.ctx.body = reply.success(inviteds);
    }else{
      this.ctx.body = reply.err('没找到此用户');
    }
  }

  async addInvited(){
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      userId:Joi.string().required(),
      friendId:Joi.string().required()
    }), this.ctx.request.body);
    const reqBody = this.ctx.request.body as any;
    const result = await this.ctx.service.user.addInvited(reqBody.userId,reqBody.friendId);
    this.ctx.body = result;
  }
  
  async playArea(){
    const model = this.ctx.model;
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      id:Joi.string().required(),
      playArea:Joi.string().required()
    }), this.ctx.request.body);
    const reqBody = this.ctx.request.body as any;
    const result = await model.User.updatePlayArea(reqBody.id,reqBody.playArea);
    if(result.nModified >=1){
      this.ctx.body = reply.success({});
    }else{
      this.ctx.body = reply.err('找不到此用户');
    }
  }

  async  bindChessRoom(){
    const model = this.ctx.model;
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      id:Joi.string().required(),
      curatorId:Joi.string().required()
    }), this.ctx.request.body);
    const reqBody = this.ctx.request.body as any;
    const result = await this.ctx.service.user.bindChessRoom(reqBody);
    this.ctx.body = result;
  }

  async getUserGame(){
    const model = this.ctx.model;
    const id = this.ctx.params.id;
    const selectKey = 'game.chess';
    const game = await model.User.findUserByIdCustomSelect(id,selectKey);
    if(game){
      this.ctx.body = reply.success(game);
      return;
    }
    this.ctx.body = reply.err('没找到此用户');
  }

  async addUserGame(){
    const model = this.ctx.model;
    const reqBody = this.ctx.request.body as any;
    const result = await model.User.addUserGameById(reqBody.id,reqBody.game);
    if(MongooseUtil.compareResult(result)){
      this.ctx.body = reply.success({});
      return;
    }
    this.ctx.body = reply.err('没找到此用户');
  }

  async removeUserGame(){
    const model = this.ctx.model;
    const reqBody = this.ctx.request.body as any;
    const result = await model.User.removeUserGameById(reqBody.id,reqBody.game);
    if(MongooseUtil.compareResult(result)){
      this.ctx.body = reply.success({});
      return;
    }
    this.ctx.body = reply.err('没找到此用户');
  }

  async getCuratorCard(){
    const model = this.ctx.model;
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      curatorId:Joi.string().required()
    }), this.ctx.params);

    const params = this.ctx.params;
    const customSelectKey = 'nameCard.friendCardUrl';
    const result = await model.User.findUserByIdCustomSelect(params.curatorId,customSelectKey);
    console.log('result=>',result);
    if(result == null){
      this.ctx.body = reply.err('没找到该用户');
      return;
    }
    this.ctx.body = reply.success({'cardUrl':result.nameCard.friendCardUrl});
  }

  async updateConfirm(){
    const model = this.ctx.model;
    const Joi = this.app.Joi;
    this.ctx.validate(Joi.object().keys({
      id:Joi.string().required(),
      realname:Joi.string().required(),
      identity:Joi.string().required(),
      phone:Joi.string().required()
    }), this.ctx.body);
    const reqBody = this.ctx.request.body as any;

    const regExp = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]");
    const res = regExp .exec(reqBody.realname);
    if(res){
      this.ctx.body = reply.err("真实姓名不合法");
      return;
    }
    await model.User.updateConfirm(reqBody.id,reqBody.realname,reqBody.identity,reqBody.phone);
    this.ctx.body = reply.success({});
  } 
  
  
}
module.exports = UserController;



