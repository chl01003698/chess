'use strict';

// had enabled by egg
 exports.static = true;

//  exports.onerror = {
//   enable: true,
//   package: 'egg-onerror'
// }

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.mongooseLogger = {
  enable: true,
  package: 'egg-mongoose-logger',
};

exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.keyv = {
  enable: true,
  package: 'egg-keyv'
}

exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};

exports.joi = {
  enable: true,
  package: 'egg-joi',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.instrument = {
  enable: true,
  package: 'egg-instrument',
};

exports.email = {
  enable: true,
  package: 'egg-mail',
};

exports.oss = {
  enable: true,
  package: 'egg-oss',
};

// exports.logrotator = {
//   enable: true,
//   package: 'egg-logrotator',
// };