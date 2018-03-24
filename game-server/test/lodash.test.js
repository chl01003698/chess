"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const scores = [1, 2, 3];
const result = _.reduce(scores, function (sum, n) {
    return sum * n;
}, 1);
console.log(result);
