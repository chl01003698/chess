import * as _ from 'lodash';

export enum PlayerStateEnum {
  None = 0,
  AGREE,
  REJECT
}

export class PlayerState {
  states: Array<object> = []
  constructor(uids: Array<string>) {
    _.forEach(uids, (v) => {
      this.states.push({uid: v, state: PlayerStateEnum.None})
    })
  }

  reset() {
    _.forEach(this.states, (v) => {
      v['state'] = PlayerStateEnum.None
      delete v['data']
    })
  }

  updateState(uid: string, state: PlayerStateEnum, data: any = undefined) {
    const findObject = _.find(this.states, {uid: uid})
    if (findObject != undefined) {
      findObject['state'] = state
      if (data != undefined) {
        findObject['data'] = data
      }
    }
  }

  getState(uid: string) {
    const findObject = _.find(this.states, {uid: uid})
    if (findObject != undefined) {
      return findObject['state']
    }
    return undefined
  }

  updateStateByIndex(index: number, state: PlayerStateEnum, data?: any) {
    if (index >= 0 && index < this.states.length) {
      this.states[index]['state'] = state
      if (data != undefined) {
        this.states[index]['data'] = data
      }
    }
  }

  isAgree(): boolean {
    return _.every(this.states, {'state': PlayerStateEnum.AGREE })
  }

  isReject(): boolean {
    return _.every(this.states, {'state': PlayerStateEnum.REJECT })
  }

  getAgreeCount(): number {
    return _.filter(this.states, {'state': PlayerStateEnum.AGREE }).length
  }

  getRejectCount(): number {
    return _.filter(this.states, {'state': PlayerStateEnum.REJECT }).length
  }

  clientInfo() {
    return this.states
  }
}

export class PlayerStateManage {
  gameStates: Map<string, PlayerState> = new Map<string, PlayerState>()

  registerState(gameState: string, uids: Array<string>) {
    this.gameStates[gameState] = new PlayerState(uids)
  }

  isStateAgree(gameState: string): boolean {
    let agree = false
    if (this.gameStates.has(gameState)) {
      agree = this.gameStates.get(gameState)!.isAgree()
    }
    return agree
  }

  isStateReject(gameState: string): boolean {
    let reject = false
    if (this.gameStates.has(gameState)) {
      reject = this.gameStates[gameState].isReject()
    }
    return reject
  }

  updateState(gameState: string, uid: string, state: PlayerStateEnum, data: any = undefined) {
    if (this.gameStates.has(gameState)) {
      this.gameStates[gameState].updateState(uid, state, data)
    }
  }

  getState(gameState: string) {
    return this.gameStates[gameState]
  }

  clientInfo(gameState: string) {
    if (this.gameStates.has(gameState)) {
      return this.gameStates[gameState].clientInfo()
    }
    return undefined
  }

  getStateByUid(gameState: string, uid: string) {
    if (this.gameStates.has(gameState)) {
      return this.gameStates[gameState].getState(uid)
    }
    return undefined
  }

  resetState(gameState: string) {
    if (this.gameStates.has(gameState)) {
      this.gameStates[gameState].reset()
    }
  }

  resetAllStates() {
    _.forEach(this.gameStates, (v) => {
      v.reset()
    })
  }
}
