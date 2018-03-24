'use strict';
import { Service } from 'egg'
import reply from '../const/reply'
import UserCache from '../cache/user'
import RankManager from '../manager/rankManager'
import DataManager from '../manager/dataManager'

export class InstanceService extends Service{
    userCache : UserCache = null;
    rankManager : RankManager = null;

    user(){
        if(this.userCache == null){
            this.userCache = new UserCache(this.app.redis.get('users'));
        }
        return this.userCache;
    }
    
    rank(){
        if(this.rankManager == null){
            this.rankManager = new RankManager(this.app.redis.get('payRank'));
        }
        return this.rankManager;
    }

}
module.exports = InstanceService;