<template>
    <div>
        <a-drawer
            class="tabs"
            :destroyOnClose="true"
            height="800"
            :closable="true"
            :mask="false"
            :maskClosable="false"
            :visible="visible"
            :placement="placement"
            @close="onClose"
        >
            <a-tabs>
                <a-tab-pane
                    v-for="(runPrj, index) in runList"
                    :key="index"
                    :tab="runPrj.projectName"
                    @change="handleTabChange"
                >
                    <!-- <div class="tabs-content">
                        <pre>{{ runPrj.runLog }}</pre>
                    </div> -->
                    <terminal :projectId="runPrj.projectId"></terminal>
                </a-tab-pane>
            </a-tabs>
        </a-drawer>
    </div>
</template>

<script>
import terminal from './terminal';

export default {
    components: {
        terminal,
    },
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
        },
        runLogList() {
            return this.$store.getters.runLogList;
        },
    },
    methods: {
        showDrawer(project) {
            const findIndex = this.runList.findIndex((i) => i.projectId === project.projectId);
            if (findIndex < 0) {
                this.$store.commit('addRun', project);
            }
            if (!this.visible) {
                this.visible = true;
            }
            // this.$store
            //     .dispatch('getRunList')
            //     .then((data) => {
            //         if (data.length > 0) {
            //             this.visible = true;
            //             this.getRunLogByProjectiD(projectId);
            //         } else {
            //             this.$message.error('当前无项目运行');
            //         }
            //     })
            //     .catch((err) => {
            //         this.$message.error(err);
            //     });
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
                    if (res.state === 200) {
                        this.$store.dispatch('setRunLog', {
                            projectId,
                            runLog: res.data.log,
                        });
                        if (res.data.status) {
                            this.timer = setTimeout(() => {
                                this.getRunLogByProjectiD(projectId);
                            }, 800);
                        } else {
                            this.$store.dispatch('getRunList');
                            clearTimeout(this.timer);
                            this.timer = '';
                        }
                    }
                })
                .catch((err) => {});
        },
        onClose() {
            clearTimeout(this.timer);
            this.timer = '';
            this.$store.commit('clearRunLogList');
            this.visible = false;
        },
        handleTabChange(project) {
            clearTimeout(this.timer);
            this.timer = '';
            this.getRunLogByProjectiD(project.projectId);
        },
        suspendRunProject(project) {
            this.$api
                .get('/suspendProject', {
                    params: {
                        projectId: project.projectId,
                    },
                })
                .then((res) => {
                    if (res.state === 200) {
                        clearTimeout(this.timer);
                        this.timer = null;
                        this.$store.dispatch('getRunList');
                        this.$message.success('项目已中止运行');
                    }
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.tabs {
}
</style>

<style lang="scss">
.tabs {
    .ant-drawer-body {
        padding: 0px 24px !important;
        height: 100%;
    }
    .ant-tabs {
        height: 100%;
    }
    .tabs-content {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }
    .ant-tabs-bar {
        margin: 0px;
    }

    .ant-tabs-content {
        height: 100%;
    }

    .ant-tabs-nav .ant-tabs-tab {
        padding: 8px 12px;
    }
}
</style>
