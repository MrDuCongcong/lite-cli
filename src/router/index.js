import Router from 'vue-router';
import Vue from 'vue';
import VueRouter from 'vue-router';

import Build from '@/pages/build.vue';
import Project from '@/pages/project/index.vue';

Vue.use(Router);

const routes = [
    {
        path: '/',
        redirect: '/project',
    },
    {
        path: '/build',
        name: 'build',
        component: Build,
    },
    {
        path: '/project',
        name: 'project',
        component: Project,
    },
];

const router = new VueRouter({
    routes,
});

export default router;
