'use strict';
import { Service } from 'egg'
import Wechat from '../helper/wechat'
import Type from '../const/type'
import reply from '../const/reply'
import DateUtil from '../util/dateUtil'
import * as moment from 'moment';
const elasticsearch = require('elasticsearch');

const event = {
    REGISTER: 'onRegister',                          //注册
    LOGIN: 'onLogin',                                //登陆
    BIND_PHONE: 'onBindPhone',                       //绑定手机
    REALAUTH: 'onRealAuth',                          //实名认证
    RECEIVE_INVITED_RWEARD:'onReceiveInvitedReward', //领取邀请好友奖励
    ADD_INVITED:'onAddInvited',                      //邀请好友成功
    RECEIVE_MSG_REWARD:'onReceiveMsgReward',         //领取消息奖励
    USER_PAY:'onUserPay',                            //用户消费
    CURATOR_AWARD: 'onCuratorAward',                 //馆长收益
    AGENT_AWARD:'onAgentAward',                      //代理收益
    CHESSROOM_ADDUSER:'onChessRoomAddUser'           //棋牌室新增用户
}

export class EventHandlerService extends Service {
    client = null;

    getInstance(){
        if(this.client == null){
            const config = this.app.config.esearch
            this.client = new elasticsearch.Client({
                host:[config]
            });
        }
        return this.client;
    }

    async runEvent(eventName: string, body: any) {
        body['event'] = eventName;
        this.getInstance().index({
            index: 'game-server',
            type: 'game',
            body: body
        }, function (error, response) {
            // console.log('response=>',response);
            // console.log('error=>',error);
        });
    }

    async registerEvent(id:string,platform:string,device:string){
        const body = {
            createAt:moment().format("YYYY-MM-DD H:m:s"),
            userId:id,
            platform: platform, //平台
            device: device      //设备
        }
        this.runEvent(event.REGISTER, body);
    }

    async loginEvent(id:string,platform:string,device:string) {
        const body = {
            createAt:moment().format("YYYY-MM-DD H:m:s"),
            userId:id,
            platform: platform, //平台
            device: device      //设备
        }
        this.runEvent(event.LOGIN, body);
    }

    async bindPhoneEvent(id:string,phone:string){
        const body ={
            createAt:moment().format("YYYY-MM-DD H:m:s"),
            userId:id,
            phone:phone
        }
        this.runEvent(event.BIND_PHONE, body);
    }

    async realAuthEvent(id:string,sex:number,identity:string){
        const body = {
            createAt:moment().format("YYYY-MM-DD H:m:s"),
            userId:id,
            sex:sex,
            identity:identity
        }
        this.runEvent(event.REALAUTH, body);
    }

    async receiveInvitedRewardEvent(id:string,type:string,num:number){
        const body = {
            createAt:moment().format("YYYY-MM-DD H:m:s"),
            userId:id,
            type:type,
            num:num
        }
        this.runEvent(event.RECEIVE_INVITED_RWEARD, body);
    }

    async addInvitedEvent(userId:string,friendId:string){
        const body = {
            createAt:moment().format("YYYY-MM-DD H:m:s"),
            userId:userId,
            friendId:friendId
        }
        this.runEvent(event.ADD_INVITED, body);
    }

    async receiveMsgRewardEvent(userId:string,msgId:string,type:string,num:number){
        const body = {
            createAt:moment().format("YYYY-MM-DD H:m:s"),
            userId:userId,
            msgId:msgId,
            type:type,
            num:num
        }
        this.runEvent(event.RECEIVE_MSG_REWARD, body);
    }

    async userPayEvent(id:string,money:number,curatorParent:string,agentParent:string){
        const body = {
            createAt:moment().format("YYYY-MM-DD H:m:s"),
            userId:id,
            money:money,
            curatorParent:curatorParent,
            agentParent:agentParent
        }
        this.runEvent(event.USER_PAY,body);
    }

    async curatorAwardEvent(money:number,curator){
        const body = {
            createAt:moment().format("YYYY-MM-DD H:m:s"),
            money:money,
            curator:curator
        }
        this.runEvent(event.CURATOR_AWARD,body);
    }

    async agentAwardEvent(money:number,agent){
        const body = {
            createAt:moment().format("YYYY-MM-DD H:m:s"),
            money:money,
            agent:agent
        }
        this.runEvent(event.AGENT_AWARD,body);
    }

    async chessRoomAddUserEvent(user,curator,chessRoomId,agent){
        const body = {
            createAt:moment().format("YYYY-MM-DD H:m:s"),
            userId:user,
            curatorParent:curator,
            chessRoomId:chessRoomId,
            agentParent:agent
        }
        this.runEvent(event.CHESSROOM_ADDUSER,body);
    }


}

module.exports = EventHandlerService;