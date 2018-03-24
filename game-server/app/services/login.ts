import { EventEmitter2 } from 'eventemitter2';
import Code from '../consts/code';
import * as _ from 'lodash';
import * as config from 'config';
import { createNickName, callFGameRemoteFunc, respOK, respError, callFGameRemoteFuncTemplate, callFGameRemoteFuncWithData } from '../util/helpers';
import axios from 'axios';
import { CoreComponent } from '../components/core';
import * as moment from 'moment';
import * as Raven from 'raven'
import { onRegister, onLogin } from '../util/keenClient';
import logger from '../util/logger';
import { UserModel } from '../extend/db';

async function getResetUser(user: any) {
	const now = new Date()
	if (!moment().isSame(user.loginAt, 'day')) {
		user.loginAt = now
		return await user.save()
	}
	return user
}

function onSessionClosed(app, session, reason) {
	try {
		if (!session || !session.uid) {
			return;
		}
		const core = app.components.core as CoreComponent;
		if (session.get('shortId') != undefined) {
			core.container.userCache.offline(session.get('shortId'))
		}
		callFGameRemoteFunc(app, session, 'onUserLogout')
	} catch (error) {
		Raven.captureException(error);
	}
}

export async function bindSessionAndNext(app, msg: object, session: any, next: (error, object) => void, user: any) {
	try {
		const userId = user.id;
		app.get('sessionService').kick(userId, { text: '您的帐户已在其他地方登录' }, function () { });
		user = await getResetUser(user)
		session.bind(userId);
		session.set('shortId', user.shortId);
		const userInfo = {
			ip: '',
			sid: session.frontendId,
			province: '',
			city: ''
		}
		let ip: string = session.__session__.__socket__.remoteAddress.ip;

		if (ip != null) {
			const ipArray: Array<string> = ip.split(':');
			if (ipArray.length > 0) {
				ip = ipArray[ipArray.length - 1];
				userInfo.ip = ip
				const response = await axios.get(
					`http://restapi.amap.com/v3/ip?ip=${session.get('ip')}&output=json&key=${config.get('gaodeKey')}`
				);
				const jsonObject = response.data;

				if (_.isString(jsonObject['status']) && jsonObject['status'] == '1') {
					userInfo.province = jsonObject['province']
					userInfo.city = jsonObject['city']
				}
			}
		}
		if (app.get('sessionService').get(session.id) != null) {

			const core = app.components.core as CoreComponent;
			core.container.userCache.online(user, userInfo)
			session.pushAll((error) => {
				if (error != null) throw error;
			});
			session.on('disconnect', () => {
			});
			session.on('closed', _.bind(onSessionClosed, _, app));

			const roomInfo: any = await core.container.roomCache.getRoomInfoByPlayerId(user.shortId)
			if (roomInfo != null && _.isString(roomInfo.serverId) && _.isString(roomInfo.roomId)) {
				callFGameRemoteFuncWithData(app, roomInfo.serverId, {
					uid: user.id,
					sid: session.frontendId,
					roomId: roomInfo.roomId
				}, 'onUserLogin')
			}
			respOK(next, { user, ip })
		} else {
			respError(next, Code.NO_EXIST_SESSION)
		}
	} catch (error) {
		Raven.captureException(error);
	}
}

