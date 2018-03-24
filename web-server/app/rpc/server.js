"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jayson = require("jayson/promise");
const client_1 = require("./client");
class RCPServer {
    static init(app) {
        const rpcServer = app.config.rpcServer;
        const server = jayson.server({
            updateBroadcast: this.updateBroadcast.bind(this),
            stopServer: this.stopServer.bind(this)
        });
        server.http().listen(rpcServer.port);
    }
    static updateBroadcast() {
        console.log('web-server server updateBroadcast');
        return new Promise(function (resolve, reject) {
            client_1.default.updateBroadcast();
            resolve({ code: 0 });
        });
    }
    static stopServer() {
        console.log('web-server server stopServer');
        return new Promise(function (resolve, reject) {
            client_1.default.updateConfig();
            resolve({ code: 0 });
        });
    }
}
exports.default = RCPServer;
