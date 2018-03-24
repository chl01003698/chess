import { MJHandle } from '../../components/MJHandleManage';
import { MJCardOriginType, MJHandleState, MJCardGroupType } from '../../consts/MJEnum';
import { MJCardGroup, MJCardGroupManage } from '../../components/MJCardGroupManage';
import MJGame from '../../MJGame';
import FriendGame from '../../../friendGame';
import * as objectPath from 'object-path'
import { MJAlgo } from '../../MJAlgo';
import * as _ from 'lodash'
import MJNCGamePlayer from './MJXZGamePlayer';
import * as MJ from '../../consts/MJConsts';

let mjlib = require('../../MJAlgo/mjlib_js/api.js');

export class SCXZMJAlGo extends MJAlgo {
	static testHu(params) {
		const card = params.card
		console.log("card")
		console.log(card)

		let cloneCards = _.clone(params.gamePlayer.cards) as Array<number>

		cloneCards.push(card)

		//cloneCards.sort((a, b) => a - b)
		return { ok: MJAlgo.canHu(cloneCards, true) }
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

	static testBuGang(params) {
		const cardGroupManage = params.gamePlayer.cardGroupManage as MJCardGroupManage
		const pengCards = _.map(cardGroupManage.filterCardGroupByType(MJCardGroupType.PENG), 'card')
		const cards = _.clone(params.gamePlayer.cards) as Array<number>
		cards.push(params.card)
		_.pullAll(cards, params.gamePlayer.raoGang)
		const gangCards = _.intersection(pengCards, cards)
		return {
			ok: gangCards.length > 0,
			data: gangCards
		}
	}

	static filterBaiPai(params) {
		if (params.gamePlayer.ting==true || params.game.remainCards.length < 12) {
			return false
		}
		return true
	}

	static testBaiPai(params) {
		let tempCards = _.clone(params.gamePlayer.cards) as Array<number>
		tempCards.push(params.card)
		let tingInfo = this.canTing(tempCards);
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
		params.game.allTingCards = _.union(params.game.allTingCards, params.gamePlayer.m_huCards);
	}
}

export default class FriendMJXZGame extends MJGame(FriendGame) {
	constructor(...args: any[]) {
		super(...args);
		this.algo = SCXZMJAlGo
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
}