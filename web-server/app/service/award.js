'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const reply_1 = require("../const/reply");
class AwardService extends egg_1.Service {
    async invitedReward(id, index) {
        const model = this.ctx.model;
        let user = await model.User.findUserAwardIndex(id, index);
        console.log('user=>', user);
        if (user)
            return reply_1.default.err('已领取该奖励');
        user = await model.User.findInviter(id);
        if (user == null)
            return reply_1.default.err('没找到此用户');
        const length = user.invited.friends.length;
        console.log('user=>', user);
        if (index == 1 && length >= 1) {
            const result = await model.User.findAndUpdateInviteAward(id, 2, index);
            console.log('result=>', result);
            return reply_1.default.success({ index: index, card: 2 });
        }
        if (index == 2 && length >= 5) {
            await model.User.findAndUpdateInviteAward(id, 2, index);
            return reply_1.default.success({ index: index, card: 12 });
        }
        if (index == 3 && length >= 10) {
            await model.User.findAndUpdateInviteAward(id, 2, index);
            return reply_1.default.success({ index: index, card: 0 });
        }
        return reply_1.default.err('不符合领取条件');
    }
    async codeAward(uid, code) {
    }
}
exports.AwardService = AwardService;
module.exports = AwardService;
