var co = require('co');
var OSS = require('ali-oss');
var client = new OSS({
    region: 'oss-cn-qingdao',
    accessKeyId: 'LTAICuGh5Fm9KIYB',
    accessKeySecret: 'VXmaobce2qdEVzTdYKeyy1mUQBydUi',
    bucket: 'projecta-dev'
});
co(function* () {
    var result = yield client.put('ossdemo/demo.json', new Buffer(JSON.stringify({ id: 123, roomId: "jndklasjd", players: [{ heel: 11 }] })));
    console.log(result);
}).catch(function (err) {
    console.log(err);
});
