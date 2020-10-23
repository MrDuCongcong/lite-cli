/*
 * @Author: DuCongcong
 * @Description:
 * @Date: 2020-10-21 14:36:24
 * @LastEditTime: 2020-10-23 17:00:25
 */
import path from '../config/path.js';
import projectService from '../service/ProjectService';
import shellService from '../service/ShellService';

const runProject = function(projectId, ws) {
    try {
        const project = projectService.getProjectById(projectId, path.projectConfigPath);
        shellService.runShell(project, path.templogDir, path.cmdDir, path.moduleBaseDir, ws);
    } catch (e) {
        const response = {
            state: 0,
            data: e.message,
            rst: 1,
            suspend: 'run',
        };

        ws.send(JSON.stringify(response));
    }
};

const suspendProject = function(projectId, ws) {
    let response = '';

    try {
        shellService.suspendRun(projectId, ws);
    } catch (err) {
        const response = {
            state: 1,
            data: err.message,
        };

        ws.send(JSON.stringify(response));
    }
};

export default {
    runProject,
    suspendProject,
};
