"use strict";
const Raven = require("raven");
const pushEvent_1 = require("../../../consts/pushEvent");
const UserRemote = function (app) {
    this.app = app;
};
UserRemote.prototype.updateConfig = function (cb) {
    Raven.context(() => {
        const core = this.app.components.core;
        core.container.dataManage.loadData();
        cb();
    });
};
UserRemote.prototype.onUserPay = function (uid, card) {
    Raven.context(() => {
        const data = { 'card': card };
        this.app.get('statusService').pushByUids([uid], pushEvent_1.default.onUserPay, data);
    });
};
module.exports = function newRemote(app) {
    return new UserRemote(app);
};
