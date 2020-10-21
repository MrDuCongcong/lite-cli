/*
 * @Author: DuCongcong
 * @Description:全局配置的路径
 * @Date: 2020-10-20 15:08:46
 * @LastEditTime: 2020-10-20 18:59:13
 */
const path = require('path');
const os = require('os');

const basePath = path.join(os.homedir(), '.lite-cli');

// 项目目录配置文件
const projectConfigPath = path.resolve(basePath, `project.config.json`);
// 模块目录配置文件
//const moduleConfigPath = path.resolve(__dirname, `../${basePath}/module.config.json`);
// 模块目录配置文件名称。该文件保存着当前工程下所有模块的目录
const moduleConfigFile = 'module.config.json';

// 保存项目拥有模块的文件的目录
const moduleBaseDir = path.resolve(basePath, `projects`);
// 报错项目临时执行脚本的文件的目录
const templogDir = path.resolve(basePath, `log`);
// 命令行目录
const cmdDir = path.resolve(basePath, `bat`);

export default {
    basePath,
    projectConfigPath,
    moduleConfigFile,
    moduleBaseDir,
    templogDir,
    cmdDir,
};
