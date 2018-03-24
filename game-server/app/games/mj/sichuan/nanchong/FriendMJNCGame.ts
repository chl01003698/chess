import { MJHandle } from '../../components/MJHandleManage';
import { MJCardOriginType, MJHandleState, MJCardGroupType } from '../../consts/MJEnum';
import { MJCardGroup, MJCardGroupManage } from '../../components/MJCardGroupManage';
import MJGame from '../../MJGame';
import FriendGame from '../../../friendGame';
import * as objectPath from 'object-path'
import { MJHuTestData, MJAlgo } from '../../MJAlgo';
import * as _ from 'lodash'
import MJNCGamePlayer from './MJNCGamePlayer';
import * as MJ from '../../consts/MJConsts';
import MJComboBase from '../../MJComboBase';

let mjlib = require('../../MJAlgo/mjlib_js/api.js');

export function processGameConfig_MJNC(roomConfig, gameConfig) {
	if (roomConfig.cantZhang) {
		objectPath.del(gameConfig, 'triggers.input.actions.1.0');
	}
	gameConfig.baipai = roomConfig.baipai
	gameConfig.piaoIndex = roomConfig.piaoIndex
	return gameConfig
}

export class SCNCMJAlGo extends MJAlgo {
	static testHu(params) {
		const card = params.card
		console.log("card")
		console.log(card)

		if (params.game.gameConfig.baipai && params.gamePlayer.ting) {
			if (_.indexOf(params.gamePlayer.huList, card) !== -1) {
				return new MJHuTestData(true, card)
			} else {
				return new MJHuTestData(false, card)
			}
		}

		let cloneCards = _.clone(params.gamePlayer.cards) as Array<number>

		cloneCards.push(card)

		//cloneCards.sort((a, b) => a - b)
		//	return { ok: MJAlgo.canHu(cloneCards, true) }
		return new MJHuTestData(MJAlgo.canHu(cloneCards, true), card)
	}

	static actionPeng(params) {
		const result = {
			ok: false,
			data: undefined
		}

		const cards = params.gamePlayer.cards as Array<number>
		const card = params.card

		if (_.filter(cards, (v) => v == card).length >= 2) {
			if (_.filter(cards, (v) => v == card).length >= 3) {
				params.gamePlayer.raoGang.push(card);
			}
			cards.splice(cards.indexOf(card), 1)
			cards.splice(cards.indexOf(card), 1)
			result.ok = true
			const cardGroupManage = params.gamePlayer.cardGroupManage as MJCardGroupManage
			//const triggerGamePlayer = params.triggerGamePlayer

			cardGroupManage.pushCardGroup(new MJCardGroup(MJCardGroupType.PENG, _.fill(new Array(3), card), card, params.gamePlayer.uid))
		}
		return result
	}

	static testAnGang(params) {
		let cards = _.clone(params.gamePlayer.cards as Array<number>)
		let card = params.card
		if (_.isNumber(card)) {
			cards.push(card)
		}

		let handCards = MJAlgo.formatCards(cards);
		let cardlist: number[] = []

		if (params.game.gameConfig.baipai && params.gamePlayer.ting == true) {
			for (let card of params.gamePlayer.baiPai) {
				handCards[card]--;
			}
			if (handCards[params.card] >= 4) {
				handCards[params.card] -= 4;
				if (MJComboBase.getCardsCount(handCards) == 0 || MJAlgo.canHuArr34(handCards, true)) {
					cardlist.push(params.card)
				}
			}
		}
		else {
			for (let i = MJ.MIN_CODE_INDEX; i <= MJ.MAX_CHECKCODE_INDEX; i++) {
				if (handCards[i] >= 4) {
					cardlist.push(i)
				}
			}
		}

		return {
			ok: cardlist.length > 0,
			data: cardlist
		}
	}

