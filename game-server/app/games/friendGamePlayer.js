"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const friendGame_1 = require("./friendGame");
function FriendGamePlayer(Base) {
    return class extends Base {
        constructor() {
            super(...arguments);
            this.dissolveState = friendGame_1.DissolveState.None;
        }
    };
}
exports.default = FriendGamePlayer;
