export namespace mjapi {
  export namespace rule {
    
    export function genAndGang(params) {
      const algo = params.game.algo
      return algo.genAndGang(params);
    }
    export function genRemoveGang(params) {
      const algo = params.game.algo
      return algo.genRemoveGang(params);
    }
  }
}