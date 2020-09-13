import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api/request';

Vue.use(Vuex);


const store = new Vuex.Store({
    state: {
        runList: [],
    },
    getters: {
        runList: (state) => {
            return state.runList;
        }  
    },
    mutations: {
        setRunList(state, runList) {
            state.runList = runList;
        }
    },
    actions: {
        getRunList({ commit }) {
            return new Promise((resolve, reject) => {
                api.get('/runProjectList')
                .then((res) => {
                    commit('setRunList', res.data);
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
            });
        },
        setRunLog({state}, projectInfo) {
            const { projectId, runLog } = projectInfo;

            let findIndex = -1;
            let findItem = {};

            /**
             * 因为计算属性无法监听到runList数组中对象属性的变化，执行通过splice来改变数组使得计算属性变化
             *  */ 
            state.runList.forEach((item, index) => {
                if (item.projectId === projectId) {
                    findIndex = index;
                    findItem = item;
                    return;
                }
            })

            findItem.runLog = runLog;
            state.runList.splice(findIndex, 1, findItem);
        }
    }

})

export default store;