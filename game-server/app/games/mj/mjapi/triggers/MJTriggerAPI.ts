import { MJHandleState } from '../../consts/MJEnum';
import * as _ from 'lodash'

export namespace mjapi {
  export namespace trigger {
    export function qiangganghu(params) {
      const handle = _.find(params.currentHandles, (v) => { return v.action == 'bugang' && v.state == MJHandleState.CONFIRM })
      if (handle) {
        return true;
      }
      return false;
    }
  }
}