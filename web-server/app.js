"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./app/helper/config");
const keywordManager_1 = require("./app/manager/keywordManager");
const client_1 = require("./app/rpc/client");
const server_1 = require("./app/rpc/server");
module.exports = app => {
    app.beforeStart(async () => {
        await config_1.default.Instance().initLoadData();
        await keywordManager_1.default.loadKeyword();
        client_1.default.init(app);
        server_1.default.init(app);
    });
};
