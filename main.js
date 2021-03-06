/*
 * @Author: DuCongcong
 * @Description:
 * @Date: 2020-10-19 16:11:59
 * @LastEditTime: 2020-10-22 18:56:12
 */
import Vue from 'vue';
import App from './src/app.vue';
import router from './src/router';
import store from './src/store';
import api from '@/api/request';

import {
    Icon,
    Button,
    Tree,
    Table,
    message,
    Modal,
    FormModel,
    Divider,
    Input,
    Checkbox,
    Tabs,
    Drawer,
} from 'ant-design-vue';

import 'ant-design-vue/dist/antd.css';
import '@/styles/style.css';

Vue.use(Tree);
Vue.use(Button);
Vue.use(Table);
Vue.use(Modal);
Vue.use(FormModel);
Vue.use(Divider);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Checkbox);
Vue.use(Tabs);
Vue.use(Drawer);

message.config({
    top: `100px`,
    duration: 2,
    maxCount: 3,
});

Vue.prototype.$message = message;

Vue.prototype.$api = api;

Vue.prototype.$confirm = Modal.confirm;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');

Vue.config.errorHandler = (err, vm, info) => {
    console.error(err, info);
};

Vue.config.warnHandler = (msg, vm, trace) => {
    console.warn(msg, trace);
};

Vue.prototype.$eventHub = new Vue();
