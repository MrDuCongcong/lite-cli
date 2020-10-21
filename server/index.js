/**
 *  处理页面打包请求的服务器
 */
import bodyParser from 'body-parser';
import router from './routes/index.js';
import init from '../scripts/init';
import initSocket from './socket/index.js';

const { createServer } = require('http');
let path = require('path');
let express = require('express');

function initServer() {
    init();

    const app = express();

    app.use(bodyParser.json());
    app.use(express.static(path.resolve(__dirname, '../dist')));

    router(app);

    const server = createServer(app);
    initSocket(server);

    return app;

    // app.get('/projectList', (req, res) => {
    //     const data = operateConfig.getProjectCategory(projectConfigPath);

    //     let responseData = {
    //         state: 200,
    //         data: data,
    //         message: '',
    //     };
    //     res.send(responseData);
    // });

    // app.post('/addProject', (req, res) => {
    //     const data = req.body;
    //     operateConfig.addProject(moduleBaseDir, projectConfigPath, data, (projectList) => {
    //         let responseData = {
    //             state: 200,
    //             data: projectList,
    //             message: '',
    //         };
    //         res.send(responseData);
    //     });
    // });

    // app.get('/getModuleByProjectId', (req, res) => {
    //     const projectId = req.param('projectId');
    //     operateConfig.getModuleByProjectId(projectId, moduleBaseDir, (data) => {
    //         let responseData = {
    //             state: 200,
    //             data: data,
    //             message: '',
    //         };
    //         res.send(responseData);
    //     });
    // });

    // app.get('/getModuleList', (req, res) => {
    //     let responseData = {};
    //     const projectId = req.param('projectId');
    //     const project = operateConfig.getProjectById(projectId, projectConfigPath);

    //     try {
    //         const data = operateConfig.getModuleList(project, moduleConfigFile);
    //         responseData = {
    //             state: 200,
    //             data: data,
    //             message: '',
    //         };
    //     } catch (err) {
    //         responseData = {
    //             state: 500,
    //             data: '',
    //             message: '模块配置文件读取失败',
    //         };
    //     }
    //     res.send(responseData);
    // });

    // app.post('/modulesForProject', (req, res) => {
    //     const data = req.body;

    //     const modules = data.modules;
    //     const projectId = data.projectId;

    //     const responseData = {
    //         state: '',
    //         data: '',
    //         message: '',
    //     };
    //     operateConfig.setModuleForProject(moduleBaseDir, projectId, modules, (result) => {
    //         if (result) {
    //             responseData.state = 200;
    //         } else {
    //             responseData.state = 500;
    //             responseData.message = '服务器错误';
    //         }
    //         res.send(responseData);
    //     });
    // });

    // app.get('/buildProject', (req, res) => {
    //     const projectId = req.param('projectId');
    //     operateConfig.getModuleByProjectId(projectId, moduleBaseDir, (data) => {
    //         buildServer.build(data);
    //     });
    // });

    // app.get('/deleteProject', (req, res) => {
    //     const projectId = req.param('projectId');
    //     let responseData = {};
    //     try {
    //         const data = operateConfig.deleteProjectById(
    //             projectId,
    //             projectConfigPath,
    //             templogDir,
    //             moduleBaseDir,
    //             cmdDir
    //         );
    //         responseData = {
    //             state: 200,
    //             data: data,
    //             message: '',
    //         };
    //     } catch (e) {
    //         responseData = {
    //             state: 500,
    //             data: '',
    //             message: '服务端错误',
    //         };
    //     }

    //     res.send(responseData);
    // });

    // app.get('/runProjectShell', (req, res) => {
    //     let responseData = '',
    //         sucCount = 0,
    //         failCount = 0;
    //     const result = [];

    //     const projectIds = req.param('projectIds');

    //     if (Array.isArray) {
    //         projectIds.forEach((projectId) => {
    //             try {
    //                 const project = operateConfig.getProjectById(projectId, projectConfigPath);
    //                 const state = runShell(project, templogDir, cmdDir, moduleBaseDir);
    //                 if (state) {
    //                     responseData = {
    //                         state: 200,
    //                         data: '',
    //                         message: '',
    //                     };
    //                 } else {
    //                     responseData = {
    //                         state: 300,
    //                         data: '',
    //                         message: `项目${project.projectName}已经在运行中`,
    //                     };
    //                 }
    //             } catch (err) {
    //                 console.log(err);
    //                 responseData = {
    //                     state: 500,
    //                     data: '',
    //                     message: err.message,
    //                 };
    //             }
    //             result.push(responseData);
    //         });
    //     }

    //     result.forEach((item) => {
    //         if (item.state === 200 || item.state === 300) {
    //             sucCount += 1;
    //         } else {
    //             failCount += 1;
    //         }
    //     });

    //     if (sucCount > 0) {
    //         responseData = {
    //             state: 200,
    //             data: '',
    //             message: `${sucCount}个项目运行成功，${failCount}个项目运行失败`,
    //         };
    //     } else {
    //         responseData = {
    //             state: 500,
    //             data: '',
    //             message: `项目运行失败`,
    //         };
    //     }
    //     res.send(responseData);
    // });

    // app.get('/runProjectList', (req, res) => {
    //     let responseData = {};
    //     try {
    //         const runPrjList = runList();
    //         responseData = {
    //             state: '',
    //             data: runPrjList,
    //             message: '',
    //         };
    //     } catch {
    //         responseData = {
    //             state: 500,
    //             data: '',
    //             message: '服务端错误',
    //         };
    //     }
    //     res.send(responseData);
    // });

    // app.get('/runLog', (req, res) => {
    //     const projectId = req.param('projectId');

    //     let responseData = {};
    //     try {
    //         const result = runLog(projectId, templogDir);
    //         responseData.data = result;
    //         responseData.message = '';
    //         responseData.state = 200;
    //     } catch {
    //         responseData = {
    //             state: 500,
    //             data: '',
    //             message: '服务端错误',
    //         };
    //     }
    //     res.send(responseData);
    // });

    // app.get('/suspendProject', (req, res) => {
    //     const projectId = req.param('projectId');

    //     let responseData = {};
    //     try {
    //         const result = suspendRun(projectId);
    //         responseData.data = '';
    //         responseData.message = '';
    //         responseData.state = 200;
    //     } catch {
    //         responseData = {
    //             state: 500,
    //             data: '',
    //             message: '服务端错误',
    //         };
    //     }
    //     res.send(responseData);
    // });
}

exports.createServer = initServer;
