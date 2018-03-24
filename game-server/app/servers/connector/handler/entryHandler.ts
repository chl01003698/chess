import * as moment from 'moment'
import { CoreComponent } from '../../../components/core';
import * as Raven from 'raven';
import { callFGameRemoteFunc, JoiValidate, respError } from '../../../util/helpers';
import * as Joi from 'joi'
import { UserModel } from '../../../extend/db';
import Code from '../../../consts/code';
import { bindSessionAndNext } from '../../../services/login';

export = function newHandler(app): EntryHandler {
	return new EntryHandler(app);
};

class EntryHandler {
	constructor(private app) {}

	login(msg: any, session: any, next: (error, object) => void) {
		Raven.context(async () => {
			const validate = JoiValidate(msg, {
				token: Joi.string().required()
			}, next)
			if (!validate) return 
			const user = await UserModel.findClientUserByToken(msg['token'])
			if (user == null) return respError(next, Code.NO_EXIST_USER)
			bindSessionAndNext(this.app, msg, session, next, user)
		})
  }

	/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
	entry(msg, session, next) {
		next(null, { code: 200, msg: 'game server is ok.' });
	};

	/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
	publish(msg, session, next) {
		var result = {
			topic: 'publish',
			payload: JSON.stringify({ code: 200, msg: 'publish message is ok.' })
		};
		next(null, result);
	};

	/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
	subscribe(msg, session, next) {
		var result = {
			topic: 'subscribe',
			payload: JSON.stringify({ code: 200, msg: 'subscribe message is ok.' })
		};
		next(null, result);
	};

	ping(msg: object, session: any, next: (error, object) => void) {
    next(null, {})
  }
}