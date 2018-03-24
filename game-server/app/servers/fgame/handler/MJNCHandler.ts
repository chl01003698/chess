import * as _ from 'lodash';
import * as Raven from 'raven';
import { handleGamePlayer, respOK, respError, JoiValidate } from '../../../util/helpers';
import Code from '../../../consts/code';
import Game from '../../../games/game';
import GamePlayer from '../../../games/gamePlayer';
import * as Joi from 'joi';
import MJNCGamePlayer from '../../../games/mj/sichuan/nanchong/MJNCGamePlayer';
import FriendMJNCGame from '../../../games/mj/sichuan/nanchong/FriendMJNCGame';

export = function newHandler(app): MJNCHandler {
	return new MJNCHandler(app);
};

class MJNCHandler {
	constructor(private app) { }

	selectPiao(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			const validate = JoiValidate(msg, {
				piao: Joi.number().integer().min(0).max(5).required(),
			}, next);
			if (!validate) return;

			handleGamePlayer.bind(this)(msg, session, next, (game: FriendMJNCGame, gamePlayer: MJNCGamePlayer) => {
				const handleOver = game.selectPiao(gamePlayer, msg)
				respOK(next)
			})
		})
	}

	selectBaiPai(msg: any, session: any, next: (error, object) => void) {
		Raven.context(() => {
			const validate = JoiValidate(msg, {
				type: Joi.number().integer().min(0).max(5).required(),
				subType: Joi.number().integer().min(0).max(5).required(),
				selectIndex: Joi.number().integer().min(0).max(4),
				state: Joi.number().integer().min(1).max(2).required(),
				card: Joi.number().required(),
				cards: Joi.array().items(Joi.number()).required()
			}, next);
			if (!validate) return;

			handleGamePlayer.bind(this)(msg, session, next, (game: FriendMJNCGame, gamePlayer: MJNCGamePlayer) => {
				if (!game.isCurrentPlayer(gamePlayer.uid)) return respError(next, Code.GAME.NOT_CURRENT_INDEX)
				if (!game.canBaiPai(gamePlayer, msg)) return respError(next, Code.GAME.MJ_CAN_NOT_HANDLE)
				if (!gamePlayer.hasCard(msg.card) && game.currentCard.card !== msg.card) {
					return respError(next, Code.FAIL)
				}
				const handleOver = game.doBaiPai(gamePlayer, msg)
				respOK(next, { handleOver })
			})
		})
	}
}