import {EventEmitter2}  from 'eventemitter2'
import * as _ from 'lodash';
import { promisify } from 'util'
import logger from '../../util/logger';

export default class Channel extends EventEmitter2 {
  channel: any

  constructor(private app: any, private channelKey: string, private channelId: string) {
    super()
    const channelName = `${this.channelKey}:${this.channelId}`
		const channelService = this.app.get('channelService');
    this.channel = channelService.getChannel(channelName, true);
  }

  add(uid: string, sid: string) {
    const member = this.getChannel().getMember(uid) 
    if (!member) {
      this.getChannel().add(uid, sid)
    } 
  }

  leave(uid: string) {
    const member = this.getChannel().getMember(uid)
    if (member)
      this.getChannel().leave(member.uid, member.sid)
  }

  count(): number {
    return this.getChannel().getUserAmount()
  }

  getChannel(): any {
		return this.channel;
  }

  pushMessage(route: string, msg: object = {}) {
    return new Promise((resolve, reject) => {
      const channel = this.getChannel();
      if (channel.getUserAmount() == 0) return resolve()
      channel.pushMessage(route, msg, null, (error) => {
        if (error != null) {
          reject(error)
        } else {
          resolve()
        }
      });
      this.emit('onPushMessage', route, msg)
    })
  }

  pushMessageByIds(route: string, msg: any, uids: any) {
    if (_.isString(uids)) {
      uids = [uids]
    }
    const channelService = this.app.get('channelService');
    const members = <any>[]
    _.forEach(uids, (uid)=> {
      if (uid != undefined) {
        const member = this.getChannel().getMember(uid)
        if (member != undefined) {
          members.push(member)
        }
      }
    })
    
    if (members.length > 0) {
      this.emit('onPushMessageByIds', route, msg, uids)
      return new Promise((resolve, reject) => {
        channelService.pushMessageByUids(route, msg, members,
          function (error) {
            if (error != null) {
              reject(error)
            } else {
              resolve()
            }
          }
        )
      })
    }
    return Promise.resolve()
  }

  destroy() {
    this.channel.destroy()
  }
}