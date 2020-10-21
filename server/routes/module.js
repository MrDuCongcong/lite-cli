/*
 * @Author: DuCongcong
 * @Description: 模块路由
 * @Date: 2020-10-20 12:10:52
 * @LastEditTime: 2020-10-20 16:50:47
 */
import moduleController from '../controller/ModuleController';
let express = require('express');

const router = express.Router();

router.get('/getModuleByProjectId', moduleController.getModuleByProjectId);
router.get('/getModuleList', moduleController.getModuleList);
router.get('/modulesForProject', moduleController.setModuleForProject);

export default router;
