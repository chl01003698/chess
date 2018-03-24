import * as _ from 'lodash'
import PushEvent from '../../consts/pushEvent';
import GamePlayer from '../gamePlayer';
import FriendGame from '../friendGame';
import { UserModel } from '../../extend/db';

export class RoomPay {
  payUsers: Set<string> = new Set<string>()
  constructor(protected game: FriendGame) {
    
  }

  protected async userExpend(user: any, card: number, needPush: boolean = true) {
		if (_.isNumber(card) && card != 0) {
      user = await UserModel.findUserAndUpdateCard(user.id, card)
      if (card < 0) {
        this.payUsers.add(user.id)
      }
      this.game.app.get('statusService').pushByUids([ user.id ], PushEvent.onUpdateCoin, {
        coin: user.coin,
        msg: ''
      });
    }
		return user.coin.card
  }

  pay(user?: any) {

  }

  refund() {

  }
}

export class FreeRoomPay extends RoomPay {

}

export class AARoomPay extends RoomPay {
  pay(user?: any) {
    const gameConfig = this.game.gameConfig
    const roomConfig = this.game.roomConfig
    const gameExpend = gameConfig.gameExpend;
    
    const expend = -gameExpend['AA'][roomConfig.expendIndex].expend
    if (!_.isNumber(expend)) return
    if (user != undefined) {
      this.userExpend(user, expend)
    } else {
      _.forEach(this.game.gamePlayers, (gamePlayer) => {
        if (gamePlayer != undefined) {
          this.userExpend(gamePlayer.user, expend)
        }
      })
    }
  }
}

export class OwnerRoomPay extends RoomPay {
  pay(user?: any) {
    const gameConfig = this.game.gameConfig
    const roomConfig = this.game.roomConfig
    const gameExpend = gameConfig.gameExpend;


    const expend = -gameExpend['owner'][roomConfig.expendIndex].expend
    this.userExpend(this.game.owner, expend)
  }

  refund() {
    const gameConfig = this.game.gameConfig
    const roomConfig = this.game.roomConfig
    const gameExpend = gameConfig.gameExpend;

    const expend = gameExpend['owner'][roomConfig.expendIndex].expend
    this.userExpend(this.game.owner, expend)
  }
}

export class WinnerRoomPay extends RoomPay {
  payState: boolean = false
  pay(user?: any) {
    const winnerPlayer = this.game.findWinnerPlayer()
    const gameConfig = this.game.gameConfig
    const roomConfig = this.game.roomConfig
    const gameExpend = gameConfig.gameExpend;
    const expend = -gameExpend['owner'][roomConfig.expendIndex].expend
    this.userExpend(winnerPlayer.user, expend)
    this.payState = true
  }

  refund() {

  }
}