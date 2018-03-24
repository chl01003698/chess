"use strict";
const Joi = require("joi");
const helpers_1 = require("../../../util/helpers");
const Raven = require("raven");
const GameRemote = function (app) {
    this.app = app;
};
GameRemote.prototype.onUserLogout = function (args, cb) {
    Raven.context(() => {
        const schema = {
            uid: Joi.string().required(),
            roomId: Joi.string().required()
        };
        const result = Joi.validate(args, schema, helpers_1.validateOptions);
        if (result.error != null) {
            throw result.error;
        }
        else {
            const uid = result.value.uid;
            const gameComponent = this.app.components.game;
            const game = gameComponent.container.gameManage.findGame(args.roomId);
            if (game != null) {
                game.onGamePlayerLogout(uid);
            }
        }
        cb();
    });
};
GameRemote.prototype.onUserLogin = function (args, cb) {
    Raven.context(() => {
        const schema = {
            uid: Joi.string().required(),
            roomId: Joi.string().required(),
            sid: Joi.string().required()
        };
        const result = Joi.validate(args, schema, helpers_1.validateOptions);
        if (result.error != null) {
            throw result.error;
        }
        else {
            const uid = args.uid;
            const gameComponent = this.app.components.game;
            const game = gameComponent.container.gameManage.findGame(args.roomId);
            if (game != null) {
                game.onGamePlayerLogin(uid, args.sid);
            }
        }
        cb();
    });
};
GameRemote.prototype.destoryGame = function (args, cb) {
    Raven.context(() => {
        let succeed = false;
        const schema = {
            roomId: Joi.string().required()
        };
        const result = Joi.validate(args, schema, helpers_1.validateOptions);
        if (result.error != null) {
            throw result.error;
        }
        else {
            const gameComponent = this.app.components.game;
            const game = gameComponent.container.gameManage.findGame(args.roomId);
            if (game != null) {
                game.destroy();
                succeed = true;
            }
        }
        cb(null, succeed);
    });
};
GameRemote.prototype.updateConfig = function (cb) {
    Raven.context(() => {
        const core = this.app.components.core;
        core.container.dataManage.loadData();
        cb();
    });
};
module.exports = function newRemote(app) {
    return new GameRemote(app);
};
