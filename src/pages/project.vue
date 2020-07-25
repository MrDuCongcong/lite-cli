<template>
    <div class="project">
        <div class="project-opea">
           <a-button type="primary" @click="showModal">新增项目</a-button>
        </div>
        <a-table :columns="columns" :data-source="projectList">
            <span slot="projectName" slot-scope="text">{{ text }}</span>
            <span slot="action" slot-scope="text, record">
                <a @click="edit(record)">编辑</a>
                <a-divider  type="vertical"/>
                <a @click="deleteProject(record)">删除</a>
                  <a-divider  type="vertical"/>
                <a @click="buildProject(record)">打包</a>              
            </span>
        </a-table>
        
        <a-modal
            title="新增项目"
            cancelText="取消"
            okText="确定"
            :visible="dialogVisible"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <a-form-model 
                ref="formRef"
                :model="form"
                :label-col="labelCol" 
                :wrapper-col="wrapperCol"
                :rules="rules">
                <a-form-model-item label="项目名称" prop="projectName">
                    <a-input v-model="form.projectName" />
                </a-form-model-item>
                <a-form-model-item label="项目ID" prop="projectId">
                    <a-input v-model="form.projectId" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>    
</template>

<script>
import axios from 'axios';

export default {
    name: 'project',
    data() {
        let checkProjectId = (rule, value, callback) => {
            
            const findItem = this.projectList.find(item =>  item.projectId === value);
            console.log(findItem, 'findItem');
            
            if (findItem) {
                return callback(new Error('已存在该项目ID，请重新输入'));
            }
            return callback();
        }
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },

            columns: [
                {
                    title: '工程',
                    dataIndex: 'projectName',
                    key: 'projectId',
                },
                {
                    title: '操作',
                    key: 'action',
                    scopedSlots: { customRender: 'action' }
                }
            ],
            projectList: [],
            dialogVisible: false,

            form: {
                projectName: '',
                projectId: '',
            },
            rules: {
                projectName: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' },
                    { min: 2, max: 15, message: '项目名称在10 ~ 15个字之间', trigger: 'blur' },
                ],
                projectId: [
                    { required: true, message: '请输入项目ID', trigger: 'blur'},
                    { validator: checkProjectId, trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.getProjectList();
    },
    methods: {
        showModal() {
            this.dialogVisible = true;
        },
        handleOk() {
            this.$refs.formRef.validate((result, field) => {
                if (result) {
                    this.addProject();
                }
            })
        },
        handleCancel() {
            this.dialogVisible = false;
            this.$refs.formRef.resetFields();
        },
        edit(project) {
            this.$router.push({ name: 'build', query: { 
                projectId: project.projectId,
            }});
        },
        delete(project) {
            this.$confirm({
                title: `确认删除项目${project.projectName}?`,
                onOk() {
                    this.deleteProject(project);
                },
                onCancel() {},
            });
        },


        addProject() {
            this.$api.post('/addProject', this.form)
            .then((res) => {
                this.projectList = res.data;
                this.dialogVisible = false;
                this.$refs.formRef.resetFields();
            }).catch((err) => {
                this.$message.error(err);
            });
        },

        getProjectList() {
            this.$api.get('/projectList')
            .then((res) => {
                this.projectList = res.data;
            }).catch((err) => {
                this.$message.error(err);
            });
        },
        buildProject(project) {
            this.$api.get('/buildProject', { 
                params: {
                    projectId: project.projectId,
                },
            }).then((res) => {

            }).catch((err) => {
                this.$message.error(err);
            });
        },
        deleteProject(project) {
            this.$api.get('/deleteProject', { 
                params: {
                    projectId: project.projectId,
                },
            }).then((res) => {

            }).catch((err) => {
                this.$message.error(err);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.project{
    padding: 0 20px;
    .project-opea {
        padding: 16px 0px;
        text-align: right;
    }
}
</style>