<template>
    <div>
       <title-bar></title-bar>
       <router-view></router-view>
    </div>
</template>

<script>
import titleBar from '@/components/titleBar.vue';

export default {
    data() {
        return {

        };
    },
    components: {
        titleBar,
    }
};
</script>


<style>
a, span, td{
    user-select: none;
}
</style>