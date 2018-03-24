'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const user_1 = require("../cache/user");
const rankManager_1 = require("../manager/rankManager");
class InstanceService extends egg_1.Service {
    constructor() {
        super(...arguments);
        this.userCache = null;
        this.rankManager = null;
    }
    user() {
        if (this.userCache == null) {
            this.userCache = new user_1.default(this.app.redis.get('users'));
        }
        return this.userCache;
    }
    rank() {
        if (this.rankManager == null) {
            this.rankManager = new rankManager_1.default(this.app.redis.get('payRank'));
        }
        return this.rankManager;
    }
}
exports.InstanceService = InstanceService;
module.exports = InstanceService;
