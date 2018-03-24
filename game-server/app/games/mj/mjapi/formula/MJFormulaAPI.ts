import Game from '../../../game';
import MJGamePlayer from '../../MJGamePlayer';
import NanChongMJFormula from '../../sichuan/nanchong/MJFormula';
export namespace mjapi {
  export namespace formula {
    export function nanchongMJFormula(params) {
      return NanChongMJFormula.getScore(params);
    }
		export function nanchongPreFormula(params){
			return NanChongMJFormula.getPreScore(params)
		}
  }
}
