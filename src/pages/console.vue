<template>
    <div class="tabs">
        <a-drawer :destroyOnClose="true"
                  height="300"
                  :closable="true"
                  :mask="false"
                  :maskClosable="false"
                  :visible="visible"
                  :placement="placement"
                  @close="onClose">
            <a-tabs>
                <a-tab-pane v-for="(runPrj, index) in runList"
                            :key="index"
                            :tab="runPrj.projectName">
                    <div class="tabs-content">

                    </div>
                    <pre>{{runPrj.runLog}}</pre>
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

            // 当前运行的项目列表
            runList: [],
        };
    },
    methods: {
        showDrawer(projectId) {
            this.$api
                .get('/runProjectList')
                .then((res) => {
                    if (res.data.length > 0) {
                        this.runList = res.data;
                        this.visible = true;
                        this.getRunLogByProjectiD(res.data[0]);
                    } else {
                        this.$message.error('当前无项目运行');
                    }
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        getRunLogByProjectiD(project) {
            this.$api
                .get('/runLog', {
                    params: {
                        projectId: project.projectId,
                    },
                })
                .then((res) => {
                    const findItem = this.runList.find((item) => {
                        return (item.projectId = project.projectId);
                    });
                    findItem.runLog = res.data;

                    console.log(this.runList);
                })
                .catch((err) => {});
        },
        onClose() {
            this.visible = false;
        },
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