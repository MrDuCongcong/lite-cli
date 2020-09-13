<template>
    <div class="project">
        <div class="project-add">
            <a-button type="primary"
                      @click="showProjectModal">新增项目</a-button>
            <a-button @click="showConDrawer">控制台</a-button>
        </div>
        <a-table :row-selection="rowSelection"
                 :columns="columns"
                 :data-source="projectList">
            <span slot="projectName"
                  slot-scope="text">{{ text }}</span>
            <span slot="createDate"
                  slot-scope="text">{{ text }}</span>
            <span slot="description"
                  slot-scope="text">{{ text }}</span>
            <span slot="action"
                  slot-scope="text, record">
                <a-icon type="loading" />
                <a class="opea-icon"
                   @click="runProject(record)">运行</a>
                <!-- <a class="opea-icon" @click="buildProject(record)">打包</a> -->
                <a-divider type="vertical" />
                <a class="opea-icon"
                   @click="editProject(record)">编辑</a>
                <a-divider type="vertical" />
                <a class="opea-icon"
                   @click="deleteOpea(record)">删除</a>
                <a-divider type="vertical"
                           v-if="record.moduleChoice" />
                <a class="opea-icon"
                   v-if="record.moduleChoice"
                   @click="editModuleTree(record)">模块</a>

                <!-- <a-icon class="opea-icon" type="setting" @click="buildProject(record)"/> -->
            </span>
        </a-table>

        <build ref="buildRef"></build>
        <project-modal ref="pjtRef"
                       @handleOk="addProject"></project-modal>
        <console ref="conRef"></console>
    </div>
</template>

<script>
import build from '@/pages/build.vue';
import projectModal from './projectModal.vue';
import console from '../console.vue';

export default {
    name: 'project',
    components: {
        build,
        projectModal,
        console,
    },
    data() {
        return {
            columns: [
                {
                    title: '工程',
                    dataIndex: 'projectName',
                    key: 'projectName',
                    width: 220,
                },
                {
                    title: '创建日期',
                    dataIndex: 'createDate',
                    key: 'createDate',
                    width: 200,
                },
                {
                    title: '描述',
                    dataIndex: 'description',
                    key: 'description',
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 250,
                    align: 'left',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            projectList: [],
        };
    },
    computed: {
        rowSelection() {
            return {};
        },
    },
    mounted() {
        this.getProjectList();
    },
    methods: {
        showProjectModal() {
            this.$refs.pjtRef.showDialog();
        },
        /**
         * 显示项目运行控制台
         */
        showConDrawer(projectId) {
            this.$refs.conRef.showDrawer(projectId);
        },
        addProject(projectData) {
            this.$api
                .post('/addProject', projectData)
                .then((res) => {
                    this.projectList = res.data;
                    this.$refs.pjtRef.closeDialog();
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        editModuleTree(project) {
            this.$refs.buildRef.showDialog(project.projectId);
        },
        editProject(project) {
            this.$refs.pjtRef.showDialog(project);
        },
        deleteOpea(project) {
            let _ = this;
            this.$confirm({
                title: `确认删除项目${project.projectName}?`,
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    _.deleteProject(project);
                },
                onCancel() {},
            });
        },
        runProject(project) {
            this.$api
                .get('/runProjectShell', {
                    params: {
                        projectId: project.projectId,
                    },
                })
                .then((res) => {
                    if (res.state === 200) {
                    }
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },

        buildProject(project) {
            this.$api
                .get('/buildProject', {
                    params: {
                        projectId: project.projectId,
                    },
                })
                .then((res) => {})
                .catch((err) => {
                    this.$message.error(err);
                });
        },

        getProjectList() {
            this.$api
                .get('/projectList')
                .then((res) => {
                    this.projectList = res.data;
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        deleteProject(project) {
            this.$api
                .get('/deleteProject', {
                    params: {
                        projectId: project.projectId,
                    },
                })
                .then((res) => {
                    this.projectList = res.data;
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.project {
    padding: 0 20px;
    .project-add {
        padding: 16px 0px;
        text-align: right;
    }
}
</style>
