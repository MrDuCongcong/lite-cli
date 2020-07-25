/**
 * 配置文件操作模块
*/
const fs = require('fs');

/**
 *  获取配置文件中所有模块目录
 *  @param {path} 模块目录文件路径
*/
const getModuleList = function (moduleConfigPath) {
    const data = fs.readFileSync(moduleConfigPath);
    const dataObj =  JSON.parse(data.toString());
    return dataObj;
}

/**
 *  根据工程Id获取模块
 *  @param {projectId} 工程Id
*/
const getModuleByProjectId = function (projectId, moduleBasePath, callback) {
    const modulePath = `${moduleBasePath}/${projectId}.json`;
    const data = fs.readFileSync(modulePath).toString();
    let dataObj = [];
    if (data.trim()) {
        dataObj =  JSON.parse(data);
    }
    callback(dataObj);
}

/**
 *  获取配置文件中的工程目录
 *  @param {path} 工程目录文件路径
*/

const getProjectCategory = function (path) {
    const data = fs.readFileSync(path).toString();
    let dataObj = [];
    if (data.trim()) {
        dataObj =  JSON.parse(data);
    }
    return dataObj;    
}

/**
 *  添加新的工程
 *  @param { basePath } 工程目录文件所在的文件夹路径
 *  @param { projectConfigPath } 工程目录文件的全路径
 *  @param { projct } 工程对象 { projectName: '', projectId: '' }
*/
const addProject = function (basePath, projectConfigPath, project, callback) {
    // 根据工程ID创建工程文件
    fs.writeFile(`${basePath}/${project.projectId}.json`, '', (err) => {
        if (err) {
            throw new Error(err);
        }
        // 将工程信息写入工程目录文件
        const data = fs.readFileSync(projectConfigPath).toString();
        let dataObj = [];
        if (data.trim()) {
            dataObj =  JSON.parse(data);
        }
        dataObj.push(project);
        fs.writeFileSync(projectConfigPath, JSON.stringify(dataObj));
        callback(dataObj);
    });
}

const setModuleForProject = function (moduleBasePath, projectId, modules, callback) {
    fs.writeFile(`${moduleBasePath}/${projectId}.json`, JSON.stringify(modules), (err) => {
        if (err) {
            callback(false)
            throw new Error(err);
        } else {
            callback(true);
        }
    });
}

const deleteProjectById = function  (params) {
    
}

module.exports = {
    getModuleList,
    getProjectCategory,
    addProject,
    getModuleByProjectId,
    setModuleForProject,
};