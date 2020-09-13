/**
 *  处理页面打包请求的服务器
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const operateConfig = require('./operateConfig');

const buildServer = require('../scripts/build');
const { runShell, runList, runLog } = require('../scripts/runShell');

const basePath = 'data';
const workPath = process.cwd(); // node.js进程当前工作目录

// 项目目录配置文件
const projectConfigPath = path.resolve(__dirname, `../${basePath}/project.config.json`);
// 模块目录配置文件
const moduleConfigPath = path.resolve(__dirname, `../${basePath}/module.config.json`);
// 保存项目拥有模块的文件的目录
const moduleBaseDir = path.resolve(__dirname, `../${basePath}/projects`);
// 报错项目临时执行脚本的文件的目录
const templogDir = path.resolve(__dirname, `../${basePath}/log`);
// 命令行目录
const cmdDir = path.resolve(__dirname, `../${basePath}/bat`)

const responseData = {
    state: '',
    data: '',
    message: '',
};

function createServer() {
    console.log('启动路径名称 ', projectConfigPath);

    const app = express();
    app.use(bodyParser.json());

    app.get('/projectList', (req, res) => {
        const data = operateConfig.getProjectCategory(projectConfigPath);

        let responseData = {
            state: 200,
            data: data,
            message: '',
        };
        res.send(responseData);
    });

    app.post('/addProject', (req, res) => {
        const data = req.body;
        operateConfig.addProject(moduleBaseDir, projectConfigPath, data, (projectList) => {
            let responseData = {
                state: 200,
                data: projectList,
                message: '',
            };
            res.send(responseData);
        });
    });

    app.get('/getModuleByProjectId', (req, res) => {
        const projectId = req.param('projectId');
        operateConfig.getModuleByProjectId(projectId, moduleBaseDir, (data) => {
            let responseData = {
                state: 200,
                data: data,
                message: '',
            };
            res.send(responseData);
        });
    });

    app.get('/getModuleList', (req, res) => {
        const data = operateConfig.getModuleList(moduleConfigPath);
        let responseData = {
            state: 200,
            data: data,
            message: '',
        };
        res.send(responseData);
    });

    app.post('/modulesForProject', (req, res) => {
        const data = req.body;

        const modules = data.modules;
        const projectId = data.projectId;

        const responseData = {
            state: '',
            data: '',
            message: '',
        };
        operateConfig.setModuleForProject(moduleBaseDir, projectId, modules, (result) => {
            if (result) {
                responseData.state = 200;
            } else {
                responseData.state = 500;
                responseData.message = '服务器错误';
            }
            res.send(responseData);
        });
    });

    app.get('/buildProject', (req, res) => {
        const projectId = req.param('projectId');
        operateConfig.getModuleByProjectId(projectId, moduleBaseDir, (data) => {
            buildServer.build(data);
        });
    });

    app.get('/deleteProject', (req, res) => {
        const projectId = req.param('projectId');
        let responseData = {};
        try {
            const data = operateConfig.deleteProjectById(projectId, projectConfigPath, templogDir, moduleBaseDir, cmdDir);
            responseData = {
                state: 200,
                data: data,
                message: '',
            };
        } catch (e) {
            console.log(e.message);
            responseData = {
                state: 500,
                data: '',
                message: e.message,
            };
        }

        res.send(responseData);
    });

    app.get('/runProjectShell', (req, res) => {
        let responseData = {
            state: '',
            data: '',
            message: '',
        };

        const projectId = req.param('projectId');

        try {
            const project = operateConfig.getProjectById(projectId, projectConfigPath);
            const state = runShell(project, templogDir, cmdDir);
            if (state) {
                responseData.state = 200;
            } else {
                responseData.state = 300;
                responseData.message = '该项目已经在运行中';
            }
            
        } catch {
            responseData = {
                state: 500,
                data: '',
                message: '服务端错误',
            };
        }

        res.send(responseData);
    });

    app.get('/runProjectList', (req, res) => {
        let responseData = {};
        try {
            const runPrjList = runList();
            responseData = {
                state: '',
                data: runPrjList,
                message: '',
            };
        } catch {
            responseData = {
                state: 500,
                data: '',
                message: '服务端错误',
            };
        }
        res.send(responseData);
    });

    app.get('/runLog', (req, res) => {
        const projectId = req.param('projectId');

        let responseData = {};
        try {
            const data = runLog(projectId, templogDir);
            responseData.data = data;
            responseData.message = '';
            responseData.state = 200;
        } catch {
            responseData = {
                state: 500,
                data: '',
                message: '服务端错误',
            };
        }
        res.send(responseData);
    });
    return app;
}

exports.createServer = createServer;
