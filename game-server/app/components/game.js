"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bottle = require("bottlejs");
const gameFactory_1 = require("../games/gameFactory");
const gameManage_1 = require("../games/gameManage");
class GameComponent extends Bottle {
    constructor(app) {
        super();
        this.app = app;
    }
    start(cb) {
        this.factory('gameFactory', () => { return new gameFactory_1.default(); });
        this.factory('gameManage', (container) => { return new gameManage_1.default(this.app, container.gameFactory); });
        this.container.gameFactory.initGames();
        this.container.gameManage.checkAutoDestroy();
        process.nextTick(cb);
    }
    afterStart(cb) {
        process.nextTick(cb);
    }
    stop(force, cb) {
        process.nextTick(cb);
    }
}
exports.GameComponent = GameComponent;
function game(app) {
    return new GameComponent(app);
}
exports.game = game;
