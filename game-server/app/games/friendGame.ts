import Game from './game';
import * as StateMachine from 'javascript-state-machine';
import * as Bottle from 'bottlejs';
import GameRecord from './components/gameRecord';
import * as moment from 'moment';
import * as config from 'config';
import GamePlayer from './gamePlayer';
import axios from 'axios';
import * as _ from 'lodash';
import PushEvent from '../consts/pushEvent';
import logger from '../util/logger';
import FriendGameController from './components/controllers/friendGameController';
import { roomNumberReleaseAsync } from '../util/helpers';
import * as Raven from 'raven';
import { FreeRoomPay, AARoomPay, OwnerRoomPay, WinnerRoomPay } from './components/roomPay';
import PlayBack from './components/playback';

export enum DissolveState {
	None = 0,
	Agree,
	Reject
}

const friendGameConfig = config.get('friendGame')

export default class FriendGame extends Game {
	isOwnerReady: boolean = false;
	fakeIds = [];
	owner: any;
	dissolveId: string = '';
	dissoleTimer: any = null;
	initDate: Date = new Date();

	constructor(...args: any[]) {
		super(...args);
		[, , , , , this.owner, this.fakeIds] = args
		this.factory('playback', (container) => {
			return new PlayBack(this.gameConfig.playback)
		})

		this.factory('controller', (container) => {
			const friendController = new FriendGameController(this, container);
			return friendController
		});

		if (this.gameConfig.free == true) {
			this.factory('roomPay', () => {
				return new FreeRoomPay(this)
			})
		} else if (this.roomConfig.payway == 'AA') {
			this.factory('roomPay', () => {
				return new AARoomPay(this)
			})
		} else if (this.roomConfig.payway == 'owner') {
			this.factory('roomPay', () => {
				return new OwnerRoomPay(this)
			})
		} else if (this.roomConfig.payway == 'winner') {
			this.factory('roomPay', () => {
				return new WinnerRoomPay(this)
			})
		}

		this.factory('gameRecord', (container) => {
			return new GameRecord(this, container.playback, container.roomPay)
		})

		this.initFSM()
		this.container.controller.bindEvent()
	}

	initFSM() {
		// this.fsm = new StateMachine({
		// 	observeUnchangedState: true,
		// 	init: "init", // 初始化状态,牌桌,配置,玩家初始化在这里完成
		// 	transitions: [
		// 		{ name: "readyTrans", from: ['init', 'over'], to: "ready" },      //准备
		// 		{ name: "startTrans", from: 'ready', to: "start" },      // 准备开始一局游戏    
		// 		{ name: "shuffleTrans", from: 'start', to: "shuffle" }, //洗牌
		// 		{ name: "outputTrans", from: 'shuffle', to: "output" }, 
		// 		{ name: "overTrans", from: "output", to: "over" },  //发牌
		// 		{ name: "finishTrans", from: "*", to: "finish" },  // 完成约定局数游戏
		// 		{ name: 'dissolveTrans', from: "*", to: "dissolve" }    // 中途解散游戏
		// 	],
		// 	methods: {
		// 		onTransition: this.onTransition.bind(this),
		// 		onAfterTransition: this.onAfterTransition.bind(this),
		// 		onBeforeDissolveTrans: this.onBeforeDissolveTrans.bind(this),
		// 		onEnterState: this.onEnterState.bind(this),
		// 		onLeaveState: this.onLeaveState.bind(this),
		// 		onEnterInit: this.onEnterInit.bind(this),
		// 		onLeaveInit: this.onLeaveInit.bind(this),
		// 		onEnterStart: this.onEnterStart.bind(this),
		// 		onEnterShuffle: this.onEnterShuffle.bind(this),
		// 		onEnterReady: this.onEnterReady.bind(this),
		// 		onEnterOutput: this.onEnterOutput.bind(this),
		// 		onEnterOver: this.onEnterOver.bind(this),
		// 		onLeaveOver: this.onLeaveOver.bind(this),
		// 		onEnterFinish: this.onEnterFinish.bind(this),
		// 		onEnterDissolve: this.onEnterDissolve.bind(this),
		// 		onInvalidTransition: this.onInvalidTransition.bind(this)
		// 	}
		// })
	}

