"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keenClient_1 = require("../../util/keenClient");
class GameKeen {
}
class FriendGameKeen {
    onGameStart() {
        keenClient_1.keenClient.recordEvent('onGameStart', {});
    }
}
exports.FriendGameKeen = FriendGameKeen;
