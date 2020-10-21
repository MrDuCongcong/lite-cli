/*
 * @Author: DuCongcong
 * @Description: 服务端初始化前进行检查
 * @Date: 2020-10-20 16:56:23
 * @LastEditTime: 2020-10-20 19:01:43
 */
import path from '../server/config/path';
const fs = require('fs');

const init = function() {
    if (!fs.existsSync(path.basePath)) {
        fs.mkdirSync(path.basePath);
    }
    if (!fs.existsSync(path.moduleBaseDir)) {
        fs.mkdirSync(path.moduleBaseDir);
    }
    if (!fs.existsSync(path.cmdDir)) {
        fs.mkdirSync(path.cmdDir);
    }
    if (!fs.existsSync(path.templogDir)) {
        fs.mkdirSync(path.templogDir);
    }

    if (!fs.existsSync(path.projectConfigPath)) {
        fs.appendFileSync(path.projectConfigPath, '');
        // fs.writeFileSync(path.projectConfigPath, '', { flag: 'w' });
    }
};

export default init;
