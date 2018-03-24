"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const config = require("config");
require("winston-mongodb");
const wcf = require("winston-console-formatter");
const _ = require("lodash");
// "capped": true,
// "cappedSize": 100000000000,
// "cappedMax": 100000000,
const { formatter, timestamp } = wcf({ types: require('yamlify-object-colors') });
const logger = new winston.Logger({
    exitOnError: false,
    levels: winston.config.syslog.levels,
    transports: [
        new (winston.transports.Console)(_.assign({ formatter, timestamp }, config.get('log.console'))),
        new winston.transports.MongoDB(config.get('log.mongodb'))
    ]
});
logger.transports.mongodb.on('error', err => console.log('Error saving log entry to MongoDB'));
exports.default = logger;
