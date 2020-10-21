import path from '../config/path.js';
import projectService from '../service/ProjectService';
import shellService from '../service/ShellService';

const runProject = function(projectId, ws) {
    const project = projectService.getProjectById(projectId, path.projectConfigPath);
    const state = shellService.runShell(project, path.templogDir, path.cmdDir, path.moduleBaseDir, ws);
};

export default {
    runProject,
};
