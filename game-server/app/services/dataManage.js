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
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const Memory = require("lowdb/adapters/Memory");
const axios_1 = require("axios");
const config = require("config");
const Raven = require("raven");
const schedule = require("node-schedule");
const merge = require("deepmerge");
const _ = require("lodash");
const dataConfig = config.get('data');
class DataManage {
    constructor() {
        this.dataList = new Map();
    }
    getMergeData(configList) {
        const configData = [];
        _.forEach(configList, (v) => {
            if (this.dataList.has(v)) {
                configData.push(this.dataList.get(v).value());
            }
        });
        const dontMerge = (destination, source) => source;
        return merge.all(configData, { arrayMerge: dontMerge });
    }
    getData(name) {
        let data;
        if (this.dataList.has(name)) {
            data = this.dataList.get(name).value();
        }
        return data;
    }
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            Raven.context(() => __awaiter(this, void 0, void 0, function* () {
                this.dataList.clear();
                console.log("..........................");
                console.log(dataConfig);
                console.log("..........................");
                if (dataConfig.pattern == 'remote') {
                    this.config = low(new Memory());
                    const response = yield axios_1.default.get(dataConfig.remoteConfigURL);
                    const jsonObject = response.data;
                    this.config.setState(jsonObject).write();
                    for (const name in dataConfig.list) {
                        this.dataList.set(name, low(new Memory()));
                        const response = yield axios_1.default.get(`${dataConfig.url}${dataConfig.list[name]}`);
                        const jsonObject = response.data;
                        this.dataList.get(name).setState(jsonObject).write();
                    }
                }
                else if (dataConfig.pattern == 'local') {
                    this.config = low(new FileSync(dataConfig.localConfigPath));
                    for (const name in dataConfig.list) {
                        this.dataList.set(name, low(new FileSync(`${dataConfig.path}${dataConfig.list[name]}`)));
                    }
                }
            }));
        });
    }
    checkNewData() {
        const rule = new schedule.RecurrenceRule();
        rule.minute = new schedule.Range(0, 59, 10);
        const j = schedule.scheduleJob(rule, () => {
            this.loadData();
        });
    }
}
exports.default = DataManage;
