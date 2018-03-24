import DiZhuGame from './diZhuGame';
// import { SanRenDiZhuAlgorithm } from './sanrendizhu';
import FriendGame from '../../friendGame';
// import { createMultipleScore } from '../../components/scoreManage';
// import { DiZhuMultipleType } from './diZhuGame';
import DiZhuGamePlayer from './diZhuGamePlayer';
import pushEvent from '../../../consts/pushEvent';
import * as _ from 'lodash';
// import { DiZhuAlgo } from '../pokerAlgo/doudizhu/diZhuAlgo';
import { PokerAlgo, PokerCard } from '../pokerAlgo/pokerAlgo';
// import { SanRenDiZhuAlgo } from '../pokerAlgo/doudizhu/sanRenDiZhuAlgo';
export default class FriendDouDiZhuGame extends DiZhuGame(FriendGame) {
  constructor(...args: any[]) {
    super(...args);
    // this.algorithm = SanRenDiZhuAlgo
    // this.recordEvents : any = [
    //   pushEvent.dz_onShowZhuang
    // ]
  }

  onEnterOver(lifecycle, gamePlayer, arg2) {
    if (_.isObject(gamePlayer)) {
      this.winId = gamePlayer.uid
      const nextRound = this.currentRound + 1
      let finish = this.roomConfig.roundCount != undefined && nextRound >= this.roomConfig.roundCount

      const [chuntian, zhuangScore, sentScore] = this.getOverResult(gamePlayer)
      let results: any = [];
      this.gamePlayers.forEach((value: DiZhuGamePlayer|any) => {
        if (value != undefined) {
          let score = 0;
          if (value.identity == "landlord") {
            score = value.score
          } else {
            score = value.score
          }
          value.roundScore = score
          value.score += score
          value.updateWinOrLose()
          let result = {
            uid: value.uid,
            remainCards: PokerAlgo.pickCardIds(value.cards),
            roundScore: score,
            score: value.score
          };
          results.push(result);
        }
      })
      const overResult = {
        results: results,
        finish: finish,
        chuntian: chuntian
      }
      if (this['gameRecord'] != undefined) {
        this['gameRecord'].overGame(overResult)
      }

      this.container.channel.pushMessage(pushEvent.dz_onGameOver, overResult);
    }
    super.onEnterOver(lifecycle, gamePlayer, arg2)
  }

  shuffleCards() {
    if (this.roomConfig.ciji) {
      return this.shuffleCards()
    }
    return super.shuffleCards()
  }
}