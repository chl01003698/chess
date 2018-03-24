"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../util/helpers");
class GameESearch {
    constructor(game, esearch) {
        this.game = game;
        this.esearch = esearch;
    }
    onFriendGameCreate(user) {
        const gameConfig = this.game.gameConfig;
        const roomConfig = this.game.roomConfig;
        const gameExpend = gameConfig.gameExpend;
        const expend = gameExpend['owner'][roomConfig.expendIndex].expend;
        helpers_1.recordEvent(this.esearch, 'onFriendGameCreate', {
            game: this.game.roomConfig.game,
            type: this.game.roomConfig.type,
            userId: user.id,
            card: expend,
            chessRoomId: user.chessRoomId,
            curatorParent: user.curatorParent ? user.curatorParent.toString() : "",
            agentParent: user.agentParent ? user.agentParent.toString() : ""
        });
    }
    onJoinGame(user) {
        helpers_1.recordEvent(this.esearch, 'onJoinGame', {
            game: this.game.roomConfig.game,
            type: this.game.roomConfig.type,
            userId: user.id,
            chessRoomId: user.chessRoomId,
            curatorParent: user.curatorParent ? user.curatorParent.toString() : "",
            agentParent: user.agentParent ? user.agentParent.toString() : ""
        });
    }
}
exports.GameESearch = GameESearch;
