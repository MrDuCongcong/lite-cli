import { Console } from 'console';
import { cpuUsage } from 'process';

const spawn = require('cross-spawn');
const fs = require('fs');
const { execFile } = require('child_process');
const path = require('path');
const process = require('process');

// 解决windows命令行编码和node默认编码不同导致的中文乱码
var iconv = require('iconv-lite');
var encoding = 'cp936';
var binaryEncoding = 'binary';

const workPath = process.cwd(); // node.js进程当前工作目录

class ShellService {
    constructor() {
        this.runProjectList = [];
    }

    runShell(project, logDir, cmdDir, moduleBaseDir, webSocket) {
        let response = {
            state: '', // 标志当前进程的状态 1表示运行中， 0 表示运行结束
            rst: '', // 标志当前进行执行结果, 1表示运行成功， 0表示运行失败
            data: '', // 指令执行过程中的消息
        };

        // 如果当前运行工程列表中已经存在该项目则返回
        const findProjectIndex = this.runProjectList.findIndex((item) => {
            return item.projectId === project.projectId;
        });

        if (findProjectIndex > -1) {
            const findProject = this.runProjectList[findProjectIndex];
            findProject.process.kill('SIGINT');
            this.runProjectList.splice(findProjectIndex, 1);
        }

        // 日志路径
        const logPath = `${logDir}/${project.projectId}.txt`;
        // 命令.bat文件路径
        const cmdPath = `${cmdDir}/${project.projectId}.bat`;
        // 模块配置文件路径
        const modulePath = `${moduleBaseDir}/${project.projectId}.json`;

        // 当前工程下的package.json文件路径
        const packagePath = project.path.trim()
            ? path.resolve(project.path, 'package.json')
            : path.resolve(workPath, 'package.json');

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
                throw new Error('当前工程下不存在package.json文件');
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
            throw new Error('项目的不存在模块配置 ');
        }

        // 运行工程如果有配置路径，则先将'导航到指定的路径下'的命令拼接到命令集中
        let pathConmand = project.path ? `cd /d ${project.path}\n` : '';
        let cmdSet = pathConmand.concat(project.cmdSet);

        fs.appendFileSync(cmdPath, cmdSet);

        const process = execFile(
            cmdPath,
            [],
            {
                maxBuffer: 5000 * 1024,
                encoding: binaryEncoding,
            },
            (error, stdout, stderr) => {
                if (error) {
                    response = {
                        state: 1,
                        data: error,
                    };
                }
                webSocket.send(JSON.stringify(response));
            }
        );

        const runInfo = {
            projectName: project.projectName,
            projectId: project.projectId,
            pId: process.pid,
            process: process,
        };

        this.runProjectList.push(runInfo);

        process.stdout.on('data', (data) => {
            const decodeData = iconv.decode(new Buffer(data, binaryEncoding), encoding);
            fs.appendFileSync(logPath, decodeData);

            response = {
                state: 1,
                data: decodeData,
            };

            webSocket.send(JSON.stringify(response));
        });

        process.stdout.on('error', (data) => {
            const decodeData = iconv.decode(new Buffer(data, binaryEncoding), encoding);
            fs.appendFileSync(logPath, decodeData);

            response = {
                state: 0,
                data: decodeData,
                method: 'run',
            };

            webSocket.send(JSON.stringify(response));
        });

        process.stderr.on('data', (data) => {
            const decodeData = iconv.decode(new Buffer(data, binaryEncoding), encoding);
            fs.appendFileSync(logPath, decodeData);

            response = {
                state: 1,
                data: decodeData,
            };

            webSocket.send(JSON.stringify(response));
        });

        process.stderr.on('error', (data) => {
            const decodeData = iconv.decode(new Buffer(data, binaryEncoding), encoding);
            fs.appendFileSync(logPath, decodeData);

            response = {
                state: 0,
                data: decodeData,
                method: 'run',
            };

            webSocket.send(JSON.stringify(response));
        });

        // process.on('exit', (code, signal) => {
        //     console.log('退出码', code);
        //     fs.appendFileSync(logPath, `子进程退出，退出码 ${code}`);

        //     // 就将其从this.runProjectList中移除
        //     const findProjectIndex = this.runProjectList.findIndex((item) => {
        //         return item.projectId === project.projectId;
        //     });

        //     response = {
        //         state: 1,
        //         data: '',
        //         rst: code,
        //     };

        //     webSocket.send(JSON.stringify(response));
        // });

        process.on('close', (code, signal) => {
            const findProjectIndex = this.runProjectList.findIndex((item) => {
                return item.projectId === project.projectId;
            });

            this.runProjectList.splice(findProjectIndex, 1);

            response = {
                state: 0,
                data: '\r\n运行结束',
                rst: code,
                method: 'run',
            };

            webSocket.send(JSON.stringify(response));
        });
    }

    suspendRun(projectId, webSocket) {
        let findProjectIndex = -1;
        const findProject = this.runProjectList.find((item, index) => {
            if (item.projectId === projectId) {
                findProjectIndex = index;
            }
            return item;
        });

        if (findProject) {
            findProject.process.kill('SIGINT');
            this.runProjectList.splice(findProjectIndex, 1);
        }

        let response = {
            state: 0, //
            rst: '',
            data: '\r\n项目已中止',
            method: 'suspend',
        };

        webSocket.send(JSON.stringify(response));
    }
}

export default new ShellService();
