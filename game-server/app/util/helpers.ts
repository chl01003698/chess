const noun = require('../../config/noun.json');
const adjective = require('../../config/adjective.json');
import * as _ from 'lodash';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';
import { GameComponent } from '../components/game';
import Game from '../games/game';
import GamePlayer from '../games/gamePlayer';

import PushEvent from '../consts/pushEvent';
import * as Raven from 'raven';
import { ulid } from 'ulid';
import * as config from 'config';
import * as Redis from 'ioredis'
import Code from '../consts/code';
import logger from './logger';
import { MailModel } from '../extend/db';
import * as Ajv from 'ajv'
import * as math from 'mathjs'
import * as moment from 'moment'

export type Constructor<T> = new(...args: any[]) => T;

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
          derivedCtor.prototype[name] = baseCtor.prototype[name];
      });
  });
}

export function roomNumberRandomAsync(app) {
  return new Promise(function (resolve) {
    app.rpc.gate.gateRemote.random.toServer('cluster-server-gate-0', {}, function(ret) {
      resolve(ret)
    })
  })
}

export function roomNumberReleaseAsync(app, roomNumber) {
  return new Promise(function (resolve) {
    app.rpc.gate.gateRemote.release.toServer('cluster-server-gate-0', roomNumber, function() {
      resolve()
    })
  })
}

export function respOK(next: any, data?: object) {
	next(null, { code: 200, data })
}

export function respError(next: any, error: object) {
	next(null, error)
}

export function createNickName() {
	return adjective[_.random(0, adjective.length - 1)] + '的' + noun[_.random(0, noun.length - 1)];
}

export const validateOptions = { allowUnknown: true, stripUnknown: true, convert: true };

export function JoiValidate(msg: object, schema: object, next: (error, object) => void) {
	const result = Joi.validate(msg, schema, validateOptions);
	if (result.error != null) {
		Raven.captureException(result.error);
		next(null, { code: Code.PARAMS_ERROR.code, msg: result.error.message });
		return false;
	}
	return true;
}

export function JoiValidateEx(msg: object, schema: object, next: (error, object) => void) {
	const result = Joi.validate(msg, schema, validateOptions);
	if (result.error != null) {
		Raven.captureException(result.error);
		next(null, { code: Code.PARAMS_ERROR.code, msg: result.error.message });
		return [false, result];
	}
	return [true, result];
}

export function AjvValidate(msg: object, schema: object, next: (error, object) => void) {
	var ajv = new Ajv({removeAdditional: true, useDefaults: true})
	var valid = ajv.validate(schema, msg);
	if (!valid) {
		Raven.captureException(ajv.errors);
		next(null, { code: Code.PARAMS_ERROR.code, msg: ajv.errorsText });
		return [false, msg]
	}
	return [true, msg]
}

export function handleGame(this: Game, msg: object, session: any, next: (error, object) => void, cb: (game: Game) => void) {
	const roomId = session.get('roomId');
	if (!_.isString(roomId)) return respError(next, Code.PARAMS_ERROR)
	const gameComponent = this.app.components.game as GameComponent;
	const gameManage = gameComponent.container.gameManage;
	const game = gameManage.findGame(roomId);
	if (!(game != null)) return respError(next, Code.GAME.NO_EXIST_GAME)
	cb.bind(this)(game);
}

export function handleGamePlayer(
	this: any,
	msg: object,
	session: any,
	next: (error, object) => void,
	cb: (game: Game, gamePlayer: GamePlayer) => void
) {
	const roomId = session.get('roomId');
	if (!_.isString(roomId)) return next(null, Code.PARAMS_ERROR);
	const gameComponent = this.app.components.game as GameComponent;
	const gameManage = gameComponent.container.gameManage;
	const game = gameManage.findGame(roomId);
	if (!(game != null)) return next(null, Code.GAME.NO_EXIST_GAME);
	const gamePlayer = game.findPlayerByUid(session.uid)
	if (!(gamePlayer != null)) return next(null, Code.GAME.USER_NO_EXIST_IN_GAME );
	cb.bind(this)(game, gamePlayer);
}

