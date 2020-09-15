import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api/request';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        runList: [], // 当前运行中的项目， runList是和服务端同步的
        runLogList: [], // 当前控制台显示日志的项目列表
    },
    getters: {
        runList: (state) => {
            return state.runList;
        },
        runLogList: (state) => {
            return state.runLogList;
        },
    },
    mutations: {
        setRunList(state, runData) {
            state.runList = runData;
        },
        setRunLogList(state, runData) {
            runData.forEach((item) => {
                const findRunIndex = state.runLogList.findIndex((logItem) => {
                    return logItem.projectId === item.projectId;
                });
                if (findRunIndex < 0) {
                    state.runLogList.push(item);
                }
            });
        },
        clearRunLogList(state) {
            state.runLogList = [];
        },
    },
    actions: {
        getRunList({ commit }) {
            return new Promise((resolve, reject) => {
                api.get('/runProjectList')
                    .then((res) => {
                        commit('setRunList', res.data);
                        commit('setRunLogList', res.data);
                        resolve(res.data);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
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