	join(user: any, userInfo: object, session: any, autoSit: boolean = true) {
		if (_.find(this.getAllGamePlayers(), { uid: user.id }) != undefined) return;
		const gamePlayer: GamePlayer = new this.GamePlayerType(this.app, user, userInfo, -1, !autoSit);
		if (autoSit) {
			this.addGamePlayer(gamePlayer);
		} else {
			this.gameWatchers.push(gamePlayer);
		}
		session.set('roomId', this.roomId);
		session.set('gameServerId', this.app.getCurServer().id);
		session.pushAll((error) => {
			if (error != null) {
				Raven.captureException(error);
			}
		});
		this.onJoin(gamePlayer, autoSit);
	}

	onJoin(gamePlayer: GamePlayer, autoSit: boolean) {
		const channel = gamePlayer.watcher ? this.container.watchChannel : this.container.channel;
		if(this.isStart == true && this.fsm.is('ready') != true ) gamePlayer.watcher = true;
		channel.add(gamePlayer.uid, gamePlayer.userInfo['sid']);
		channel.pushMessageByIds(PushEvent.onPlayerJoinGame_, this.clientInfo(gamePlayer.uid), gamePlayer.uid);
		if (autoSit) {
			this.container.channel.pushMessage(PushEvent.onPlayerJoinGame, { gamePlayer: gamePlayer.clientInfo() });
		}
		this.container.emitter.emit('onJoin', gamePlayer, autoSit);
	}

	leave(userId: string, session: any, reason: string = '') {
		const gamePlayer = _.find(this.getAllGamePlayers(), { uid: userId });
		if (gamePlayer == undefined) return;
		if (gamePlayer.watcher) {
			_.remove(this.gameWatchers, { uid: userId });
		} else {
			_.pull(this.readyIds, userId);
			this.gamePlayers[gamePlayer.index] = null;
		}

		session.set('roomId', null);
		session.set('gameServerId', null);
		session.pushAll(function (error) {
			if (error != null) {
				Raven.captureException(error);
			}
		});
		this.onLeave(gamePlayer);
	}

	async onLeave(gamePlayer: GamePlayer, reason: string = '') {
		if (!gamePlayer.watcher) {
			await this.container.channel.pushMessage(PushEvent.onPlayerLeaveGame, { uid: gamePlayer.uid, reason });
		}
		this.container.channel.leave(gamePlayer.uid);
		this.container.emitter.emit('onLeave', gamePlayer)
	}

	sitdown(gamePlayer: GamePlayer, session: any) {
		const [rmGamePlayer] = _.remove(this.gameWatchers, { uid: gamePlayer.uid });
		if (rmGamePlayer != null) {
			rmGamePlayer.watcher = false;
			this.addGamePlayer(rmGamePlayer);
			this.onSitdown(rmGamePlayer);
		}
	}

	onSitdown(gamePlayer: GamePlayer) {
		this.container.watchChannel.leave(gamePlayer.uid);
		this.container.channel.add(gamePlayer.uid, gamePlayer.userInfo['sid']);
		this.container.channel.pushMessage(PushEvent.onPlayerSitDown, { gamePlayer: gamePlayer.clientInfo() });
		this.container.emitter.emit('onSitdown', gamePlayer)
	}

	standup(gamePlayer: GamePlayer, session: any) {
		_.pull(this.readyIds, gamePlayer.uid);
		this.gamePlayers[gamePlayer.index] = null;
		this.onStandup(gamePlayer);
	}

