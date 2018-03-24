import * as Joi from 'joi';
import { validateOptions } from '../../../util/helpers';
import DataManage from '../../../services/dataManage';
import { GameComponent } from '../../../components/game';
import * as Raven from 'raven';
import { CoreComponent } from '../../../components/core';

export = function newRemote(app): any {
  return new GameRemote(app)
}

const GameRemote = function (this: any, app) {
  this.app = app;
};

GameRemote.prototype.onUserLogout = function(args, cb) {
  Raven.context(() => {
    const schema = {
      uid: Joi.string().required(),
      roomId: Joi.string().required()
    }
    const result = Joi.validate(args, schema, validateOptions)
    if (result.error != null) {
      throw result.error
    } else {
      const uid = result.value.uid
      const gameComponent = this.app.components.game as GameComponent
      const game = gameComponent.container.gameManage.findGame(args.roomId)
      if (game != null) {
        game.onGamePlayerLogout(uid)
      }
    }
    cb()
  })
}

GameRemote.prototype.onUserLogin = function (args, cb) {
  Raven.context(() => {
    const schema = {
      uid: Joi.string().required(),
      roomId: Joi.string().required(),
      sid: Joi.string().required()
    }
    const result = Joi.validate(args, schema, validateOptions)
    if (result.error != null) {
      throw result.error
    } else {
      const uid = args.uid
      const gameComponent = this.app.components.game as GameComponent
      const game = gameComponent.container.gameManage.findGame(args.roomId)
      if (game != null) {
        game.onGamePlayerLogin(uid, args.sid)
      }
    }
    cb()
  })
};

GameRemote.prototype.destoryGame = function (args, cb) {
  Raven.context(()=> {
    let succeed = false
    const schema = {
      roomId: Joi.string().required()
    }

    const result = Joi.validate(args, schema, validateOptions)
    if (result.error != null) {
      throw result.error
    } else {
      const gameComponent = this.app.components.game as GameComponent
      const game = gameComponent.container.gameManage.findGame(args.roomId)
      if (game != null) {
        game.destroy()
        succeed = true
      }
    }
    cb(null, succeed)
  })
}

GameRemote.prototype.updateConfig = function(cb) {
  Raven.context(()=> {
    const core = this.app.components.core as CoreComponent
    core.container.dataManage.loadData()
    cb()
  })
}