import * as _ from 'lodash'
import Game from '../game';

export interface BankerStrategy {
  getBanker(game: any): number
}

export class BankerStrategyAlwaysFirst implements BankerStrategy {
  getBanker(game: any): number {
    return 0
  }
}

export class BankerStrategyRandom implements BankerStrategy {
  getBanker(game: any): number {
    return _.random(0, game.playerCount - 1)
  }
}

export class BankerStrategySpecify implements BankerStrategy {
  banker: number = 0

  setBanker(banker: number) {
    this.banker = banker
  }

  getBanker(): number {
    return this.banker
  }
}