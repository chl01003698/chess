'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  /**
   * JWT 验证规则　    验证匹配path= '/api' 开头的
   * URL 签名验证规则　验证匹配path= '/public/v1' || '/api/v1' 开头的
   */
  //都不验证的
  router.get    ('/', controller.home.index);
  router.post   ('/public/other/orders/callback',            controller.v1.order.callback);
  router.get    ('/public/other/awards/luckaward',           controller.v1.award.luckAward);
  router.get    ('/public/other/awards/luckaward/integral',  controller.v1.award.luckAwardIntegral);
  router.get    ('/public/other/awards/luckaward/callback',  controller.v1.award.luckAwardCallback);
  //不验证token　验证Url签名
  router.get    ('/public/v1/hotpatchings/config',           controller.v1.hotPatching.updateConfig);
  router.get    ('/public/v1/hotpatchings/keywords',         controller.v1.hotPatching.updateKeywords);
  router.post   ('/public/v1/users',                         controller.v1.user.create);
  router.post   ('/public/v1/users/phone',                   controller.v1.user.createByPhone);
  router.post   ('/public/v1/users/phone/password',          controller.v1.user.loginByPasswrod);
  router.post   ('/public/v1/users/phone/smscode',           controller.v1.user.loginBySmsCode);
  router.post   ('/public/v1/sms',                           controller.v1.sms.create);
  //验证token    验证Url签名
  router.get    ('/api/v1/users/:id',                     controller.v1.user.show);
  router.get    ('/api/v1/users/shortId/:shortId',        controller.v1.user.byShortId);
  router.put    ('/api/v1/users/phone',                   controller.v1.user.bindPhone);
  router.put    ('/api/v1/users/realName',                controller.v1.user.realName);
  router.put    ('/api/v1/users/nickname',                controller.v1.user.nickname);
  router.put    ('/api/v1/users/location',                controller.v1.user.location);
  router.put    ('/api/v1/users/playArea',                controller.v1.user.playArea);
  router.put    ('/api/v1/users/chessroom',               controller.v1.user.bindChessRoom);
  router.put    ('/api/v1/users/card',                    controller.v1.user.addCard);
  router.put    ('/api/v1/users/confirm',                 controller.v1.user.updateConfirm);
  router.get    ('/api/v1/mails/:id',                     controller.v1.mail.index);
  router.post   ('/api/v1/mails',                         controller.v1.mail.create);
  router.put    ('/api/v1/mails',                         controller.v1.mail.update);
  router.put    ('/api/v1/mails/remove',                  controller.v1.mail.removeMail);
  router.put    ('/api/v1/mails/all',                     controller.v1.mail.receiveAll);
  router.get    ('/api/v1/activities/:app',               controller.v1.activity.index);
  router.post   ('/api/v1/activities',                    controller.v1.activity.create);
  router.get    ('/api/v1/records/:id/:game',             controller.v1.record.index);
  router.get    ('/api/v1/records/owner/:id/:game',       controller.v1.record.getOwnerRecords);
  router.get    ('/api/v1/records/chessRoom/:id/:game',   controller.v1.record.getChessRoomRecords);
  router.post   ('/api/v1/records',                       controller.v1.record.create);
  router.get    ('/api/v1/users/friends/invited/:id',     controller.v1.user.getInvited);
  router.post   ('/api/v1/users/friends/invited',         controller.v1.user.addInvited);
  router.post   ('/api/v1/orders',                        controller.v1.order.create);
  router.get    ('/api/v1/feedbacks',                     controller.v1.feedback.index);
  router.post   ('/api/v1/feedbacks',                     controller.v1.feedback.create);
  router.get    ('/api/v1/awards/shareaward/:id',         controller.v1.award.shareAward);
  router.put    ('/api/v1/awards/inviteaward',            controller.v1.award.invitedAward);
  router.get    ('/api/v1/curators/chessRoom/:shortId',   controller.v1.curator.show);
  router.post   ('/api/v1/curators',                      controller.v1.curator.create);
  router.put    ('/api/v1/curators/tablet',               controller.v1.curator.updateTablet);
  router.post   ('/api/v1/agents',                        controller.v1.agent.create);
  router.get    ('/api/v1/tests',                         controller.v1.test.show);
  router.get    ('/api/v1/pushs',                         controller.v1.push.pushAll);
  // 群组
  router.get    ('/api/v1/curatorGroups/:id',             controller.v1.curatorGroup.index);
  router.post   ('/api/v1/curatorGroups',                 controller.v1.curatorGroup.create);
  router.put    ('/api/v1/curatorGroups/member',          controller.v1.curatorGroup.insertMember);
  router.delete ('/api/v1/curatorGroups/member',          controller.v1.curatorGroup.removeMember);
  router.get    ('/api/v1/curatorGroups/members/:groupId',controller.v1.curatorGroup.getGroupMembers);
  router.delete ('/api/v1/curatorGroups/members',         controller.v1.curatorGroup.removeMemerInAllGroup);
  router.delete ('/api/v1/curatorGroups/:groupId',        controller.v1.curatorGroup.remvoeGroup);
  router.put    ('/api/v1/curatorGroups/name',            controller.v1.curatorGroup.updateGroupName);
  // 用户游戏
  router.get    ('/api/v1/user/game/chess/:id',           controller.v1.user.getUserGame);
  router.put    ('/api/v1/user/game/chess',               controller.v1.user.addUserGame);
  router.delete ('/api/v1/user/game/chess',               controller.v1.user.removeUserGame);
  // 红包
  router.post   ('/api/v1/users/redPackets',              controller.v1.redPacket.create);
  router.get    ('/api/v1/users/redPackets/:id',          controller.v1.redPacket.show);
  router.put    ('/api/v1/users/redPackets',              controller.v1.redPacket.receive);
  
  router.get    ('/api/v1/users/nameCard/:curatorId',     controller.v1.user.getCuratorCard);
  router.post   ('/api/v1/approvals/curator',             controller.v1.approval.createCuratorApporval);
  router.get    ('/api/v1/broadcasts/:game',              controller.v1.broadcast.index);
  router.post   ('/api/v1/sms/award',                     controller.v1.sms.sendJDAward);

  

};

