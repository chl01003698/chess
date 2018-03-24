import * as math from 'mathjs'
import * as _ from 'lodash'


class ABC {
  a: number = 10
 
  setA(a: number) {
    this.a = a
  }

  getA() {
    return this.a
  }
}

class MJAlgoA {
  static test(abc: ABC) {
    console.log('asss')
    console.log(abc)
    return {a: 123, b: 456}
  }
}

math.import({ maxBy: _.maxBy}, {override: true, wrap: true, silent: false})
const abc = new ABC()
console.log(math.eval(['MJAlgoA.test(abc)', 'MJAlgoA.test(abc)'], {abc: abc, MJAlgoA}))
console.log(abc.a)