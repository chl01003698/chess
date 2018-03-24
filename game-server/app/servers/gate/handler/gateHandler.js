"use strict";
const uuid = require("uuid");
const dispatcher_1 = require("../../../util/dispatcher");
const code_1 = require("../../../consts/code");
const helpers_1 = require("../../../util/helpers");
class GateHandler {
    constructor(app) {
        this.app = app;
    }
    queryEntry(msg, session, next) {
        const uid = uuid.v4();
        const connectors = this.app.getServersByType('connector');
        if (!connectors || connectors.length == 0) {
            next(null, code_1.default.GATE.NO_SERVER_AVAILABLE);
            return;
        }
        const res = dispatcher_1.dispatcher(uid, connectors);
        helpers_1.respOK(next, { host: res.clientHost, port: res.clientPort });
    }
}
module.exports = function newHandler(app) {
    return new GateHandler(app);
};
