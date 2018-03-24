import * as Redis from 'ioredis'
import * as Joi from 'joi'
import { validateOptions } from '../util/helpers'
import * as _ from 'lodash'
import * as config from 'config';
const redisConfig = config.get('redis')
import * as Raven from 'raven'
import logger from '../util/logger';
import PushEvent from '../consts/pushEvent';
import * as Keyv from 'keyv';


export default class RoomCache {
  keyv: Keyv;
  readonly roomKeyPrefix = 'rooms'
  readonly roomPlayersKeyPrefix = 'room:players:'
  readonly roomWatchersKeyPrefix = 'room:watchers:'
  readonly roomPlayersKey = 'room:players'
  readonly playerRoomsKeyPrefix = 'player:rooms:'
  readonly groupRoomsKeyPrefix = 'group:rooms:'

  constructor(private redis: Redis, private app) {
    this.keyv = new Keyv('', {
      port: redisConfig.port,
      host: redisConfig.host,
      password: redisConfig.password != "" ? redisConfig.password : undefined,
      db: redisConfig.defaultDB,
      adapter: 'redis',
      namespace: this.roomKeyPrefix
    })
    this.keyv.on('error', err => console.error('Connection Error', err))
  }

  async createRoom(args: any) {
    try {
      const schema = {
        roomId: Joi.string().required(),
        serverId: Joi.string().required(),
        game: Joi.string().required(),
        type: Joi.string().required(),
        playerNumber: Joi.number().required(),
        watcherNumber: Joi.number().required(),
        ownerId: Joi.string().required(),
        ownerShortId: Joi.number().required(),
        currentRound: Joi.number().required(),
        playerCount: Joi.number().required(),
        state: Joi.number().default(0).required(),
        groupId: Joi.number().optional(),
        config: Joi.object().required().keys({
          type: Joi.string().required(),
          expendIndex: Joi.number().min(0).max(3).required(),
          private: Joi.boolean().optional()
        })
      }
      const result = Joi.validate(args, schema, validateOptions)
      if (result.error != null) {
        throw result.error
      }
      this.redis.lpush(`${this.playerRoomsKeyPrefix}${args.ownerId}`, args.roomId)
      if (_.isNumber(args.groupId) && args.groupId > 0) {
        this.redis.lpush(`${this.groupRoomsKeyPrefix}${args.groupId}`, args.roomId)

        // todo: 推送群组创建房间消息
      }
      this.pushRoomCreateMessage(args.ownerId, args)
      return await this.keyv.set(args['roomId'], args)
    } catch (e) {
      Raven.captureException(e);
    }
  }

  async joinRoom(args) {
    try {
      const schema = {
        roomId: Joi.string().required(),
        shortId: Joi.number().required(),
        watcher: Joi.boolean().optional()
      }
  
      const result = Joi.validate(args, schema, validateOptions)
      if (result.error != null) {
        throw result.error
      }
      const roomInfo = await this.keyv.get(args['roomId'])
      if (roomInfo != undefined) {
        if (args['watcher'] == true) {
          ++roomInfo.watcherNumber
          this.redis.sadd(`${this.roomWatchersKeyPrefix}${args['roomId']}`, args['shortId'])
        } else {
          ++roomInfo.playerNumber
          this.redis.sadd(`${this.roomPlayersKeyPrefix}${args['roomId']}`, args['shortId'])
        }
        this.keyv.set(args['roomId'], roomInfo)
        this.redis.hset(this.roomPlayersKey, args['shortId'], args['roomId'])
        this.pushRoomChangeMessage(roomInfo.ownerId, roomInfo)
      }
    } catch (error) {
      Raven.captureException(error);
    }
  }

  async leaveRoom(args: object) {
    try {
      const schema = {
        roomId: Joi.string().required(),
        shortId: Joi.number().required(),
        watcher: Joi.boolean().optional()
      }
  
      const result = Joi.validate(args, schema, validateOptions)
      if (result.error != null) {
        throw result.error
      }

      this.redis.hdel(this.roomPlayersKey, args['shortId'])
      const roomInfo = await this.keyv.get(args['roomId'])
      if (roomInfo != undefined) {
        if (args['watcher'] == true) {
          --roomInfo.watcherNumber
          this.redis.srem(`${this.roomWatchersKeyPrefix}${args['roomId']}`, args['shortId'])
        } else {
          --roomInfo.playerNumber
          this.redis.srem(`${this.roomPlayersKeyPrefix}${args['roomId']}`, args['shortId'])
        }
        this.keyv.set(args['roomId'], roomInfo)
        this.pushRoomChangeMessage(roomInfo.ownerId, roomInfo)
      }
    } catch (error) {
      Raven.captureException(error);
    }
  }