	async onStandup(gamePlayer: GamePlayer) {
		if (!gamePlayer.watcher) {
			await this.container.channel.pushMessage(PushEvent.onPlayerStandUp, { uid: gamePlayer.uid });
		}
		this.container.channel.leave(gamePlayer.uid);
	}

	onBeforeDissolveTrans(lifecycle, gamePlayer: GamePlayer, vote: boolean) {
		if (gamePlayer instanceof GamePlayer && vote == undefined) {
			this.dissolveId = gamePlayer.uid;
			const seconds = friendGameConfig.dissolveMinutes * 60;
			this.dissoleTimer = moment.duration(seconds, 'seconds')['timer']({ start: true }, () => {
				_.forEach(this.gamePlayers, (v: GamePlayer) => {
					if (v != undefined && v.dissolveState == DissolveState.None) {
						v.dissolveState = DissolveState.Agree
					}
				})
				this.dissolveTemplate()
			});

			gamePlayer.dissolveState = DissolveState.Agree;
			this.container.channel.pushMessage(PushEvent.onRequestGameDissolve, {
				states: this.getPlayersDissolveState(),
				seconds: seconds,
				uid: gamePlayer.uid
			})
		} else if (gamePlayer instanceof GamePlayer && _.isBoolean(vote)) {
			gamePlayer.dissolveState = vote ? DissolveState.Agree : DissolveState.Reject;
			this.dissolveTemplate()
		}
		return false
	}

	dissolveTemplate() {
		const result = this.getDissolveResult();
		let playerCount = this.playerCount;
		if (this.gameConfig.freeMode == true) {
			playerCount = this.getRealGamePlayersCount();
		}
		const agreeCount = Math.floor(playerCount / 2) + 1;
		const rejectCount = Math.floor(playerCount / 2);
		if (result.rejectCount >= rejectCount || result.agreeCount >= agreeCount) {
			if (result.agreeCount >= agreeCount) {
				this.container.channel.pushMessage(PushEvent.onGameDissolveResult, { result: true, states: this.getPlayersDissolveState() })
				process.nextTick(() => {
					this.fsm.finishTrans();
				});
			} else if (result.rejectCount >= rejectCount) {
				this.container.channel.pushMessage(PushEvent.onGameDissolveResult, { result: false, states: this.getPlayersDissolveState() })
			}
			this.clearDissoleData();
		} else {
			this.container.channel.pushMessage(PushEvent.onRefreshGameDissolve, {
				states: this.getPlayersDissolveState(),
				uid: this.dissolveId
			})
		}
	}

	onEnterDissolve(lifecycle, gamePlayer: GamePlayer, vote: boolean) {

	}

	getPlayersDissolveState(): Array<object> {
		const results: Array<object> = [];
		this.gamePlayers.forEach(function (value) {
			if (value != null) {
				results.push({ uid: value.uid, state: value.dissolveState });
			}
		});
		return results;
	}

	getDissolveResult() {
		let agreeCount = 0;
		let rejectCount = 0;
		let resultCount = 0;
		this.gamePlayers.forEach(function (v) {
			if (v != null) {
				if (v.dissolveState == DissolveState.Agree) {
					++agreeCount;
					++resultCount;
				} else if (v.dissolveState == DissolveState.Reject) {
					++rejectCount;
					++resultCount;
				}
			}
		});
		return { agreeCount, rejectCount, resultCount };
	}

	clearDissoleData() {
		this.gamePlayers.forEach(function (v) {
			if (v != null) {
				v.dissolveState = DissolveState.None;
			}
		});
		if (this.dissoleTimer != null) {
			this.dissoleTimer.stop();
			this.dissoleTimer = null;
		}

		this.dissolveId = '';
	}

	onEnterStart(lifecycle, arg1, arg2) {
		super.onEnterStart(lifecycle, arg1, arg2);
	}

