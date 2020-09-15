const spawn = require('cross-spawn');
const fs = require('fs');
const { execFile } = require('child_process');
const path = require('path');
const { clear } = require('console');
const process = require('process');

const runProjectList = [];
const workPath = process.cwd(); // node.js进程当前工作目录

exports.runShell = function(project, logDir, cmdDir, moduleBaseDir) {
    // 如果当前运行工程列表中已经存在该项目则返回
    const findProjectIndex = runProjectList.findIndex((item) => {
        return item.projectId === project.projectId;
    });

    if (findProjectIndex > -1) {
        return false;
    }

    // 日志路径
    const logPath = `${logDir}/${project.projectId}.txt`;
    // 命令.bat文件路径
    const cmdPath = `${cmdDir}/${project.projectId}.bat`;
    // 模块配置文件路径
    const modulePath = `${moduleBaseDir}/${project.projectId}.json`;

    // 当前工程下的package.json文件路径
    const packagePath = project.path.trim() ? path.resolve(project.path, 'package.json') : path.resolve(workPath, 'package.json');

    // 命令执行前先清理上一次的日志
    if (fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, '');
    }
    // 命令执行前先清理上一次命令
    if (fs.existsSync(cmdPath)) {
        fs.writeFileSync(cmdPath, '');
    }

    // 如果当前工程配置了需要打包的模块数据，则将模块信息写入package.json
    if (fs.existsSync(modulePath) && project.moduleChoice) {
        if (!fs.existsSync(packagePath)) {
            throw new Error('package.json不存在');
        }
        let data = fs.readFileSync(modulePath).toString();
        let dataObj = [];
        if (data.trim()) {
            dataObj = JSON.parse(data);
        }

        data = fs.readFileSync(packagePath).toString();
        const packageData = JSON.parse(data);
        packageData.modules = dataObj;
        fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 4));
    } else if (project.moduleChoice) {
        // 说明
        throw new Error('项目的不存在模块配置');
    }

    // 运行工程如果有配置路径，则先将'导航到指定的路径下'的命令拼接到命令集中
    let pathConmand = project.path ? `cd /d ${project.path}\n` : '';
    let cmdSet = pathConmand.concat(project.cmdSet);

    fs.appendFileSync(cmdPath, cmdSet);

    const process = execFile(cmdPath, [], { maxBuffer: 5000 * 1024 });

    const runInfo = {
        projectName: project.projectName,
        projectId: project.projectId,
        pId: process.pid,
        process: process,
    };

    runProjectList.push(runInfo);

    process.stdout.on('data', (data) => {
        fs.appendFileSync(logPath, data);
    });

    process.stdout.on('error', (data) => {
        fs.appendFileSync(logPath, data);
        // 当命令发送错误
        // 就将其从runProjectList中移除
        const findProjectIndex = runProjectList.findIndex((item) => {
            return item.projectId === project.projectId;
        });
        runProjectList.splice(findProjectIndex, 1);
    });

    process.stdout.on('message', (data) => {
        fs.appendFileSync(logPath, data);
    });

    process.on('exit', (code, signal) => {
        fs.appendFileSync(logPath, `子进程退出，退出码 ${code}`);
    });

    process.on('close', (code) => {
        fs.appendFileSync(logPath, `子进程关闭，退出码 ${code}`);
        // 当命令运行完成之后，当命令运行完毕之后，需要进行一些清理工作
        // 就将其从runProjectList中移除
        const findProjectIndex = runProjectList.findIndex((item) => {
            return item.projectId === project.projectId;
        });
        runProjectList.splice(findProjectIndex, 1);
        // 清空当前工程的bat文件内容
        // fs.writeFileSync(cmdPath, '');
    });

    return true;
};

exports.runList = function() {
    return runProjectList;
};

exports.runLog = function(projectId, logDir, callback) {
    const logPath = `${logDir}/${projectId}.txt`;

    const data = fs.readFileSync(logPath);

    const findProjectIndex = runProjectList.findIndex((item) => {
        return item.projectId === projectId;
    });
    if (findProjectIndex < 0) {
        return {
            status: 0,
            log: data.toString(),
        };
    }
    return {
        status: 1,
        log: data.toString(),
    };
};

exports.suspendRun = function(projectId) {
    let findProjectIndex = -1;
    const findProject = runProjectList.find((item, index) => {
        if (item.projectId === projectId) {
            findProjectIndex = index;
        }
        return item;
    });

    findProject.process.kill('SIGINT');
    runProjectList.splice(findProjectIndex, 1);
};
