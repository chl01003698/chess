import * as uuid from 'uuid';
import { dispatcher } from '../../../util/dispatcher';
import Code from '../../../consts/code';
import { respOK } from '../../../util/helpers';

export = function newHandler(app): GateHandler {
	return new GateHandler(app);
};

class GateHandler {
	constructor(private app) {}

	queryEntry(msg: object, session: object, next: (error, object) => void) {
		const uid = uuid.v4();
		const connectors = this.app.getServersByType('connector');
		if (!connectors || connectors.length == 0) {
			next(null, Code.GATE.NO_SERVER_AVAILABLE);
			return;
		}

    const res = dispatcher(uid, connectors);
    respOK(next, {host: res.clientHost, port: res.clientPort})
	}
}
