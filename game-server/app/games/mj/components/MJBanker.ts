import * as _ from 'lodash'
import Game from '../../game';

export interface MJBanker {
  getBanker(game: Game): number
  setPaoHu(paoIndex: number, huIndex: number)
}

class MJBankerDefault implements MJBanker {
  getBanker(game: Game): number {
    return game.gamePlayers[0].index
  }
  setPaoHu(paoIndex: number, huIndex: number) { }
}

class MJBankerRandom implements MJBanker {
  getBanker(game: Game): number {
    return game.gamePlayers[_.random(0, game.gamePlayers.length - 1)].index
  }
  setPaoHu(paoIndex: number, huIndex: number) { }
}

class MJBankerSpecify implements MJBanker {
  bankerId: number = 0

  setBanker(bankerId: number) {

    this.bankerId = bankerId
  }
  setPaoHu(paoIndex: number, huIndex: number) { }

  getBanker(game: Game): number {
    return this.bankerId
  }
}

class MJBankerHu implements MJBanker {
  getBanker(game: Game): number {
    return game['huId']
  }
  setPaoHu(paoIndex: number, huIndex: number) { }
}

class MJSCNCHu implements MJBanker {
  bankerId: number = -1
  currentRound = 0
  currentHu = _.fill(new Array(4), 0)

  setPaoHu(paoIndex: number, huIndex: number) {
    this.currentHu[paoIndex] = -1;
    this.currentHu[huIndex] = 1;
  }

  getBanker(game: Game): number {
    this.currentRound++
    if (this.currentRound == 1) {
      this.bankerId = 0
    }
    else {
      let group = _.countBy(this.currentHu)
      if (group['1'] == 1) {
        this.bankerId = _.indexOf(this.currentHu, 1)
      } else if (group['1'] > 1) {
        this.bankerId = _.indexOf(this.currentHu, -1)
      } else {
        this.bankerId = game.m_banker
      }
    }
    this.currentHu = _.fill(new Array(4), 0)
    return this.bankerId
  }
}

export const MJBankerMap = {
  'default': MJBankerDefault,
  'random': MJBankerRandom,
  'specify': MJBankerSpecify,
  'hu': MJBankerHu,
  'sc_nanchong': MJSCNCHu
}

