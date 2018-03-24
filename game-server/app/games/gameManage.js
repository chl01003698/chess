"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const schedule = require("node-schedule");
const config = require("config");
const dateFns = require("date-fns");
const autoDestroyMinutes = config.get('friendGame.autoDestroyMinutes');
class GameManage {
    constructor(app, gameFactory) {
        this.app = app;
        this.gameFactory = gameFactory;
        this.games = new Map();
    }
    createGame(roomId, createGameConfig, gameConfig, roomConfig, owner, fakeIds = []) {
        if (this.games[roomId] == null) {
            this.games[roomId] = new createGameConfig.GameType(this.app, roomId, gameConfig, roomConfig, createGameConfig.GamePlayerType, owner, fakeIds);
            this.games[roomId].fsm.readyTrans();
            return this.games[roomId];
        }
        return null;
    }
    findGame(roomId) {
        return this.games[roomId];
    }
    findGameByName(name) {
        return _.chain(this.games).values().find({ gameName: name }).value();
    }
    existGame(roomId) {
        return (this.games[roomId] != null);
    }
    deleteGame(roomId) {
        delete this.games[roomId];
    }
    onServerStop() {
        _.forEach(this.games, (room) => {
            room.onServerStop();
        });
        _.forEach(this.games, (room) => {
            room.destroy();
        });
    }
    checkAutoDestroy() {
        const rule = new schedule.RecurrenceRule();
        rule.minute = new schedule.Range(0, 59, 10);
        const j = schedule.scheduleJob(rule, () => {
            const date = new Date();
            _.forEach(this.games, (game) => {
                if (dateFns.differenceInMinutes(date, game.initDate) >= autoDestroyMinutes) {
                    game.destroy();
                }
            });
        });
    }
}
exports.default = GameManage;
