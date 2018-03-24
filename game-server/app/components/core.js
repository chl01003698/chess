"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bottle = require("bottlejs");
const config = require("config");
const userCache_1 = require("../services/userCache");
const roomCache_1 = require("../services/roomCache");
const countManage_1 = require("../services/countManage");
const rankManage_1 = require("../services/rankManage");
const NRP = require("node-redis-pubsub");
const Keyv = require("keyv");
const dataManage_1 = require("../services/dataManage");
const gmManage_1 = require("../services/gmManage");
const helpers_1 = require("../util/helpers");
const elasticsearch = require("elasticsearch");
const redisConfig = config.get('redis');
class CoreComponent extends Bottle {
    constructor(app) {
        super();
        this.app = app;
    }
    start(cb) {
        this.factory('userCache', () => { return new userCache_1.default(); });
        this.factory('roomCache', () => {
            return new roomCache_1.default(helpers_1.createRedisClient(redisConfig.host, redisConfig.port, redisConfig.password, redisConfig.defaultDB), this.app);
        });
        this.factory('countManage', () => {
            return new countManage_1.default(helpers_1.createRedisClient(redisConfig.host, redisConfig.port, redisConfig.password, redisConfig.defaultDB));
        });
        this.factory('rankManage', () => {
            return new rankManage_1.default(helpers_1.createRedisClient(redisConfig.host, redisConfig.port, redisConfig.password, redisConfig.rankDB));
        });
        this.factory('nrp', () => {
            return new NRP({
                port: redisConfig.port,
                host: redisConfig.host,
                auth: redisConfig.password,
                scope: 'task'
            });
        });
        this.factory('keyv', () => {
            const keyv = new Keyv('', {
                port: redisConfig.port,
                host: redisConfig.host,
                password: redisConfig.password != "" ? redisConfig.password : undefined,
                db: redisConfig.defaultDB,
                adapter: 'redis'
            });
            keyv.on('error', err => console.error('Connection Error', err));
            return keyv;
        });
        this.factory('dataManage', () => {
            const dataManage = new dataManage_1.default();
            return dataManage;
        });
        this.factory('GMManage', () => {
            return new gmManage_1.default(this.app);
        });
        this.factory('esearch', () => {
            return new elasticsearch.Client({ host: [config.get('esearch')] });
        });
        process.nextTick(cb);
    }
    afterStart(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.container.dataManage.loadData();
            // this.container.dataManage.checkNewData()
            process.nextTick(cb);
        });
    }
    stop(force, cb) {
        process.nextTick(cb);
    }
}
exports.CoreComponent = CoreComponent;
function core(app) {
    return new CoreComponent(app);
}
exports.core = core;
