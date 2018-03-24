import FriendGameController from "./friendGameController";
import FriendGame from '../../friendGame';
import * as Bottle from 'bottlejs';
import { EventEmitter2 } from "eventemitter2";

export default class FriendMJGameController {
  emitter: EventEmitter2
  constructor(private game: any, container: Bottle.IContainer) {
    this.emitter = container.emitter
  }
}