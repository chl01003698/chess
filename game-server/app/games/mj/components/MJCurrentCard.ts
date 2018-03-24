import { MJCardOriginType } from '../consts/MJEnum';


export class MJCurrentCard {
  card: number = -1
  shift: boolean = true
  type: MJCardOriginType = MJCardOriginType.NONE
  fIndex: number = -1
  bIndex: number = -1
  uid: string = ''

  rest() {
    this.card = -1
    this.shift = true
    this.type = MJCardOriginType.NONE
    this.fIndex = -1
    this.bIndex = -1
    this.uid = ''
  }
}