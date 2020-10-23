/*
 * @Author: DuCongcong
 * @Description:
 * @Date: 2020-10-19 16:12:28
 * @LastEditTime: 2020-10-23 18:45:54
 */
import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api/request';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        runList: [], // 当前运行中的项目， runList是和服务端同步的
    },
    getters: {
        runList: (state) => {
            return state.runList;
        },
    },
    mutations: {
        runProject(state, project) {
            const findPjtIndex = state.runList.findIndex((i) => i.projectId === project.projectId);

            if (findPjtIndex < 0) {
                const tempProject = JSON.parse(JSON.stringify(project));
                tempProject.state = 1;
                state.runList.push(tempProject);
            } else {
                const findPjt = state.runList[findPjtIndex];
                findPjt.state = 1;
                findPjt.rst = '';

                /**
                 * 因为计算属性无法监听到runList数组中对象属性的变化，执行通过splice来改变数组使得计算属性变化
                 *  */
                state.runList.splice(findPjtIndex, 1, findPjt);
            }
        },
        suspendProject(state, runInfo) {
            const findPjtIndex = state.runList.findIndex((i) => {
                return i.projectId === runInfo.projectId;
            });

            const findPjt = state.runList[findPjtIndex];
            findPjt.state = 0;

            if ((runInfo.methed = 'run')) {
                findPjt.rst = runInfo.rst;
            } else {
                findPjt.rst = '';
            }

            /**
             * 因为计算属性无法监听到runList数组中对象属性的变化，执行通过splice来改变数组使得计算属性变化
             *  */
            state.runList.splice(findPjtIndex, 1, findPjt);
        },
        clearRunList(state) {
            state.runList = state.runList.filter((i) => {
                return i.state !== 0;
            });
        },
    },
    actions: {
        setRunLog({ state }, projectInfo) {
            const { projectId, runLog } = projectInfo;

            let findIndex = -1;
            let findItem = {};

            /**
             * 因为计算属性无法监听到runList数组中对象属性的变化，执行通过splice来改变数组使得计算属性变化
             *  */

            state.runLogList.forEach((item, index) => {
                if (item.projectId === projectId) {
                    findIndex = index;
                    findItem = item;
                    return;
                }
            });

            findItem.runLog = runLog;
            state.runLogList.splice(findIndex, 1, findItem);
        },
    },
});

export default store;
