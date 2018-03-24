"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pomelo = require("pomelo");
const sessionFilter_1 = require("./app/filter/sessionFilter");
const app = pomelo.createApp();
process.env.NODE_ENV = app.get('env');
const core_1 = require("./app/components/core");
const game_1 = require("./app/components/game");
const routeUtil_1 = require("./app/util/routeUtil");
const config = require("config");
const status = require("pomelo-status-plugin");
const Raven = require("raven");
const helpers_1 = require("./app/util/helpers");
const gate_1 = require("./app/components/gate");
const mongoose = require("mongoose");
const bluebird = require("bluebird");
const uniqueValidator = require("mongoose-unique-validator");
// import { nohm } from 'nohm'
mongoose.Promise = bluebird;
mongoose.plugin(uniqueValidator);
mongoose.connect(config.get('mongo.url'), {});
mongoose.connection.on('connected', function () {
    console.info('Mongoose default connection open to ' + config.get('mongo.url'));
});
// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.error('Mongoose default connection error: ' + err);
});
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.info('Mongoose default connection disconnected');
});
// const redisConfig = config.get('redis');
// const redisClient = createRedisClient(redisConfig.host, redisConfig.port, redisConfig.password, redisConfig.defaultDB);
// redisClient.select(redisConfig.defaultDB)
// redisClient.on('ready', () => {
// 	nohm.logError = function (err) {
// 		Raven.captureException(err);
// 	}
// 	nohm.setPublish(false);
// 	nohm.setClient(redisClient);
// })
Raven.config(config.get('raven'), { captureUnhandledRejections: true }).install();
Raven.disableConsoleAlerts();
app.set('name', 'chess');
app.configure('production|development|alpha|beta', 'gate', function () {
    const redisConfig = config.get('redis');
    const redis = helpers_1.createRedisClient(redisConfig.host, redisConfig.port, redisConfig.password, redisConfig.defaultDB);
    redis.flushdb();
    app.load(gate_1.gate);
});
app.configure(function () {
    app.set('serverConfig', {
        reloadHandlers: false
    });
    app.set('remoteConfig', {
        reloadRemotes: false,
        bufferMsg: true,
        interval: 30,
        whitelist: function (cb) {
            cb(null, []);
        }
    });
    app.set('proxyConfig', {
        timeout: 1000 * 20,
        bufferMsg: true,
        lazyConnection: true
    });
    // app.beforeStopHook(fun);
});
const heartbeat = 20 * 1000;
app.configure('production|development|alpha|beta', 'connector|gate', function () {
    app.set('connectorConfig', {
        connector: pomelo.connectors.hybridconnector,
        disconnectOnTimeout: true,
        heartbeat: heartbeat,
        timeout: heartbeat * 2,
        useDict: true,
        setNoDelay: true,
        useProtobuf: true,
        // useCrypto:true,
        handshake: function (msg, cb) {
            cb(null, { code: 200 });
        },
        blacklistFun: function (cb) {
            cb(null, []);
        }
    });
    app.enable('filter');
    app.filter(pomelo.filters.serial());
    app.filter(pomelo.filters.time());
    app.filter(pomelo.filters.timeout());
    app.before(pomelo.filters.toobusy());
    app.rpcFilter(pomelo.rpcFilters.rpcLog());
});
app.configure('production|development|alpha|beta', 'connector', function () {
    app.route('fgame', routeUtil_1.gameRoute);
    app.route('match', routeUtil_1.route('match'));
    app.route('user', routeUtil_1.route('user'));
});
app.configure('production|development|alpha|beta', 'gate|connector|fgame|user', function () {
    app.use(status, {
        status: {
            host: config.get('redis.host'),
            port: config.get('redis.port'),
            auth_pass: config.get('redis.password'),
            cleanOnStartUp: true,
            prefix: config.get('redis.prefix')
        }
    });
    app.load(core_1.core);
});
app.configure('production|development|alpha|beta', 'fgame|user', function () {
    app.before(sessionFilter_1.default());
});
app.configure('production|development|alpha|beta', 'fgame', function () {
    app.load(game_1.game);
});
app.start();
process.on('uncaughtException', function (error) {
    console.error(error);
});
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.info('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
// logger.info('test', {event: 'test', data: { tt: 'aa'}})
