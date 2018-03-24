"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const _ = require("lodash");
// quarter 季度
// day 日
// week 周
// month 月
// year 年
// total 总 
exports.tokenKey = {
    day: 'day',
    week: 'week',
    month: 'month',
    quarter: 'quarter',
    year: 'year',
    total: 'total'
};
class RankManage {
    constructor(redis) {
        this.redis = redis;
    }
    formatDate(token, distance = 0) {
        let result = '';
        if (token == 'total') {
            result = token;
            return result;
        }
        if (distance == 0) {
            if (token == 'day') {
                result = moment().format('YYYYMMDD');
            }
            else if (token == 'week') {
                result = moment().format('YYYYww');
            }
            else if (token == 'month') {
                result = moment().format('YYYYMM');
            }
            else if (token == 'year') {
                result = moment().format('YYYY');
            }
        }
        else if (distance > 0) {
            let tokens = token + 's';
            if (token == 'day') {
                result = moment().subtract(distance, tokens).format('YYYYMMDD');
            }
            else if (token == 'week') {
                result = moment().subtract(distance, tokens).format('YYYYww');
            }
            else if (token == 'month') {
                result = moment().subtract(distance, tokens).format('YYYYMM');
            }
            else if (token == 'year') {
                result = moment().subtract(distance, tokens).format('YYYY');
            }
        }
        return result;
    }
    tokensToKeys(tokens, distance = 0) {
        const results = [];
        _.forEach(tokens, (v) => {
            const dateStr = this.formatDate(v, distance);
            if (dateStr != "") {
                results.push(`${v}:${dateStr}`);
            }
        });
        return results;
    }
    add(keys, member, score, tokens) {
        _.forEach(tokens, (v) => {
            const dateStr = this.formatDate(v);
            if (dateStr != "") {
                _.forEach(keys, (key) => {
                    this.redis.zadd(`rank:${key}:${v}:${dateStr}`, score, member);
                });
            }
        });
    }
    addMulti(keys, members, tokens) {
        const dateKeys = this.tokensToKeys(tokens);
        const args = [];
        _.forEach(members, (v, k) => {
            args.push(v);
            args.push(k);
        });
        const commands = [];
        _.forEach(keys, (key) => {
            _.forEach(dateKeys, (v) => {
                args.unshift(`rank:${key}:${v}`);
                commands.push(args);
            });
        });
        _.forEach(commands, (v) => {
            this.redis.zadd.apply(this.redis, v);
        });
    }
    getRankKey(key, token, distance = 0) {
        return `rank:${key}:${token}:${this.formatDate(token, distance)}`;
    }
    count(key, token, distance = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.redis.zcard(this.getRankKey(key, token, distance));
        });
    }
    countByScore(key, min, max, token, distance = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.redis.zcount(this.getRankKey(key, token, distance), min, max);
        });
    }
    incrBy(key, member, score, token) {
        this.redis.zincrby(this.getRankKey(key, token, 0), score, member);
    }
    incrByMulti(keys, member, score, tokens) {
        _.forEach(keys, (key) => {
            _.forEach(tokens, (token) => {
                this.redis.zincrby(this.getRankKey(key, token, 0), score, member);
            });
        });
    }
    revrange(key, min, max, withscores, token, distance = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.redis.zrevrange(this.getRankKey(key, token, distance), min, max, withscores == true ? 'WITHSCORES' : '');
        });
    }
    revrank(key, token, distance, member) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.redis.zrevrank(this.getRankKey(key, token, distance), member);
        });
    }
    score(key, token, distance, member) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.redis.zscore(this.getRankKey(key, token, distance), member);
        });
    }
}
exports.default = RankManage;
