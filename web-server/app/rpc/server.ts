
import * as jayson from 'jayson/promise'
import RCPClient from './client';

export default class RCPServer {

    public static init(app: any) {
        const rpcServer = app.config.rpcServer
        const server = jayson.server({
            updateBroadcast: this.updateBroadcast.bind(this),
            stopServer: this.stopServer.bind(this)
        });
        server.http().listen(rpcServer.port);
    }

    static updateBroadcast() {
        console.log('web-server server updateBroadcast');
        return new Promise(function (resolve, reject) {
            RCPClient.updateBroadcast();
            resolve({ code: 0 });
        });
    }

    static stopServer() {
        console.log('web-server server stopServer');
        return new Promise(function (resolve, reject) {
            RCPClient.updateConfig();
            resolve({ code: 0 });
        });
    }


}
