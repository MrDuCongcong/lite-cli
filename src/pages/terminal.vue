<!--
 * @Author: DuCongcong
 * @Description: 自定义终端
 * @Date: 2020-10-20 10:53:51
 * @LastEditTime: 2020-10-23 18:44:58
-->
<template>
    <div class="terminal"></div>
</template>

<script>
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';

export default {
    props: {
        project: Object,
    },
    data() {
        return {
            ws: null,
            term: null,
            fitAddon: null,
        };
    },
    computed() {},
    mounted() {
        let _ = this;
        this.initTerminal();
        this.$eventHub.$on('resize', () => {
            this.$nextTick(() => {
                _.fitAddon.fit();
            })
        });
        this.$eventHub.$on('run', (projectId) => {
            if (projectId === _.project.projectId) {
                this.initWebSocket();
            }
        });

        this.$eventHub.$on('suspend', (project) => {
            if (project.projectId === this.project.projectId) {
                this.suspendProject();
            }
        });
    },
    methods: {
        initTerminal() {
            // 创建显示终端
            const term = new Terminal({
                windowsMode: false,
                convertEol: true,
                tabTopWidth: 30,
                disableStdin: true,
            });
            const fitAddon = new FitAddon();
            term.loadAddon(fitAddon);
            term.open(this.$el);

            this.fitAddon = fitAddon;
            this.term = term;

            this.fitAddon.fit();
        },
        initWebSocket() {
            if (this.ws) {
                this.runProject();
                return;
            }

            this.ws = new WebSocket('ws://127.0.0.1:8082');
            this.ws.onopen = this.handleOpen;
            this.ws.onerror = this.handleError;
            this.ws.onmessage = this.handleMessage;
        },

        suspendProject() {
            const ws = this.ws;
            if (ws && ws.readyState === 1) {
                const params = {
                    methed: 'suspend',
                    projectId: this.project.projectId,
                };
                ws.send(JSON.stringify(params));
            }
        },
        runProject() {
            const ws = this.ws;
            if (ws && ws.readyState === 1) {
                const params = {
                    methed: 'suspend',
                    projectId: this.project.projectId,
                };
                ws.send(JSON.stringify(params));
            }
        },
        handleMessage(msg) {

            const response = JSON.parse(msg.data);
            if (response.state === 0) {
                this.ws.close();
                this.ws = null;
                this.$store.commit('suspendProject', {
                    projectId: this.project.projectId,
                    method: response.method,
                    rst: response.rst,
                });
                if (response.method === 'run') {
                    this.$message.success('项目运行完成');
                } else if (response.method === 'suspend') {
                    this.$message.success('项目运行中止');
                }
            }
            this.term.write(response.data);
            this.term.scrollToBottom();
        },
        handleError(error) {},
        handleOpen() {
            const params = {
                methed: 'run',
                projectId: this.project.projectId,
            };
            this.ws.send(JSON.stringify(params));
        },
    },
    beforeDestroy() {
        this.$eventHub.$off('resize', () => {
            console.log('suspend事件监听器移除');
        });
        this.$eventHub.$off('run', () => {
            console.log('事件监听器移除');
        });
        this.$eventHub.$off('suspend', () => {
            console.log('suspend事件监听器移除');
        });
    },
};
</script>

<style lang="scss" scoped>
.terminal {
    height: 100%;
}
</style>