	async onEnterShuffle(lifecycle, arg1, arg2) {
		if (this.app.get('env') != 'production' && config.get('friendGame.fakeEnabled') && this.fakeIds.length > 0) {
			const cards = await this.getFakeCards();
			if (_.isArray(cards) && cards.length >= 0) {
				const fakeCardIds = cards;
				const allCardIds = this.gameConfig.allCardIds;
				const otherCards = _.difference(allCardIds, fakeCardIds);
				const ids: any = _.slice(_.concat(fakeCardIds, _.shuffle(otherCards)), 0, allCardIds.length);
				this.cards = this.container.cardAdapter.createCardsFromIds(ids);
			} else {
				this.cards = this.shuffleCards();
			}
		} else {
			this.cards = this.shuffleCards();
		}
		setTimeout(() => {
			this.fsm.outputTrans();
		}, 0)
	}

	onEnterOver(lifecycle, arg1, arg2) {
		this.container.emitter.emit('onEnterFriendGameOver')
		++this.currentRound;
		process.nextTick(() => {
			if (this.isFinish()) {
				this.fsm.finishTrans();
			} else {
				this.fsm.readyTrans();
			}
		});

		super.onEnterOver(lifecycle, arg1, arg2);
	}

	// 派生类实现getFinishData
	getFinishData(data: any) {

	}

	// 派生类实现getGamePlayerFinishData
	getGamePlayerFinishData(gamePlayer: GamePlayer, data: any) {

	}

	onEnterFinish(lifecycle, arg1, arg2) {
		super.onEnterFinish(lifecycle, arg1, arg2);
		const data = { gamePlayers: <any>[], payUIds: Array.from(this.container.roomPay.payUsers), payway: this.roomConfig.payway }
		this.getFinishData(data)
		this.gamePlayers.forEach((value: GamePlayer) => {
			if (value != null) {
				const result = {
					uid: value.uid,
					isGuest: value.user.isGuest,
					score: value.score - value.initScore,
					winCount: value.winCount,
					loseCount: value.loseCount,
					drawCount: value.drawCount
				};
				this.getGamePlayerFinishData(value, result)
				data.gamePlayers.push(result);
			}
		});
		this.container.channel.pushMessage(PushEvent.onGameFinish, data);
		this.destroy(false);
	}

	ownerReady() {
		if (this.isOwnerReady == false) {
			this.isOwnerReady = true;
			process.nextTick(() => {
				this.fsm.startTrans();
				this.readyIds = [];
			});
		}
	}

	reset() {
		super.reset();
		this.clearDissoleData()
	}

	clientInfo(uid?: string) {
		let result = super.clientInfo(uid);
		if (this.dissoleTimer != null) {
			result['dissolveInfo'] = {
				seconds: this.getTimeLeft(this.dissoleTimer),
				states: this.getPlayersDissolveState(),
				dissolveId: this.dissolveId
			}
		}
		result['ownerId'] = this.owner.id;
		return result;
	}

	destroy(needPush: boolean = false, reason: string = '') {
		roomNumberReleaseAsync(this.app, parseInt(this.roomId));
		super.destroy(needPush, reason);
	}

	updateConfig(roomConfig, gameConfig) {
		_.assign(this.roomConfig, roomConfig)
		this.gameConfig = gameConfig
		this.container.channel.pushMessage(PushEvent.onUpdateRoomConfig, this.roomConfig)
	}

	async getFakeCards() {
		try {
			const fakeDataURL = config.get('fakeDataURL');
			if (this.fakeIds.length > 0) {
				const fakeId = this.fakeIds.shift();
				if (_.isSafeInteger(fakeId)) {

					const response = await axios.get(`${fakeDataURL}cards/${fakeId}`);
					const jsonObject = response.data;
					const initCards = jsonObject['cards'];
					if (_.isArray(initCards) && initCards.length > 0) {
						return initCards;
					}
				}
			}
		} catch (e) {
			Raven.captureException(e);
		}
	}
}
