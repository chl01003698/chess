'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Url = require('url');
const Query = require('querystring');
class UrlUtil {
    static _stringifySorted(query) {
        var keys = Object.keys(query).sort();
        var pairs = keys.reduce(function (collect, key) {
            return collect.concat(Query.escape(key) + '=' + Query.escape(query[key]));
        }, []);
        return pairs.join('&');
    }
    static match(path) {
        let result = null;
        result = path.match('/public/v1');
        result = path.match('/api/v1');
        if (result == null)
            return false;
        // console.log('result=>',result);
        return true;
    }
}
exports.default = UrlUtil;
