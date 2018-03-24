import * as Raven from 'raven';
import { CoreComponent } from '../../../components/core';
import PushEvent from '../../../consts/pushEvent';

export = function newRemote(app): any {
  return new UserRemote​​(app)
}

const UserRemote​​ = function (this: any, app) {
  this.app = app
}

UserRemote​​.prototype.updateConfig = function (cb) {
  Raven.context(() => {
    const core = this.app.components.core as CoreComponent
    core.container.dataManage.loadData()
    cb()
  })
}

UserRemote​​.prototype.onUserPay = function (uid,card) {
  Raven.context(() => {
    const data = {'card':card};
    this.app.get('statusService').pushByUids([ uid ], PushEvent.onUserPay, data);
  })
}