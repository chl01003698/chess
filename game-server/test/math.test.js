"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math = require("mathjs");
const _ = require("lodash");
class ABC {
    constructor() {
        this.a = 10;
    }
    setA(a) {
        this.a = a;
    }
    getA() {
        return this.a;
    }
}
class MJAlgoA {
    static test(abc) {
        console.log('asss');
        console.log(abc);
        return { a: 123, b: 456 };
    }
}
math.import({ maxBy: _.maxBy }, { override: true, wrap: true, silent: false });
const abc = new ABC();
console.log(math.eval(['MJAlgoA.test(abc)', 'MJAlgoA.test(abc)'], { abc: abc, MJAlgoA }));
console.log(abc.a);
