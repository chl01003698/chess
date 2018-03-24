import { Service } from 'egg'
var Raven = require('raven');
Raven.config('https://f021ecd9988a4b0689f12e03b8478992:e9d2e3ac80e84caa9a7ec38a81de2a0a@sentry.io/272162').install();
// Raven.config(config.get('raven'), {captureUnhandledRejections: true}).install();
// Raven.disableConsoleAlerts();

class SentryService extends Service {
  /**
   * filter errors need to be submitted to sentry
   *
   * @param {any} err error
   * @return {boolean} true for submit, default true
   * @memberof SentryService
   */
  judgeError(err) {
    // ignore HTTP Error
    console.log('##########################err',err);
    return !(err.status && err.status > 500);
  }
  
  sendErr(err:any,status:number){
    // ignore HTTP Error
    if((status >= 500)){
      console.log('##########################err',err);
      Raven.captureException(err);
    }
  }

  // user information
  get user() {
    return this.ctx.session
  }

  get extra() {
    return {
      ip: this.ctx.ip,
      payload: this.ctx.request.body,
    };
  }

  get tags() {
    return {
      url: this.ctx.request.url,
    };
  }

}

module.exports = SentryService;