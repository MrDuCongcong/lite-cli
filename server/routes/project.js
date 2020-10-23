/*
 * @Author: DuCongcong
 * @Description: 工程路由
 * @Date: 2020-10-20 12:11:08
 * @LastEditTime: 2020-10-22 10:22:02
 */
import express from 'express';
import ProjectController from '../controller/ProjectController';
import projectController from '../controller/ProjectController';

const router = express.Router();

router.get('/projectList', projectController.getProjectList);
router.post('/addProject', projectController.addProject);
router.get('/deleteProject', projectController.deleteProject);
router.get('/buildProject', projectController.buildProject);
// router.get('/runProjectShell', projectController.runProject);
router.get('/suspendProject', ProjectController.suspendProject);

export default router;
