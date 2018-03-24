export namespace mjapi {
  export namespace combo {
    //清一色
    export function qingYiSe(params):number{
      const algo = params.game.algo
      return algo.qingYiSe(params);
    }
    //七对
    export function qiDui(params):number{
      const algo = params.game.algo
      return algo.qiDui(params);
    }

    //平胡
    export function pingHu(params):number{
      const algo = params.game.algo
      return algo.pingHu(params);
    }
    //对对胡
    export function duiDuiHu(params):number{
      const algo = params.game.algo
      return algo.duiDuiHu(params);
    }

    export function getNumCache(params,key:string):number{
      const algo = params.game.algo
      return algo.getNumCache(params);
    }

    //清一色对对胡
    export function qingYiSeDaDuiZi(params):number{
      const algo = params.game.algo
      return algo.qingYiSeDaDuiZi(params);
    }
    //缺一门
    export function queYiMen(params):number{
      const algo = params.game.algo
      return algo.queYiMen(params);
    }

    //一般高
    export function yiBanGao(params):number{
      const algo = params.game.algo
      return algo.yiBanGao(params);
    }

    //卡心五
    export function kaXinWu(params):number{
      const algo = params.game.algo
      return algo.kaXinWu(params);
    }

    //将将胡
    export function jiangJiangHu(params):number{
      const algo = params.game.algo
      return algo.jiangJiangHu(params);
    }
    //一条龙
    export function yiTiaoLong(params):number{
      const algo = params.game.algo
      return algo.yiTiaoLong(params);
    }
    //清一条龙
    export function qingYiTiaoLong(params):number{
      const algo = params.game.algo
      return algo.qingYiTiaoLong(params);
    }
    //清七对
    export function qingQiDui(params):number{
      const algo = params.game.algo
      return algo.qingQiDui(params);
    }
    //将七对
    export function jiangQiDui(params):number{
      const algo = params.game.algo
      return algo.jiangQiDui(params);
    }
    //双龙七对
    export function shuangLongQiDui(params):number{
      const algo = params.game.algo
      return algo.shuangLongQiDui(params);
    }
    //三龙七对
    export function sanLongQiDui(params){
      const algo = params.game.algo
      return algo.sanLongQiDui(params);
    }
    //龙七对
    export function longQiDui(params):number{
      const algo = params.game.algo
      return algo.longQiDui(params);
    }

    //清双龙七对
    export function qingShuangLongQiDui(params):number{
      const algo = params.game.algo
      return algo.qingShuangLongQiDui(params);
    }
    //清三龙七对
    export function qingSanLongQiDui(params):number{
      const algo = params.game.algo
      return algo.qingSanLongQiDui(params);
    }

    //清龙七对
    export function qingLongQiDui(params):number{
      const algo = params.game.algo
      return algo.qingLongQiDui(params);
    }
    //金钩炮
    export function jinGouPao(params):number{
      const algo = params.game.algo
      return algo.jinGouPao(params);
    }
    //金钩钓
    export function jinGouDiao(params):number{
      const algo = params.game.algo
      return algo.jinGouDiao(params);
    }
    //将金钩钓
    export function jiangJinGouDiao(params):number{
      const algo = params.game.algo
      return algo.jiangJinGouDiao(params);
    }
    //清金钩钓
    export function qingJinGouDiao(params):number{
      const algo = params.game.algo
      return algo.qingJinGouDiao(params);   
    }
    //字一色
    export function ziYiSe(params):number{
      const algo = params.game.algo
      return algo.ziYiSe(params);
    }
    //混一色
    export function hunYiSe(params):number{
      const algo = params.game.algo
      return algo.hunYiSe(params);
    }
    //大三元
    export function daSanYuan(params):number{
      const algo = params.game.algo
      return algo.daSanYuan(params);
    }
    //小三元
    export function xiaoSanYuan(params):number{
      const algo = params.game.algo
      return algo.xiaoSanYuan(params);
    }
    //十八罗汉
    export function shiBaLuoHan(params):number{
      const algo = params.game.algo
      return algo.shiBaLuoHan(params);
    }
    //清十八罗汉
    export function qingShiBaLuoHan(params):number{
      const algo = params.game.algo
      return algo.qingShiBaLuoHan(params);
    }
    //十三幺 
    export function shiSanYao(params):number{
      const algo = params.game.algo
      return algo.shiSanYao(params);
    }
    //十三不靠
    export function shiSanBuKao(params):number{
      const algo = params.game.algo
      return algo.shiSanBuKao(params);
    }
    //软十三不靠
    export function ruanShiSanBuKao(params):number{
      const algo = params.game.algo
      return algo.ruanShiSanBuKao(params);
    }
    //全幺九
    export function quanYaoJiu(params):number{
      const algo = params.game.algo
      return algo.quanYaoJiu(params);
    }
    //混幺九
    export function hunYaoJiu(params):number{
      const algo = params.game.algo
      return algo.hunYaoJiu(params);
    }
    //带幺九
    export function daiYaoJiu(params):number{
      const algo = params.game.algo
      return algo.daiYaoJiu(params);
    }
    //清三搭
    export function qingSanDa(params):number{
      const algo = params.game.algo
      return algo.qingSanDa(params);
    }
    
    export function menQing(params) {
      const algo = params.game.algo
      return algo.menQing(params);
    }
  }
}