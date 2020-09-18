<template>
    <div v-if="visibleFlag" class="LoadingBox">
        <div class="Loading">
            <div class="box">
                <div class="loader-15"></div>
            </div>
            <div class="span">{{text}}</div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
        },
        data(){
            return {
                text:"正在加载",
                visibleFlag:this.visible
            }
        },
        mounted(){
            setTimeout(()=>{
                this.visibleFlag = false
            },1000)
        },
    }
</script>
<style scoped>
    .LoadingBox{
        position: fixed;left: 0;right: 0;top:0;bottom: 0;
    }
    .Loading{
        width: 200px;height: 120px;background: rgba(0,0,0,.7);border-radius: 5px;
        position: fixed;left: 0;right: 0;bottom: 0;top: 0;margin: auto;
    }
    .box {
        display: inline-block;
        width: 150px;
        margin: 0 auto;
        border-radius: 3px;
        color: #fff;
        padding: 30px 100px 20px 100px;
        vertical-align: top;
        -webkit-transition: .3s color, .3s border;
        transition: .3s color, .3s border;
    }
    .span{
        color:#fff
    }
    .loader-15 {
        background: #fff;
        position: relative;
        -webkit-animation: loader-15 1s ease-in-out infinite;
        animation: loader-15 1s ease-in-out infinite;
        -webkit-animation-delay: 0.4s;
        animation-delay: 0.4s;
        width: 4px;
        height: 20px;
    }
    .loader-15:after,
    .loader-15:before {
        content: '';
        position: absolute;
        width: inherit;
        height: inherit;
        background: inherit;
        -webkit-animation: inherit;
        animation: inherit;
    }
    .loader-15:before {
        right: 10px;
        -webkit-animation-delay: 0.2s;
        animation-delay: 0.2s;
    }
    .loader-15:after {
        left: 10px;
        -webkit-animation-delay: 0.6s;
        animation-delay: 0.6s;
    }
    @-webkit-keyframes loader-15 {
        0%, 100% {
            box-shadow: 0 0 0 #fff, 0 0 0 #fff;
        }
        50% {
            box-shadow: 0 -10px 0 #fff, 0 10px 0 #fff;
        }
    }
    @keyframes loader-15 {
        0%, 100% {
            box-shadow: 0 0 0 #fff, 0 0 0 #fff;
        }
        50% {
            box-shadow: 0 -10px 0 #fff, 0 10px 0 #fff;
        }
    }
</style>