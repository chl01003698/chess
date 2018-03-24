import * as Redis from 'ioredis';


export default class CountManage {
  readonly count_room = 'count:room'

  constructor(private redis: Redis) {

  }

  incrBy(key: string, value: number = 1) {
    this.redis.incrby(key, value)
  }

  decrBy(key: string, value: number = 1) {
    this.redis.decrby(key, value)
  }

  async get(key: string) {
    return this.redis.get(key)
  }

  async mget(keys: Array<string>) {
    return this.redis.mget(...keys)
  }
}