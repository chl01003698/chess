
import * as Joi from 'joi';
import { JoiValidate, handleGame, handleGamePlayer, respError, respOK } from '../../../util/helpers';
import * as _ from 'lodash';
import { PokerAlgo } from '../../../games/poker/pokerAlgo/pokerAlgo';
import { SanZhangAlgo } from '../../../games/poker/pokerAlgo/sanzhang/sanzhangAlgo';
import FriendGame from '../../../games/friendGame';
import SanZhangGame from '../../../games/poker/sanzhang/friendSanZhangGame';
import SanZhangGamePlayer from '../../../games/poker/sanzhang/sanZhangGamePlayer';
import Code from '../../../consts/code';


export = function newHandler(app): SanZhangHandler {
  return new SanZhangHandler(app)
}

class SanZhangHandler {
  constructor(private app) {
  }
  //玩家看牌
  checked(msg: object, session: object, next: (error, object) => void) {
    handleGamePlayer.bind(this)(msg, session, next, (game: SanZhangGame, gamePlayer) => {
      if (!(game.fsm.is('input') &&
        gamePlayer.checked == false &&
        gamePlayer.giveup == false)) return respError(next, Code.FAIL)
      game.lookCards(session["uid"]);
      respOK(next);
    })
  }
  //玩家弃牌
  giveup(msg: object, session: object, next: (error, object) => void) {
    handleGamePlayer.bind(this)(msg, session, next, (game: SanZhangGame, gamePlayer: SanZhangGamePlayer) => {
      if (!(game.fsm.is("input") && gamePlayer.giveup == false)) return next(null, { code: Code.FAIL })
      game.removeBeatPlayer(gamePlayer)
      respOK(next)
    })
  }
  getBeatPlayers(msg: object, session: object, next: (error, object) => void) {
    handleGamePlayer.bind(this)(msg, session, next, (game: SanZhangGame, gamePlayer: SanZhangGamePlayer) => {
      game.getBiPaiPlayers(session["uid"]);
      next(null, { code: Code.OK })
    })
  }
  showCards(msg: object, session: object, next: (error, object) => void) {
    handleGamePlayer.bind(this)(msg, session, next, (game: SanZhangGame, gamePlayer: SanZhangGamePlayer) => {
      game.showCards(session["uid"]);
      next(null, { code: Code.OK })
    })
  }
  gameLeave(msg: object, session: object, next: (error, object) => void) {
    handleGamePlayer.bind(this)(msg, session, next, (game: SanZhangGame, gamePlayer: SanZhangGamePlayer) => {
      game.leave(session["uid"], session);
      next(null, { code: Code.OK })
    })
  }
  peiPai(msg: object, session: object, next: (error, object) => void) {
    handleGamePlayer.bind(this)(msg, session, next, (game: SanZhangGame, gamePlayer: SanZhangGamePlayer) => {
      game.peiPai(session["uid"], msg);
      next(null, { code: Code.OK })
    })
  }
  chooseCards(msg: object, session: object, next: (error, object) => void) {
    let validate = JoiValidate(msg, {
      cards: Joi.array().required(),
    }, next);
    if (!validate) return
    handleGamePlayer.bind(this)(msg, session, next, (game: SanZhangGame, gamePlayer: SanZhangGamePlayer) => {
      game.chooseCards(session["uid"], msg);
      next(null, { code: Code.OK })
    })
  }
  //玩家跟加 比
  input(msg: object, session: object, next: (error, object) => void) {
    let validate = JoiValidate(msg, {
      type: Joi.number().min(0).max(8).required(),
      param: Joi.any().optional()
    }, next)
    if (!validate) return

    handleGamePlayer.bind(this)(msg, session, next, (game: SanZhangGame, gamePlayer: SanZhangGamePlayer) => {
      if (!(game.fsm.is('input'))) return next(null, { code: Code.GAME.STATE_ERROR })
      // if (!(gamePlayer.pkIndex == game.currentIndex)) return next(null, {code: Code.GAME.NOT_CURRENT_INDEX})
      if (!(gamePlayer.giveup == false)) return next(null, { code: Code.GAME.IS_GIVEUP })
      game.fsm.inputTrans(gamePlayer, msg)
      next(null, { code: Code.OK })
    })
  }
  getResults(msg: object, session: object, next: (error, object) => void) {
    handleGamePlayer.bind(this)(msg, session, next, (game: SanZhangGame, gamePlayer: SanZhangGamePlayer) => {
      game.getResults(session["uid"]);
      next(null, { code: Code.OK })
    })
  }
}
