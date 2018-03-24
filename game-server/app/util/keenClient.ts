import * as Keen from 'keen-tracking'
import * as config from 'config'

export const keenClient = new Keen({
  projectId: config.get('keen.projectId'),
	writeKey: config.get('keen.writeKey')
})

// 登录
export function onLogin(uid: string, channel: string, platform: string) {
  keenClient.recordEvent('onLogin', {uid, channel, platform})
}

// 注册
export function onRegister(uid: string, channel: string, sex: number, platform: string) {
   keenClient.recordEvent('onRegister', {uid, channel, sex, platform})
}

// 赠予
export function onReward(coin: number, reason: string, coinType: string = 'card') {
  keenClient.recordEvent('onReward', {coin, reason, coinType})
}

// 消耗
export function onPurchase(coin: number, reason: string, label: string = '', coinType: string = 'card') {
  keenClient.recordEvent('onPurchase', {coin, label, reason, coinType})
}

// 消耗物品
export function onUse(itemId: number | string, count: number) {
  keenClient.recordEvent('onUse', {itemId, count})
}

// 充值请求
export function onChargeRequst(uid: string, orderId: string, productId: number, money: number, coin: number, coinType: string, channel: string, provider: string = '') {
  keenClient.recordEvent('onChargeRequst', {uid, orderId, productId, money, coin, coinType, channel, provider})
}

// 充值成功
export function onChargeSuccess(uid: string, orderId: string, productId: number, money: number, coin: number, coinType: string, channel: string, provider: string = '') {
  keenClient.recordEvent('onChargeSuccess', {uid, orderId, productId, money, coin, coinType, channel, provider})
}

// 绑定手机
export function onBindPhone(uid: string, phone: string) {
  keenClient.recordEvent('onBindPhone', {uid, phone})
}

// GM命令
export function onGM(args) {
  keenClient.recordEvent('onGM', args)
}

