export default class GameRecord {
  roomId: string = ""
  ownerId: string = ""
  startDate?: Date
  overDate?: Date
  currentRound: number = 0
  roundCount: number = 0
  playerCount: number = 0
  players: Array<any> = []
  roomConfig: any = {}
  remainCards: Array<string|number> = []
  commands: Array<any> = []
  result: any 
  id = ""
  startGame(game) {

  }
}

const gameRecord = new GameRecord()
console.log(JSON.stringify(gameRecord))