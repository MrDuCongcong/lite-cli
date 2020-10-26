<template>
    <div class="console-panel">
        <a-drawer
            class="tabs"
            :destroyOnClose="false"
            :height="drawerHeight"
            :closable="true"
            :mask="false"
            :maskClosable="false"
            :visible="visible"
            :placement="placement"
            @close="onClose"
        >
            <div @drag.prevent="handleDrag" id="gutter"></div>
            <a-tabs :animated="false" :activeKey="activeProject" @change="handleTabChange">
                <a-tab-pane v-for="runPrj in runList" :key="runPrj.projectId" :forceRender="true">
                    <span slot="tab">
                        {{ runPrj.projectName }}
                        <a-icon
                            type="exclamation-circle"
                            style="color: #f5222d"
                            v-if="runPrj.state === 0 && runPrj.rst !== '' && runPrj.rst !== 0"
                        />
                        <a-icon type="check" style="color: #52c41a" 
                            v-else-if="runPrj.state === 0 && runPrj.rst !== '' && runPrj.rst === 0" />
                    </span>
                    <terminal :project="runPrj"></terminal>
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
            drawerHeight: 400,
            placement: 'bottom',
            visible: false,
            timer: null,
            activeProject: '',
        };
    },
    computed: {
        runList() {
            return this.$store.getters.runList;
        },
    },
    methods: {
        showDrawer(project) {
            if (!this.visible) {
                this.visible = true;
            }
            if (project) {
                this.$store.commit('runProject', project);
                this.activeProject = project.projectId;
            } else {
                this.activeProject = this.runList[0].projectId;
            }
            this.$nextTick(() => {
                this.$eventHub.$emit('resize');
                this.$eventHub.$emit('run', this.activeProject);
            });
        },

        onClose() {
            this.visible = false;
            this.$store.commit('clearRunList');
        },
        handleTabChange(projectId) {
            this.$nextTick(() => {
                this.activeProject = projectId;
                this.$eventHub.$emit('resize');
            })
        },
        suspendRunProject(project) {
            this.$store.commit('suspendProject', project);
        },

        handleDrag(e) {
            e.preventDefault();

            if (this.timer) {
                return;
            }

            this.timer = setTimeout(() => {
                if (e.clientY > 0) {
                    this.drawerHeight = parseInt(window.innerHeight - e.clientY);
                    this.$eventHub.$emit('resize');
                }
                clearTimeout(this.timer);
                this.timer = null;
            }, 200);
        },
    },
};
</script>

<style lang="scss" scoped></style>

<style lang="scss">
.tabs {
    #gutter {
        height: 6px;
        cursor: ns-resize;
        width: 100%;
        position: absolute;
        z-index: 1000;
        left: 0px;
    }
    .ant-drawer-body {
        padding: 0px 24px !important;
        height: 100%;
    }
    .ant-tabs {
        height: 100% !important;
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

    .ant-tabs-tabpane-active {
        height: 100%;
    }
    // .ant-tabs-no-animation > .ant-tabs-content > .ant-tabs-tabpane-inactive {
    //     height: 100%;
    // }
}
</style>
