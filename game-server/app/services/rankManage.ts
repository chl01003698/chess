import * as moment from 'moment'
import * as _ from 'lodash';
import * as config from 'config'
import * as Redis from 'ioredis'

// quarter 季度
// day 日
// week 周
// month 月
// year 年
// total 总 

export const tokenKey = {
  day: 'day',
  week: 'week',
  month: 'month',
  quarter: 'quarter',
  year: 'year',
  total: 'total'
}

export default class RankManage {
  constructor(private redis: Redis) {}

  formatDate(token: string, distance: any = 0): string {
    let result = ''
    if (token == 'total') {
      result = token
      return result
    }
    if (distance == 0) {
      if (token == 'day') {
        result = moment().format('YYYYMMDD')
      } else if (token == 'week') {
        result = moment().format('YYYYww')
      } else if (token == 'month') {
        result = moment().format('YYYYMM')
      } else if (token == 'year') {
        result = moment().format('YYYY')
      }
    } else if (distance > 0) {
      let tokens:any = token + 's'
      if (token == 'day') {
        result = moment().subtract(distance, tokens).format('YYYYMMDD')
      } else if (token == 'week') {
        result = moment().subtract(distance, tokens).format('YYYYww')
      } else if (token == 'month') {
        result = moment().subtract(distance, tokens).format('YYYYMM')
      } else if (token == 'year') {
        result = moment().subtract(distance, tokens).format('YYYY')
      }
    }
    return result
  }

  tokensToKeys(tokens: [string], distance: number = 0) {
    const results: Array<string> = []
    _.forEach(tokens, (v) => {
      const dateStr = this.formatDate(v, distance)
      if (dateStr != "") {
        results.push(`${v}:${dateStr}`)
      }
    })
    return results
  }

  add(keys: [string], member: string | number, score: number, tokens: [string]) {
    _.forEach(tokens, (v) => {
      const dateStr = this.formatDate(v)
      if (dateStr != "") {
        _.forEach(keys, (key) => {
          this.redis.zadd(`rank:${key}:${v}:${dateStr}`, score, member)
        })
      }
    })
  }

  addMulti(keys: [string], members: object, tokens: [string]) {
    const dateKeys = this.tokensToKeys(tokens)
    const args: Array<string> = []
    _.forEach(members, (v, k) => {
      args.push(v)
      args.push(k)
    })
    const commands: Array<Array<string>> = []
    _.forEach(keys, (key) => {
      _.forEach(dateKeys, (v) => {
        args.unshift(`rank:${key}:${v}`)
        commands.push(args)
      })
    })

    _.forEach(commands, (v) => {
      this.redis.zadd.apply(this.redis, v)
    })
  }

  getRankKey(key: string, token: string, distance: number = 0): string {
    return `rank:${key}:${token}:${this.formatDate(token, distance)}`
  }

  async count(key: string, token: string, distance: number = 0) {
    return this.redis.zcard(this.getRankKey(key, token, distance))
  }

  async countByScore(key: string, min: number, max: number, token: string, distance: number = 0) {
    return this.redis.zcount(this.getRankKey(key, token, distance), min, max)
  }

  incrBy(key: string, member: string | number, score: number, token: string) {
    this.redis.zincrby(this.getRankKey(key, token, 0), score, member)
  }

  incrByMulti(keys: [string], member: string | number, score: number, tokens: [string]) {
    _.forEach(keys, (key) => {
      _.forEach(tokens, (token) => {
        this.redis.zincrby(this.getRankKey(key, token, 0), score, member)
      })
    })
  }

  async revrange(key: string, min: number, max: number, withscores: boolean, token: string, distance: number = 0) {
    return this.redis.zrevrange(this.getRankKey(key, token, distance), min, max, withscores == true ? 'WITHSCORES': '')
  }

  async revrank(key: string, token: string, distance: number, member: number | string) {
   return this.redis.zrevrank(this.getRankKey(key, token, distance), member)
  }

  async score(key: string, token: string, distance: number, member: number | string) {
    return this.redis.zscore(this.getRankKey(key, token, distance), member)
  }
}