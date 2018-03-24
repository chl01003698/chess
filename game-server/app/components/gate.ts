import * as Bottle from 'bottlejs';
import RPC from '../services/rpc';
import RoomNumber from '../services/roomNumber';

export class GateComponent extends Bottle {
	constructor(private app) {
		super();
	}

	start(cb) {
		this.factory('rpc', () => { return new RPC(this.app) })
		const _ = this.container.rpc
		this.service('roomNumber', RoomNumber)
    process.nextTick(cb);
  }

	afterStart(cb) {
    process.nextTick(cb);
  }

	stop(force, cb) {
    process.nextTick(cb);
  }
}

declare module "bottlejs" { 
	interface IContainer {
		rpc: RPC
		roomNumber: RoomNumber
	}
}

export function gate(app) {
	return new GateComponent(app);
}
