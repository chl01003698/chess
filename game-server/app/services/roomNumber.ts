import * as _ from 'lodash'

export default class RoomNumber {
  numbers: Array<number> = []
  constructor() {
    this.numbers = _.range(100000, 1000000)
  }

  random(): number {
    let number = -1
    if (this.numbers.length > 0) {
      let index = _.random(this.numbers.length - 1)
      number = this.numbers[index]
      this.numbers.splice(index, 1)
    }
    return number
  }

  release(number: number) {
    if (_.indexOf(this.numbers, number) == -1) {
      this.numbers.push(number)
    }
  }
}
