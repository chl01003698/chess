import { PokerCard,PokerAlgo } from '../poker/pokerAlgo/pokerAlgo';

export interface CardAdapter {
  pickCardIds(cards: Array<any>)

  createCardsFromIds(cards: Array<any>)
}

export class PokerCardAdapter implements CardAdapter {
  pickCardIds(cards: Array<any>) {
    return PokerAlgo.pickCardIds(cards)
  }

  createCardsFromIds(cards: Array<any>) {
		return PokerAlgo.createCardsFromIds(cards)
  }
}

export class MJCardAdapter implements CardAdapter {
  pickCardIds(cards: Array<any>) {
    return cards
  }

  createCardsFromIds(cards: Array<any>) {
		return cards
  }
}