"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class MJOverDefault {
    check(game) {
        return _.some(game.gamePlayers, (v) => {
            return v.huCount > 0;
        });
    }
    overTemplate(game, handles) {
    }
}
class MJOverXueLiu {
    check(game) {
        return false;
    }
    overTemplate(game, handles) {
    }
}
class MJOverXueZhan {
    check(game) {
        return _.filter(game.gamePlayers, (v) => {
            return v.huCount > 0;
        }).length == game.gamePlayers.length - 1;
    }
    overTemplate(game, handles) {
        _.forEach(handles, (v) => {
            const gamePlayer = game.findPlayerByUid(v.uid);
            if (gamePlayer != null) {
                gamePlayer.over = true;
            }
        });
    }
}
exports.MJOverMap = {
    "default": MJOverDefault,
    "xueliu": MJOverXueLiu,
    "xuezhan": MJOverXueZhan
};
