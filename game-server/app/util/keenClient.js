"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Keen = require("keen-tracking");
const config = require("config");
exports.keenClient = new Keen({
    projectId: config.get('keen.projectId'),
    writeKey: config.get('keen.writeKey')
});
// 登录
function onLogin(uid, channel, platform) {
    exports.keenClient.recordEvent('onLogin', { uid, channel, platform });
}
exports.onLogin = onLogin;
// 注册
function onRegister(uid, channel, sex, platform) {
    exports.keenClient.recordEvent('onRegister', { uid, channel, sex, platform });
}
exports.onRegister = onRegister;
// 赠予
function onReward(coin, reason, coinType = 'card') {
    exports.keenClient.recordEvent('onReward', { coin, reason, coinType });
}
exports.onReward = onReward;
// 消耗
function onPurchase(coin, reason, label = '', coinType = 'card') {
    exports.keenClient.recordEvent('onPurchase', { coin, label, reason, coinType });
}
exports.onPurchase = onPurchase;
// 消耗物品
function onUse(itemId, count) {
    exports.keenClient.recordEvent('onUse', { itemId, count });
}
exports.onUse = onUse;
// 充值请求
function onChargeRequst(uid, orderId, productId, money, coin, coinType, channel, provider = '') {
    exports.keenClient.recordEvent('onChargeRequst', { uid, orderId, productId, money, coin, coinType, channel, provider });
}
exports.onChargeRequst = onChargeRequst;
// 充值成功
function onChargeSuccess(uid, orderId, productId, money, coin, coinType, channel, provider = '') {
    exports.keenClient.recordEvent('onChargeSuccess', { uid, orderId, productId, money, coin, coinType, channel, provider });
}
exports.onChargeSuccess = onChargeSuccess;
// 绑定手机
function onBindPhone(uid, phone) {
    exports.keenClient.recordEvent('onBindPhone', { uid, phone });
}
exports.onBindPhone = onBindPhone;
// GM命令
function onGM(args) {
    exports.keenClient.recordEvent('onGM', args);
}
exports.onGM = onGM;
