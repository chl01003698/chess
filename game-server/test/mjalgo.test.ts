import { MJAlgo } from '../app/games/mj/MJAlgo';
import * as _ from 'lodash'
const result = MJAlgo.canHu(MJAlgo.xuanJiang([11, 12, 13, 13, 13, 22, 22, 22, 22, 23, 24, 31, 31, 31]))
console.log(result)
const cards = MJAlgo.initCards({
  "wtb": [1, 2, 3],
  "zfb": true
})
console.log(cards)
console.log(_.uniq(cards))

const tingCards = MJAlgo.getTingCards([11, 11, 11, 12, 13, 14, 15, 16, 17, 18, 19, 19, 19], _.uniq(cards))
console.log(tingCards)