export async function pushMail(
	app,
	to: string,
	title: string,
	content: string = title,
	items: Array<any> = [],
	type: number = 0,
	sender?: any
) {
	const mail = new MailModel({
		type,
		sender,
		to: mongoose.Types.ObjectId(to),
		title,
		content,
		items
	});
	await mail.save();
	app.get('statusService').pushByUids([ to ], PushEvent.onNewMail, { id: mail.id });
}

export function callFGameRemoteFunc(app, session, funcName: string) {
	const gameServerId = session.get('gameServerId');
	const roomId = session.get('roomId');
	callFGameRemoteFuncTemplate(app, session.uid, gameServerId, roomId, funcName);
}

export function callFGameRemoteFuncTemplate(app, uid, gameServerId, roomId, funcName: string) {
	if (_.isString(gameServerId) && _.isString(roomId)) {
		const args = {
			uid,
			roomId
		};
		if (_.isFunction(app.rpc.fgame.gameRemote[funcName])) {
			app.rpc.fgame.gameRemote[funcName].toServer(gameServerId, args, function(err, ret) {
				if (err != null) {
					throw err;
				}
			});
		}
	}
}

export function callFGameRemoteFuncWithData(app, gameServerId, data, funcName: string) {
	if (_.isFunction(app.rpc.fgame.gameRemote[funcName])) {
		app.rpc.fgame.gameRemote[funcName].toServer(gameServerId, data, function(err, ret) {
			if (err != null) {
				throw err;
			}
		});
	}
}

export function createFakeGamePlayer() {
	const sex = _.random(1, 2);
	const sexName = sex == 1 ? 'nan' : 'nv';
	const avatarMax = sex == 1 ? config.get('fakerGuest.nan') : config.get('fakerGuest.nv');
	const seriesMax = _.random(3, 20);
	const count = _.random(30, 1000);
	const player = {
		id: ulid(),
		shortId: _.random(10000000, 99999999),
		nickname: createNickName(),
		isGuest: false,
		sex: sex,
		headimgurl: `${config.get('fakerGuest.headimgurl')}${sexName}/${_.random(1, avatarMax)}.jpg`,
		coin: { card: 0 },
		signature: '',
		count: {
			seriesMax: seriesMax,
			series: _.random(seriesMax),
			winCount: _.random(Math.trunc(count / 3), Math.trunc(count / 1.3)),
			count: count
		}
	};

	return [ player, {} ];
}

export function pushGlobalMessage(app, route: string, msg: object) {
	app.get('channelService').broadcast('connector', route, msg, {}, function(err) {
		if (err) {
			Raven.captureException(err);
		}
	});
}

export function createRedisClient(host: string = 'localhost', port: number = 6379, password: string = '', select: number = 0) {
  const redis =  new Redis({
    host,
    port,
    detect_buffers: true,
    password
  })
  redis.select(select)
  return redis
}

export function hasEnoughGameCard(user, roomConfig, gameConfig) {
	if (gameConfig.free == true) {
		return true
	}
	let result = false
	const payway = roomConfig.payway == 'AA' ? 'AA' : 'owner'
	const expend = gameConfig.gameExpend[payway][roomConfig.expendIndex].expend
	if (_.isNumber(expend) && expend > 0 && user.coin.card >= expend) {
		result = true
	}
	return result
}

export function evalExpr(expr: string, params: object) {
	let result = undefined
	if (_.isString(expr) && expr.length > 0) {
		result = math.eval(expr, params)
	} 
	return result
}

export function recordEvent(client, event, body) {
	client.index({index: 'game-server', type: 'game', body: _.assign({event, createdAt: moment().format("YYYY-MM-DD H:mm:ss")}, body)})
}