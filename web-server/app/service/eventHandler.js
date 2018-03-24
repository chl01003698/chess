'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const moment = require("moment");
const elasticsearch = require('elasticsearch');
const event = {
    REGISTER: 'onRegister',
    LOGIN: 'onLogin',
    BIND_PHONE: 'onBindPhone',
    REALAUTH: 'onRealAuth',
    RECEIVE_INVITED_RWEARD: 'onReceiveInvitedReward',
    ADD_INVITED: 'onAddInvited',
    RECEIVE_MSG_REWARD: 'onReceiveMsgReward',
    USER_PAY: 'onUserPay',
    CURATOR_AWARD: 'onCuratorAward',
    AGENT_AWARD: 'onAgentAward',
    CHESSROOM_ADDUSER: 'onChessRoomAddUser' //棋牌室新增用户
};
class EventHandlerService extends egg_1.Service {
    constructor() {
        super(...arguments);
        this.client = null;
    }
    getInstance() {
        if (this.client == null) {
            const config = this.app.config.esearch;
            this.client = new elasticsearch.Client({
                host: [config]
            });
        }
        return this.client;
    }
    async runEvent(eventName, body) {
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
    async registerEvent(id, platform, device) {
        const body = {
            createAt: moment().format("YYYY-MM-DD H:m:s"),
            userId: id,
            platform: platform,
            device: device //设备
        };
        this.runEvent(event.REGISTER, body);
    }
    async loginEvent(id, platform, device) {
        const body = {
            createAt: moment().format("YYYY-MM-DD H:m:s"),
            userId: id,
            platform: platform,
            device: device //设备
        };
        this.runEvent(event.LOGIN, body);
    }
    async bindPhoneEvent(id, phone) {
        const body = {
            createAt: moment().format("YYYY-MM-DD H:m:s"),
            userId: id,
            phone: phone
        };
        this.runEvent(event.BIND_PHONE, body);
    }
    async realAuthEvent(id, sex, identity) {
        const body = {
            createAt: moment().format("YYYY-MM-DD H:m:s"),
            userId: id,
            sex: sex,
            identity: identity
        };
        this.runEvent(event.REALAUTH, body);
    }
    async receiveInvitedRewardEvent(id, type, num) {
        const body = {
            createAt: moment().format("YYYY-MM-DD H:m:s"),
            userId: id,
            type: type,
            num: num
        };
        this.runEvent(event.RECEIVE_INVITED_RWEARD, body);
    }
    async addInvitedEvent(userId, friendId) {
        const body = {
            createAt: moment().format("YYYY-MM-DD H:m:s"),
            userId: userId,
            friendId: friendId
        };
        this.runEvent(event.ADD_INVITED, body);
    }
    async receiveMsgRewardEvent(userId, msgId, type, num) {
        const body = {
            createAt: moment().format("YYYY-MM-DD H:m:s"),
            userId: userId,
            msgId: msgId,
            type: type,
            num: num
        };
        this.runEvent(event.RECEIVE_MSG_REWARD, body);
    }
    async userPayEvent(id, money, curatorParent, agentParent) {
        const body = {
            createAt: moment().format("YYYY-MM-DD H:m:s"),
            userId: id,
            money: money,
            curatorParent: curatorParent,
            agentParent: agentParent
        };
        this.runEvent(event.USER_PAY, body);
    }
    async curatorAwardEvent(money, curator) {
        const body = {
            createAt: moment().format("YYYY-MM-DD H:m:s"),
            money: money,
            curator: curator
        };
        this.runEvent(event.CURATOR_AWARD, body);
    }
    async agentAwardEvent(money, agent) {
        const body = {
            createAt: moment().format("YYYY-MM-DD H:m:s"),
            money: money,
            agent: agent
        };
        this.runEvent(event.AGENT_AWARD, body);
    }
    async chessRoomAddUserEvent(user, curator, chessRoomId, agent) {
        const body = {
            createAt: moment().format("YYYY-MM-DD H:m:s"),
            userId: user,
            curatorParent: curator,
            chessRoomId: chessRoomId,
            agentParent: agent
        };
        this.runEvent(event.CHESSROOM_ADDUSER, body);
    }
}
exports.EventHandlerService = EventHandlerService;
module.exports = EventHandlerService;
