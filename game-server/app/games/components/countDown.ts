import '../../util/moment-timer.js'
import * as moment from 'moment'
import * as _ from 'lodash';
import { EventEmitter2 } from 'eventemitter2'

export default class CountDown extends EventEmitter2 {
  timers = {}

  register(state: string, seconds: number, callback: () => void, attr: object = {
    start: false
  }) {
    if (this.timers[state] != undefined) {
      this.timers[state].stop()
      delete this.timers[state]
    }
    this.timers[state] = moment.duration(seconds, "seconds")['timer'](attr, callback)
  }

  start(state: string) {
    if (this.timers[state] != undefined) {
      this.timers[state].start()
    }
  }

  stop(state: string) {
    if (this.timers[state] != undefined) {
      this.timers[state].stop()
    }
  }

  remove(state: string) {
    if (this.timers[state] != undefined) {
      this.timers[state].stop()
      delete this.timers[state]
    }
  }

  reset(state: string) {
    if (this.timers[state] != undefined) {
      this.timers[state].reset()
    }
  }

  isStopped(state: string) {
    return this.timers[state].isStopped()
  }

  resetAll() {
    _.forEach(this.timers, (v) => {
      v['reset']()
    })
  }

  existTime(state: string): boolean {
    return this.timers[state] != undefined;
  }

  getRemainingDuration(state: string) {
    return this.timers[state].getRemainingDuration()
  }
}
