#!/usr/bin/env node

const { program } = require("commander");
const { createServer } = require('../server');
const { runDevServer } = require('../scripts/devServer');
const path = require('path');

program
    .option('-c, --config', '模块树的配置文件', 'build.config.json');

console.log(path.join(__dirname, '../src'));

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







