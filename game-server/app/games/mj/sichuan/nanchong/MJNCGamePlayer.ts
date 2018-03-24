import MJGamePlayer from '../../MJGamePlayer';
import { ScoreData } from '../../MJModel/MJFormulaModel';

export default class MJNCGamePlayer extends MJGamePlayer {
  piao: number = -1
  raoGang:number[] = []
  ting:boolean = false
  huList:number[] = []
  baiPai:number[] = []
  daJiaoScore:ScoreData = new ScoreData();
  reset() {
    super.reset()
    this.piao = -1
    this.raoGang = []
    this.ting = false
    this.huList = []
    this.baiPai = []
    this.daJiaoScore = new ScoreData();
}
}