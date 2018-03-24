
export namespace mjapi {
  export namespace action {
    export function filterZhang(params) {
      const algo = params.game.algo
      return algo.filterZhang(params)
    }

    export function testZhang(params) {
      const algo = params.game.algo
      return algo.testZhang(params)
    }

    export function actionZhang(params) {
      const algo = params.game.algo
      return algo.actionZhang(params)
    }

    export function filterChi(params) {
      const algo = params.game.algo
      return algo.filterChi(params)
    }

    export function testChi(params) {
      const algo = params.game.algo
      return algo.testChi(params)
    }

    export function actionChi(params) {
      const algo = params.game.algo
      return algo.actionChi(params)
    }

    export function filterPeng(params) {
      const algo = params.game.algo
      return algo.filterPeng(params)
    }

    export function testPeng(params) {
      const algo = params.game.algo
      return algo.testPeng(params)
    }

    export function actionPeng(params) {
      const algo = params.game.algo
      return algo.actionPeng(params)
    }

    export function filterAnGang(params) {
      const algo = params.game.algo
      return algo.filterAnGang(params)
    }

    export function testAnGang(params) {
      const algo = params.game.algo
      return algo.testAnGang(params)
    }

    export function actionAnGang(params) {
      const algo = params.game.algo
      return algo.actionAnGang(params)
    }

    export function filterDianGang(params) {
      const algo = params.game.algo
      return algo.filterDianGang(params)
    }

    export function testDianGang(params) {
      const algo = params.game.algo
      return algo.testDianGang(params)
    }

    export function actionDianGang(params) {
      const algo = params.game.algo
      return algo.actionDianGang(params)
    }

    export function filterBuGang(params) {
      const algo = params.game.algo
      return algo.filterBuGang(params)
    }

    export function testBuGang(params) {
      const algo = params.game.algo
      return algo.testBuGang(params)
    }

    export function actionBuGang(params) {
      const algo = params.game.algo
      return algo.actionBuGang(params)
    }

    export function filterLuanGang(params) {
      const algo = params.game.algo
      return algo.filterLuanGang(params)
    }

    export function testLuanGang(params, luanCards: Array<Array<number>>) {
      const algo = params.game.algo
      return algo.testLuanGang(params, luanCards)
    }

    export function actionLuanGang(params) {
      const algo = params.game.algo
      return algo.actionLuanGang(params)
    }

    export function filterHu(params) {
      const algo = params.game.algo
      return algo.filterHu(params)
    }

    export function testHu(params) {
      const algo = params.game.algo
      let data = algo.testHu(params)
      if(data.ok){
        data.ok = algo.testGuoShouHu(params)
      }
      return data
    }

    export function testGuoShouHu(params){
      const algo = params.game.algo
      return algo.testGuoShouHu(params)
    }
    
    export function actionHu(params) {
      const algo = params.game.algo
      return algo.actionHu(params)
    }

    export function filterTing(params) {
      const algo = params.game.algo
      return algo.filterTing(params)
    }

    export function testTing(params) {
      const algo = params.game.algo
      return algo.testTing(params)
    }

    export function actionTing(params) {
      const algo = params.game.algo
      return algo.actionTing(params)
    }

    export function testHuShiSanYao(params) {
      const algo = params.game.algo
      return algo.testHuShiSanYao(params)
    }

    export function testHuShiSanBuKao(params) {
      const algo = params.game.algo
      return algo.testHuShiSanBuKao(params)
    }
    export function filterBaiPai(params) {
      const algo = params.game.algo
      return algo.filterBaiPai(params)
    }

    export function testBaiPai(params) {
      const algo = params.game.algo
      return algo.testBaiPai(params)
    }

    export function actionBaiPai(params) {
      const algo = params.game.algo
      return algo.actionBaiPai(params)
    }
  }
}