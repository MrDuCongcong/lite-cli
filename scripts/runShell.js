const spawn = require('cross-spawn');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const runProjectList = [];

exports.runShell = function(project, logDir) {
    let cmdStr = project.cmdSet.split('\n').join(' & ');

    // 运行工程如果有配置路径， 则先导航到指定的路径下
    if (project.path) {
        const navigation = `cd /d ${project.path} `;
        cmdStr = navigation.concat(' & ').concat(cmdStr);
    }

    const runInfo = {
        projectName: project.projectName,
        projectId: project.projectId,
    };

    runProjectList.push(runInfo);

    const filePath = `${logDir}/${project.projectId}.txt`;
    const pid = exec(cmdStr, { shell: 'cmd.exe' });

    pid.stdout.on('data', (data) => {
        fs.appendFileSync(filePath, data);
    });

    pid.stdout.on('error', (data) => {
        fs.appendFileSync(filePath, data);
    });

    pid.stdout.on('message', (data) => {
        fs.appendFileSync(filePath, data);
    });

    pid.on('exit', (code, signal) => {
        fs.appendFileSync(filePath, `子进程退出，退出码 ${code}`);
    });

    pid.on('close', (code) => {
        fs.appendFileSync(filePath, `子进程退出，退出码 ${code}`);
    });
};

exports.runList = function() {
    return runProjectList;
};

exports.runLog = function(projectId, logDir, callback) {
    const logPath = `${logDir}/${projectId}.txt`;

    const data = fs.readFileSync(logPath);

    return data.toString();
};
