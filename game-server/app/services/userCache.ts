import * as _ from 'lodash'
import Redis from 'ioredis'
import * as config from 'config';
import * as Keyv from 'keyv';
const redisConfig = config.get('redis')
const port = config.get('redis.port')
const host = config.get('redis.host')
const password = config.get('redis.password')
const db = config.get('redis.defaultDB')

export default class UserCache {
  readonly keyPrefix = 'users'
  keyv: Keyv;

  constructor() {
    this.keyv = new Keyv('', {
      port: redisConfig.port,
      host: redisConfig.host,
      password: redisConfig.password != "" ? redisConfig.password : undefined,
      db: redisConfig.defaultDB,
      adapter: 'redis',
      namespace: this.keyPrefix
    })
    this.keyv.on('error', err => console.error('Connection Error', err))
  }

  async online(user: any, userInfo) {
    const userData = await this.keyv.get(user.shortId)
    const data = {
      uid: user.id,
      nickname: user.nickname,
      sex: user.sex,
      headimgurl: user.headimgurl,
      sid: userInfo['sid'],
      ip: userInfo['ip'],
      province: userInfo['province'],
      city: userInfo['city']
    }
    if (!userData) {
      this.keyv.set(user.shortId, _.assign(data, { game: "", online: true, roomId: "", status: "idle" }))
    } else {
      userData.online = true;
      this.keyv.set(user.shortId, _.assign(userData, data))
    }
  }

  async offline(shortId: number) {
    const userInfo = await this.keyv.get(shortId)
    if (userInfo != undefined) {
      this.keyv.set(shortId, _.assign(userInfo, { online: false }))
    }
  }

  async joinGame(shortId: number, game: string, roomId: string) {
    const userInfo = await this.keyv.get(shortId)
    if (userInfo != undefined) {
      this.keyv.set(shortId, _.assign(userInfo, { game, roomId, status: 'ready' }))
    }
  }

  async startGame(shortId: number) {
    const userInfo = await this.keyv.get(shortId)
    if (userInfo != undefined) {
      this.keyv.set(shortId, _.assign(userInfo, { status: 'gaming' }))
    }
  }

  async endGame(shortId: number) {
    const userInfo = await this.keyv.get(shortId)
    if (userInfo != undefined) {
      this.keyv.set(shortId, _.assign(userInfo, { game: "", roomId: "", status: "idle" }))
    }
  }

  async updateUserSession(shortId: number, value: object) {
    const userInfo = await this.keyv.get(shortId)
    if (userInfo != undefined) {
      this.keyv.set(shortId, _.assign(userInfo, value))
    }
  }

  async findUserSession(shortId: number) {
    return await this.keyv.get(shortId)
  }

  async findUserAndMerge(friend:any){
    const data = await this.keyv.get(friend.shortId);
    if (data) {
      const info = {
        uid: data.uid,
        online: data.online,
        shortId: friend.shortId,
        headimgurl: friend.headimgurl,
        nickname: friend.nickname,
        status:data.status,
        sex:data.sex
      }
      return info;
    }
    const user = {
      uid: friend._id,
      shortId: friend.shortId,
      headimgurl: friend.headimgurl,
      nickname: friend.nickname,
      online: false,
      status: "idle",
      sex:friend.sex
    }
    return user;
  }

  async addUser(user:any){
    const data = {
      uid: user._id,
      headimgurl: user.headimgurl,
      nickname: user.nickname,
      sex: user.sex,
      online: false,
      status: "idle",
      province: [],
      city: [],
      shortId:user.shortId,
      loc:user.loc
    }
    this.keyv.set(user.shortId,data);
    return data;
  }


}
