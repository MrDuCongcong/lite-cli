<template>
    <div class="edit-project">
        <a-modal title="新增项目" cancelText="取消" okText="确定" :visible="dialogVisible" @ok="handleOk" @cancel="handleCancel">
            <a-form-model ref="formRef" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
                <a-form-model-item label="名称" :colon="false" prop="projectName">
                    <a-input v-model="form.projectName" />
                </a-form-model-item>
                <a-form-model-item label="描述" :colon="false" prop="description">
                    <a-input v-model="form.description" />
                </a-form-model-item>
                <a-form-model-item label="路径" :colon="false" prop="path">
                    <a-input v-model="form.path" @focus="handlePathInput" />
                </a-form-model-item>
                <a-form-model-item label="按模块打包" :colon="false" prop="moduleChoice">
                    <a-checkbox v-model="form.moduleChoice"> </a-checkbox>
                </a-form-model-item>
                <a-form-model-item label="命令" :colon="false" prop="cmdSet">
                    <a-textarea :rows="8" v-model="form.cmdSet" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: false,

            // 表单配置项
            labelCol: {
                span: 4,
            },
            wrapperCol: {
                span: 20,
            },

            form: {
                projectName: '', // 项目名称
                projectId: '', // 项目id
                description: '', // 描述
                path: '', // 项目路径
                cmdSet: '', // 命令集
                moduleChoice: false, // 是否可以按模块打包
            },
            rules: {
                projectName: [
                    {
                        required: true,
                        message: '请输入项目名称',
                        trigger: 'blur',
                    },
                    {
                        min: 2,
                        max: 15,
                        message: '项目名称在2 ~ 15个字之间',
                        trigger: 'blur',
                    },
                ],
                cmdSet: [
                    {
                        required: true,
                        message: '请输入命令',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    methods: {
        showDialog(project) {
            if (project) {
                this.form = JSON.parse(JSON.stringify(project));
            }
            this.dialogVisible = true;
        },
        closeDialog() {
            this.form = {
                projectName: '', // 项目名称
                projectId: '', // 项目id
                description: '', // 描述
                path: '', // 项目路径
                cmdSet: '', // 命令集
                moduleChoice: false, // 是否可以按模块打包
            };
            this.dialogVisible = false;
            this.$refs.formRef.resetFields();
        },
        handleOk() {
            this.$refs.formRef.validate((result, field) => {
                if (result) {
                    this.$emit('handleOk', this.form);
                }
            });
        },
        handleCancel() {
            this.form = {
                projectName: '', // 项目名称
                projectId: '', // 项目id
                description: '', // 描述
                path: '', // 项目路径
                cmdSet: '', // 命令集
                moduleChoice: false, // 是否可以按模块打包
            };
            this.dialogVisible = false;
            this.$refs.formRef.resetFields();
        },
        handlePathInput() {},
    },
};
</script>

<style lang="scss" scoped>
.edit-project {
}
</style>
