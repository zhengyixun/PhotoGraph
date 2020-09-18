<template>
    <div id="apps">
        <HelloWorld :info="info"/>
    </div>
</template>

<script>
    import HelloWorld from './components/HelloWorld.vue'

    export default {
        name: 'App',
        components: {HelloWorld},
        data() {
            return {
                info: {}
            }
        },
        mounted() {
            //判断是否有cpuid 没有的话
        }
    }
</script>

<style>
    @font-face {
        font-family: 'FZCYJ';
        src: url('./assets/font/AlibabaSans-Medium.otf');
        font-weight: normal;
        font-style: normal;
    }

    * {
        margin: 0;
        padding: 0;
        list-style: none;
        text-decoration: none;
        font-family: 'FZCYJ';
    }

    #apps {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: linear-gradient(#D0F5D2, #8BCEC5);
    }
</style>