	static testDianGang(params) {
		let cards = _.clone(params.gamePlayer.cards as Array<number>)
		let card = params.card
		if (_.isNumber(card)) {
			cards.push(card)
		}

		let handCards = MJAlgo.formatCards(cards);
		let cardlist: number[] = []

		if (params.game.gameConfig.baipai && params.gamePlayer.ting == true) {
			for (let card of params.gamePlayer.baiPai) {
				handCards[card]--;
			}
			if (handCards[params.card] >= 4) {
				handCards[params.card] -= 4;
				if (MJComboBase.getCardsCount(handCards) == 0 || MJAlgo.canHuArr34(handCards, true)) {
					cardlist.push(params.card)
				}
			}
		}
		else {
			if (handCards[params.card] >= 4) {
					cardlist.push(params.card)
				}
		}

		return {
			ok: cardlist.length > 0,
			data: cardlist
		}
	}

	static testBuGang(params) {
		const cardGroupManage = params.gamePlayer.cardGroupManage as MJCardGroupManage
		const pengCards = _.map(cardGroupManage.filterCardGroupByType(MJCardGroupType.PENG), 'card')
		const cards = _.clone(params.gamePlayer.cards) as Array<number>
		if (params.card > 0) {
			cards.push(params.card)
		}
		if (params.game.gameConfig.raoGang) {
			_.pullAll(cards, params.gamePlayer.raoGang)
		}
		const gangCards = _.intersection(pengCards, cards)
		return {
			ok: gangCards.length > 0,
			data: gangCards
		}
	}

	static filterBaiPai(params) {
		if (params.game.gameConfig.baipai && (params.gamePlayer.ting == true || params.game.remainCards.length < 12)) {
			return false
		}
		return true
	}

	static testBaiPai(params) {
		let cards = _.clone(params.gamePlayer.cards) as Array<number>
		if (params.card > 0) {
			cards.push(params.card)
		}
		let tingInfo = this.canTing(cards, true);
		if (tingInfo.length) {
			_.remove(tingInfo, (info) => {
				return _.indexOf(params.game.allTingCards, info['card']) !== -1;
			})
		}

		return {
			ok: tingInfo.length > 0,
			data: tingInfo
		};
	}

	static actionBaiPai(params) {
		params.gamePlayer.ting = true
		params.gamePlayer.baipai = params.cards
		console.log("params.game.allTingCards")
		console.log(params.game.allTingCards)
		console.log("params.gamePlayer.huList")
		console.log(params.gamePlayer.huList)
		params.game.allTingCards = _.union(params.game.allTingCards, params.gamePlayer.huList);

	}
}

export default class FriendMJNCGame extends MJGame(FriendGame) {
	maxpiao: number = 0
	constructor(...args: any[]) {
		super(...args);
		this.algo = SCNCMJAlGo
	}

	onEnterReady(lifecycle, arg1, arg2) {
		super.onEnterReady(lifecycle, arg1, arg2);
		console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    this.gameConfig.piaos")
		console.log(this.gameConfig.piaoList)
		console.log("this.gameConfig.piaoIndex")
		console.log(this.gameConfig.piaoIndex)
		if(!this.gameConfig.piaoIndex){
			this.gameConfig.piaoIndex = 0;
		}
		this.maxpiao = this.gameConfig.piaoList[this.gameConfig.piaoIndex]
		console.log(this.maxpiao)
	}

	onEnterDeal(lifecycle, arg1, arg2) {
		if (this.maxpiao < 1) {
			super.onEnterDeal(lifecycle, arg1, arg2);
		}
	}

	selectPiao(gamePlayer, msg) {
		gamePlayer.piao = msg.piao;
		for (let i = 0; i < this.gamePlayers.length; i++) {
			if (this.gamePlayers[i].piao < 0) {
				return
			}
		}
		process.nextTick(() => {
			this.fsm.dealTrans();
		});
	}

	afterHu(uids) {
		_.forEach(uids, (v) => {
			const gamePlayer = this.findPlayerByUid(v) as MJNCGamePlayer
			if (gamePlayer != null) {
				this.container.mjbanker.setPaoHu(this.currentIndex, gamePlayer.index);
			}
		})
	}

