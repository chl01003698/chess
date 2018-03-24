import * as Joi from 'joi';
import { JoiValidate, handleGame, handleGamePlayer, respError, respOK } from '../../../util/helpers';
import * as _ from 'lodash';
import Game from '../../../games/game';
import GamePlayer from '../../../games/gamePlayer';
import * as Raven from 'raven';
import Code from '../../../consts/code';
import DiZhuGame from '../../../games/poker/doudizhu/diZhuGame';
import { SanRenDiZhuAlgo } from '../../../games/poker/pokerAlgo/doudizhu/sanRenDiZhuAlgo';
import { PokerAlgo } from '../../../games/poker/pokerAlgo/pokerAlgo';

export = function newHandler(app): DiZhuHandler {
  return new DiZhuHandler(app)
}

class DiZhuHandler {
  constructor(private app) {
  }
  //明牌开始
  showCards(msg:object,session:object,next:(error,object)=>void){
    Raven.context(()=>{
      const validate = JoiValidate(msg, { multiple: Joi.number().min(1).max(5).default(1).optional(),state:Joi.number().min(1).max(3).required() }, next)
      if(!validate) return ;
      handleGamePlayer.bind(this)(msg, session, next, (game: Game, gamePlayer: GamePlayer) => {
        if (!game.fsm.is('showCards')) return respError(next, Code.GAME.STATE_ERROR)
        game.fsm.showCardsTrans(session['uid'], msg)
        next(null, { code: Code.OK })
      })
    })
  }
  //叫地主
  call(msg: object, session: object, next: (error, object) => void) {
    Raven.context(() => {
      const validate = JoiValidate(msg, { choosed : Joi.string().required() }, next) //landOwner叫地主 notCall不叫 landGrab抢地主 //"1","2","3" 叫分
      if (!validate) return
      handleGamePlayer.bind(this)(msg, session, next, (game: Game, gamePlayer: GamePlayer) => {
        if (!game.fsm.is('callZhuang')) return respError(next, Code.GAME.STATE_ERROR)
        game.fsm.callZhuangTrans(session['uid'], msg)
        next(null, { code: Code.OK })
      })
    })
  }
  //踢拉
  kickPull(msg:object,session:object,next:(error,object)=>void){
    Raven.context(()=>{
      const validate = JoiValidate(msg,{choosed:Joi.string().required()},next) //kick-->notKick  follow-->notFollow  pull--->notPull
      if(!validate) return ;
      handleGamePlayer.bind(this)(msg, session, next, (game: Game, gamePlayer: GamePlayer) => {
        if (!game.fsm.is('kickPull')) return respError(next, Code.GAME.STATE_ERROR)
        game.fsm.kickPullTrans(session['uid'], msg)
        next(null, { code: Code.OK })
      })
    })
  }
  //打牌
  input(msg: object, session: object, next: (error, object) => void) {
    Raven.context(() => {
      const validate = JoiValidate(msg, { 
        cards: Joi.array().items(Joi.string()).max(20).required(), 
        cardsType:Joi.string().default(""),
        soundRestart:Joi.boolean().default(false)
      }, next)
      console.log("====input==validate==",validate);
      if (!validate) return;
      handleGamePlayer.bind(this)(msg, session, next, (game: Game, gamePlayer: GamePlayer) => {
        if (!game.fsm.is('input')) return respError(next, Code.GAME.STATE_ERROR)
        game.fsm.inputTrans(session['uid'], msg)
        next(null, { code: Code.OK })
      })
    })
  }
  lookCards(msg:object,session:object,next:(error,object)=>void){
    Raven.context(()=>{
      const validate = JoiValidate(msg, { multiple: Joi.number().min(1).max(5).default(1).optional(),state:Joi.number().min(1).max(3).required() }, next)
      if(!validate) return ;
      handleGamePlayer.bind(this)(msg, session, next, (game:any, gamePlayer: GamePlayer) => {
        game.onShowCards(session['uid'],msg)
        next(null, { code: Code.OK })
      })
    })
  }
  getResults(msg:object,session:object,next:(error,object)=>void){
    Raven.context(()=>{
      handleGamePlayer.bind(this)(msg, session, next, (game:any, gamePlayer: GamePlayer) => {
        game.getResults(session['uid'])
        next(null, { code: Code.OK })
      })
    })
  }
}

