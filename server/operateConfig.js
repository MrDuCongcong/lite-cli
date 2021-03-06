const { json } = require('body-parser');
const fs = require('fs');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const workPath = process.cwd();

/**
 *  获取配置文件中所有模块目录
 *  @param {path} 模块目录文件路径
 *  @param {moduleConfigFile} 工程下的模块目录配置文件
 */
const getModuleList = function(project, moduleConfigFile) {
    let configFilePath = '';
    if (project.path) {
        configFilePath = path.resolve(project.path, moduleConfigFile);
    } else {
        configFilePath = path.resolve(workPath, moduleConfigFile);
    }

    const data = fs.readFileSync(configFilePath);
    const dataObj = JSON.parse(data.toString());
    return dataObj;
};

/**
 *  根据工程Id获取模块。获取当前工程被勾选的模块
 *  @param {projectId} 工程Id
 */
const getModuleByProjectId = function(projectId, moduleBaseDir, callback) {
    const modulePath = `${moduleBaseDir}/${projectId}.json`;
    const data = fs.readFileSync(modulePath).toString();
    let dataObj = [];
    if (data.trim()) {
        dataObj = JSON.parse(data);
    }
    callback(dataObj);
};

const getProjectById = function(projectId, projectConfigPath) {
    const data = fs.readFileSync(projectConfigPath);
    const dataObjList = JSON.parse(data.toString());

    const findObj = dataObjList.find((i) => {
        if (i.projectId === projectId) return i;
    });

    return findObj;
};

/**
 *  获取配置文件中的工程目录
 *  @param {path} 工程目录文件路径
 */

const getProjectCategory = function(path) {
    const data = fs.readFileSync(path).toString();
    let dataObj = [];
    if (data.trim()) {
        dataObj = JSON.parse(data);
    }
    return dataObj;
};

/**
 *  添加新的工程
 *  @param { basePath } 工程目录文件所在的文件夹路径
 *  @param { projectConfigPath } 工程目录文件的全路径
 *  @param { projct } 工程对象 { projectName: '', projectId: '' }
 */
const addProject = function(moduleBaseDir, projectConfigPath, project, callback) {
    if (project.projectId) {
        // 如果有projectId则是编辑工程，查找相应的project对象替换

        // 将工程信息写入工程目录文件
        const data = fs.readFileSync(projectConfigPath).toString();
        let projectList = [];
        if (data.trim()) {
            projectList = JSON.parse(data);
        }

        const findProjectIndex = projectList.findIndex((item, index) => {
            return item.projectId === project.projectId;
        });

        if (findProjectIndex > -1) {
            projectList.splice(findProjectIndex, 1, project);

            fs.writeFileSync(projectConfigPath, JSON.stringify(projectList, null, 4));
            callback(projectList);
        } else {
            callback(projectList);
        }
    } else {
        // 否则将project对象写入列表中

        project.projectId = uuidv4();
        // 将创建日期写到工程对象中
        project.createDate = new moment().format('YYYY-MM-DD HH:MM:SS');

        // 根据工程ID创建工程文件
        fs.writeFile(`${moduleBaseDir}/${project.projectId}.json`, '', (err) => {
            if (err) {
                throw new Error(err);
            }

            // 将工程信息写入工程目录文件
            const data = fs.readFileSync(projectConfigPath).toString();
            let dataObj = [];
            if (data.trim()) {
                dataObj = JSON.parse(data);
            }
            dataObj.push(project);
            fs.writeFileSync(projectConfigPath, JSON.stringify(dataObj, null, 4));
            callback(dataObj);
        });
    }
};

const setModuleForProject = function(moduleBaseDir, projectId, modules, callback) {
    // 过滤掉非模块节点
    const reg = /^(\d+)(\-|\d)+\d$/;
    const useableModules = modules.filter((item) => {
        return !reg.test(item);
    });

    fs.writeFile(`${moduleBaseDir}/${projectId}.json`, JSON.stringify(useableModules, null, 4), (err) => {
        if (err) {
            callback(false);
            throw new Error(err);
        } else {
            callback(true);
        }
    });
};

/**
 * 根据项目ID删除当前项目
 * @param {*} projectId 项目ID
 * @param {*} projectConfigPath 项目目录配置文件
 * @param {*} logDir 项目运行日志目录
 * @param {*} moduleBaseDir 项目模块配置文件目录
 */
const deleteProjectById = function(projectId, projectConfigPath, logDir, moduleBaseDir, cmdDir) {
    // 删除项目目录配置
    const tempProjectList = fs.readFileSync(projectConfigPath);
    let projectList = JSON.parse(tempProjectList.toString());
    const findIndex = projectList.findIndex((item) => {
        return item.projectId === projectId;
    });

    projectList.splice(findIndex, 1);
    fs.writeFileSync(projectConfigPath, JSON.stringify(projectList));

    // 删除项目日志文件
    const logPath = path.join(logDir, `${projectId}.txt`);
    if (fs.existsSync(logPath)) {
        fs.unlinkSync(logPath);
    }

    // 删除项目对应的命令行文件
    const cmdPath = path.join(cmdDir, `${projectId}.bat`);

    if (fs.existsSync(cmdPath)) {
        fs.unlinkSync(cmdPath);
    }

    // 删除项目对应的模块文件
    const modulePath = path.join(moduleBaseDir, `${projectId}.json`);

    if (fs.existsSync(modulePath)) {
        fs.unlinkSync(modulePath);
    }

    return projectList;
};

module.exports = {
    getModuleList,
    getProjectCategory,
    addProject,
    getModuleByProjectId,
    setModuleForProject,
    deleteProjectById,
    getProjectById,
};
