import Vue from 'vue';
import App from './src/app.vue';
import router from './src/router';
import api from '@/api/request';

import { Icon, Button, Tree, Table, message, Modal, FormModel, Divider, Input } from 'ant-design-vue';

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

message.config({
  top: `100px`,
  duration: 2,
  maxCount: 3
});

Vue.prototype.$message = message;


Vue.prototype.$api = api;

new Vue({
  el: '#app',
  router,
  render: h => h(App),
}).$mount('#app');