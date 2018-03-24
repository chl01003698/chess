'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const dataManager_1 = require("../manager/dataManager");
class ConfigHelper {
}
ConfigHelper.instance = null;
ConfigHelper.Instance = function () {
    if (this.instance == null) {
        this.instance = new dataManager_1.default();
    }
    return this.instance;
};
ConfigHelper.SHAREAWARD = function () {
    return this.Instance().get('common.shareAward');
};
exports.default = ConfigHelper;
