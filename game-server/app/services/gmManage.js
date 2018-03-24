"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../util/helpers");
const Joi = require("joi");
const code_1 = require("../consts/code");
const pushEvent_1 = require("../consts/pushEvent");
const _ = require("lodash");
const Raven = require("raven");
const db_1 = require("../extend/db");
class GMManage {
    constructor(app) {
        this.app = app;
        this.cmds = {
            // $addCoin -s 100583 -v 1000 -t gold
            $addCoin: {
                opts: {
                    alias: {
                        shortId: 's',
                        value: 'v',
                        type: 't'
                    },
                    default: {
                        shortId: 0,
                        type: 'gold'
                    }
                },
                execute: (args, next, user) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const validate = helpers_1.JoiValidate(args, {
                            shortId: Joi.number().required(),
                            value: Joi.number().max(1000000).required(),
                            type: Joi.string().required()
                        }, next);
                        if (!validate)
                            return;
                        let exeUser = undefined;
                        const shortId = args['shortId'];
                        const coinType = args['type'];
                        if (shortId == 0) {
                            exeUser = user;
                        }
                        else if (shortId > 0) {
                            exeUser = yield db_1.UserModel.byShortId(shortId).select('coin').exec();
                        }
                        if (exeUser == null)
                            return next(null, code_1.default.NO_EXIST_USER);
                        const value = args['value'] < 0
                            ? -_.min([Math.abs(args['value']), exeUser.coin[coinType]])
                            : args['value'];
                        exeUser['coin'][coinType] += value;
                        exeUser['save']();
                        this.app.get('statusService').pushByUids([exeUser.id], pushEvent_1.default.onUpdateCoin, {
                            coin: exeUser.coin,
                            msg: ''
                        });
                        next(null, { code: code_1.default.OK });
                    }
                    catch (error) {
                        Raven.captureException(error);
                    }
                })
            },
            $checkCoin: {
                opts: {
                    alias: {
                        shortId: 's'
                    },
                    default: {
                        shortId: 0
                    }
                },
                execute: (args, next, user) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const validate = helpers_1.JoiValidate(args, {
                            shortId: Joi.number().required()
                        }, next);
                        if (!validate)
                            return;
                        let exeUser = undefined;
                        const shortId = args['shortId'];
                        if (shortId == 0) {
                            exeUser = user;
                        }
                        else if (shortId > 0) {
                            exeUser = yield db_1.UserModel.byShortId(shortId).select('coin nickname').exec();
                        }
                        if (exeUser == null)
                            return next(null, code_1.default.NO_EXIST_USER);
                        next(null, {
                            code: _.assign(code_1.default.OK, {
                                msg: '昵称: ' + exeUser.nickname + '\n金币: ' + exeUser.coin.gold
                            })
                        });
                    }
                    catch (error) {
                        Raven.captureException(error);
                    }
                })
            },
            $gm: {
                opts: {
                    alias: {
                        shortId: 's',
                        level: 'l'
                    }
                },
                execute: (args, next, user) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const validate = helpers_1.JoiValidate(args, {
                            shortId: Joi.number().required(),
                            level: Joi.number().min(0).max(1).required()
                        }, next);
                        if (!validate)
                            return;
                        let exeUser = undefined;
                        const shortId = args['shortId'];
                        if (shortId == 0) {
                            exeUser = user;
                        }
                        else if (shortId > 0) {
                            exeUser = yield db_1.UserModel.byShortId(shortId).select('coin GMLevel').exec();
                        }
                        if (exeUser == null)
                            return next(null, code_1.default.NO_EXIST_USER);
                        exeUser.GMLevel = args['level'];
                        exeUser.save();
                        next(null, { code: code_1.default.OK });
                    }
                    catch (error) {
                        Raven.captureException(error);
                    }
                })
            }
        };
    }
}
exports.default = GMManage;
