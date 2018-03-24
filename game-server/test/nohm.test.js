"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nohm_1 = require("nohm");
const redisClient = require('redis').createClient();
redisClient.select(0);
nohm_1.nohm.setClient(redisClient);
// nohm.logError = function (err) {
//   throw new Error({
//     name: "Nohm Error",
//     message: err
//   });
// }
var UserModel = nohm_1.nohm.model('User', {
    properties: {
        name: {
            type: 'string',
            validations: [
                'notEmpty'
            ]
        }
    }
});
var user = new UserModel();
user.id = "123";
user.property('name', 'test');
console.log(user.property('name'));
user.save();
