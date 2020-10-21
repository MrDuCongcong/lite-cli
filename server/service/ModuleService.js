const fs = require('fs');
class ModuleService {
    constructor() {}

    /**
     *  获取配置文件中所有模块目录
     *  @param {path} 模块目录文件路径
     *  @param {moduleConfigFile} 工程下的模块目录配置文件
     */
    getModuleList(project, moduleConfigFile) {
        let configFilePath = '';
        if (project.path) {
            configFilePath = path.resolve(project.path, moduleConfigFile);
        } else {
            configFilePath = path.resolve(workPath, moduleConfigFile);
        }

        const data = fs.readFileSync(configFilePath);
        const dataObj = JSON.parse(data.toString());
        return dataObj;
    }

    /**
     *  根据工程Id获取模块。获取当前工程被勾选的模块
     *  @param {projectId} 工程Id
     */
    getModuleByProjectId(projectId, moduleBaseDir, callback) {
        const modulePath = `${moduleBaseDir}/${projectId}.json`;
        const data = fs.readFileSync(modulePath).toString();
        let dataObj = [];
        if (data.trim()) {
            dataObj = JSON.parse(data);
        }
        callback(dataObj);
    }

    setModuleForProject(moduleBaseDir, projectId, modules, callback) {
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
    }
}

export default new ModuleService();
