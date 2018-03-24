"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bottle = require("bottlejs");
const rpc_1 = require("../services/rpc");
const roomNumber_1 = require("../services/roomNumber");
class GateComponent extends Bottle {
    constructor(app) {
        super();
        this.app = app;
    }
    start(cb) {
        this.factory('rpc', () => { return new rpc_1.default(this.app); });
        const _ = this.container.rpc;
        this.service('roomNumber', roomNumber_1.default);
        process.nextTick(cb);
    }
    afterStart(cb) {
        process.nextTick(cb);
    }
    stop(force, cb) {
        process.nextTick(cb);
    }
}
exports.GateComponent = GateComponent;
function gate(app) {
    return new GateComponent(app);
}
exports.gate = gate;
