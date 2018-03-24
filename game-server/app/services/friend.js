"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../extend/db");
class FriendService {
    static addFriend(senderId, toId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db_1.UserModel.requestFriend(senderId, toId, function (err, friendships) {
                    if (friendships) {
                        resolve(friendships);
                    }
                    else {
                        reject(err);
                    }
                });
            }).then((friendships) => {
                return friendships;
            }).catch((err) => {
                return null;
            });
        });
    }
    static getFriends(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db_1.UserModel.getAcceptedFriends(userId, {}, { shortId: 1, nickname: 1, headimgurl: 1, sex: 1 }, function (err, friendships) {
                    if (friendships) {
                        resolve(friendships);
                    }
                    else {
                        reject(err);
                    }
                });
            }).then((friendships) => {
                return friendships;
            }).catch((err) => {
                return null;
            });
        });
    }
    static getPendings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db_1.UserModel.getPendingFriends(userId, {}, { shortId: 1, nickname: 1, headimgurl: 1, sex: 1 }, function (err, friendships) {
                    if (friendships) {
                        resolve(friendships);
                    }
                    else {
                        reject(err);
                    }
                });
            }).then((friendships) => {
                return friendships;
            }).catch((err) => {
                return null;
            });
        });
    }
    static _(friend) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = {
                uid: friend._id,
                shortId: friend.shortId,
                headimgurl: friend.headimgurl,
                nickname: friend.nickname,
            };
            return user;
        });
    }
    static removeFriend(userId, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('user', userId, friendId);
            const user = yield db_1.UserModel.findClientUser(userId);
            const friend = yield db_1.UserModel.findClientUser(friendId);
            return new Promise((resolve, reject) => {
                db_1.UserModel.removeFriend(user, friend, function (err, friendships) {
                    if (friendships) {
                        resolve(friendships);
                    }
                    else {
                        reject(err);
                    }
                });
            }).then((friendships) => {
                return friendships;
            }).catch((err) => {
                return null;
            });
        });
    }
}
exports.default = FriendService;
