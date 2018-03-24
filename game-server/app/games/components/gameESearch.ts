import { keenClient } from '../../util/keenClient';
import { recordEvent } from '../../util/helpers';
import Game from '../game';
import GamePlayer from '../gamePlayer';

export class GameESearch {
  game: Game
  esearch

  constructor(game: Game, esearch) {
    this.game = game
    this.esearch = esearch
  }

  onFriendGameCreate(user) {
    const gameConfig = this.game.gameConfig
    const roomConfig = this.game.roomConfig
    const gameExpend = gameConfig.gameExpend
    const expend = gameExpend['owner'][roomConfig.expendIndex].expend
    recordEvent(this.esearch, 'onFriendGameCreate', {
      game: this.game.roomConfig.game,
      type: this.game.roomConfig.type,
      userId: user.id,
      card: expend,
      chessRoomId: user.chessRoomId,
      curatorParent: user.curatorParent ? user.curatorParent.toString() : "",
      agentParent: user.agentParent ? user.agentParent.toString() : ""
    })
  }

  onJoinGame(user) {
    recordEvent(this.esearch, 'onJoinGame', {
      game: this.game.roomConfig.game,
      type: this.game.roomConfig.type,
      userId: user.id,
      chessRoomId: user.chessRoomId,
      curatorParent: user.curatorParent ? user.curatorParent.toString():"",
      agentParent: user.agentParent ? user.agentParent.toString() : ""
    })
  }
}

