"use strict";
const Raven = require("raven");
const pushEvent_1 = require("../../../consts/pushEvent");
const EntryRemote = function (app) {
    this.app = app;
};
EntryRemote.prototype.updateConfig = function (cb) {
    Raven.context(() => {
        const channelService = this.app.get('channelService');
        channelService.broadcast(pushEvent_1.default.onUpdateConfig);
        cb();
    });
};
EntryRemote.prototype.updateBroadcast = function (cb) {
    Raven.context(() => {
        const channelService = this.app.get('channelService');
        channelService.broadcast(pushEvent_1.default.onUpdateBroadcast);
        cb();
    });
};
EntryRemote.prototype.stopServer = function (cb) {
    Raven.context(() => {
        const channelService = this.app.get('channelService');
        channelService.broadcast(pushEvent_1.default.onStopServer);
        cb();
    });
};
module.exports = function newRemote(app) {
    return new EntryRemote(app);
};
