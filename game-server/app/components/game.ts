import * as Bottle from 'bottlejs';
import * as config from 'config';
import UserCache from '../services/userCache';
import GameFactory from '../games/gameFactory';
import GameManage from '../games/gameManage';

export class GameComponent extends Bottle {
	constructor(private app) {
		super();
	}

	start(cb) {
		this.factory('gameFactory', () => { return new GameFactory() })
		this.factory('gameManage', (container) => { return new GameManage(this.app, container.gameFactory)})
		this.container.gameFactory.initGames()
		this.container.gameManage.checkAutoDestroy()
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
		gameFactory: GameFactory
		gameManage:  GameManage
	}
}

export function game(app) {
	return new GameComponent(app);
}
