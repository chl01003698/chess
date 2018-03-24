import { Constructor } from '../util/helpers';
import GamePlayer from './gamePlayer';
import { DissolveState } from './friendGame';

export default function FriendGamePlayer<T extends Constructor<GamePlayer>>(Base: T) {
  return class extends Base  {
    dissolveState: DissolveState = DissolveState.None
  }
}