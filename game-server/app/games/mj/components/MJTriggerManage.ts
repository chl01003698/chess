import Game from '../../game';
import GamePlayer from '../../gamePlayer';
import * as _ from 'lodash'
import * as math from 'mathjs'
import { MJHandleManage, MJHandle } from './MJHandleManage';
import { MJActionManage } from './MJActionManage';
import MJGamePlayer from '../MJGamePlayer';
import { MJCardGroupType, MJHuType, MJScoreScopeType, MJSignType, MJHuTypeMap, MJScoreScopeTypeMap, MJSignTypeMap } from '../consts/MJEnum';
import { MJScoreData } from './MJScoreManage';
import { mjapi } from '../mjapi/triggers/MJTriggerAPI';

function getScopeGamePlayers(scope: string, game: Game, gamePlayer: MJGamePlayer) {
  let gamePlayers: Array<MJGamePlayer> = []
  if (scope == 'self') {
    gamePlayers = [gamePlayer]
  } else if (scope == 'all') {
    gamePlayers = _.concat(_.slice(game.gamePlayers, game.currentIndex, game.gamePlayers.length),
                  _.slice(game.gamePlayers, 0, game.currentIndex))
  } else if (scope == 'others') {
    gamePlayers = _.concat(_.slice(game.gamePlayers, game.currentIndex + 1, game.gamePlayers.length),
                  _.slice(game.gamePlayers, 0, game.currentIndex))
  }
  return gamePlayers
}

export class MJTriggerCache {
  handles: Array<MJHandle>
  gamePlayer: MJGamePlayer
  cardGroupType: MJCardGroupType

  constructor(handles: Array<MJHandle>, gamePlayer: MJGamePlayer, cardGroupType: MJCardGroupType) {
    this.handles = handles
    this.gamePlayer = gamePlayer
    this.cardGroupType = cardGroupType
  }
}

export class MJTrigger {
  hookExpr?
  scope: string
  actions: Array<Array<string>>
  scoreData: MJScoreData
  nextTrigger?: string
  needHook: boolean
  handleManage = new MJHandleManage()

  lastTrigger?: MJTrigger
  lastTriggerCache?: MJTriggerCache

  constructor(data) {
    if (!_.isEmpty(data.hookExpr)) {
      this.hookExpr = math.compile(data.hookExpr)
    }
    this.scope = data.scope
    this.actions = data.actions
    this.scoreData = data.score
    this.nextTrigger = data.nextTrigger
    this.needHook = _.defaultTo(data.needHook, false)
  }

  clear() {
    this.lastTrigger = undefined
    this.lastTriggerCache = undefined
    this.handleManage.clear()
  }

  evalHookExpr(params) {
    let result = true
    if (this.hookExpr != undefined && _.isFunction(this.hookExpr.eval)) {
      result = this.hookExpr.eval({mjapi, params})
    }
    return result
  }
}

export class MJTriggerManage {
  triggers = new Map<string, MJTrigger>()
  constructor(private mjactionManage: MJActionManage, triggers: any) {
    _.forEach(triggers, (v, k) => {
      this.triggers.set(k, new MJTrigger(v))
    })
  }

  triggerTest(triggerName: string, params: any) {
    if (this.triggers.has(triggerName)) {
      const { gamePlayer, game, card } = params
      const trigger = this.triggers.get(triggerName) as MJTrigger
      const gamePlayers = getScopeGamePlayers(trigger.scope, game, gamePlayer)
      const actions = trigger.actions
      if (actions.length >= gamePlayers.length) {
        let priority = gamePlayers.length
        _.forEach(gamePlayers, (v, i) => {
          const handles = this.mjactionManage.evalTestExprs(actions[i], { card, game, triggerPlayer: gamePlayer, gamePlayer:v}, --priority)
          trigger.handleManage.handles.push(...handles)
        })
        trigger.handleManage.sortHandlesByPriority()
      }
    }
  }

  triggerAction(handles: Array<MJHandle>, params) {
    this.mjactionManage.evalActionExprs(handles, params)
  }

  getTrigger(triggerName: string) {
    return this.triggers.get(triggerName)
  }

  clearTriggerHandles(triggerName?: string) {
    if (_.isEmpty(triggerName)) {
      this.triggers.forEach(v => {
        v.handleManage.clear()
      })
    } else if (this.triggers.get(triggerName!) != undefined) {
      this.triggers.get(triggerName!)!.handleManage.clear()
    }
  }
}