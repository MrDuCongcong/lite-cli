/*
 * @Author: DuCongcong
 * @Description: 模块
 * @Date: 2020-10-19 16:12:44
 * @LastEditTime: 2020-10-22 11:46:37
 */
import moduleService from '../service/ModuleService';
import projectService from '../service/ProjectService';
import path from '../config/path.js';
const fs = require('fs');

class ModuleController {
    constructor() {}

    getModuleByProjectId(req, res, next) {
        const projectId = req.param('projectId');
        moduleService.getModuleByProjectId(projectId, path.moduleBaseDir, (data) => {
            let responseData = {
                state: 200,
                data: data,
                message: '',
            };
            res.send(responseData);
        });
    }

    getModuleList(req, res, next) {
        let responseData = {};
        const projectId = req.param('projectId');
        const project = projectService.getProjectById(projectId, path.projectConfigPath);

        try {
            const data = moduleService.getModuleList(project, path.moduleConfigFile);
            responseData = {
                state: 200,
                data: data,
                message: '',
            };
        } catch (err) {
            responseData = {
                state: 500,
                data: '',
                message: '模块配置文件读取失败',
            };
        }
        res.send(responseData);
    }

    getModulesForProject(req, res, next) {
        const data = req.body;

        const modules = data.modules;
        const projectId = data.projectId;

        const responseData = {
            state: '',
            data: '',
            message: '',
        };
        moduleService.setModuleForProject(path.moduleBaseDir, projectId, modules, (result) => {
            if (result) {
                responseData.state = 200;
            } else {
                responseData.state = 500;
                responseData.message = '服务器错误';
            }
            res.send(responseData);
        });
    }

    setModulesForProject(req, res, next) {
        const data = req.body;

        const modules = data.modules;
        const projectId = data.projectId;

        const responseData = {
            state: '',
            data: '',
            message: '',
        };
        moduleService.setModuleForProject(path.moduleBaseDir, projectId, modules, (result) => {
            if (result) {
                responseData.state = 200;
            } else {
                responseData.state = 500;
                responseData.message = '服务器错误';
            }
            res.send(responseData);
        });
    }
}

export default new ModuleController();
