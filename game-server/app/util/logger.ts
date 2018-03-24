import * as winston from 'winston'
import * as config from 'config'
import 'winston-mongodb'
import * as wcf from 'winston-console-formatter'
import * as _ from 'lodash'

// "capped": true,
// "cappedSize": 100000000000,
// "cappedMax": 100000000,

const { formatter, timestamp } = wcf({types: require('yamlify-object-colors')});

const logger = new winston.Logger({
  exitOnError: false,
  levels: winston.config.syslog.levels,
  transports: [
    new (winston.transports.Console)(_.assign({formatter, timestamp}, config.get('log.console'))),
    new winston.transports.MongoDB(config.get('log.mongodb'))
  ]
})

logger.transports.mongodb.on('error', err => console.log('Error saving log entry to MongoDB'));

export default logger