  async destroyRoom(args: object) {
    try {
      const schema = {
        roomId: Joi.string().required()
      }
  
      const result = Joi.validate(args, schema, validateOptions)
      if (result.error != null) {
        throw result.error
      }
      const roomInfo = await this.keyv.get(args['roomId'])
      if (roomInfo != undefined) {
        const members = await this.redis.smembers(`${this.roomPlayersKeyPrefix}${args['roomId']}`)
        if (_.isArray(members) && members.length > 0) {
          this.redis.hdel(this.roomPlayersKey, members)
        }

        const watchers = await this.redis.smembers(`${this.roomWatchersKeyPrefix}${args['roomId']}`)
        if (_.isArray(watchers) && watchers.length > 0) {
          this.redis.hdel(this.roomPlayersKey, watchers)
        }
        this.redis.lrem(`${this.playerRoomsKeyPrefix}${roomInfo.owner}`, 0, roomInfo.roomId)
        if (_.isNumber(roomInfo.groupId) && roomInfo.groupId > 0) {
          this.redis.lrem(`${this.groupRoomsKeyPrefix}${roomInfo.groupId}`, 0, roomInfo.roomId)

          // todo: 推送群组在线成员,游戏结束消息
        }
        
        this.keyv.delete(args['roomId'])
        this.redis.del(`${this.roomPlayersKeyPrefix}${args['roomId']}`)
        this.redis.del(`${this.roomWatchersKeyPrefix}${args['roomId']}`)
        this.pushRoomDestroy(roomInfo.ownerId, roomInfo.roomId)
      }
    } catch (error) {
      Raven.captureException(error);
    }
  }

  async getRoomInfoByRoomId(roomId: string) {
    return await this.keyv.get(roomId)
  }

  async getRoomMembersByRoomId(roomId: string) {
    const members = await this.redis.smembers(`${this.roomPlayersKeyPrefix}${roomId}`)
    return members
  }

  async getRoomAtServerId(roomId: string) {
    const result = await this.keyv.get(roomId)
    if (result != undefined) {
      return result['serverId']
    }
    return undefined
  }

  async getRoomsInfoByPlayerId(shortId: number) {
    let results: Array<any> = []
    const roomIds = await this.redis.lrange(`${this.playerRoomsKeyPrefix}${shortId}`, 0, -1)
    if (roomIds.length == 0) {
      return []
    } else {
      results = await Promise.all(roomIds.map(async (roomId) => {
        return await this.keyv.get(roomId)
      }))
    }
    return results
  }

  async getRoomsInfoByGroupId(groupId: number) {
    let results: Array<any> = []
    const roomIds = await this.redis.lrange(`${this.groupRoomsKeyPrefix}${groupId}`, 0, -1)
    if (roomIds.length == 0) {
      return []
    } else {
      results = await Promise.all(roomIds.map(async (roomId) => {
        return await this.keyv.get(roomId)
      }))
    }
    return results
  }

  async updateRoomInfo(roomId: string, object: object, needPush: boolean = true) {
    let roomInfo = await this.getRoomInfoByRoomId(roomId)
    if (roomInfo != null) {
      roomInfo = _.assign(roomInfo, object)
      this.keyv.set(roomId, roomInfo)
      if (needPush && _.isString(roomInfo.ownerId) && roomInfo.ownerId != "") {
        this.pushRoomChangeMessage(roomInfo.ownerId, roomInfo)
      }
    }
  }

  async getRoomInfoByPlayerId(shortId: number) {
    let result = null
    const roomId = await this.redis.hget(this.roomPlayersKey, shortId)
    if (_.isString(roomId) && roomId.length > 0) {
      const roomInfo = await this.keyv.get(roomId)
      if (!_.isEmpty(roomInfo)) {
        result = roomInfo
      }
    }
    return result
  }

  async existPlayerInRoom(shortId: number) {
    let result = false
    const roomId = await this.redis.hget(this.roomPlayersKey, shortId)
    if (_.isString(roomId) && roomId.length > 0) {
      result = true
    }
    return result
  }

  async getPlayerRoomCount(shortId: number) {
    return await this.redis.llen(`${this.playerRoomsKeyPrefix}${shortId}`)
  }

  async getGroupRoomCount(groupId: number) {
    return await this.redis.llen(`${this.groupRoomsKeyPrefix}${groupId}`)
  }

  pushRoomCreateMessage(ownerId, roomInfo) {
    this.app.get('statusService').pushByUids([ownerId], PushEvent.onRoomCreate, roomInfo)
  }

  pushRoomChangeMessage(ownerId, roomInfo) {
    this.app.get('statusService').pushByUids([ownerId], PushEvent.onRoomChange,
      _.omit(roomInfo, ['serverId', 'type', 'AA', 'playerCount', 'watcherNumber', 'config', 'owner', 'ownerId']))
  }

  pushRoomDestroy(ownerId, roomId) {
    this.app.get('statusService').pushByUids([ownerId], PushEvent.onRoomDestroy, { roomId: roomId })
  }
}
