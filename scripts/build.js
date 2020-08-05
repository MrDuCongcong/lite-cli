const fs = require('fs');
const spawn = require('cross-spawn');


const workPath = process.cwd();

/**
 * 执行当前执行项目环境下的打包命令
*/
function build(data) {
    const pureData = filterData(data);
    alterProcess(pureData);
    const start = spawn('npm', ['run', 'build:prod'], { stdio: 'inherit' });
}

/**
 * 过滤模块选择树中已选择数据的非叶子节点
 * 由于ant-design-vue的tree组件，会默认给树节点一个key值
 * @return {Array} 已经选择的模块
*/
function filterData(data) {
    const reg = /([0-9]|-)+/
    return data.filter(item => {
        return !reg.test(item)
    })
}


/**
 * 复制源文件，并重写源文件。
 * 根据选择的模块，重新写入import和export
*/
function alterProcess(data) {
    const processFilePath = `${workPath}/src/graph/processing.js`;
    const processCopyPath = `${workPath}/src/graph/processing.copy.js`;
    if (fs.existsSync(processCopyPath)) {
        return 'process的复制文件已存在，请勿重复打包';
    }
    fs.copyFileSync(processFilePath, processCopyPath);

    let fileContent = ''
    data.forEach(item => {
        fileContent += `import ${item} from './processing/${item}.js';\n`;
    });
 
    fileContent += 'export {\n'
    data.forEach( item => {
        fileContent += `    ${item},\n`;
    })
    fileContent += '};';
    
    fs.writeFileSync(processFilePath, fileContent);
}





module.exports = {
    build
};