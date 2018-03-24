'use strict';
import { Controller } from 'egg'
import RCPClient from '../rpc/client';

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi egg';
  }
}

module.exports = HomeController;


