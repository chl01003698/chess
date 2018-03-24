import * as Bottle from 'bottlejs';
import * as config from 'config';
import UserCache from '../services/userCache';
import RoomCache from '../services/roomCache';
import CountManage from '../services/countManage';
import RankManage from '../services/rankManage';
import * as NRP from 'node-redis-pubsub'
import * as Keyv from 'keyv'
import DataManage from '../services/dataManage';
import GMManage from '../services/gmManage';
import { createRedisClient } from '../util/helpers';
import * as elasticsearch from 'elasticsearch'

const redisConfig = config.get('redis')

export class CoreComponent extends Bottle {
	constructor(private app) {
		super();
	}

	start(cb) {
		this.factory('userCache', () => { return new UserCache() })
		this.factory('roomCache', () => {
			return new RoomCache(createRedisClient(
				redisConfig.host,
				redisConfig.port,
				redisConfig.password,
				redisConfig.defaultDB
			), this.app)
		})
		this.factory('countManage', () => {
			return new CountManage(createRedisClient(
				redisConfig.host,
				redisConfig.port,
				redisConfig.password,
				redisConfig.defaultDB
			))
		})
		this.factory('rankManage', () => {
			return new RankManage(createRedisClient(
				redisConfig.host,
				redisConfig.port,
				redisConfig.password,
				redisConfig.rankDB
			))
		})

		this.factory('nrp', () => {
			return new NRP({
				port: redisConfig.port,
				host: redisConfig.host,
				auth: redisConfig.password,
				scope: 'task'
			})
		})

		this.factory('keyv', () => {
			const keyv = new Keyv('', {
				port: redisConfig.port,
				host: redisConfig.host,
				password: redisConfig.password != "" ? redisConfig.password : undefined,
				db: redisConfig.defaultDB,
				adapter: 'redis'
			})
			keyv.on('error', err => console.error('Connection Error', err))
			return keyv
		})

		this.factory('dataManage', () => {
			const dataManage = new DataManage()
			return dataManage
		})

		this.factory('GMManage', () => {
			return new GMManage(this.app)
		})

		this.factory('esearch', () => {
			return new elasticsearch.Client({host:[config.get('esearch')]});
		})
		process.nextTick(cb);
	}

	async afterStart(cb) {
		await this.container.dataManage.loadData()
		// this.container.dataManage.checkNewData()
		process.nextTick(cb);
	}

	stop(force, cb) {
		process.nextTick(cb);
	}
}

declare module "bottlejs" {
	interface IContainer {
		userCache: UserCache
		roomCache: RoomCache
		countManage: CountManage
		rankManage: RankManage
		nrp: NRP
		keyv: Keyv
		dataManage: DataManage
		GMManage: GMManage
	}
}

export function core(app) {
	return new CoreComponent(app);
}
