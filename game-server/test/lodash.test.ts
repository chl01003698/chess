import * as _ from 'lodash'

const scores = [1, 2, 3]

const result = _.reduce(scores, function(sum, n) {
  return sum * n;
}, 1);

console.log(result)