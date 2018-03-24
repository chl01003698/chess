import * as StateMachine from 'javascript-state-machine';
import { Constructor } from '../../util/helpers';
import Game from '../game';
import * as mergeByKey from 'array-merge-by-key';
import * as _ from 'lodash';
import { MJAlgo } from './MJAlgo';
import PushEvent from '../../consts/pushEvent';
import { PushRoute } from './consts/pushRoute';
import { MJActionManage } from './components/MJActionManage';
import { MJComboManage } from './components/MJComboManage';
import { MJEventManage } from './components/MJEventManage';
import { MJRuleManage } from './components/MJRuleManage';
import { MJScoreManage } from './components/MJScoreManage';
import { MJTriggerManage, MJTrigger, MJTriggerCache } from './components/MJTriggerManage';
import { MJBankerMap } from './components/MJBanker';
import { MJOverMap } from './components/MJOver';
import { MJCurrentCard } from './components/MJCurrentCard';
import { MJCardOriginType, MJHandleState, MJCardGroupType } from './consts/MJEnum';
import FriendMJGameController from '../components/controllers/friendMJGameController';
import { MJHandle } from './components/MJHandleManage';
import MJGamePlayer from './MJGamePlayer';
import { MJFormulaManage } from './components/MJFormulaManage';
import { MJRulerObjManage } from './components/MJRulerObjManage';
import MJNotify from './MJCmd/FillMsg/MJNotify'
import {MJMsgFillType} from './MJCmd/base/MJCmd'
export default function MJGame<T extends Constructor<Game>>(Base: T) {
	return class extends Base {
		algo = MJAlgo;
		lastCard: MJCurrentCard
		currentCard = new MJCurrentCard()
		loops = 0
		outPutCount = 0
		currentTrigger = ''
		allTingCards: number[] = []

		// 记录上一个动作，杠，碰，胡等
		lastHandles

		constructor(...args: any[]) {
			super(...args);
			this.algo = MJAlgo
			console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xx this.gameConfig");
			console.log(this.gameConfig);
			const bankerStrategy = _.get(this.gameConfig, 'strategy.banker', 'default');
			console.log(bankerStrategy);
			this.factory('mjbanker', () => {
				return new MJBankerMap[bankerStrategy]()
			});

			const overStrategy = _.get(this.gameConfig, 'strategy.over', 'default');
			this.factory('mjover', () => {
				return new MJOverMap[overStrategy]()
			});

			this.factory('mjscoreManage', (container) => {
				return new MJScoreManage(this)
			})

			this.factory('mjactionManage', (container)=> {
				return new MJActionManage(container.mjscoreManage, container.emitter, this.gameConfig.actions)
			})
			this.factory('mjcomboManage', (container) => {
				return new MJComboManage(this, container.emitter, container.mjscoreManage, this.gameConfig.combo, this.gameConfig.comboMode)
			})
			this.factory('mjRuleManage', (container) => {
				return new MJRuleManage(this, container.emitter, container.mjscoreManage, this.gameConfig.rule)
			})
			this.factory('mjeventManage', (container) => {
				return new MJEventManage(this, container.emitter, container.mjscoreManage, this.gameConfig.events)
			})

			this.factory('mjtriggerManage', (container) => {
				return new MJTriggerManage(container.mjactionManage, this.gameConfig.triggers)
			})

			this.factory('mjformulaManage', (container) => {
				return new MJFormulaManage(this, container.mjscoreManage, this.gameConfig.score)
			})

			this.factory('mjrulerobjManage', (container) => {
				return new MJRulerObjManage(this, this.gameConfig)
			})
			
			this.factory('mjcontroller', (container) => {
				return new FriendMJGameController(this, container);
			})

			this.bindEvent()
		}

		initFSM() {
			let { transitions, methods } = this.appendFSM();
			transitions = mergeByKey(
				'name',
				[
					{ name: 'readyTrans', from: [ 'init', 'over' ], to: 'ready' }, //准备
					{ name: 'startTrans', from: 'ready', to: 'start' }, // 准备开始一局游戏
					{ name: 'bankerTrans', from: 'start', to: 'banker' }, // 定庄流程
					{ name: 'shuffleTrans', from: 'banker', to: 'shuffle' }, //洗牌
					{ name: 'dealTrans', from: 'shuffle', to: 'deal' },
					{ name: 'outputTrans', from: ['deal', 'input','output'], to: 'output' },
					{ name: 'inputTrans', from: ['output','input'], to: 'input' },
					{ name: 'overTrans', from: ['output', 'input'], to: 'over' }, //发牌
					{ name: 'finishTrans', from: '*', to: 'finish' }, // 完成约定局数游戏
					{ name: 'dissolveTrans', from: '*', to: 'dissolve' } // 中途解散游戏
				],
				transitions
			);

			methods = _.assign(
				{},
				{
					onTransition: this.onTransition.bind(this),
					onAfterTransition: this.onAfterTransition.bind(this),
					onBeforeDissolveTrans: this.onBeforeDissolveTrans.bind(this),
					onEnterState: this.onEnterState.bind(this),
					onLeaveState: this.onLeaveState.bind(this),
					onEnterInit: this.onEnterInit.bind(this),
					onLeaveInit: this.onLeaveInit.bind(this),
					onEnterReady: this.onEnterReady.bind(this),
					onEnterStart: this.onEnterStart.bind(this),
					onEnterBanker: this.onEnterBanker.bind(this),
					onEnterShuffle: this.onEnterShuffle.bind(this),
					onEnterDeal: this.onEnterDeal.bind(this),
					onEnterOutput: this.onEnterOutput.bind(this),
					onEnterInput: this.onEnterInput.bind(this),
					onEnterOver: this.onEnterOver.bind(this),
					onLeaveOver: this.onLeaveOver.bind(this),
					onEnterFinish: this.onEnterFinish.bind(this),
					onEnterDissolve: this.onEnterDissolve.bind(this),
					onInvalidTransition: this.onInvalidTransition.bind(this)
				},
				methods
			);
			this.fsm = new StateMachine({
				observeUnchangedState: true,
				init: 'init', 
				transitions,
				methods
			});
		}

		bindEvent() {
			this.container.mjeventManage.bindEvents()
		}

		appendFSM() {
			return { transitions: [], methods: {} };
		}

		onEnterReady(lifecycle, arg1, arg2) { 
			super.onEnterReady(lifecycle,arg1,arg2);
			console.log("onEnterReady");
			this.currentCard.rest()
			this.lastCard=this.currentCard
			this.loops = 0
			this.outPutCount = 0
			this.currentTrigger = ''
			this.allTingCards = []
	}

		onEnterStart(lifecycle, arg1, arg2) {
			super.onEnterStart(lifecycle, arg1, arg2);

			this.cards = this.algo.initCards(this.gameConfig.initCards);
			process.nextTick(() => {
				this.fsm.bankerTrans();
			});
		}

		onEnterBanker(lifecycle, arg1, arg2) {
			this.m_banker = this.container.mjbanker.getBanker(this);
			if (this.m_banker >= 0 && this.m_banker < this.playerCount) {
				this.currentIndex = this.m_banker;
			} else {
				this.currentIndex = 0;
			}
			process.nextTick(() => {
				this.fsm.shuffleTrans();
			});
		}

		onEnterShuffle(lifecycle, arg1, arg2) {
			//super.onEnterShuffle(lifecycle, arg1, arg2); 不适用
			console.log("onEnterShuffle ");
			this.cards = _.shuffle(this.cards);
			//var inpuCards = [21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 20, 20, 20, 20, 20];
			// let inpuCards = [
			// 	8, 8, 9, 9, 10, 10, 12, 12, 13, 13, 29, 29, 31,
			// 	30, 30, 30, 27, 27, 27, 31, 31, 31, 28, 28, 29, 29,
			// 	17, 17, 17, 11, 11, 18, 18, 18, 19, 19, 19, 33, 32,
			// 	21, 21, 22, 22, 23, 23, 24, 24, 31, 30, 20, 20, 20,
			// 	28, 21, 22, 22, 23, 23, 24, 24, 25, 25, 29, 29, 29, 31
			// ];

			//一条龙
			// let inpuCards = [
			// 	8,9,10,11,12,13,14,15,16,23,24,25,16,
			// 	20,4,7,26,4,11,16,0,28,11,17,9,1,
			// 	15,32,10,5,14,13,18,1,11,19,5,21,30,
			// 	34,5,4,14,33,13,3,32,31,2,5,0,4,
			// 	16				
			// ];
			
			let inpuCards = [
				8, 8, 9, 9, 10, 10, 12, 12, 13, 13, 29, 29, 31,
				30, 30, 30, 27, 27, 27, 31, 31, 31, 28, 28, 29, 29,
				17, 17, 17, 11, 11, 18, 18, 18, 19, 19, 19, 32, 33,
				21, 21, 22, 22, 23, 23, 24, 24, 31, 30, 20, 20, 20,
				28, 21, 22, 22, 23, 23, 24, 24, 25, 25, 29, 29, 29, 31
			];

			if (_.isArray(inpuCards) && inpuCards.length >= 0) {
				for (let i = 0; i < inpuCards.length && i < this.cards.length; i++) {
					if (inpuCards[i] === this.cards[i]) {
						continue;
					}
					for (let j = i + 1; j < this.cards.length; j++) {
						if (inpuCards[i] === this.cards[j]) {
							this.cards[j] = this.cards[i];
							this.cards[i] = inpuCards[i];
						}
					}
				}
			}

			process.nextTick(() => {
				this.fsm.dealTrans();
			});
		}

		onEnterDeal(lifecycle, arg1, arg2) {
			const playerInitCards = this.gameConfig.playerInitCards;
			const { playerCards, remainCards } = this.algo.dealCards(this.cards, playerInitCards);

			const gamePlayer = this.getCurrGamePlayer() as MJGamePlayer
			this.currentCard.card = remainCards.shift() as number
			this.currentCard.shift = true
			this.currentCard.bIndex = remainCards.length
			this.currentCard.fIndex = this.outPutCount
			this.currentCard.uid = gamePlayer.uid

			console.log(playerCards);
			console.log(this.m_banker);
			playerCards[this.m_banker].push(this.currentCard.card);//庄多发一张牌

			if (playerCards.length > 0 && this.gamePlayers.length == playerCards.length) {
				_.forEach(this.gamePlayers, (v: MJGamePlayer, i) => {
					if (v != undefined) {
						v.initCards = playerCards[i];
						v.cards = _.cloneDeep(v.initCards);
						this.container.channel.pushMessageByIds(PushEvent.mj_onDeal_, { cards: v.cards }, v.uid)
					}
				});
				this.remainCards = remainCards;

				process.nextTick(() => {
					this.fsm.outputTrans(false);
				});
			}
		}

		onBeforeOutputTrans(lifecycle, arg1, arg2) {
			if (this.remainCards.length > 0) {
				return true
			}
			return false
		}

		onEnterOutput(lifecycle, getCard: boolean = true, shift: boolean = true) {
			this.resetCurrentCard()

			const gamePlayer = this.getCurrGamePlayer() as MJGamePlayer
			gamePlayer.onOutput()
			if (getCard) {
				this.currentCard.card = (shift ? this.remainCards.shift() : this.remainCards.pop()) as number
			this.currentCard.shift = shift
			this.currentCard.type = MJCardOriginType.OUTPUT
			this.currentCard.bIndex = this.remainCards.length
			this.currentCard.fIndex = this.outPutCount
			this.currentCard.uid = gamePlayer.uid
			}
			

			const { handles } = this.triggerTest('output', gamePlayer)

			if (_.isEmpty(handles) && getCard) {
				gamePlayer.pushCard(this.currentCard.card)
			}
			const netdata = { uid: gamePlayer.uid, card: this.currentCard, remainCards: this.remainCards.length, shift: shift, handles, outPutCount: this.outPutCount }
			this.container.channel.pushMessageByIds(PushRoute.mj_onOutput_, netdata, gamePlayer.uid)
			if (getCard) {
			this.container.channel.pushMessage(PushRoute.mj_onOutput, _.omit(netdata, 'card', 'handles'))
			++this.outPutCount
		}
		}

		triggerTest(triggerName: string, gamePlayer: MJGamePlayer, card?: number) {
			let handles
			const trigger = this.container.mjtriggerManage.getTrigger(triggerName)
			if (trigger != undefined) {
				this.container.mjtriggerManage.triggerTest(triggerName, { game: this, gamePlayer, currentCard: this.currentCard, card: _.defaultTo(card, this.currentCard.card) })
				if (!trigger.handleManage.isEmpty()) {
					this.currentTrigger = triggerName
					handles = trigger.handleManage.handles
				}
			}
			return { handles, trigger }
		}

		onEnterInput(lifecycle, msg, arg2) {
			this.resetCurrentCard()
			const gamePlayer = this.getCurrGamePlayer() as MJGamePlayer
			gamePlayer.inputCard(msg.card)
			this.currentCard.card = msg.card
			this.currentCard.type = MJCardOriginType.INPUT
			this.currentCard.uid = gamePlayer.uid

			this.container.mjrulerobjManage.onDaPai(gamePlayer)
			
			const {handles} = this.triggerTest('input', gamePlayer)

			const netdata = { uid: msg.uid, card: msg.card, cardCount: gamePlayer.cards.length }
			this.container.channel.pushMessage(PushRoute.mj_onInput, netdata)

			if (_.isEmpty(handles)) {
				process.nextTick(() => {
					this.inputTemplate(true, true)
				})
			} else {
				this.sendPlayerHandles(handles)
			}
		}

		inputTemplate(shift: boolean = true, turnNext: boolean = true) {
			if (this.remainCards.length == 0) {
				process.nextTick(() => {
					this.fsm.overTrans()
				});
			} else {
				if (turnNext) {
					this.turnNext()
				}
				process.nextTick(() => {
					this.fsm.outputTrans(true,shift)
				});
			}
		}

		onEnterOver(lifecycle, arg1, arg2) {
			super.onEnterOver(lifecycle, arg1, arg2)

			//小结算
			console.log("----------------------进入小结算----------------------------");
			let notify:any =  MJNotify.fillMsg(this,MJMsgFillType.FillMJMinSettleScores);
			this.container.channel.pushMessage(PushEvent.mj_onMinSettleScores,notify);

			console.log(">>当前圈[%d]",this.currentRound);
			if(this.currentRound >= 2){
				//大结算
				console.log("----------------------进入大结算----------------------------");
				let notify:any = MJNotify.fillMsg(this,MJMsgFillType.FillMJMaxSettleScores);
				this.container.channel.pushMessage(PushEvent.mj_onMaxSettleScores, notify);
		}
		}

		selectHandle(gamePlayer: MJGamePlayer, msg) {
			const triggerName = this.currentTrigger
			const trigger = this.container.mjtriggerManage.getTrigger(triggerName)
			console.log("trigger:" + triggerName)
			console.log(trigger)
			let handleOver = true
			if (trigger != undefined && !trigger.handleManage.isEmpty()) {
				trigger.handleManage.selectHandle(this, gamePlayer, msg.state, msg.type, msg.subType, msg.selectIndex)
				const { state, handles, type } = trigger.handleManage.findHandleResult()
				console.log("state")
				console.log(state)
				if (state == MJHandleState.CANCEL) {
					this.onCancelHandle(triggerName, trigger, gamePlayer)
				} else if (state == MJHandleState.CONFIRM) {
					const handleGamePlayer = this.findPlayerByUid(handles[0].uid)
					if (trigger.needHook) {
						handleOver = this.exeNextTrigger(trigger, type, handles, handleGamePlayer, trigger.needHook)
					}
					
					if (handleOver) {
						this.onConfirmHandle(trigger, type, handles, handleGamePlayer)
					}
				}
				else{
					handleOver = false
				}
				if (handleOver) {
					this.container.mjtriggerManage.clearTriggerHandles()
					this.currentTrigger = ''
				}
			}
			return handleOver
		}

		onCancelHandle(triggerName: string, trigger: MJTrigger, gamePlayer: MJGamePlayer) {
			if (triggerName == 'output' && this.currentCard.type == MJCardOriginType.OUTPUT) {
				gamePlayer.pushCard(this.currentCard.card)
			} else if (triggerName == 'input') {
				this.inputTemplate(true, true)
			}
			
			// else if (triggerName == 'ganghu') {
			// 	this.inputTemplate(false, false)
			// }
			if (trigger.lastTrigger != undefined && trigger.lastTriggerCache != undefined) {

				this.onConfirmHandle(trigger.lastTrigger!, trigger.lastTriggerCache.cardGroupType!, trigger.lastTriggerCache.handles!, trigger.lastTriggerCache.gamePlayer!)
			}
		}

		exeNextTrigger(currentTrigger: MJTrigger, type: MJCardGroupType, currentHandles: Array<MJHandle>, gamePlayer: MJGamePlayer, needHook: boolean) {
			let handleOver = true
			if (_.isString(currentTrigger.nextTrigger) && currentTrigger.nextTrigger!.length > 0) {
				const nextTrigger = this.container.mjtriggerManage.getTrigger(currentTrigger.nextTrigger!)
				console.log("nextTrigger")
				console.log(nextTrigger)
				if (nextTrigger != undefined) {
					const hookResult = nextTrigger.evalHookExpr({currentHandles})
					console.log("hookResult")
					console.log(hookResult)
					if (hookResult) {
						const { handles, trigger } = this.triggerTest(currentTrigger.nextTrigger!, gamePlayer, currentHandles[0].getCard())
						if (!_.isEmpty(handles)) {
							this.sendPlayerHandles(handles)
							if (needHook) {
								trigger!.lastTrigger = currentTrigger
								trigger!.lastTriggerCache = new MJTriggerCache(currentHandles, gamePlayer, type)
								handleOver = false
							}
						}
					}
				}
			}
			return handleOver 
		}

		onConfirmHandle(currentTrigger: MJTrigger, type: MJCardGroupType, currentHandles: Array<MJHandle>, gamePlayer: MJGamePlayer) {
			const curGamePlayer = this.gamePlayers[this.currentIndex]
			// TODO: triggeraction 的card 参数错误
			this.container.mjtriggerManage.triggerAction(currentHandles, { game: this, curGamePlayer, gamePlayer, currentCard: this.currentCard, card: this.currentCard.card });
			if (this.currentCard.type == MJCardOriginType.INPUT) {
				(this.gamePlayers[this.currentIndex] as MJGamePlayer).popInputCard()
				if (type != MJCardGroupType.HU) {
					const lastPlayerId = this.gamePlayers[this.currentIndex].uid
					const gamePlayer = this.findPlayerByUid(currentHandles[0].uid)
					this.currentIndex = gamePlayer.index
				}
			}
			console.log("type")
			console.log(type)
			console.log(gamePlayer.cards)

			// 记录上一个动作，用于杠上花等
			if (type !== MJCardGroupType.HU){
				this.lastHandles = currentHandles
			}
			if(type===MJCardGroupType.PENG && this.remainCards.length>0){
				this.resetCurrentCard()
			}
			if (type == MJCardGroupType.GANG) {
				this.inputTemplate(true, false)
			} else if ((type == MJCardGroupType.PENG || type == MJCardGroupType.CHI) && currentTrigger.needHook == false) {
				process.nextTick(()=>{
					this.exeNextTrigger(currentTrigger, type, currentHandles, gamePlayer, false)
				})				
			} else if (type == MJCardGroupType.HU) {
				this.onGamePlayerHu(currentTrigger, currentHandles, gamePlayer)
			}
			
			this.sendSelectResult(currentHandles)
			console.log(gamePlayer.cards)
		}

		incrGamePlayersHuCount(uids: Array<string>) {
			_.forEach(uids, (v) => {
				const gamePlayer = this.findPlayerByUid(v) as MJGamePlayer
				if (gamePlayer != null) {
					gamePlayer.incrHuCount()
				}
			})
		}
		canInPutCard(gamePlayer,card):boolean{return true} 
		afterHu(uids){}
		onGamePlayerHu(currentTrigger: MJTrigger, currentHandles: Array<MJHandle>, gamePlayer: MJGamePlayer) {
			const uids = _.map(currentHandles, 'uid')
			const curGamePlayer = this.gamePlayers[this.currentIndex]
			//this.container.mjcomboManage.computeCombo({game:this,curGamePlayer, scoreData: currentTrigger.scoreData, uids, gamePlayer,card:this.currentCard.card})
			//this.container.mjRuleManage.checkRule({game:this,curGamePlayer, scoreData: currentTrigger.scoreData, uids, gamePlayer,card:this.currentCard.card})
			this.incrGamePlayersHuCount(uids)
			//this.container.emitter.emit('onPlayerHu',{}, {game:this,curGamePlayer, uids, gamePlayer})
			this.afterHu(uids)

			if (this.remainCards.length == 0 || this.container.mjover.check(this)) {
				this.fsm.overTrans()
			} else {
				this.container.mjover.overTemplate(this, currentHandles)
				const huResults: Array<boolean> = []

				_.forEach(this.gamePlayers, (v) => {
					if (_.includes(uids, v.uid)) {
						huResults.push(true)
					} else {
						huResults.push(false)
					}
				})

				const lastIndex = _.findLastIndex(huResults, (v) => { return v == true })
				this.turnNext(lastIndex)
				this.fsm.outputTrans(true)
			}
		}

		sendPlayerHandles(handles) {
			const groupHandles = _.groupBy(handles, 'uid')
			_.forEach(groupHandles, (v, k) => {
				const gamePlayer = this.findPlayerByUid(k)
				if (gamePlayer != undefined) {
					this.container.channel.pushMessageByIds(PushRoute.mj_onSelectHandle, { handles: v }, k)
				}
			})
		}

		sendSelectResult(handles: Array<MJHandle>) {
			const groupHandles = _.groupBy(handles, 'uid')
			_.forEach(this.gamePlayers, (v) => {
				const uid = v.uid
				const results = new Array<any>()
				_.forEach(groupHandles, (v , k) => {
					const gamePlayer = this.findPlayerByUid(k) as MJGamePlayer
					if (gamePlayer != undefined) {
						results.push({ uid: gamePlayer.uid, card: this.currentCard.card, cardGroups: gamePlayer.cardGroupManage.getPrivateCardGroups(), handles: v, cards: uid == gamePlayer.uid ? gamePlayer.cards.concat() : gamePlayer.cards.length })
					}
				})
				this.container.channel.pushMessageByIds(PushRoute.mj_onSelectHandleResult_, {results}, uid)
			})
		}

		resetCurrentCard() {
			this.lastCard = this.currentCard
			this.currentCard.rest()
		}

		reset() {
			super.reset()
			this.lastCard.rest()
			this.currentCard.rest()
			this.outPutCount = 0
			this.currentTrigger = ''
			this.lastHandles = null
		}

		clientInfo() {
			const clientInfo = super.clientInfo()

			return clientInfo
		}

		canHandle(uid: string) {
			let result = false
			if (_.isString(this.currentTrigger) && this.currentTrigger.length > 0) {
				const trigger = this.container.mjtriggerManage.getTrigger(this.currentTrigger)
				if (trigger != null) {
					if(uid != undefined){
						result = trigger.handleManage.canHandle(uid)
					}
					else{
						result = trigger.handleManage.isEmpty()
					}
				}
			}
			return result
		}

		turnNext(index: number = this.currentIndex) {
			let nextPlayer = _.find(this.gamePlayers, (v: MJGamePlayer) => {
				return v.index > index && v.over == false
			})
			if (nextPlayer == undefined) {
				nextPlayer = _.find(this.gamePlayers, (v) => {
					return v.index >= 0 && v.over == false
				})
			}
			if (nextPlayer != undefined) {
				this.currentIndex = nextPlayer.index
				// 切换玩家打牌或抓牌，把上个动作清空
				this.lastHandles = null
			}
		}

		getCurrentHandles(){
			if (_.isString(this.currentTrigger) && this.currentTrigger.length > 0) {
				const trigger = this.container.mjtriggerManage.getTrigger(this.currentTrigger)
				if (trigger != null) {
					return trigger.handleManage.handles
				}
			}

			return []
		}

		getCurrentPlayer(){
			return this.gamePlayers[this.currentIndex]
		}
	};
}
