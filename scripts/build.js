const fs = require('fs');
const spawn = require('cross-spawn');


const workPath = process.cwd();

function build(data) {
    const pureData = filterData(data);
    alterProcess(pureData);
    const start = spawn('npm', ['run', 'build:prod'], { stdio: 'inherit' });
}

// 过滤项目文件数组中存在的非图表项
function filterData(data) {
    const reg = /([0-9]|-)+/
    return data.filter(item => {
        return !reg.test(item)
    })
}

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