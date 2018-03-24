import Game from "./game";
import GameFactory from "./gameFactory";
import * as _ from 'lodash'
import * as schedule from 'node-schedule';
import * as config from 'config'
import * as dateFns from 'date-fns'

const autoDestroyMinutes = config.get('friendGame.autoDestroyMinutes')
export default class GameManage {
  games = new Map<string, Game>()

  constructor(private app, private gameFactory: GameFactory) {
    
  }
  
  createGame(roomId: string, createGameConfig: any, gameConfig: any, roomConfig: object, owner: any, fakeIds: Array<number> = []) {
    if (this.games[roomId] == null) {
      this.games[roomId] = new createGameConfig.GameType(this.app, roomId, gameConfig, roomConfig, createGameConfig.GamePlayerType, owner, fakeIds)
      this.games[roomId].fsm.readyTrans()
      return this.games[roomId]
    }
    return null
  }


  findGame(roomId: string): any {
    return this.games[roomId]
  }

  findGameByName(name: string): Game {
    return _.chain(this.games).values().find({gameName: name}).value()
  }

  existGame(roomId: string) {
    return (this.games[roomId] != null)
  }

  deleteGame(roomId: string) {
    delete this.games[roomId]
  }

  onServerStop() {
    _.forEach(this.games, (room) => {
      room.onServerStop()
    })

    _.forEach(this.games, (room) => {
      room.destroy()
    })
  }

  checkAutoDestroy() {
    const rule = new schedule.RecurrenceRule();
		rule.minute = new schedule.Range(0, 59, 10);
		const j = schedule.scheduleJob(rule, () => {
      
      const date = new Date()
      _.forEach(this.games, (game) => {
        if (dateFns.differenceInMinutes(date, game.initDate) >= autoDestroyMinutes) {
          game.destroy()
        }
      })
		});
  }
}