'use strict';

module.exports = appInfo => {
  const config = exports = {};

  config.mongoose = {
    url: 'mongodb://root:ddz2018NB@dds-2ze18328a3077e741.mongodb.rds.aliyuncs.com:3717,dds-2ze18328a3077e742.mongodb.rds.aliyuncs.com:3717/chess?replicaSet=mgset-5192003&authSource=admin',
    options: {
      // useMongoClient: true
    }
  }

  config.mongooseLogger = {
    debug: false,
    // custom formatter, optional
    formatter: function(meta) {
      const query = JSON.stringify(meta.query);
      const options = JSON.stringify(meta.options || {});
      return `db.getCollection('${meta.collectionName}').${meta.methodName}(${query}, ${options})`;
    },
  };

  config.redis = {
    clients: {
      session: {
        port: 6379, // Redis port
        host: 'r-2zef04229a789c04.redis.rds.aliyuncs.com', // Redis host
        password: '2zef04229a789c04:ddz2018NB',
        db: 0,
      },
      payRank: {
        port: 6379,
        host: 'r-2zef04229a789c04.redis.rds.aliyuncs.com',
        password: '2zef04229a789c04:ddz2018NB',
        db: 2,
      }
    }
  };

  config.rpcClient = {
    host: '172.17.226.116',
    port: 3003
  }

  config.rpcServer = {
    host: '172.17.226.116',
    port: 3005
  }

  config.jwt = {
    enable: true,
    secret: 'd90289cc2e92c046b5f15f9a6ef747b9',
    match: '/api',
  }

  config.keyv = {
    clients: {
      instance: {
        port: 6379, // Redis port
        host: 'r-2zef04229a789c04.redis.rds.aliyuncs.com', // Redis host
        password: '2zef04229a789c04:ddz2018NB',
        db: 0,
        namespace: 'hall',
        adapter: 'redis'
      },
      user: {
        port: 6379, // Redis port
        host: 'r-2zef04229a789c04.redis.rds.aliyuncs.com', // Redis host
        password: '2zef04229a789c04:ddz2018NB',
        db: 1,
        namespace: 'users',
        adapter: 'redis'
      }
    }
  };

  config.user = {
    coin:{
      card:10
    }
  }

  config.pingxx = {
    appid: "app_m5izjTjT40WPjPK8",
    apiKey:"sk_live_8aHef5zXH4yPCin5yPLOi9e1"
  };
  
  config.json = {
    url:'http://chess-dev.oss-cn-beijing.aliyuncs.com/data/beta/config.json'
  }

  config.sentry = {
    dsn: 'https://f021ecd9988a4b0689f12e03b8478992:e9d2e3ac80e84caa9a7ec38a81de2a0a@sentry.io/272162',
  };

  config.jpush = {
    appKey:'31dde33daa16012528fc2f33',
    appSecret:'989623144ca6b3c6a96ecfda',
  }

  return config;
};



