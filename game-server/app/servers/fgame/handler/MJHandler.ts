import * as _ from 'lodash';
import * as Raven from 'raven';
import { handleGamePlayer, respOK, respError, JoiValidate } from '../../../util/helpers';
import Code from '../../../consts/code';
import Game from '../../../games/game';
import GamePlayer from '../../../games/gamePlayer';
import * as Joi from 'joi';
import MJGamePlayer from '../../../games/mj/MJGamePlayer';

export = function newHandler(app): MJHandler {
	return new MJHandler(app);
};

class MJHandler {
	constructor(private app) {}

	selectCPGH(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			const validate = JoiValidate(msg, {
				type: Joi.number().integer().min(0).max(5).required(),
				subType: Joi.number().integer().min(0).max(5).required(),
				selectIndex: Joi.number().integer().min(0).max(4),
				state: Joi.number().integer().min(1).max(2).required()
			}, next);
			if (!validate) return;

			handleGamePlayer.bind(this)(msg, session, next, (game: any, gamePlayer: GamePlayer) => {
				if (!game.canHandle(gamePlayer.uid)) return respError(next, Code.GAME.MJ_CAN_NOT_HANDLE)
				const handleOver = game.selectHandle(gamePlayer, msg)
				respOK(next, { handleOver })
			})
		})
	}

	input(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			const validate = JoiValidate(msg, {
				card: Joi.number().required()
			}, next);
			if (!validate) return;

			handleGamePlayer.bind(this)(msg, session, next, (game: any, gamePlayer: MJGamePlayer) => {
				if (!game.isCurrentPlayer(gamePlayer.uid)) return respError(next, Code.GAME.NOT_CURRENT_INDEX)
				if (gamePlayer.cardGroupManage.getCardCount() + gamePlayer.cards.length != game.gameConfig.playerInitCards + 1) return respError(next, Code.GAME.MJ_CARD_NUMBER_ERROR)
				if (game.canHandle()) return respError(next, Code.FAIL)
				if (!gamePlayer.hasCard(msg.card)) return respError(next, Code.FAIL)
				if (!game.canInPutCard(gamePlayer,msg.card)) return respError(next, Code.FAIL)
				game.fsm.inputTrans({uid: gamePlayer.uid, card: msg.card})
				respOK(next)
			})
		})
	}
}