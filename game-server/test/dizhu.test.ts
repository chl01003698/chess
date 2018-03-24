import { PokerCard, PokerAlgo } from "../app/games/poker/pokerAlgo/pokerAlgo";
import { SanRenDiZhuAlgo } from "../app/games/poker/pokerAlgo/doudizhu/sanRenDiZhuAlgo";

debugger ;

var a = 1 ;
var b = 2 ;
console.log(a + b) ;

const algo: SanRenDiZhuAlgo = new SanRenDiZhuAlgo() ;
// let arr = algo.getCardsType() ;
const arr: Array<PokerCard> = PokerAlgo.createCardsFromIds(['0.3', '1.3']) ;
const arr1: Array<PokerCard> = PokerAlgo.createCardsFromIds(['0.3', '1.3', '2.3', '0.4', '1.4', '2.4', '3.4', '0.5', '1.5']) ;
const num: number = SanRenDiZhuAlgo.getCardsType(arr) ;

const arr2:  Array<Array<PokerCard>> = SanRenDiZhuAlgo.prompt(arr, arr1) ;

console.log(arr2)
