<template>
    <div v-if="visibleFlag" class="LoadingBox">
        <div class="Loading">
            <div class="span">{{ text }}</div>
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
            msg: {
                type: String,
                default: '提示'
            }
        },
        data(){
            return {
                text: this.msg,
                visibleFlag: this.visible
            }
        },
        mounted(){
            setTimeout(()=>{
                this.visibleFlag = false;
            },1000);
        },
        watch:{
            visible(val) {
                this.visibleFlag = val;
                setTimeout(()=>{
                    this.visibleFlag = false;
                },1000);
            },
            msg(val) {
                this.text = val
                setTimeout(()=>{
                    this.text = '';
                },1000);
            },
        }
    }
</script>
<style scoped>
    .LoadingBox{
        position: fixed;left: 0;right: 0;top:0;bottom: 0;
    }
    .Loading{
        width: 160px;height: 80px;background: rgba(0,0,0,.7);border-radius: 5px;
        position: fixed;left: 0;right: 0;bottom: 0;top: 0;margin: auto;padding: 20px;
    }
    .span{
        color:#fff;height: 100%;display: flex;align-items: center;justify-content: center;
    }
</style>