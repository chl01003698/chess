import { MJCardGroupType, MJGangType } from '../consts/MJEnum';
import * as _ from 'lodash'

export class MJCardGroup {
  type: MJCardGroupType
  cards: Array<number>
  card?: number
  triggerId?: string
  open: boolean
  data?: any
  subType?: number
  count: number

  constructor(type: MJCardGroupType, cards: Array<number>, card?: number, triggerId?: string, open: boolean = true, data?: any, subType?: number) {
    this.type = type
    this.cards = cards
    this.card = card
    this.triggerId = triggerId
    this.open = open
    this.data = data
    this.subType = subType
    this.count = 1
  }
}

export class MJCardGroupManage {
  cardGroups = new Array<MJCardGroup>()

  pushCardGroup(cardGroup: MJCardGroup) {
    this.cardGroups.push(cardGroup)
  }

  updateCardGroup(subType: number, card: number) {
    const cardGroup = this.findCardGroupBySubTypeAndCard(subType, card)
    if (cardGroup != undefined) {
      cardGroup.cards.push(card)
      cardGroup.count++
      return true
    }
    return false
  }

  findCardGroupByCard(card: number) {
    return _.find(this.cardGroups, { card })
  }

  findCardGroupBySubTypeAndCard(subType: number, card: number) {
    return _.find(this.cardGroups, (v) => {
      return v.subType == subType && v.cards.indexOf(card) != -1
    })
  }

  changePengToBuGang(card: number) {
    const cardGroup = this.findCardGroupByCard(card) as MJCardGroup
    if (cardGroup != undefined && cardGroup.type == MJCardGroupType.PENG) {
      cardGroup.type = MJCardGroupType.GANG
      cardGroup.subType = MJGangType.BUGANG
      cardGroup.cards.push(card)
      return true
    }
    return false
  }

  existCardGroupType(type: MJCardGroupType) {
    return _.some(this.cardGroups, { type })
  }

  existPengCardGroup(card: number): boolean {
    return _.some(this.cardGroups, { type: MJCardGroupType.PENG, card })
  }

  countCardGroupByType(type: MJCardGroupType): number {
    return _.filter(this.cardGroups, { type }).length
  }

  filterCardGroupByType(type: MJCardGroupType): Array<MJCardGroup> {
    return _.filter(this.cardGroups, { type })
  }

  getCardCount(): number {
    return _.sumBy(this.cardGroups, function(v) { 
      let length = v.cards.length 
      if (length > 3) {
        length = 3
      }
      return length
    })
    
  }

  getCardRealCount(): number {
    return _.sumBy(this.cardGroups, function(v) { return v.cards.length })
  }
  
  getPrivateCardGroups(): Array<any> {
    return _.map(this.cardGroups, (v) => { return _.pick(v, ['type', 'cards', 'triggerId', 'subType'])})
  }

  getPublicCardGroups(): Array<any> {
    return _.map(this.cardGroups, (v) => { 
      if (!v.open) {
        return _.pick(v, ['type', 'triggerId', 'subType'])
      } 
      return _.pick(v, ['type', 'cards', 'triggerId', 'subType'])
    })
  }

  clear() {
    this.cardGroups = []
  }
}