	canBaiPai(gamePlayer: MJNCGamePlayer, msg: any) {
		let result = false
		let handCards = gamePlayer.cards.concat() as number[];
		if (this.currentCard.type == MJCardOriginType.OUTPUT) {
			handCards.push(this.currentCard.card)
		}
		if (_.isString(this.currentTrigger) && this.currentTrigger.length > 0) {
			const trigger = this.container.mjtriggerManage.getTrigger(this.currentTrigger)
			if (trigger != null) {
				return _.some(trigger.handleManage.handles, (v: MJHandle) => {
					if (v.uid == gamePlayer.uid && v.state == MJHandleState.NONE && v.type == MJCardGroupType.BAIPAI) {
						for (let baipaiinfo of v.testData.data) {
							if (baipaiinfo['card'] === msg.card) {
								let tempcards = handCards.concat();
								for (let oneCard of msg.cards) {
									if (_.indexOf(tempcards, oneCard) !== -1) {
										_.pullAt(tempcards, _.indexOf(tempcards, oneCard))
									}
									else {
										console.log("baipaiinfo['card'] err 1:");
										return false;
									}
								}

								if (_.indexOf(tempcards, msg.card) !== -1) {
									_.pullAt(tempcards, _.indexOf(tempcards, msg.card))
								}
								else {
									console.log("baipaiinfo['card'] err 11:");
									return false;
								}

								if (tempcards.length !== 0 && !MJAlgo.canHu(tempcards)) {
									if (!mjlib.MHulib.get_shun_info(MJAlgo.formatCards(tempcards))) {
										console.log("baipaiinfo['card'] err 2:");
										return false;
									}
								}

								let tinginfo = MJAlgo.canShunKe(msg.cards, true);
								console.log("tingInfo:" + tinginfo)
								//console.log("tinginfo['hulist']:" + tinginfo['hulist'])
								if (tinginfo && tinginfo['hulist'].length > 0) {
									gamePlayer.huList = tinginfo['hulist']
									return true;
								}
								console.log("baipaiinfo['card'] err 2xx:");
								return false;
							}
						}
					}
				});
			}
		}
	}
	doBaiPai(gamePlayer: MJNCGamePlayer, msg) {
		//this.container.mjactionManage.get("baipai"). evalActionExpr()
		const triggerName = this.currentTrigger
		const trigger = this.container.mjtriggerManage.getTrigger(triggerName)

		let handleOver = true
		if (trigger != undefined) {
			trigger.handleManage.selectHandle(this, gamePlayer, msg.state, msg.type, msg.subType, msg.selectIndex)
			const { state, handles, type } = trigger.handleManage.findHandleResult()

			console.log("trigger:" + triggerName)
			console.log(trigger)

			const curGamePlayer = this.gamePlayers[this.currentIndex]

			this.container.mjtriggerManage.triggerAction(handles, { game: this, curGamePlayer, gamePlayer, cards: msg.cards, card: msg.card });

			this.container.mjtriggerManage.clearTriggerHandles()
			this.currentTrigger = ''

			this.fsm.inputTrans({ uid: gamePlayer.uid, card: msg.card })
		}

		return handleOver
	}
	canInPutCard(gamePlayer: MJNCGamePlayer, card: number): boolean {
		if (this.gameConfig.baipai) {
			if (gamePlayer.ting === true) {
				if (card !== this.currentCard.card) {
					return false
				}
			}
			else {
				console.log("putCard allTingCards" + this.allTingCards)
				if (_.indexOf(this.allTingCards, card) !== -1) {
					let cards = gamePlayer.cards.concat()
					if (_.pullAll(cards, this.allTingCards).length > 0) {
						return false
					} else if (card !== this.currentCard.card) {
						return false
					}
				}
			}
		}
		return true;
	}

}