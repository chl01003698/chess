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
    notfound: {
      pageUrl: '/404.html',
    },
    all(err, ctx) {
      ctx.status = ctx.status || 500;
      ctx.body = '{code:' + ctx.status + ',msg:' + err.message + '}';
      ctx.service.sentry.sendErr(err,ctx.status);
      return;
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
    port: 4003
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
    template:'【369互娱】您的手机验证码是#code#',
    awardTemplate:'【369互娱】尊敬的用户,您的京东卡号是#cardnum#，密码是#password#，请妥善保管，祝您游戏愉快。'
  }

  config.user = {
    nickname:'测试',
    headimgurl:'/public/source/headimg.jpg',
    coin:{
      card:1000
    },
  }

  config.pingxx = {
    appid: "app_m5izjTjT40WPjPK8",
    apiKey:"sk_test_5eHaHSnHqjL80ij5GSHqnDOC",
    resultUrl:"http://www.369qipai.cn/"
  };
  
  config.json = {
    url:'http://chess-dev.oss-cn-beijing.aliyuncs.com/data/default/config.json'
  }

  config.keyword = {
    url:'http://chess-dev.oss-cn-beijing.aliyuncs.com/data/default/keyword.txt'
  }

  config.sentry = {
    dsn: 'https://f021ecd9988a4b0689f12e03b8478992:e9d2e3ac80e84caa9a7ec38a81de2a0a@sentry.io/272162'
  };

  config.esearch = {
    host:'192.168.221.38',
    auth:'elastic:changeme',
    protocol: 'http',
    port: 9200,
    log:'trace'
  }

  config.duiba = {
    appKey:'2VMqwGhwqvhgygjXXCd6EU83t28y',
    appSecret:'469wzq1K45Z4sMynyFcLv79e7jJx'
  }

  config.jpush = {
    appKey:'31dde33daa16012528fc2f33',
    appSecret:'989623144ca6b3c6a96ecfda'
  }

  config.oss = {
    client: {
        accessKeyId: 'LTAI0pAXumCVVog9',
        accessKeySecret: '6gUYu6nMYoOLjECNzyPjQMS2f9ZBHI',
        bucket: 'chess-dev',
        endpoint: 'oss-cn-beijing.aliyuncs.com',
        timeout: '60s',
        nameCardPath:'data/default/name-card/',
    },
  };
  return config;
};
// console.log('NODE_ENV=>',process.env.NODE_ENV);
// console.log('EGG_SERVER_ENV=>',process.env.EGG_SERVER_ENV);
