'use strict';
import { Controller } from 'egg';
import reply from '../../const/reply';
import Config from '../../helper/config';

export class TestController extends Controller{
    async show(){
        const query = this.ctx.query;
        this.ctx.body = 'test'
    }

}
module.exports = TestController;