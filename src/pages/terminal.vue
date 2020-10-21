<!--
 * @Author: DuCongcong
 * @Description: 自定义终端
 * @Date: 2020-10-20 10:53:51
 * @LastEditTime: 2020-10-21 18:58:15
-->
<template>
    <div></div>
</template>

<script>
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

export default {
    props: {
        projectId: String,
    },
    data() {
        return {
            ws: null,
        };
    },
    mounted() {
        this.initTerminal();
        // 初始化webSocket通信
        this.initWebSocket();
    },
    methods: {
        initTerminal() {
            // 创建显示终端
            const term = new Terminal();
            term.open(this.$el);
        },
        initWebSocket() {
            if (this.ws) {
                return;
            }

            this.ws = new WebSocket('ws://127.0.0.1:8082');

            this.ws.onopen = () => {
                const params = {
                    methed: 'run',
                    projectId: this.projectId,
                };
                this.ws.send(JSON.stringify(params));
            };

            this.ws.onerror = (error) => {};

            this.ws.onmessage = (msg) => {};
        },
    },
};
</script>

<style lang="scss" scoped></style>
