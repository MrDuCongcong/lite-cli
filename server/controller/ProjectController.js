/*
 * @Author: DuCongcong
 * @Description: 工程控制器
 * @Date: 2020-10-19 16:12:44
 * @LastEditTime: 2020-10-20 18:57:17
 */
import projectService from '../service/ProjectService';
import path from '../config/path.js';
const fs = require('fs');
const buildServer = require('../../scripts/build');

const { runShell, runList, runLog, suspendRun } = require('../../scripts/runShell');

class ProjectController {
    constructor() {}

    getProjectList(req, res, next) {
        const data = projectService.getProjectCategory(path.projectConfigPath);

        let responseData = {
            state: 200,
            data: data,
            message: '',
        };
        res.send(responseData);
    }

    addProject(req, res) {
        const data = req.body;
        projectService.addProject(path.moduleBaseDir, path.projectConfigPath, data, (projectList) => {
            let responseData = {
                state: 200,
                data: projectList,
                message: '',
            };
            res.send(responseData);
        });
    }

    deleteProject(req, res, next) {
        const projectId = req.param('projectId');
        let responseData = {};
        try {
            const data = projectService.deleteProjectById(
                projectId,
                path.projectConfigPath,
                path.templogDir,
                path.moduleBaseDir,
                path.cmdDir
            );
            responseData = {
                state: 200,
                data: data,
                message: '',
            };
        } catch (e) {
            responseData = {
                state: 500,
                data: '',
                message: '服务端错误',
            };
        }

        res.send(responseData);
    }

    buildProject(req, res, next) {
        const projectId = req.param('projectId');
        projectService.getModuleByProjectId(projectId, path.moduleBaseDir, (data) => {
            buildServer.build(data);
        });
    }

    runProject(req, res, next) {
        let responseData = '',
            sucCount = 0,
            failCount = 0;
        const result = [];

        const projectIds = req.param('projectIds');

        if (Array.isArray) {
            projectIds.forEach((projectId) => {
                try {
                    const project = projectService.getProjectById(projectId, path.projectConfigPath);
                    const state = runShell(project, path.templogDir, path.cmdDir, path.moduleBaseDir);
                    if (state) {
                        responseData = {
                            state: 200,
                            data: '',
                            message: '',
                        };
                    } else {
                        responseData = {
                            state: 300,
                            data: '',
                            message: `项目${project.projectName}已经在运行中`,
                        };
                    }
                } catch (err) {
                    console.log(err);
                    responseData = {
                        state: 500,
                        data: '',
                        message: err.message,
                    };
                }
                result.push(responseData);
            });
        }

        result.forEach((item) => {
            if (item.state === 200 || item.state === 300) {
                sucCount += 1;
            } else {
                failCount += 1;
            }
        });

        if (sucCount > 0) {
            responseData = {
                state: 200,
                data: '',
                message: `${sucCount}个项目运行成功，${failCount}个项目运行失败`,
            };
        } else {
            responseData = {
                state: 500,
                data: '',
                message: `项目运行失败`,
            };
        }
        res.send(responseData);
    }
}

export default new ProjectController();
