const spawn = require('cross-spawn');
const fs = require('fs');
const { execFileSync, execFile } = require('child_process');
const path = require('path');

const runProjectList = [];

exports.runShell = function(project, logDir, cmdDir) {

    const findProjectIndex = runProjectList.findIndex(item => {
        return item.projectId === project.projectId;
    })

    if (findProjectIndex > -1) {
        return false;
    }

    // 日志路径
    const logPath = `${logDir}/${project.projectId}.txt`;
    // 命令.bat文件路径
    const cmdPath = `${cmdDir}/${project.projectId}.bat`

    // 运行工程如果有配置路径，则先将'导航到指定的路径下'的命令拼接到命令集中
    let pathConmand = `cd /d ${project.path}\n`;
    let cmdSet = pathConmand.concat(project.cmdSet);
    

    fs.appendFileSync(cmdPath, cmdSet);
 
    const runInfo = {
        projectName: project.projectName,
        projectId: project.projectId,
    };

    runProjectList.push(runInfo);


    const pid = execFile(cmdPath, [], { maxBuffer: 5000 * 1024 });
    pid.stdout.on('data', (data) => {
        fs.appendFileSync(logPath, data);
    });

    pid.stdout.on('error', (data) => {
        fs.appendFileSync(logPath, data);
    });

    pid.stdout.on('message', (data) => {
        fs.appendFileSync(logPath, data);
    });

    pid.on('exit', (code, signal) => {
        fs.appendFileSync(logPath, `子进程退出，退出码 ${code}`);
    });

    pid.on('close', (code) => {
        fs.appendFileSync(logPath, `子进程退出，退出码 ${code}`);
    });

    return true;
};

exports.runList = function() {
    return runProjectList;
};

exports.runLog = function(projectId, logDir, callback) {
    const logPath = `${logDir}/${projectId}.txt`;

    const data = fs.readFileSync(logPath);

    return data.toString();
};
