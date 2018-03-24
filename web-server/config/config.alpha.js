'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1515399912006_4674';

  // config.middleware = [ 'urlHandler' ]

  config.security = {
    xframe: {
      enable: false,
    },
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://localhost:8000' ],
  }

  config.cors = {
    credentials:true,
    enable: true,
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }

  config.multipart = {
    fileExtensions: [ '.apk', '.pptx', '.docx', '.csv', '.doc', '.ppt', '.pdf', '.pages', '.wav', '.mov' ], // 增加对 .apk 扩展名的支持
  }

  config.onerror = {
    errorPageUrl: '/index.html#/exception/500',
    json(err, ctx) {
      ctx.body = {
        code: ctx.response.status,
        msg: err.message
      }
      ctx.status = ctx.response.status
      ctx.service.sentry.sendErr(err);
    },
    html(err, ctx) {
      // html hander
      const msgStr = err.message.toString();
      ctx.body = '{code:'+ctx.status + ',msg: ' + msgStr + '}';
      ctx.status = err.status;
      ctx.service.sentry.sendErr(err);
    },
    notfound: {
      pageUrl: '/404.html',
    },
  }

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/chess',
    options: {
      // useMongoClient: true
      // autoReconnect: true,
      // reconnectTries: Number.MAX_VALUE,
      // bufferMaxEntries: 0,
    },
  }

  config.mongooseLogger = {
    debug: true,
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
        host: '127.0.0.1', // Redis host
        password: '',
        db: 0,
      },
      payRank: {
        port: 6379,
        host: '127.0.0.1',
        password: '',
        db: 2,
      }
    }
  };

  exports.sessionRedis = {
    name: 'session', // specific instance `session` as the session store
  };

  config.joi = {
    options: {},
    locale: {
      'zh-cn': {}
    },
    enable: true,
  };

  config.jwt = {
    enable: false,
    secret: 'd90289cc2e92c046b5f15f9a6ef747b9',
    match: '/api',
  }

  config.logrotator = {
    filesRotateByHour: [],           // list of files that will be rotated by hour
    hourDelimiter: '-',              // rotate the file by hour use specified delimiter
    filesRotateBySize: [],           // list of files that will be rotated by size
    maxFileSize: 50 * 1024 * 1024,   // Max file size to judge if any file need rotate
    maxFiles: 10,                    // pieces rotate by size
    rotateDuration: 60000,           // time interval to judge if any file need rotate
    maxDays: 31,                     // keep max days log files, default is `31`. Set `0` to keep all logs
  };

  config.rpcClient = {
    host: 'localhost',
    port: 3003
  }

  config.rpcServer = {
    host: 'localhost',
    port: 3005
  }

  config.keyv = {
    clients: {
      instance: {
        port: 6379, // Redis port
        host: '127.0.0.1', // Redis host
        password: '',
        db: 0,
        namespace: 'keyv',
        adapter: 'redis'
      },      
      user: {
        port: 6379, // Redis port
        host: '127.0.0.1', // Redis host
        password: '',
        db: 1,
        namespace: 'users',
        adapter: 'redis'
      }
    }
  };

  config.wechat = {
    appId:'wxf9013690160d0cea', 
    appSecret:'d90289cc2e92c046b5f15f9a6ef747b9',
    tokenReqUrl:'https://api.weixin.qq.com/sns/oauth2/access_token?',
    userReqUrl:'https://api.weixin.qq.com/sns/userinfo?'
  }

  config.sms = {
    key:'b38226f48679c7eab0cd6835cab0f0fc',
    minutes:1,
    template:'【369互娱】您的手机验证码是#code#'
  }

  config.user = {
    nickname:'测试',
    headimgurl:'/public/source/headimg.jpg',
    coin:{
      card:100
    }
  }

  config.pingxx = {
    appid: "app_m5izjTjT40WPjPK8",
    apiKey:"sk_test_5eHaHSnHqjL80ij5GSHqnDOC",
    resultUrl:"http://www.369qipai.cn/"
  };
  
  config.json = {
    url:'http://chess-dev.oss-cn-beijing.aliyuncs.com/data/default/config.json'
  }

  config.sentry = {
    dsn: 'https://f021ecd9988a4b0689f12e03b8478992:e9d2e3ac80e84caa9a7ec38a81de2a0a@sentry.io/272162'
  };

  config.duiba = {
    appKey:'2VMqwGhwqvhgygjXXCd6EU83t28y',
    appSecret:'469wzq1K45Z4sMynyFcLv79e7jJx'
  }

  config.jpush = {
    appKey:'31dde33daa16012528fc2f33',
    appSecret:'989623144ca6b3c6a96ecfda'
  }

  return config;
};



