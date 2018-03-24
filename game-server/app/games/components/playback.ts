import * as qiniu from 'qiniu'
import * as config from 'config';
import * as Joi from 'joi';
import { validateOptions } from '../../util/helpers';
import * as _ from 'lodash';
import GamePlayer from '../gamePlayer';
import * as generate from 'nanoid/generate'
import logger from '../../util/logger';
import * as OSS from 'ali-oss'
import * as Raven from 'raven';
import * as co from 'co'

export default class PlayBack {
  roomId: string = ""
  ownerId: string = ""
  startDate?: Date
  overDate?: Date
  currentRound: number = 0
  roundCount: number = 0
  playerCount: number = 0
  gamePlayers: Array<any> = []
  roomConfig: any = {}
  remainCards: Array<string|number> = []
  commands: Array<any> = []
  result: any 
  id = ""
  config: any = {
    events: [],
    enabled: true
  }

  constructor(config) {
    this.config = config
  }
  
  startGame(game) {
    if (this.config.enabled) {
      this.id = generate('1234567890', 11)
      this.startDate = new Date()
      _.assignIn(this, _.pick(game, ['roomId', 'roomConfig', 'currentRound', 'roundCount', 'playerCount']))
      this.ownerId = game.owner.id
    }
  }

  setPlayers(gamePlayers: Array<GamePlayer>) {
    if (this.config.enabled) {
      _.forEach(gamePlayers, (v, i) => {
        if (v != undefined) {
          this.gamePlayers[i] = v.clientInfo(true)
        } else {
          this.gamePlayers[i] = undefined
        }
      })
    }
  }

  overGame(result) {
    if (this.config.enabled) {
      this.result = result
      this.overDate = new Date()
      this.upload()
    }
  }

  pushChannelCommand(type, msg) {
    if (this.config.enabled == true && _.includes(this.config.events, type) == true) {
			this.pushCommand(type, msg)
		}
  }

  pushCommand(type, msg) {
    if (this.config.enabled) {
      this.commands.push({ type: type, msg: msg })
    }
  }

  resetData() {
    if (this.config.enabled) {
      this.roomId = ""
      this.ownerId = ""
      this.startDate = undefined
      this.overDate = undefined
      this.currentRound = 0
      this.roundCount = 0
      this.playerCount = 0
      this.gamePlayers = []
      this.roomConfig = {}
      this.remainCards= []
      this.commands = []
      this.result = undefined
      this.id = ""
    }
  }

  upload() {
    Raven.context(() => {
      if (this.config.enabled) {
        const self = this
        co(function* (this: PlayBack) {
          const client = new OSS(config.get('oss'));
          yield client.put(`record/${self.id}.json`, new Buffer(JSON.stringify(_.pick(self, [
            "roomId",
            "ownerId",
            "startDate",
            "overDate",
            "currentRound",
            "roundCount",
            "playerCount",
            "gamePlayers",
            "roomConfig",
            "remainCards",
            "commands",
            "result",
            "id"
          ]))))
          self.resetData()
        })
      }
    }) 
  }
}
