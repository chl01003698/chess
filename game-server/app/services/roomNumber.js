"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class RoomNumber {
    constructor() {
        this.numbers = [];
        this.numbers = _.range(100000, 1000000);
    }
    random() {
        let number = -1;
        if (this.numbers.length > 0) {
            let index = _.random(this.numbers.length - 1);
            number = this.numbers[index];
            this.numbers.splice(index, 1);
        }
        return number;
    }
    release(number) {
        if (_.indexOf(this.numbers, number) == -1) {
            this.numbers.push(number);
        }
    }
}
exports.default = RoomNumber;
