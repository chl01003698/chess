"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mjapi;
(function (mjapi) {
    let action;
    (function (action) {
        function filterZhang(params) {
            const algo = params.game.algo;
            return algo.filterZhang(params);
        }
        action.filterZhang = filterZhang;
        function testZhang(params) {
            const algo = params.game.algo;
            return algo.testZhang(params);
        }
        action.testZhang = testZhang;
        function actionZhang(params) {
            const algo = params.game.algo;
            return algo.actionZhang(params);
        }
        action.actionZhang = actionZhang;
        function filterChi(params) {
            const algo = params.game.algo;
            return algo.filterChi(params);
        }
        action.filterChi = filterChi;
        function testChi(params) {
            const algo = params.game.algo;
            return algo.testChi(params);
        }
        action.testChi = testChi;
        function actionChi(params) {
            const algo = params.game.algo;
            return algo.actionChi(params);
        }
        action.actionChi = actionChi;
        function filterPeng(params) {
            const algo = params.game.algo;
            return algo.filterPeng(params);
        }
        action.filterPeng = filterPeng;
        function testPeng(params) {
            const algo = params.game.algo;
            return algo.testPeng(params);
        }
        action.testPeng = testPeng;
        function actionPeng(params) {
            const algo = params.game.algo;
            return algo.actionPeng(params);
        }
        action.actionPeng = actionPeng;
        function filterAnGang(params) {
            const algo = params.game.algo;
            return algo.filterAnGang(params);
        }
        action.filterAnGang = filterAnGang;
        function testAnGang(params) {
            const algo = params.game.algo;
            return algo.testAnGang(params);
        }
        action.testAnGang = testAnGang;
        function actionAnGang(params) {
            const algo = params.game.algo;
            return algo.actionAnGang(params);
        }
        action.actionAnGang = actionAnGang;
        function filterDianGang(params) {
            const algo = params.game.algo;
            return algo.filterDianGang(params);
        }
        action.filterDianGang = filterDianGang;
        function testDianGang(params) {
            const algo = params.game.algo;
            return algo.testDianGang(params);
        }
        action.testDianGang = testDianGang;
        function actionDianGang(params) {
            const algo = params.game.algo;
            return algo.actionDianGang(params);
        }
        action.actionDianGang = actionDianGang;
        function filterBuGang(params) {
            const algo = params.game.algo;
            return algo.filterBuGang(params);
        }
        action.filterBuGang = filterBuGang;
        function testBuGang(params) {
            const algo = params.game.algo;
            return algo.testBuGang(params);
        }
        action.testBuGang = testBuGang;
        function actionBuGang(params) {
            const algo = params.game.algo;
            return algo.actionBuGang(params);
        }
        action.actionBuGang = actionBuGang;
        function filterLuanGang(params) {
            const algo = params.game.algo;
            return algo.filterLuanGang(params);
        }
        action.filterLuanGang = filterLuanGang;
        function testLuanGang(params, luanCards) {
            const algo = params.game.algo;
            return algo.testLuanGang(params, luanCards);
        }
        action.testLuanGang = testLuanGang;
        function actionLuanGang(params) {
            const algo = params.game.algo;
            return algo.actionLuanGang(params);
        }
        action.actionLuanGang = actionLuanGang;
        function filterHu(params) {
            const algo = params.game.algo;
            return algo.filterHu(params);
        }
        action.filterHu = filterHu;
        function testHu(params) {
            const algo = params.game.algo;
            let data = algo.testHu(params);
            if (data.ok) {
                data.ok = algo.testGuoShouHu(params);
            }
            return data;
        }
        action.testHu = testHu;
        function testGuoShouHu(params) {
            const algo = params.game.algo;
            return algo.testGuoShouHu(params);
        }
        action.testGuoShouHu = testGuoShouHu;
        function actionHu(params) {
            const algo = params.game.algo;
            return algo.actionHu(params);
        }
        action.actionHu = actionHu;
        function filterTing(params) {
            const algo = params.game.algo;
            return algo.filterTing(params);
        }
        action.filterTing = filterTing;
        function testTing(params) {
            const algo = params.game.algo;
            return algo.testTing(params);
        }
        action.testTing = testTing;
        function actionTing(params) {
            const algo = params.game.algo;
            return algo.actionTing(params);
        }
        action.actionTing = actionTing;
        function testHuShiSanYao(params) {
            const algo = params.game.algo;
            return algo.testHuShiSanYao(params);
        }
        action.testHuShiSanYao = testHuShiSanYao;
        function testHuShiSanBuKao(params) {
            const algo = params.game.algo;
            return algo.testHuShiSanBuKao(params);
        }
        action.testHuShiSanBuKao = testHuShiSanBuKao;
        function filterBaiPai(params) {
            const algo = params.game.algo;
            return algo.filterBaiPai(params);
        }
        action.filterBaiPai = filterBaiPai;
        function testBaiPai(params) {
            const algo = params.game.algo;
            return algo.testBaiPai(params);
        }
        action.testBaiPai = testBaiPai;
        function actionBaiPai(params) {
            const algo = params.game.algo;
            return algo.actionBaiPai(params);
        }
        action.actionBaiPai = actionBaiPai;
    })(action = mjapi.action || (mjapi.action = {}));
})(mjapi = exports.mjapi || (exports.mjapi = {}));
