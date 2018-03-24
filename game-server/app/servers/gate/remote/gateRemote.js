"use strict";
const _ = require("lodash");
const GateRemote = function (app) {
    this.app = app;
};
GateRemote.prototype.random = function (args, cb) {
    const gateComponent = this.app.components.gate;
    cb(gateComponent.container.roomNumber.random());
};
GateRemote.prototype.release = function (args, cb) {
    if (_.isNumber(args) && args >= 100000 && args < 1000000) {
        const gateComponent = this.app.components.gate;
        gateComponent.container.roomNumber.release(args);
    }
    cb();
};
module.exports = function newRemote(app) {
    return new GateRemote(app);
};
