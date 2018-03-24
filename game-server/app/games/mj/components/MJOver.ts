import * as _ from 'lodash'
import MJGamePlayer from '../MJGamePlayer';
import Game from '../../game';
import { MJHandle } from './MJHandleManage';
export interface MJOver {
  check(game: any): boolean

  overTemplate(game: any, handles: Array<MJHandle>)
}

class MJOverDefault implements MJOver {
  check(game: Game): boolean {
    return _.some(game.gamePlayers, (v: MJGamePlayer) => {
      return v.huCount > 0
    })
  }

  overTemplate(game: Game, handles: Array<MJHandle>) {

  }
}

class MJOverXueLiu implements MJOver {
  check(game: Game): boolean {
    return false
  }

  overTemplate(game: Game, handles: Array<MJHandle>) {
    
  }
}

class MJOverXueZhan implements MJOver {
  check(game: Game): boolean {
    return _.filter(game.gamePlayers, (v: MJGamePlayer) => {
      return v.huCount > 0
    }).length == game.gamePlayers.length - 1
  }

  overTemplate(game: Game, handles: Array<MJHandle>) {
    _.forEach(handles, (v: MJHandle) => {
      const gamePlayer = game.findPlayerByUid(v.uid) as MJGamePlayer
      if (gamePlayer != null) {
        gamePlayer.over = true
      }
    })
  }
}

export const MJOverMap = {
  "default": MJOverDefault,
  "xueliu": MJOverXueLiu,
  "xuezhan": MJOverXueZhan
}