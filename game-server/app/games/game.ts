import * as StateMachine from 'javascript-state-machine';
import GamePlayer from './gamePlayer';
import * as Bottle from 'bottlejs';
import Channel from './components/channel';
import Chat from './components/chat';
import CountDown from './components/countDown';
import { EventEmitter2 } from 'eventemitter2';
import logger from '../util/logger';
import * as _ from 'lodash'
import { ScoreManage } from './components/scoreManage';
import { PokerCardAdapter, MJCardAdapter } from './components/cardAdapter';
import PushEvent from '../consts/pushEvent';
import { GameComponent } from '../components/game';
import * as Raven from 'raven';
import { PlayerStateManage } from './components/playerStateManage';
import { PokerCard } from './poker/pokerAlgo/pokerAlgo';
import * as config from 'config';
import { GameESearch } from './components/gameESearch';
import { CoreComponent } from '../components/core';

export default class Game extends Bottle {
	roomId: string;
	fsm: StateMachine;
	app: any;
	gamePlayers: Array<GamePlayer | any> = []
	gameWatchers: Array<GamePlayer> = []
	gameConfig: any;
	roomConfig: any;
	currentRound: number = 0
	startDate: Date;
	isStart: boolean = false
	pattern: string;
	currentIndex: number = 0
	playerCount: number
	cards: any = []
	remainCards: Array<PokerCard | number> = []
	readyIds: Array<string> = []
	owner = this.owner;
	m_banker: any;
	
	protected GamePlayerType

	constructor(...args: any[]) {
		super();

		[this.app, this.roomId, this.gameConfig, this.roomConfig, this.GamePlayerType] = args

		_.isNumber(this.roomConfig['playerCount']) ? this.playerCount = this.roomConfig['playerCount'] : this.playerCount = this.gameConfig['playerCount']
		this.factory('emitter', () => {
			return new EventEmitter2({ wildcard: true, delimiter: ':' });
		});
		this.factory('channel', () => {
			return new Channel(this.app, 'members', this.roomId);
		});
		this.factory('watchChannel', () => {
			return new Channel(this.app, 'watchers', this.roomId);
		});
		this.factory('chat', (container) => {
			return new Chat(container.channel);
		});
		this.factory('countDown', () => {
			return new CountDown
		});

		this.service('playerStateManage', PlayerStateManage)

		this.factory('scoreManage', () => {
			return new ScoreManage
		})

		if (this.gameConfig.type == 'poker') {
			this.service('cardAdapter', PokerCardAdapter)
		} else {
			this.service('cardAdapter', MJCardAdapter)
		}

		this.factory('esearch', () => {
			const coreComponent = this.app.components.core as CoreComponent
			return new GameESearch(this, coreComponent.container.esearch)
		})
	}


	onInvalidTransition(transition, from, to) {
		logger.debug('transition not allowed from that state');
		logger.debug('from: ', from);
		if (to != undefined) {
			logger.debug('to: ', to);
		}
	}

	onTransition(lifecycle, arg1, arg2) { }

	onEnterState(lifecycle, arg1, arg2) {
		// logger.debug('from: ', lifecycle.from);
		// logger.debug('to: ', lifecycle.to);
		this.container.emitter.emit(`onEnter${_.upperFirst(lifecycle.to)}`)
		this.container.countDown.start(lifecycle.to)
	}

	onLeaveState(lifecycle, arg1, arg2) {
		this.container.emitter.emit(`onLeave${_.upperFirst(lifecycle.from)}`)
		this.container.countDown.reset(lifecycle.from)
	}

	onAfterTransition(lifecycle, arg1, arg2) { }

	onBeforeDissolveTrans(lifecycle, arg1, arg2) { }

	onEnterInit(lifecycle, arg1, arg2) { }

	onLeaveInit(lifecycle, arg1, arg2) { }

	onEnterReady(lifecycle, arg1, arg2) { }
	onEnterShuffle(lifecycle, arg1, arg2) { }
	onEnterStart(lifecycle, arg1, arg2) {
		this.startDate = new Date();
		this.gamePlayers = _.compact(this.gamePlayers)
		_.forEach(this.gamePlayers, (v, i) => {
			v.index = i
			v.joined = true
		})

		if (this.currentRound == 0) {
			this.isStart = true
		}
	}

	onEnterOver(lifecycle, arg1, arg2) { }

	onLeaveOver(lifecycle, arg1, arg2) {
		this.reset()
	}

	onEnterFinish(lifecycle, arg1, arg2) { }

	onEnterDissolve(lifecycle, arg1, arg2) { }

	saveCurrentRoundGamePlayer(roundObject: object, gamePlayer: GamePlayer, index: number) { }

	turnNext() {
		++this.currentIndex;
		this.currentIndex = this.currentIndex % this.playerCount;
	}

	turnFromTo(from: number = this.currentIndex, to: number = 1) {
		let index = from + to;
		return index % this.playerCount;
	}

