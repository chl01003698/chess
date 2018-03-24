"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mjapi;
(function (mjapi) {
    let combo;
    (function (combo) {
        //清一色
        function qingYiSe(params) {
            const algo = params.game.algo;
            return algo.qingYiSe(params);
        }
        combo.qingYiSe = qingYiSe;
        //七对
        function qiDui(params) {
            const algo = params.game.algo;
            return algo.qiDui(params);
        }
        combo.qiDui = qiDui;
        //平胡
        function pingHu(params) {
            const algo = params.game.algo;
            return algo.pingHu(params);
        }
        combo.pingHu = pingHu;
        //对对胡
        function duiDuiHu(params) {
            const algo = params.game.algo;
            return algo.duiDuiHu(params);
        }
        combo.duiDuiHu = duiDuiHu;
        function getNumCache(params, key) {
            const algo = params.game.algo;
            return algo.getNumCache(params);
        }
        combo.getNumCache = getNumCache;
        //清一色对对胡
        function qingYiSeDaDuiZi(params) {
            const algo = params.game.algo;
            return algo.qingYiSeDaDuiZi(params);
        }
        combo.qingYiSeDaDuiZi = qingYiSeDaDuiZi;
        //缺一门
        function queYiMen(params) {
            const algo = params.game.algo;
            return algo.queYiMen(params);
        }
        combo.queYiMen = queYiMen;
        //一般高
        function yiBanGao(params) {
            const algo = params.game.algo;
            return algo.yiBanGao(params);
        }
        combo.yiBanGao = yiBanGao;
        //卡心五
        function kaXinWu(params) {
            const algo = params.game.algo;
            return algo.kaXinWu(params);
        }
        combo.kaXinWu = kaXinWu;
        //将将胡
        function jiangJiangHu(params) {
            const algo = params.game.algo;
            return algo.jiangJiangHu(params);
        }
        combo.jiangJiangHu = jiangJiangHu;
        //一条龙
        function yiTiaoLong(params) {
            const algo = params.game.algo;
            return algo.yiTiaoLong(params);
        }
        combo.yiTiaoLong = yiTiaoLong;
        //清一条龙
        function qingYiTiaoLong(params) {
            const algo = params.game.algo;
            return algo.qingYiTiaoLong(params);
        }
        combo.qingYiTiaoLong = qingYiTiaoLong;
        //清七对
        function qingQiDui(params) {
            const algo = params.game.algo;
            return algo.qingQiDui(params);
        }
        combo.qingQiDui = qingQiDui;
        //将七对
        function jiangQiDui(params) {
            const algo = params.game.algo;
            return algo.jiangQiDui(params);
        }
        combo.jiangQiDui = jiangQiDui;
        //双龙七对
        function shuangLongQiDui(params) {
            const algo = params.game.algo;
            return algo.shuangLongQiDui(params);
        }
        combo.shuangLongQiDui = shuangLongQiDui;
        //三龙七对
        function sanLongQiDui(params) {
            const algo = params.game.algo;
            return algo.sanLongQiDui(params);
        }
        combo.sanLongQiDui = sanLongQiDui;
        //龙七对
        function longQiDui(params) {
            const algo = params.game.algo;
            return algo.longQiDui(params);
        }
        combo.longQiDui = longQiDui;
        //清双龙七对
        function qingShuangLongQiDui(params) {
            const algo = params.game.algo;
            return algo.qingShuangLongQiDui(params);
        }
        combo.qingShuangLongQiDui = qingShuangLongQiDui;
        //清三龙七对
        function qingSanLongQiDui(params) {
            const algo = params.game.algo;
            return algo.qingSanLongQiDui(params);
        }
        combo.qingSanLongQiDui = qingSanLongQiDui;
        //清龙七对
        function qingLongQiDui(params) {
            const algo = params.game.algo;
            return algo.qingLongQiDui(params);
        }
        combo.qingLongQiDui = qingLongQiDui;
        //金钩炮
        function jinGouPao(params) {
            const algo = params.game.algo;
            return algo.jinGouPao(params);
        }
        combo.jinGouPao = jinGouPao;
        //金钩钓
        function jinGouDiao(params) {
            const algo = params.game.algo;
            return algo.jinGouDiao(params);
        }
        combo.jinGouDiao = jinGouDiao;
        //将金钩钓
        function jiangJinGouDiao(params) {
            const algo = params.game.algo;
            return algo.jiangJinGouDiao(params);
        }
        combo.jiangJinGouDiao = jiangJinGouDiao;
        //清金钩钓
        function qingJinGouDiao(params) {
            const algo = params.game.algo;
            return algo.qingJinGouDiao(params);
        }
        combo.qingJinGouDiao = qingJinGouDiao;
        //字一色
        function ziYiSe(params) {
            const algo = params.game.algo;
            return algo.ziYiSe(params);
        }
        combo.ziYiSe = ziYiSe;
        //混一色
        function hunYiSe(params) {
            const algo = params.game.algo;
            return algo.hunYiSe(params);
        }
        combo.hunYiSe = hunYiSe;
        //大三元
        function daSanYuan(params) {
            const algo = params.game.algo;
            return algo.daSanYuan(params);
        }
        combo.daSanYuan = daSanYuan;
        //小三元
        function xiaoSanYuan(params) {
            const algo = params.game.algo;
            return algo.xiaoSanYuan(params);
        }
        combo.xiaoSanYuan = xiaoSanYuan;
        //十八罗汉
        function shiBaLuoHan(params) {
            const algo = params.game.algo;
            return algo.shiBaLuoHan(params);
        }
        combo.shiBaLuoHan = shiBaLuoHan;
        //清十八罗汉
        function qingShiBaLuoHan(params) {
            const algo = params.game.algo;
            return algo.qingShiBaLuoHan(params);
        }
        combo.qingShiBaLuoHan = qingShiBaLuoHan;
        //十三幺 
        function shiSanYao(params) {
            const algo = params.game.algo;
            return algo.shiSanYao(params);
        }
        combo.shiSanYao = shiSanYao;
        //十三不靠
        function shiSanBuKao(params) {
            const algo = params.game.algo;
            return algo.shiSanBuKao(params);
        }
        combo.shiSanBuKao = shiSanBuKao;
        //软十三不靠
        function ruanShiSanBuKao(params) {
            const algo = params.game.algo;
            return algo.ruanShiSanBuKao(params);
        }
        combo.ruanShiSanBuKao = ruanShiSanBuKao;
        //全幺九
        function quanYaoJiu(params) {
            const algo = params.game.algo;
            return algo.quanYaoJiu(params);
        }
        combo.quanYaoJiu = quanYaoJiu;
        //混幺九
        function hunYaoJiu(params) {
            const algo = params.game.algo;
            return algo.hunYaoJiu(params);
        }
        combo.hunYaoJiu = hunYaoJiu;
        //带幺九
        function daiYaoJiu(params) {
            const algo = params.game.algo;
            return algo.daiYaoJiu(params);
        }
        combo.daiYaoJiu = daiYaoJiu;
        //清三搭
        function qingSanDa(params) {
            const algo = params.game.algo;
            return algo.qingSanDa(params);
        }
        combo.qingSanDa = qingSanDa;
        function menQing(params) {
            const algo = params.game.algo;
            return algo.menQing(params);
        }
        combo.menQing = menQing;
    })(combo = mjapi.combo || (mjapi.combo = {}));
})(mjapi = exports.mjapi || (exports.mjapi = {}));
