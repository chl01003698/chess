'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
class TestController extends egg_1.Controller {
    async show() {
        const query = this.ctx.query;
        this.ctx.body = 'test';
    }
}
exports.TestController = TestController;
module.exports = TestController;
