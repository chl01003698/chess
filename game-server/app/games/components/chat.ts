
import { EventEmitter2 }  from 'eventemitter2'
import Channel from './channel';
import GamePlayer from '../gamePlayer';
import PushEvent from '../../consts/pushEvent';
import * as _ from 'lodash'

export default class Chat extends EventEmitter2 {
  chatRecords: Array<object>
  constructor(private channel: Channel) {
    super()
    this.chatRecords = []
  }

  chat(gamePlayer: GamePlayer, msg: object) {
    this.channel.pushMessage(PushEvent.onChat, _.assign(msg, {uid: gamePlayer.uid}))
  }

  chatText(gamePlayer: GamePlayer, text: string) {
    this.chatRecords.push({n: gamePlayer.user.nickname, t: text})
		this.channel.pushMessage(PushEvent.onChatText, { uid: gamePlayer.uid, text: text });
  }

  recentChatRecords() {
    return _.takeRight(this.chatRecords, 20)
  }
}