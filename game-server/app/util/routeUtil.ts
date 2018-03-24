import { dispatcher } from './dispatcher';
import * as _ from 'lodash'
import * as Raven from 'raven';
import { CoreComponent } from '../components/core';

export function route(type) {
  return function (session: any, msg, app, cb) {
    const servers = app.getServersByType(type);
    if (!servers || servers.length === 0) {
      cb(new Error(`can not find ${type} servers.`));
      return
    }
    const res = dispatcher(session.uid, servers);
    cb(null, res.id)
  }
}

export function randRoute(app, type) {
  const servers = app.getServersByType(type);
  if (!servers || servers.length === 0) {
    return null
  }
  return _.sample(servers)['id']
}

export function gameRoute(session: any, msg, app, cb) {
  Raven.context(async () => {
    const body = msg.args[0].body
    const serverId = session.get('gameServerId')
    if (_.isString(serverId)) {
      cb(null, serverId)
      return 
    } else if (_.isString(body.roomId)) {
      const coreComponent = app.components.core as CoreComponent
      const roomCache = coreComponent.container.roomCache
      const serverId = await roomCache.getRoomAtServerId(body.roomId)
      if (_.isString(serverId) && serverId.length > 0) {
        cb(null, serverId)
        return
      } 
    } 
    if (_.isString(session.uid) && session.uid.length > 0) {
      const servers = app.getServersByType('fgame');
      if (!servers || servers.length === 0) {
        cb(new Error('can not find game servers.'));
        return
      }
      const res = dispatcher(session.uid, servers);
      cb(null, res.id)
    } else {
      cb(new Error('can not find game servers.'));
    }
  })
}

