'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class MongooseUtil {
    static compareResult(result) {
        if (result.nModified >= 1) {
            return true;
        }
        return false;
    }
}
exports.default = MongooseUtil;
