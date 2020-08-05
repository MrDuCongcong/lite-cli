<template>
    <div class="titleBar">
        <span class="titleBar-title" >项目仪表盘</span>
    </div>
</template>

<script>
export default {
    name: 'titleBar',
    data() {
        return {
            
        };
    },
}
</script>

<style lang="scss" scoped>
.titleBar {
    padding: 0px 20px;
    line-height: 50px;
    box-shadow: 0 2px 8px #f0f1f2;
    .titleBar-title {
        font-size: 28px;
    }
}
</style>