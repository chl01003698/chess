# web-server



## 快速入门

<!-- 在此次添加使用文档 -->

如需进一步了解，参见 [egg 文档][egg]。

### 本地开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```


### 部署

$ cd baseDir
$ npm install --production
$ tar -zcvf ../release.tgz .
启动
//只能jsonpack.json文件中配置
$ npm start --port=7050 --workers=6 --daemon --title=egg-server-hall

    --port=7001 端口号，默认会读取环境变量 process.env.PORT，如未传递将使用框架内置端口 7001。
    --daemon 是否允许在后台模式，无需 nohup。若使用 Docker 建议直接前台运行。
    --env=prod 框架运行环境，默认会读取环境变量 process.env.EGG_SERVER_ENV， 如未传递将使用框架内置环境 prod。
    --workers=2 框架 worker 线程数，默认会创建和 CPU 核数相当的 app worker 数，可以充分的利用 CPU 资源。
    --title=egg-server-showcase 用于方便 ps 进程时 grep 用，默认为 egg-server-${appname}。

停止
$ npm stop [--title=egg-server-hall]


sudo apt-get install graphicsmagick 画图
sudo apt-get install imagemagick 画图


### 单元测试

- [egg-bin] 内置了 [mocha], [thunk-mocha], [power-assert], [istanbul] 等框架，让你可以专注于写单元测试，无需理会配套工具。
- 断言库非常推荐使用 [power-assert]。
- 具体参见 [egg 文档 - 单元测试](https://eggjs.org/zh-cn/core/unittest)。

### 内置指令

- 使用 `npm run lint` 来做代码风格检查。
- 使用 `npm test` 来执行单元测试。
- 使用 `npm run autod` 来自动检测依赖更新，详细参见 [autod](https://www.npmjs.com/package/autod) 。


[egg]: https://eggjs.org
