import {UserModel} from '../extend/db'
import UserCache from './userCache'

export default class FriendService{
    
    public static async addFriend(senderId:number,toId:number){
        return new Promise((resolve, reject) => {
            UserModel.requestFriend(senderId, toId, function (err, friendships) {
                if (friendships) {
                    resolve(friendships);
                } else {
                    reject(err);
                }
            });
        }).then((friendships) => {
            return friendships;
        }).catch((err) => {
            return null;
        });
    }

    public static async getFriends(userId:string){
        return new Promise((resolve, reject) => {
            UserModel.getAcceptedFriends(userId, {}, { shortId:1, nickname: 1, headimgurl: 1 ,sex: 1 }, function (err, friendships) {
                if (friendships) {// friendships looks like: [{status: "requested", added: <Date added>, friend: user2}]
                    resolve(friendships);
                } else {
                    reject(err);
                }
            });
        }).then((friendships)=>{
            return friendships;
        }).catch((err)=>{
            return null;
        })
    }

    public static async getPendings(userId:string){
        return new Promise((resolve, reject) => {
            UserModel.getPendingFriends(userId, {}, {shortId:1, nickname: 1, headimgurl: 1 ,sex: 1 }, function (err, friendships) {
                if (friendships) {
                    resolve(friendships);
                } else {
                    reject(err);
                }
            });
        }).then((friendships) => {
            return friendships;
        }).catch((err) => {
            return null;
        });
    }

    public static async _(friend:any){
        const user = {
            uid:friend._id,
            shortId:friend.shortId,
            headimgurl:friend.headimgurl,
            nickname:friend.nickname,
        }
        return user;
    }

    public static async removeFriend(userId: string, friendId: string) {
        console.log('user', userId, friendId);
        const user = await UserModel.findClientUser(userId);
        const friend = await UserModel.findClientUser(friendId);
        return new Promise((resolve, reject) => {
            UserModel.removeFriend(user, friend, function (err, friendships) {
                if (friendships) {
                    resolve(friendships);
                } else {
                    reject(err);
                }
            });
        }).then((friendships) => {
            return friendships;
        }).catch((err) => {
            return null;
        });
    }


}

