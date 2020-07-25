/**
 *  处理页面打包请求的服务器
*/
const fs = require('fs');
const path =  require('path');
const express = require('express');
const bodyParser = require('body-parser');
const operateConfig = require('./operateConfig');
const buildServer = require('../scripts/build');

const basePath = 'test';
const workPath = process.cwd();
const projectDir = 'projects';

// 项目目录文件
const projectConfigPath = `${workPath}/${basePath}/project.config.json`;
// 模块目录文件
const moduleConfigPath = `${workPath}/${basePath}/module.config.json`;
// 保存项目拥有模块的文件的目录
const moduleBasePath = `${workPath}/${basePath}`

const responseData = {
    state: '',
    data: '',
    message: '',
};

function createServer() {
    const app = express();
    app.use(bodyParser.json());

    app.get('/projectList', (req, res) => {
        const data = operateConfig.getProjectCategory(projectConfigPath)
        res.send(data);
    });

    app.post('/addProject', (req, res) => {
        const data = req.body;
        operateConfig.addProject(basePath, projectConfigPath, data, (projectList) => {
           res.send(projectList);
        });
    });

    app.get('/getModuleByProjectId', (req, res) => {
        const projectId = req.param('projectId');
        operateConfig.getModuleByProjectId(projectId, moduleBasePath, (data) => {
            res.send(data);
        });
    });

    app.get('/getModuleList', (req, res) => {
        const data = operateConfig.getModuleList(moduleConfigPath)
        res.send(data);
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
        operateConfig.setModuleForProject(moduleBasePath, projectId, modules, (result) => {
            if (result) {
                responseData.state = 200;
            } else {
                responseData.state = 500;
                responseData.message = "服务器错误";
            }
            res.send(responseData);
        });
    })

    app.get('/buildProject', (req, res) => {
        const projectId = req.param('projectId');
        operateConfig.getModuleByProjectId(projectId, moduleBasePath, (data) => {
            buildServer.build(data);
        });

    });
    
    app.get('/deleteProject', (req, res) => {
        const projectId = req.param('projectId');

        const data = operateConfig.deleteProjectById(projectId)
        res.send(data);
    });

    return app
}


exports.createServer = createServer;
