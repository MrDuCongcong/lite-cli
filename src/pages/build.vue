<template>
    <div class="build">
        <a-modal title="模块选择"
                 cancelText="取消"
                 okText="确定"
                 :visible="buildDialogVisible"
                 @ok="handleOk"
                 @cancel="handleCancel">
            <div class="build-content">
                <a-tree v-model="selectedModule"
                        checkable
                        :replace-fields="replaceFields"
                        :default-expand-all="true"
                        :tree-data="projectList"
                        @check="handleCheck" />
            </div>
        </a-modal>
    </div>
</template>

<script>
export default {
    name: 'build',
    data() {
        return {
            buildDialogVisible: false,

            selectedModule: [], // 已选择的模块
            projectId: '', // 当前编辑的工程id
            projectList: [],
            replaceFields: {
                children: 'children',
                title: 'name',
                key: 'type',
            },
        };
    },
    computed: {},
    mounted() {},
    methods: {
        handleOk() {
            this.handleMoudleChange();
        },
        handleCancel() {
            this.buildDialogVisible = false;
        },
        showDialog(projectId) {
            this.projectId = projectId;
            this.buildDialogVisible = true;
            this.getModuleList(projectId);
        },
        goBack() {
            this.$router.back();
        },
        getModuleList(projectId) {
            this.$api
                .get('/getModuleList', {
                    params: {
                        projectId: projectId,
                    },
                })
                .then((res) => {
                    this.projectList = res.data;
                    this.getModuleByProjectId();
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        getModuleByProjectId() {
            this.$api
                .get('/getModuleByProjectId', {
                    params: {
                        projectId: this.projectId,
                    },
                })
                .then((res) => {
                    this.selectedModule = res.data;
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        handleCheck() {},
        handleMoudleChange() {
            this.$api
                .post('/modulesForProject', {
                    modules: this.selectedModule,
                    projectId: this.projectId,
                })
                .then((res) => {
                    if (res.state === 200) {
                        this.buildDialogVisible = false;
                        this.$message.success('项目模块修改成功');
                    }
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
    },
};
</script>

<style lang="scss">
.build {
    width: 600px;
    margin: 100px auto auto auto;
    .build-footer {
        margin: 16px 0px;
        text-align: right;
    }
}
.ant-modal-header {
    border: none !important;
}

.build-content {
    height: 400px;
    overflow: scroll;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
}
</style>
