/*
 * @Author: DuCongcong
 * @Description: 模块路由
 * @Date: 2020-10-20 12:10:52
 * @LastEditTime: 2020-10-22 11:40:46
 */
import moduleController from '../controller/ModuleController';
let express = require('express');

const router = express.Router();

router.get('/getModuleByProjectId', moduleController.getModuleByProjectId);
router.get('/getModuleList', moduleController.getModuleList);
router.post('/setModulesForProject', moduleController.setModulesForProject);

export default router;
