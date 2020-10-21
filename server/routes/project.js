/*
 * @Author: DuCongcong
 * @Description: 工程路由
 * @Date: 2020-10-20 12:11:08
 * @LastEditTime: 2020-10-20 14:31:14
 */
import express from 'express';
import projectController from '../controller/ProjectController';

const router = express.Router();

router.get('/projectList', projectController.getProjectList);
router.post('/addProject', projectController.addProject);
router.get('/deleteProject', projectController.deleteProject);
router.get('/buildProject', projectController.buildProject);
router.get('/runProjectShell', projectController.runProject);

export default router;
