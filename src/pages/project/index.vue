<template>
    <div class="project">
        <div class="project-add">
            <a-button class="opea-left" type="primary" :disabled="!hasSelected" @click="runProjects">
                运行
            </a-button>
            <a-button class="opea-right" type="primary" @click="showProjectModal">
                新增项目
            </a-button>
            <a-button class="opea-right" @click="showConDrawer">
                控制台
            </a-button>
        </div>
        <a-table
            :row-selection="{ selectedRowKeys: selectedProjectId, onChange: onSelectChange }"
            :columns="columns"
            :data-source="projectList"
            :rowKey="(record) => record.projectId"
        >
            <span slot="projectName" slot-scope="text">{{ text }}</span>
            <span slot="createDate" slot-scope="text">{{ text }}</span>
            <span slot="description" slot-scope="text">{{ text }}</span>
            <span slot="action" slot-scope="text, record">
                <a-icon v-if="isRun(record)" type="loading" />
                <a class="opea-icon" v-if="!isRun(record)" @click="runProject(record)">运行</a>
                <a class="opea-icon" v-if="isRun(record)" @click="suspendRunProject(record)">中止</a>
                <!-- <a class="opea-icon" @click="buildProject(record)">打包</a> -->
                <a-divider type="vertical" />
                <a class="opea-icon" @click="editProject(record)">编辑</a>
                <a-divider type="vertical" />
                <a class="opea-icon" @click="deleteOpea(record)">删除</a>
                <a-divider type="vertical" v-if="record.moduleChoice" />
                <a class="opea-icon" v-if="record.moduleChoice" @click="editModuleTree(record)">模块</a>

                <!-- <a-icon class="opea-icon" type="setting" @click="buildProject(record)"/> -->
            </span>
        </a-table>

        <build ref="buildRef"></build>
        <project-modal ref="pjtRef" @handleOk="addProject"></project-modal>
        <console-panel ref="conRef"></console-panel>
    </div>
</template>

<script>
import build from '@/pages/build.vue';
import projectModal from './projectModal.vue';
import consolePanel from '../consolePanel.vue';

export default {
    name: 'project',
    components: {
        build,
        projectModal,
        consolePanel,
    },
    computed: {
        runList() {
            return this.$store.getters.runList;
        },
        rowSelection() {
            return {};
        },
        hasSelected() {
            return this.selectedProjectId.length > 0;
        },
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
                    scopedSlots: {
                        customRender: 'action',
                    },
                },
            ],
            projectList: [],
            selectedProjectId: [],
            selectedProjects: [],
        };
    },
    mounted() {
        this.getProjectList();
    },
    methods: {
        showProjectModal() {
            this.$refs.pjtRef.showDialog();
        },
        /**
         *  当前项目是否处于运行状态
         */
        isRun(project) {
            const findPjtIndex = this.runList.findIndex((item) => {
                return item.projectId === project.projectId;
            });
            if (findPjtIndex > -1) {
                return true;
            }
            return false;
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
                    if (res.state === 200) {
                        this.projectList = res.data;
                        this.$refs.pjtRef.closeDialog();
                    } else {
                        this.$refs.message(res.message);
                    }
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
            this.selectedProjectId = [];

            this.$api
                .get('/runProjectShell', {
                    params: {
                        projectIds: [project.projectId],
                    },
                })
                .then((res) => {
                    if (res.state === 200 || res.state === 300) {
                        this.$refs.conRef.showDrawer(project.projectId);
                    } else {
                        this.$message.error(res.message);
                    }
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        runProjects() {
            this.$api
                .get('/runProjectShell', {
                    params: {
                        projectIds: this.selectedProjectId,
                    },
                })
                .then((res) => {
                    if (res.state === 200 || res.state === 300) {
                        this.$refs.conRef.showDrawer(this.selectedProjectId[0]);
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
                    if (res.state === 200) {
                        this.projectList = res.data;
                        this.$store.dispatch('getRunList');
                    } else {
                        this.$message.error(res.message);
                    }
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
                    if (res.state === 200) {
                        this.projectList = res.data;
                        this.$store.dispatch('getRunList');
                    } else {
                        this.$message.error(res.message);
                    }
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },

        onSelectChange(selectedProjectId, selectedRows) {
            this.selectedProjectId = selectedProjectId;
            this.selectedProjects = selectedRows;
        },

        /**
         * 中止项目运行
         * @param {Object} project 项目信息
         */
        suspendRunProject(project) {
            this.$refs.conRef.suspendRunProject(project);
        },
    },
};
</script>

<style lang="scss" scoped>
.project {
    padding: 0 20px;

    .project-add {
        padding: 16px 0px;
        overflow: hidden;
        .opea-left {
            float: left;
        }
        .opea-right {
            float: right;
            margin-left: 10px;
        }
    }
}
</style>
