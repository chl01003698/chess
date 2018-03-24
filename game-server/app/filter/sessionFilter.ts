import * as _ from 'lodash';

export default function sessionFilter() {
  return new SessionFilter()
}

class SessionFilter {
  before(msg, session, next) {
    if (!_.isString(session.uid)) {
      next(new Error('玩家不存在'))
      return
    }
    next()
  }
}