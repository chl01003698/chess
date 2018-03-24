"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const jayson = require("jayson/promise");
class RCPClient extends egg_1.Service {
    static init(app) {
        const rpcClient = app.config.rpcClient;
        this.client = jayson.client.http({
            port: rpcClient.port,
            host: rpcClient.host
        });
    }
    static async updateConfig() {
        console.log("web-server client updateConfig");
        const response = await this.client.request('updateConfig', []);
        return response;
    }
    static async updateBroadcast() {
        console.log("web-server client updatBroadcast");
        const response = await this.client.request('updateBroadcast', []);
        return response;
    }
    static async stopServer() {
        console.log("web-server client stopServer");
        const response = await this.client.request('stopServer', []);
        return response;
    }
    static async onUserPay(uid, card) {
        console.log("web-server client onUserPay");
        const response = await this.client.request('onUserPay', [uid, card]);
        return response;
    }
}
exports.default = RCPClient;
