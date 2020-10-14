#!/usr/bin/env node

const { program } = require('commander');
const { createServer } = require('../server');
const path = require('path');
const openBrowsers = require('open-browsers');

program.option('-c, --config', '模块树的配置文件', 'build.config.json');

const basePath = 'build'; //当前工程下所有配置文件的目录路径

program.parse(process.argv);

const serverConfig = {
    port: 8081,
};

const server = createServer();
server.listen(serverConfig.port, () => {
    console.log(`服务已启动, 监听端口：${serverConfig.port}`);
    if (!openBrowsers('http://127.0.0.1:8081')) {
        console.log('浏览器打开失败！请访问：http://127.0.0.1:8081');
    }
});
