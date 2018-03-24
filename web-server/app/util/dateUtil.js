'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class DateUtil {
    static getDateInstance() {
        if (this.date == null) {
            this.date = new Date();
        }
        return this.date;
    }
    static compareDate(userDate) {
        const date = this.getDateInstance();
        userDate = new Date(userDate);
        if (date.getFullYear() != userDate.getFullYear()) {
            return false;
        }
        if (date.getMonth() != userDate.getMonth()) {
            return false;
        }
        if (date.getDate() > userDate.getDate()) {
            return false;
        }
        return true;
    }
}
DateUtil.date = null;
exports.default = DateUtil;
