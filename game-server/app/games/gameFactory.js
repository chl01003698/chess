"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const friendSanZhangGame_1 = require("./poker/sanzhang/friendSanZhangGame");
const sanZhangGamePlayer_1 = require("./poker/sanzhang/sanZhangGamePlayer");
const friendDoudizhuGame_1 = require("./poker/doudizhu/friendDoudizhuGame");
const diZhuGamePlayer_1 = require("./poker/doudizhu/diZhuGamePlayer");
const _ = require("lodash");
const FriendMJNCGame_1 = require("./mj/sichuan/nanchong/FriendMJNCGame");
const MJNCGamePlayer_1 = require("./mj/sichuan/nanchong/MJNCGamePlayer");
const FriendMJXZGame_1 = require("./mj/sichuan/xuezhandaodi/FriendMJXZGame");
const MJXZGamePlayer_1 = require("./mj/sichuan/xuezhandaodi/MJXZGamePlayer");
class GameFactory {
    constructor() {
        // fangzuobi: Joi.boolean().default(false).optional() // 防作弊 看牌之后只能比拼
        this.topGameConfigs = new Map();
        this.gameConfigs = new Map();
    }
    initGames() {
        this.register('sanzhang', {
            GameType: friendSanZhangGame_1.default,
            GamePlayerType: sanZhangGamePlayer_1.default,
            config: ''
        });
        this.register('doudizhu', {
            GameType: friendDoudizhuGame_1.default,
            GamePlayerType: diZhuGamePlayer_1.default,
            config: ''
        });
        this.addGames('doudizhu', 'ddz3', { config: "ddz3" });
        this.addGames('doudizhu', 'sd3', { config: "sd3" });
        this.addGames('doudizhu', 'ddz2', { config: "ddz2" });
        this.addGames('doudizhu', 'ddz4', { config: "ddz4" });
        this.addGames('doudizhu', 'pz3', { config: "pz3" });
        this.addGames('doudizhu', 'lz3', { config: "lz3" });
        this.addGames('doudizhu', 'tdlz3', { config: "tdlz3" });
        this.addGames("sanzhang", "sd", { config: "sanzhang" });
        this.addGames("sanzhang", "pt", { config: "sanzhang" });
        this.addGames("sanzhang", "sanzhang", { config: "sanzhang" });
        this.addGames("sichuan", "nanchong", { config: "sichuan_nanchong", GameType: FriendMJNCGame_1.default, GamePlayerType: MJNCGamePlayer_1.default, processGameConfig: FriendMJNCGame_1.processGameConfig_MJNC });
        this.addGames("sichuan", "xuezhandaodi", { config: "sichuan_xuezhandaodi", GameType: FriendMJXZGame_1.default, GamePlayerType: MJXZGamePlayer_1.default });
    }
    register(game, createGameConfig) {
        this.topGameConfigs.set(game, createGameConfig);
    }
    addGames(game, types, createGameConfig) {
        if (!this.gameConfigs.has(game)) {
            this.gameConfigs.set(game, new Map());
        }
        if (_.isString(types)) {
            this.gameConfigs.get(game).set(types, createGameConfig);
        }
        else if (_.isArray(types)) {
            _.forEach(types, (v) => {
                this.gameConfigs.get(game).set(v, createGameConfig);
            });
        }
    }
    getConfig(game, type) {
        let topGameConfig = {};
        let gameConfig = {};
        if (this.topGameConfigs.has(game)) {
            topGameConfig = this.topGameConfigs.get(game);
        }
        if (_.isString(type) && type != "" && this.gameConfigs.has(game) && this.gameConfigs.get(game).has(type)) {
            gameConfig = this.gameConfigs.get(game).get(type);
        }
        let obj = _.assign({}, topGameConfig, gameConfig);
        return obj;
    }
}
exports.default = GameFactory;
