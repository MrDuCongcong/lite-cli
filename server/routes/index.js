/*
 * @Author: DuCongcong
 * @Description:路由配置文件
 * @Date: 2020-10-20 12:09:59
 * @LastEditTime: 2020-10-20 14:33:45
 */
import moduleRouter from './module';
import projectRouter from './project';

export default (app) => {
    app.use('/module', moduleRouter);
    app.use('/project', projectRouter);
};
