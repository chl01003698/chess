import { JoiValidate } from '../util/helpers';
import * as Joi from 'joi';
import Code from '../consts/code';
import PushEvent from '../consts/pushEvent';
import * as _ from 'lodash';
import * as Raven from 'raven';
import logger from '../util/logger';
import { UserModel } from '../extend/db';

export default class GMManage {
	cmds;

	constructor(private app) {
		this.cmds = {
			// $addCoin -s 100583 -v 1000 -t gold
			$addCoin: {
				opts: {
					alias: {
						shortId: 's',
						value: 'v',
						type: 't'
					},
					default: {
						shortId: 0,
						type: 'gold'
					}
				},
				execute: async (args, next, user) => {
					try {
						const validate = JoiValidate(
							args,
							{
								shortId: Joi.number().required(),
								value: Joi.number().max(1000000).required(),
								type: Joi.string().required()
							},
							next
						);
						if (!validate) return;
						let exeUser: any = undefined;
						const shortId = args['shortId'];
						const coinType = args['type'];
						if (shortId == 0) {
							exeUser = user;
						} else if (shortId > 0) {
							exeUser = await UserModel.byShortId(shortId).select('coin').exec();
						}
						if (exeUser == null) return next(null, Code.NO_EXIST_USER);
						const value =
							args['value'] < 0
								? -_.min([ Math.abs(args['value']), (exeUser as any).coin[coinType] ])
								: args['value'];
						(exeUser as any)['coin'][coinType] += value;
						exeUser['save']();
						this.app.get('statusService').pushByUids([ exeUser.id ], PushEvent.onUpdateCoin, {
							coin: exeUser.coin,
							msg: ''
						});
						next(null, { code: Code.OK });
					} catch (error) {
						Raven.captureException(error);
					}
				}
			},
			$checkCoin: {
				opts: {
					alias: {
						shortId: 's'
					},
					default: {
						shortId: 0
					}
				},
				execute: async (args, next, user) => {
					try {
						const validate = JoiValidate(
							args,
							{
								shortId: Joi.number().required()
							},
							next
						);
						if (!validate) return;
						let exeUser: any = undefined;
						const shortId = args['shortId'];
						if (shortId == 0) {
							exeUser = user;
						} else if (shortId > 0) {
							exeUser = await UserModel.byShortId(shortId).select('coin nickname').exec();
						}
						if (exeUser == null) return next(null, Code.NO_EXIST_USER);
						next(null, {
							code: _.assign(Code.OK, {
								msg: '昵称: ' + exeUser.nickname + '\n金币: ' + (exeUser as any).coin.gold
							})
						});
					} catch (error) {
						Raven.captureException(error);
					}
				}
			},
			$gm: {
				opts: {
					alias: {
						shortId: 's',
						level: 'l'
					}
				},
				execute: async (args, next, user) => {
					try {
						const validate = JoiValidate(
							args,
							{
								shortId: Joi.number().required(),
								level: Joi.number().min(0).max(1).required()
							},
							next
						);
						if (!validate) return;
						let exeUser: any = undefined;
						const shortId = args['shortId'];
						if (shortId == 0) {
							exeUser = user;
						} else if (shortId > 0) {
							exeUser = await UserModel.byShortId(shortId).select('coin GMLevel').exec();
						}
						if (exeUser == null) return next(null, Code.NO_EXIST_USER);
						exeUser.GMLevel = args['level'];
						exeUser.save();
						next(null, { code: Code.OK });
					} catch (error) {
						Raven.captureException(error);
					}
				}
			}
		};
	}
}
