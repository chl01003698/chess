import { MJHandleState, MJCardGroupType, MJHuHandleType, MJHandleMap } from '../consts/MJEnum';
import Game from '../../game';
import MJGamePlayer from '../mjGamePlayer';
import * as _ from 'lodash'

export class MJHandle {
  state: MJHandleState = MJHandleState.NONE
  uid: string
  triggerUid: string
  testData
  type: MJCardGroupType
  subType: number
  priority: number
  selectIndex: number = 0
  action: string

  constructor(action: string, uid: string, testData, type: MJCardGroupType, priority: number = type, subType: number = 0, triggerUid: string="") {
    this.action = action
    this.uid = uid
    this.triggerUid = triggerUid
    this.testData = testData
    this.type = type
    this.priority = priority
    this.subType = subType
  }

  getCard() {
    if (_.isArray(this.testData['data'])) {
      return this.testData['data'][this.selectIndex]
    }
  }
}

export class MJHandleManage {
  handles = new Array<MJHandle>()
  huType = MJHuHandleType.MULTIPLE
  sortHandlesByPriority() {
    this.handles.sort((a, b) => {
      return b.priority - a.priority
    })
  }

  canHandle(uid: string) {
    return _.some(this.handles, (v: MJHandle) => {
      return v.uid == uid && v.state == MJHandleState.NONE
    })
  }

  pushHandle(handle: MJHandle) {
    this.handles.push(handle)
  }

  selectHandle(game: Game, gamePlayer: MJGamePlayer, handleState: MJHandleState, type: MJCardGroupType, subType: number = 0, selectIndex: number = 0) {
    if (handleState == MJHandleState.CONFIRM) {
      console.log(this.handles)
      const handle = _.find(this.handles, (v) => { return v.uid == gamePlayer.uid && v.type == type && v.subType == subType})
      console.log(handle)
      if (handle != null) {
        handle.state = MJHandleState.CONFIRM
        handle.selectIndex = selectIndex
      }
    }
    else{
		  game.container.mjrulerobjManage.cancelHandle(gamePlayer, this)
    }
    this.cancelHandleByUid(gamePlayer.uid)
  }

	findHandleByTypeAndSub(uid, type, subType:number = 0){
		return _.find(this.handles, (v) => { return v.uid == uid && v.type == type && v.subType == subType })
	}
	
  findHandleResult() {
    const result = {
      state: MJHandleState.NONE,
      handles: new Array<MJHandle>(),
      type: -1
    }
    if (_.every(this.handles, (v) => { return v.state == MJHandleState.CANCEL})) {
      console.log(" xxx  1  xx")
      result.state = MJHandleState.CANCEL
    } 
    else if (this.huType == MJHuHandleType.SINGLE) {
      console.log(" xxx  2  xx")
      console.log(this.handles)
      const filterHandles = _.filter(this.handles, (v) => { return v.state != MJHandleState.CANCEL })
      console.log(filterHandles)
      const firstHandle = _.first(filterHandles)
      console.log(firstHandle)
      if (firstHandle != undefined && firstHandle.state == MJHandleState.CONFIRM) {
        result.handles.push(firstHandle)
      }
    } 
    else if (this.huType == MJHuHandleType.MULTIPLE) {
      console.log(" xxx  3  xx")
      const filterHuHandles = _.filter(this.handles, (v) => { return v.type == MJCardGroupType.HU})
      if (filterHuHandles.length == 0 || _.every(filterHuHandles, (v) => { return v.state == MJHandleState.CANCEL })) {
        const filterHandles = _.filter(this.handles, (v) => { return v.type != MJCardGroupType.HU && v.state != MJHandleState.CANCEL })
        const firstHandle = _.first(filterHandles)
        if (firstHandle != undefined && firstHandle.state == MJHandleState.CONFIRM) {
          result.handles.push(firstHandle)
        }
      } 
      else if (_.every(filterHuHandles, (v) => { return v.type == MJCardGroupType.HU && v.state != MJHandleState.NONE })) {
        result.handles = _.filter(filterHuHandles, (v) => { return v.type == MJCardGroupType.HU && v.state == MJHandleState.CONFIRM })
      }
    }

    if (result.handles.length != 0) {
        result.state = MJHandleState.CONFIRM
      result.type = result.handles[0].type
    }

    return result
  }

  cancelHandleByUid(uid: string) {
    _.forEach(this.handles, (v) => {
      if (v.uid == uid && v.state == MJHandleState.NONE) {
        v.state = MJHandleState.CANCEL
      }
    })
  }

  filterHandlesByUid(uid: string) {
    return _.filter(this.handles, (v) => { return v.uid == uid && v.state == MJHandleState.NONE})
  }

  clear() {
    this.handles = []
  }

  isEmpty() {
    return _.isEmpty(this.handles)
  }
}
