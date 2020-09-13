<template>
<div class="tabs">
    <a-drawer :destroyOnClose="true" height="300" :closable="true" :mask="false" :maskClosable="false" :visible="visible" :placement="placement" @close="onClose">
        <a-tabs>
            <a-tab-pane v-for="(runPrj, index) in runList" :key="index" :tab="runPrj.projectName" @change="handleTabChange(runPrj)">
                <div class="tabs-content">
                    <pre>{{runPrj.runLog}}</pre>
                </div>
            </a-tab-pane>
        </a-tabs>
    </a-drawer>
</div>
</template>

<script>
export default {
    data() {
        return {
            placement: 'bottom',
            visible: false,
            timer: '', // 定时请求日志
        };
    },
    computed: {
        runList() {
            return this.$store.getters.runList;
        }
    },
    methods: {
        showDrawer(projectId) {
            this.$store.dispatch('getRunList')
                .then((data) => {
                    console.log(data);
                    if (data.length > 0) {
                        this.visible = true;
                        this.getRunLogByProjectiD(projectId);
                    } else {
                        this.$message.error('当前无项目运行');
                    }
                }).catch((err) => {
                    this.$message.error(err);
                });
        },
        /**
         * 根据项目Id获取运行日志
         * @param {projectId} 项目Id
         */
        getRunLogByProjectiD(projectId) {
            this.$api
                .get('/runLog', {
                    params: {
                        projectId: projectId,
                    },
                })
                .then((res) => {
                    this.$store.dispatch('setRunLog', {
                        projectId,
                        runLog: res.data,
                    });
                    this.timer = setTimeout(this.getRunLogByProjectiD(projectId), 800);
                })
                .catch((err) => {});
        },
        onClose() {
            this.visible = false;
            clearTimeout(this.timer);
            this.timer = '';
        },
        handleTabChange(project) {
            clearTimeout(this.timer);
            this.timer = '';
            this.getRunLogByProjectiD(project.projectId);
        }
    },
};
</script>

<style lang="scss" scoped>
.tabs {
    .tabs-content {
        width: 100%;
        height: 100%;
    }
}
</style>
