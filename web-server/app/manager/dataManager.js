"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const low = require("lowdb");
const Memory = require("lowdb/adapters/Memory");
const axios_1 = require("axios");
const fs = require('fs');
const path = './data/config.json';
class DataManager {
    constructor() {
        this.db = low(new Memory());
    }
    async initLoadData() {
        this.loadLocalHotConfig();
    }
    async loadLocalHotConfig() {
        try {
            const jsonObject = JSON.parse(fs.readFileSync(path));
            // console.log("jsonObject=>",jsonObject);
            this.db.setState(jsonObject).write();
        }
        catch (error) {
            console.log('error=>', error);
        }
    }
    async loadRemoteHotConfig(url) {
        try {
            const response = await axios_1.default.get(url);
            const jsonObject = response.data;
            this.db.setState(jsonObject).write();
            fs.writeFileSync(path, JSON.stringify(jsonObject));
        }
        catch (error) {
            // logger.error(error);
        }
    }
    get(key) {
        const config = this.db.get(key).value();
        return config;
    }
}
exports.default = DataManager;