	shiftCard() {
		return this.remainCards.shift();
	}

	popCard() {
		return this.remainCards.pop();
	}

	isFinish() {
		return this.currentRound >= this.roomConfig.roundCount;
	}

	isAboutToFinish() {
		return this.currentRound + 2 >= this.roomConfig.roundCount;
	}

	clearSessionData(gamePlayer: GamePlayer) {
		if (gamePlayer != null && gamePlayer.userInfo['sid'] != '') {
			this.app.backendSessionService.getByUid(gamePlayer.userInfo['sid'], gamePlayer.uid, function (error, sessions) {
				if (sessions != null && _.isArray(sessions) && sessions.length > 0) {
					const session = sessions[0] as any;
					if (session != null) {
						session.set('roomId', null);
						session.set('gameServerId', null);
						session.pushAll(function () { });
					}
				}
			})
		}
	}

	clearSessionsData() {
		this.gamePlayers.forEach((v) => {
			if (v != null) {
				this.clearSessionData(v)
			}
		})
	}

	reset() {
		this.currentIndex = 0;
		this.cards = [];
		this.remainCards = [];
		this.gamePlayers.forEach((value: GamePlayer) => {
			if (value != undefined) {
				value.reset();
			}
		});
		this.container.countDown.resetAll()
		const components = this.container.$list()
		this.readyIds = [];
		_.forEach(components, (v) => {
			if (_.isFunction(this.container[v].reset)) {
				this.container[v].reset()
			}
		})
	}
	onRest() {
		this.container.emitter.emit('onRest')
	}


	clientInfo(uid?: string) {
		const clientInfo = _.pick(this, ['roomId', 'roomName', 'currentRound', 'roomConfig', "readyIds"]);
		clientInfo['state'] = this.fsm.state;
		// clientInfo['playerCount'] = this.getGamePlayerCount()
		clientInfo["playerCount"] = this.playerCount;
		if (this.container.countDown.timers[this.fsm.state] != undefined) {
			clientInfo['stateRemain'] = this.container.countDown.getRemainingDuration(this.fsm.state)
		}
		clientInfo.index = 0;
		clientInfo["gamePlayers"] = [];
		if (config.get('game.readySeconds') != undefined) clientInfo["readySeconds"] = config.get('game.readySeconds')
		this.gamePlayers.forEach((v, i) => {
			clientInfo.index = i;
			if (v == null) {
				clientInfo["gamePlayers"][i] = null;
			} else {
				clientInfo["gamePlayers"][i] = v.clientInfo(uid == v.uid);
				clientInfo["gamePlayers"][i].isOwner = false;
			}
		});
		return clientInfo;
	}

	clientGamePlayers() {
		const clientGamePlayers: Array<GamePlayer> = []
		_.forEach(this.gamePlayers, (v) => {
			clientGamePlayers.push(v.clientInfo())
		})
		return clientGamePlayers
	}

	destroy(needPush: boolean = false, reason: string = '') {
		if (needPush) {
			this.container.channel.pushMessage(PushEvent.onGameDestroy)
		}

		this.clearSessionsData();
		this.onDestroy(needPush, reason)
		this.deleteGame()
	}

	onDestroy(needPush, reason) {
		this.container.emitter.emit('onDestroy', needPush, reason)
	}

	onServerStop() {
		this.container.emitter.emit('onServerStop')
	}

	ready(uid: string, needPush: boolean = true) {
		if (this.fsm.state == 'ready') {
			const index = this.readyIds.indexOf(uid);
			let playerCount = this.playerCount
			if (index == -1 && this.readyIds.length < playerCount) {
				this.readyIds.push(uid);
				const gamePlayer = this.findPlayerByUid(uid);
				if (needPush) {
					this.container.channel.pushMessage(PushEvent.onGameReady, {
						uids: this.readyIds,
						uid,
						index: gamePlayer.index
					})
				}
				if (this.readyIds.length >= playerCount) {
					process.nextTick(() => {
						this.fsm.startTrans();
						this.container.countDown.remove('ready')
					});
				} else if (this.readyIds.length == this.gamePlayers.length &&
					this.gameConfig.freeMode == true && 
					this.gameConfig.playerMinCount != undefined && 
					this.readyIds.length >= this.gameConfig.playerMinCount) {
					process.nextTick(() => {
						this.fsm.startTrans();
						this.container.countDown.remove('ready')
					});
				} else if (this.readyIds.length >= 2 && this.gameConfig.freeMode == true &&
					this.container.countDown.timers['ready'] == undefined) {
					const readySeconds = config.get('game.readySeconds')
					this.container.channel.pushMessage(PushEvent.onGameReadyCountDown, {
						readySeconds
					})
					this.container.countDown.register('ready', readySeconds, () => {
						this.fsm.startTrans();
						this.container.countDown.remove('ready')
					}, { start: true })
				}
			}
		}
	}

