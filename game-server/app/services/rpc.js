"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jayson = require("jayson/promise");
const config = require("config");
const Raven = require("raven");
class RPC {
    constructor(app) {
        this.app = app;
        this.server = jayson.server({
            add: this.add.bind(this),
            updateConfig: this.updateConfig.bind(this),
            updateBroadcast: this.updateBroadcast.bind(this),
            stopServer: this.stopServer.bind(this),
            onUserPay: this.onUserPay.bind(this)
        });
        this.server.http().listen(config.get('rpcPort'));
    }
    add(args) {
        return new Promise(function (resolve, reject) {
            var sum = args[0] + args[1];
            resolve(sum);
        });
    }
    /**
     * 配置文件更新推送
     */
    updateConfig() {
        console.log('game-server updateConfig');
        return new Promise((resolve, reject) => {
            this.app.rpc.fgame.gameRemote.updateConfig.toServer('*', function (err, ret) {
                if (err != null) {
                    Raven.captureException(err);
                }
            });
            this.app.rpc.user.userRemote.updateConfig.toServer('*', function (err, ret) {
                if (err != null) {
                    Raven.captureException(err);
                }
            });
            this.app.rpc.connector.entryRemote.updateConfig.toServer('*', function (err, ret) {
                if (err != null) {
                    Raven.captureException(err);
                }
            });
            resolve({ code: 0 });
        });
    }
    /**
     * 跑马灯更新推送
     */
    updateBroadcast() {
        console.log('game-server updateBroadcast');
        return new Promise((resolve, reject) => {
            this.app.rpc.connector.entryRemote.updateBroadcast.toServer('*', function (err, ret) {
                if (err != null) {
                    Raven.captureException(err);
                }
            });
            resolve({ code: 0 });
        });
    }
    /**
     * 停服推送
     */
    stopServer() {
        console.log('game-server stopServer');
        return new Promise((resolve, reject) => {
            this.app.rpc.connector.entryRemote.stopServer.toServer('*', function (err, ret) {
                if (err != null) {
                    Raven.captureException(err);
                }
            });
            resolve({ code: 0 });
        });
    }
    /**
     * 用户支付成功推送
     */
    onUserPay(args) {
        console.log('game-server onUserPay');
        const uid = args[0];
        console.log('uid=>', args[0]);
        console.log('card=>', args[1]);
        return new Promise((resolve, reject) => {
            resolve({ code: 0 });
        });
    }
}
exports.default = RPC;
