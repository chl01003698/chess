"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crc = require("crc");
function dispatcher(uid, connectors) {
    let index = Math.abs(crc.crc32(uid)) % connectors.length;
    return connectors[index];
}
exports.dispatcher = dispatcher;
