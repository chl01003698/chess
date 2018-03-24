import SanZhangGame from './sanZhangGame';
import MatchGame from '../../matchGame';


export default class MatchSanZhangGame extends SanZhangGame(MatchGame) {
  constructor(...args: any[]) {
    super(...args);
  }
}