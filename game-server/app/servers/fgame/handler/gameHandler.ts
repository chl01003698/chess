import * as _ from 'lodash';
import Code from '../../../consts/code';
import * as Joi from 'joi';
import Game from '../../../games/game';
import * as config from 'config';
import {
	roomNumberRandomAsync,
	validateOptions,
	JoiValidate,
	handleGame,
	handleGamePlayer,
	JoiValidateEx,
	AjvValidate,
	hasEnoughGameCard
} from '../../../util/helpers';
import FriendGame from '../../../games/friendGame';
import GamePlayer from '../../../games/gamePlayer';
import { keenClient } from '../../../util/keenClient';
import * as Raven from 'raven';
import { UserModel } from '../../../extend/db';
import { respOK, respError } from '../../../util/helpers';
import { CoreComponent } from '../../../components/core';
import { GameComponent } from '../../../components/game';
import logger from '../../../util/logger';
import * as merge from 'deepmerge';

export = function newHandler(app): GameHandler {
	return new GameHandler(app);
};

class GameHandler {
	constructor(private app) { }

	async destroy(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			handleGamePlayer.bind(this)(msg, session, next, (game: FriendGame, gamePlayer: GamePlayer) => {
				if (game.isStart || session.uid != game.owner.id) return respError(next, Code.FAIL)
				game.destroy(true, 'owner')
				respOK(next)
			})
		})
	}

	async dissolve(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			handleGamePlayer.bind(this)(msg, session, next, (game: FriendGame, gamePlayer: GamePlayer) => {
				if (!game.isStart) return respError(next, Code.FAIL)
				if (game.dissolveId != '') return respError(next, Code.GAME.STATE_ERROR)
				game.fsm.dissolveTrans(gamePlayer)
				respOK(next)
			})
		})
	}

	async dissolveVote(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			const validate = JoiValidate(msg, {
				vote: Joi.boolean().required()
			}, next);
			if (!validate) return;

			handleGamePlayer.bind(this)(msg, session, next, (game: FriendGame, gamePlayer: GamePlayer) => {
				if (!game.isStart || game.dissolveId == '') return respError(next, Code.FAIL)
				if (game.dissolveId == '') return respError(next, Code.GAME.STATE_ERROR)
				game.fsm.dissolveTrans(gamePlayer, msg.vote)
				respOK(next)
			})
		})
	}

	create(msg: any, session: any, next: (error, object) => void) {
		Raven.context(async () => {
			const [validate, result] = JoiValidateEx(msg, {
				fakeIds: Joi.array().items(Joi.number()),
				groupId: Joi.number().optional(),			// 群组Id
				origin: Joi.string().default('hall').optional(),  // 创建房间来源
				config: Joi.object().required().keys({
					game: Joi.string().required(),
					type: Joi.string().optional(),
					expendIndex: Joi.number().min(0).max(3).required(),
					payway: Joi.string().allow('AA', 'owner', 'winner').required(),
					join: Joi.boolean().default(true).optional(),
					private: Joi.boolean().default(false).optional(),
					playerCount: Joi.number().min(2).max(5).optional(),
					autoReady: Joi.boolean().default(false).optional()
				})
			}, next);
			if (!validate) return;

			let msgConfig = result.value.config
			const gameComponent = this.app.components.game as GameComponent
			const gameFactory = gameComponent.container.gameFactory
			const createGameConfig = gameFactory.getConfig(msgConfig.game, msgConfig.type)
			

			if (!createGameConfig) return respError(next, Code.PARAMS_ERROR)

			const coreComponent = this.app.components.core as CoreComponent
			const dataManage = coreComponent.container.dataManage

			const remoteData = dataManage.getData(createGameConfig.config!)
			if (!_.isEmpty(remoteData.ajvSchema)) {
			const [validate, ajvMsg] = AjvValidate(msg, remoteData.ajvSchema, next)
				if (!validate) return
				msgConfig = _.assign(msgConfig, ajvMsg["config"])
			}

			const willStopServer = await coreComponent.container.keyv.get('willStopServer')
			if (_.isBoolean(willStopServer) && willStopServer == true &&
				!_.includes(config.get('whiteList'), session.get('shortId'))) {
				return respError(next, Code.GAME.WILL_STOP_SERVER)
			}
			const roomCache = coreComponent.container.roomCache
			const playerRoomCount = await roomCache.getPlayerRoomCount(session.get('shortId'))
			if (playerRoomCount >= config.get('friendGame.createRoomLimit')) {
				return respError(next, Code.GAME.GAME_COUNT_LIMIT)
			}
			const [user, userInfo] = await Promise.all([
				UserModel.findGameUser(session.uid),
				coreComponent.container.userCache.findUserSession(session.get('shortId'))
			])
			if (user == null || userInfo == null) return respError(next, Code.NO_EXIST_USER)
			
			//let gameConfig = remoteData.server
			let gameConfig = merge(_.defaultTo(remoteData.share, {}), _.defaultTo(remoteData.server, {}), {
				arrayMerge: (destination, source) => source
			})
			if (createGameConfig.processGameConfig != undefined && _.isFunction(createGameConfig.processGameConfig)) {
				gameConfig = createGameConfig.processGameConfig!(msgConfig, _.cloneDeep(gameConfig))
			}
			if (_.isEmpty(gameConfig)) return respError(next, Code.FAIL)
			if (!hasEnoughGameCard(user, msgConfig, gameConfig)) return respError(next, Code.GAME.NOT_ENOUGH_GAMECARDS)
			const payway = msgConfig.payway == 'AA' ? 'AA' : 'owner'
			msgConfig.roundCount = gameConfig.gameExpend[payway][msgConfig.expendIndex].round;
			const existInRoom = await roomCache.existPlayerInRoom(session.get('shortId'))
			if (existInRoom) return respError(next, Code.GAME.ALREADY_EXIST_OTHER_GAME)

			const roomId = await roomNumberRandomAsync(this.app);
			if (roomId == -1) return respError(next, Code.GAME.NO_AVAILABLE_GAME_NUMBER)

			const gameManage = gameComponent.container.gameManage
			const fakeIds = _.defaultTo(msg.fakeIds, [])
			const game: FriendGame = gameManage.createGame(roomId + '', createGameConfig, gameConfig, msgConfig, user, fakeIds);
			if (game == null) respError(next, Code.GAME.CREATE_GAME_ERROR)
			if (msgConfig['join']) {
				game.container.emitter.once('onCreateRoom', () => {
					game.join(user, userInfo, session, !game.gameConfig.watch)
					if(msgConfig.autoReady){
						process.nextTick(()=>{
							game.ready(session.uid);
						})						
					}
				})
			}

			respOK(next)
		})
	}

	updateConfig(msg: any, session: any, next: (error, object) => void) {
		Raven.context(async () => {
			handleGame.bind(this)(msg, session, next, (game: FriendGame) => {
				let msgConfig = msg.config
				const gameComponent = this.app.components.game as GameComponent
				const gameFactory = gameComponent.container.gameFactory
				const createGameConfig = gameFactory.getConfig(msgConfig.game, msgConfig.type)
				const coreComponent = this.app.components.core as CoreComponent
				const dataManage = coreComponent.container.dataManage
				const remoteData = dataManage.getData(createGameConfig.config!)

				if (!_.isEmpty(remoteData.ajvSchema)) {
					const [validate, ajvMsg] = AjvValidate(msg, remoteData.ajvSchema, next)
					if (!validate) return
					if (!(game.isStart == false && game.fsm.is('ready'))) return respError(next, Code.GAME.STATE_ERROR)
					msgConfig = _.assign(msgConfig, ajvMsg)
					let gameConfig = _.cloneDeep(game.gameConfig)
					if (createGameConfig.processGameConfig != undefined && _.isFunction(createGameConfig.processGameConfig)) {
						gameConfig = createGameConfig.processGameConfig!(msgConfig, gameConfig)
					}
					game.updateConfig(msgConfig, gameConfig)
					respOK(next)
				}
			})
		})
	}

	join(msg: any, session: any, next: (error, object) => void) {
		Raven.context(async () => {
			const validate = JoiValidate(msg, {
				roomId: Joi.string().length(6).required()
			}, next);
			if (!validate) return;
			const coreComponent = this.app.components.core as CoreComponent
			const willStopServer = await coreComponent.container.keyv.get('willStopServer')
			if (_.isBoolean(willStopServer) && willStopServer == true &&
				!_.includes(config.get('whiteList'), session.get('shortId'))) {
				return respError(next, Code.GAME.WILL_STOP_SERVER)
			}
			const existInRoom = await coreComponent.container.roomCache.existPlayerInRoom(session.get('shortId'))
			if (existInRoom) return respError(next, Code.GAME.ALREADY_JOIN_GAME)

			const [user, userInfo] = await Promise.all([
				UserModel.findGameUser(session.uid),
				coreComponent.container.userCache.findUserSession(session.get('shortId'))
			])
			if (user == null || userInfo == null) return respError(next, Code.NO_EXIST_USER)
			const gameComponent = this.app.components.game as GameComponent;
			const gameManage = gameComponent.container.gameManage;
			const game = gameManage.findGame(msg.roomId);
			if (!(game != null)) return respError(next, Code.GAME.NO_EXIST_GAME)
			if (game.isGameFull()) return respError(next, Code.GAME.GAME_FULL)
			if (!hasEnoughGameCard(user, game.roomConfig, game.gameConfig)) return respError(next, Code.GAME.NOT_ENOUGH_GAMECARDS)
			game.join(user, userInfo, session, true)
			respOK(next)
		})
	}

	async leave(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			handleGamePlayer.bind(this)(msg, session, next, (game: FriendGame, gamePlayer: GamePlayer) => {
				if (!(game.isStart == false && game.fsm.is('ready'))) return respError(next, Code.GAME.STATE_ERROR)
				game.leave(session.uid, session)
				respOK(next)
			})
		})
	}

	async sitdown(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			handleGame.bind(this)(msg, session, next, (game: FriendGame) => {
				const gameWatcher = _.find(game.gameWatchers, { uid: session.uid })
				if (gameWatcher == undefined) return respError(next, Code.FAIL)
				if (game.isGameFull()) return next(null, { code: Code.GAME.GAME_FULL })
				if (game.isAboutToFinish()) return next(null, { code: Code.GAME.IS_ABOUT_TO_FINISH })
				if (!hasEnoughGameCard(gameWatcher.user, game.roomConfig, game.gameConfig)) return respError(next, Code.GAME.NOT_ENOUGH_GAMECARDS)
				game.sitdown(gameWatcher, session)
				respOK(next)
			})
		})
	}

	async standup(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			handleGamePlayer.bind(this)(msg, session, next, (game: FriendGame, gamePlayer: GamePlayer) => {
				if (!game.fsm.is('ready')) return respError(next, Code.GAME.STATE_ERROR)
				if (!(game.currentRound == 0 && gamePlayer.joined == false)) return respError(next, Code.FAIL)
				game.standup(gamePlayer, session);
				respOK(next)
			})
		})
	}

	ready(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			handleGamePlayer.bind(this)(msg, session, next, (game: Game, gamePlayer: GamePlayer) => {
				if (!game.fsm.is('ready')) return respError(next, Code.GAME.STATE_ERROR)
				game.ready(session.uid);
				respOK(next)
			})
		})
	}

	cancelReady(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			handleGamePlayer.bind(this)(msg, session, next, (game: Game, gamePlayer: GamePlayer) => {
				if (!game.fsm.is('ready')) return respError(next, Code.GAME.STATE_ERROR)
				game.cancelReady(session.uid);
				respOK(next)
			})
		})
	}

	async ownerReady(msg: object, session: any, next: (error, object) => void) {
		Raven.context(() => {
			handleGamePlayer.bind(this)(msg, session, next, (game: FriendGame, gamePlayer: GamePlayer) => {
				if (game.owner.id == session.uid &&
					game.gameConfig.ownerReadyEnabled == true &&
					game.isOwnerReady == false &&
					game.fsm.is('ready') &&
					game.currentRound == 0 &&
					game.readyIds.length >= game.getRealGamePlayersCount() &&
					game.readyIds.length >= 2) {
					game.ownerReady()
					respOK(next)
				} else {
					next(null, Code.FAIL)
				}
			})
		})
	}

	async chat(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			const validate = JoiValidate(msg, {
				type: Joi.number().integer().min(0).max(2).required(),
				index: Joi.number().integer().min(0).max(100).required(),
				targetId: Joi.string().allow("")
			}, next);
			if (!validate) return;

			handleGamePlayer.bind(this)(msg, session, next, (game: Game, gamePlayer: GamePlayer) => {
				game.container.chat.chat(gamePlayer, msg);
				respOK(next)
			});
		})
	}

	async chatText(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			const validate = JoiValidate(msg, {
				text: Joi.string().max(300).required()
			}, next);
			if (!validate) return;

			handleGamePlayer.bind(this)(msg, session, next, (game: Game, gamePlayer: GamePlayer) => {
				game.container.chat.chatText(gamePlayer, msg.text);
				respOK(next)
			});
		})
	}

	async chatHistory(msg: object, session: any, next: (error, object) => void) {
		Raven.context(() => {
			handleGamePlayer.bind(this)(msg, session, next, (game: Game, gamePlayer: GamePlayer) => {
				respOK(next, game.container.chat.recentChatRecords())
			})
		})
	}

	async kick(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			const validate = JoiValidate(msg, {
				uid: Joi.string().required()
			}, next);
			if (!validate) return;

			handleGamePlayer.bind(this)(msg, session, next, (game: FriendGame, gamePlayer: GamePlayer) => {
				if (session.uid == msg.uid) return respError(next, Code.FAIL)
				if (session.uid != game.owner.id) return respError(next, Code.FAIL)
				if (!(game.isStart == false && game.fsm.is('ready'))) return respError(next, Code.GAME.STATE_ERROR)
				game.leave(msg.uid, session, 'kick')
				respOK(next)
			})
		})
	}
}
