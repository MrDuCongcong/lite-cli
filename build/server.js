#!/usr/bin/env node
const { createServer } = require('../server');
const { runDevServer } = require('../scripts/devServer');
const path = require('path');

const basePath = "build";  //当前工程下所有配置文件的目录路径 

program.parse(process.argv);

const serverConfig = {
    port: 8081,
};

const server = createServer();
server.listen(serverConfig.port, () => {
    console.log(`服务器已启动, 监听端口：${serverConfig.port}`);
    runDevServer();
});   







