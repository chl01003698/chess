import * as Raven from 'raven';
import { CoreComponent } from '../../../components/core';
import PushEvent from '../../../consts/pushEvent';

export = function newRemote(app): any {
  return new EntryRemote(app)
}

const EntryRemote = function (this: any, app) {
  this.app = app;
};

EntryRemote.prototype.updateConfig = function(cb) {
  Raven.context(()=> {
    const channelService = this.app.get('channelService');
    channelService.broadcast(PushEvent.onUpdateConfig)
    cb()
  })
}

EntryRemote.prototype.updateBroadcast = function(cb) {
  Raven.context(()=> {
    const channelService = this.app.get('channelService');
    channelService.broadcast(PushEvent.onUpdateBroadcast)
    cb()
  })
}

EntryRemote.prototype.stopServer = function(cb) {
  Raven.context(()=> {
    const channelService = this.app.get('channelService');
    channelService.broadcast(PushEvent.onStopServer)
    cb()
  })
}