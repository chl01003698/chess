import * as _ from 'lodash'
import { GateComponent } from '../../../components/gate';

export = function newRemote(app) {
	return new GateRemote(app);
};

const GateRemote = function (this: any, app) {
  this.app = app;
};

GateRemote.prototype.random = function(args, cb) {
  const gateComponent = this.app.components.gate as GateComponent
  cb(gateComponent.container.roomNumber.random())
}

GateRemote.prototype.release = function(args, cb) {
  if (_.isNumber(args) && args >= 100000 && args < 1000000) {
    const gateComponent = this.app.components.gate as GateComponent
    gateComponent.container.roomNumber.release(args)
  }
  cb()
}