	cancelReady(uid: string) {
		this.readyIds = []
		this.container.countDown.remove('ready');
		let player = this.findPlayerByUid(uid);
		this.container.channel.pushMessage(PushEvent.onGameCancelReady, {
			uid: uid, sid: player.index
		})
	}

	findPlayerByUid(uid: string) {
		return _.find(this.gamePlayers, function (v) {
			if (v != null) {
				return v.uid == uid;
			}
			return false;
		});
	}

	findPlayerByShortId(shortId: number) {
		return _.find(this.gamePlayers, function (v) {
			if (v != null) {
				return v.shortId == shortId;
			}
			return false;
		});
	}

	findWinnerPlayer() {
		const gamePlayers: Array<GamePlayer> = _.compact(this.gamePlayers)
		return _.maxBy(gamePlayers, (v) => {
			return v.score
		})
	}

	getAllGamePlayers() {
		return _.compact(_.concat(this.gamePlayers, this.gameWatchers))
	}

	nullPlayerIndex(players: Array<any>): number {
		return _.findIndex(players, function (value) {
			return value == null;
		});
	}

	indexOfPlayer(players: Array<any>, uid: string): number {
		return _.findIndex(players, function (value) {
			if (value != undefined) {
				return value.uid == uid;
			}
			return false
		});
	}

	getGamePlayerCount(): number {
		return this.gamePlayers.length
	}

	getPlayerIds(): Array<string> {
		const results: Array<string> = []
		_.forEach(this.gamePlayers, (v) => {
			if (v != undefined) results.push(v.uid)
		})
		return results
	}

	getOtherPlayerIds(uid: string): Array<string> {
		return _.filter(this.gamePlayers, (v: GamePlayer) => {
			return v != undefined && v.uid != uid
		})
	}

	// 获取房间真实玩家数量
	getRealGamePlayersCount(): number {
		return _.compact(this.gamePlayers).length
	}

	// 是否玩家数量已满
	isGameFull(): boolean {
		return _.compact(this.gamePlayers).length >= this.playerCount
	}

	// 检测是否为当前玩家
	isCurrentPlayer(uid: string): boolean {
		return this.gamePlayers[this.currentIndex].uid == uid;
	}

	addGamePlayer(gamePlayer: GamePlayer) {
		const nullIndex = this.nullPlayerIndex(this.gamePlayers);
		if (nullIndex == -1) {
			this.gamePlayers.push(gamePlayer);
			gamePlayer.index = this.gamePlayers.length - 1
		} else {
			this.gamePlayers[nullIndex] = gamePlayer;
			gamePlayer.index = nullIndex
		}
	}

	// 检测是否在某些状态当中
	inStates(states: Array<string>) {
		return _.includes(states, this.fsm.state)
	}

	// 洗牌接口
	shuffleCards() {
		return _.shuffle(this.cards)
	}

	sessionBindGame(gamePlayer: GamePlayer) {
		this.app.backendSessionService.getByUid(gamePlayer.userInfo['sid'], gamePlayer.uid, (error, sessions: any) => {
			if (sessions != null && _.isArray(sessions) && sessions.length > 0) {
				const session: any = sessions[0];
				session.set('roomId', this.roomId);
				session.set('gameServerId', this.app.getCurServer().id);
				session.pushAll(function (error) {
					if (error != null) {
						Raven.captureException(error);
					}
				})
			}
		})
	}

	onGamePlayerLogin(uid: string, sid: string) {
		const gamePlayer = _.find(this.getAllGamePlayers(), { uid: uid });
		// const channel = gamePlayer.watcher ? this.container.watchChannel : this.container.channel;
		const channel = this.container.channel;

		if (gamePlayer != undefined) {
			channel.leave(uid);
			gamePlayer.userInfo['sid'] = sid
			channel.add(uid, gamePlayer.userInfo['sid']);
			this.sessionBindGame(gamePlayer)
			this.container.channel.pushMessage(PushEvent.onGamePlayerLogin, { uid });

			// if (gamePlayer.watcher == false) {
			// 	// if (this.currentRound > 0 && this.fsm.state == "ready") {
			// 	// 	this.ready(uid)
			// 	// }
			// }
			this.container.channel.pushMessageByIds(PushEvent.onRestoreGameInfo, this.clientInfo(uid), uid);
		}
	}

	onGamePlayerLogout(uid: string) {
		Raven.context(async () => {
			const gamePlayer = this.findPlayerByUid(uid)
			if (gamePlayer != null) {
				await this.container.channel.pushMessage(PushEvent.onGamePlayerLogout, { uid })
				this.container.channel.leave(gamePlayer.uid)
			}
		})
	}

	deleteGame() {
		const gameComponent = this.app.components.game as GameComponent
		gameComponent.container.gameManage.deleteGame(this.roomId)
	}

	getTimeLeft(timeout) {
		return Math.ceil(timeout.getRemainingDuration() / 1000);
	}

	getCurrGamePlayer(): GamePlayer {
		return this.gamePlayers[this.currentIndex]
	}
}
