<template>
    <div class="build">
        <a-modal
            title="模块选择"
            cancelText="取消"
            okText="确定"
            :visible="buildDialogVisible"
            @ok="handleOk"
            @cancel="handleCancel"
        >
           <div class="build-content">
                <a-tree
                    v-model="selectedModule"
                    checkable
                    :replace-fields="replaceFields"
                    :default-expand-all="true"
                    :tree-data="projectList"
                    @check="handleCheck"
                />
            </div>
        </a-modal>

        <!-- <a-button type="primary" @click="goBack" >返回</a-button>
        <div class="build-header">打包图表选择</div>
        <a-tree
            v-model="selectedModule"
            checkable
            :replace-fields="replaceFields"
            :default-expand-all="true"
            :tree-data="projectList"
            @check="handleCheck"
        />
        <div class="build-footer">
            <a-button class="footer-button" @click="handleMoudleChange" type="primary">确定</a-button>
        </div> -->
    </div>
</template>

<script>
export default {
    name: 'build',
    data() {
        return {
            buildDialogVisible: false,

            selectedModule: [],  // 已选择的模块
            projectId: '',       // 当前编辑的工程id
            projectList: [],
            replaceFields: {
                children: 'children',
                title: 'name',
                key: 'type',
            },
        };
    },
    computed: {
    },
    mounted() {
    },
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
            this.getModuleList()
        },
        goBack() {
            this.$router.back();
        },
        getModuleList() {
            this.$api.get('/getModuleList')
            .then((res) => {
                this.projectList = res.data;
                this.getModuleByProjectId();
            }).catch((err) => {
                this.$message.error(err);
            });
        },
        getModuleByProjectId() {
            this.$api.get('/getModuleByProjectId', {
                params: {
                    projectId: this.projectId
                },
            }).then((res) => {
                this.selectedModule = res.data;
            }).catch((err) => {
                this.$message.error(err);
            });
        },
        handleCheck() {
            console.log('this.selectModule', this.selectedModule);
        },
        handleMoudleChange() {
            this.$api.post('modulesForProject', {
                modules: this.selectedModule,
                projectId: this.projectId,
            }).then((res) => {
                const data = res.data;
                if (data.state === 200) {
                    this.buildDialogVisible = false;
                    this.$message.success('项目模块修改成功');
                }
            }).catch((err) => {
                this.$message.error(err);
            })
        }
    }
}
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
    border: none!important;
}

    .build-content {
        height: 400px;
        overflow: scroll;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
    }
</style>