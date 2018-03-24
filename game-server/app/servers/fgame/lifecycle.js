"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function beforeShutdown(app, cb) {
    const gameComponent = app.components.game;
    gameComponent.container.gameManage.onServerStop();
    setTimeout(cb, 5000);
}
exports.beforeShutdown = beforeShutdown;
let mjlib = require('../../games/mj/MJAlgo/mjlib_js/api.js');
function afterStartAll(app) {
    console.log("MJ table initing");
    mjlib.Init();
    mjlib.MTableMgr.LoadTable();
    mjlib.MTableMgr.LoadFengTable();
    console.log("MJ table init end");
    // app.rpc.game.gameRemote.onPlayerLoginAsync = util.promisify(app.rpc.game.gameRemote.onPlayerLogin) 
    // app.rpc.game.gameRemote.onPlayerLogoutAsync = util.promisify(app.rpc.game.gameRemote.onPlayerLogout)
    // app.rpc.game.gameRemote.createMatchGameAsync = util.promisify(app.rpc.game.gameRemote.createMatchGame)
    // app.rpc.game.gameRemote.clearGameAsync = util.promisify(app.rpc.game.gameRemote.clearGame)
    // app.rpc.game.gameRemote.readyMatchGameAsync = util.promisify(app.rpc.game.gameRemote.readyMatchGame) 
}
exports.afterStartAll = afterStartAll;
// afterStartAll
