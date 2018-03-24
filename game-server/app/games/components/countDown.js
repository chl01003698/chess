"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../util/moment-timer.js");
const moment = require("moment");
const _ = require("lodash");
const eventemitter2_1 = require("eventemitter2");
class CountDown extends eventemitter2_1.EventEmitter2 {
    constructor() {
        super(...arguments);
        this.timers = {};
    }
    register(state, seconds, callback, attr = {
        start: false
    }) {
        if (this.timers[state] != undefined) {
            this.timers[state].stop();
            delete this.timers[state];
        }
        this.timers[state] = moment.duration(seconds, "seconds")['timer'](attr, callback);
    }
    start(state) {
        if (this.timers[state] != undefined) {
            this.timers[state].start();
        }
    }
    stop(state) {
        if (this.timers[state] != undefined) {
            this.timers[state].stop();
        }
    }
    remove(state) {
        if (this.timers[state] != undefined) {
            this.timers[state].stop();
            delete this.timers[state];
        }
    }
    reset(state) {
        if (this.timers[state] != undefined) {
            this.timers[state].reset();
        }
    }
    isStopped(state) {
        return this.timers[state].isStopped();
    }
    resetAll() {
        _.forEach(this.timers, (v) => {
            v['reset']();
        });
    }
    existTime(state) {
        return this.timers[state] != undefined;
    }
    getRemainingDuration(state) {
        return this.timers[state].getRemainingDuration();
    }
}
exports.default = CountDown;
