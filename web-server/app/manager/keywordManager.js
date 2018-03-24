"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const KeywordFilter = require('keyword-filter');
const filter = new KeywordFilter();
const fs = require('fs');
const filePath = './data/keyword.txt';
class KeywordManager {
    static async loadKeyword() {
        const data = await fs.readFileSync(filePath, { encoding: 'utf-8' });
        const keywords = data.split(/\r?\n/);
        // console.log('keywords=>',keywords);
        filter.init(keywords);
    }
    static async loadRomoteKeyword(url) {
        try {
            const response = await axios_1.default.get(url);
            await fs.writeFileSync(filePath, response.data);
            await this.loadKeyword();
        }
        catch (error) {
            // logger.error(error);
        }
    }
    static hasKeyword(word) {
        if (filter.hasKeyword(word))
            return true;
        return false;
    }
}
exports.default = KeywordManager;
