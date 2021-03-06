/*
 * @Author: DuCongcong
 * @Description:
 * @Date: 2020-10-19 16:01:25
 * @LastEditTime: 2021-01-19 15:11:45
 */
import axios from 'axios';

// const baseURL = 'http://127.0.0.1:8080/';

// 当打包页面资源的时候需要将服务修改为8081
const baseURL = 'http://127.0.0.1:8081/';

const timeout = 1000;

const api = axios.create({
    baseURL,
    timeout,
});

// 添加请求拦截器
api.interceptors.request.use(
    function(config) {
        // 在发送请求之前做些什么
        return config;
    },
    function(error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
api.interceptors.response.use(
    function(response) {
        // 对响应数据做点什么
        if (response.status === 200) {
            Promise.resolve(response.data);
        }

        return response.data;
    },
    function(error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export default api;
