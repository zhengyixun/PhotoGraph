<template>
    <div class="camera_outer" :style="{'backgroundImage':(isIndex ? `url(${require('@/assets/bg1.png')})` : `url(${require('@/assets/bg2.png')})`)}">
<!--        <input v-model="card" id="card" @keyup="cardChange" style="display: none"/>-->
        <video id="videoCamera" :width="videoWidth" :height="videoHeight" autoplay></video>
        <canvas style="display:none;" id="canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
        <div class="pageOne" v-if="isIndex">

<!--            <div class="button">-->
<!--&lt;!&ndash;                <span @click="stopNavigator()" class="btns">关闭摄像头</span>&ndash;&gt;-->
<!--&lt;!&ndash;                <span @click="setImage()" class="btns">拍照</span>&ndash;&gt;-->
<!--            </div>-->
<!--            顶部状态栏-->
            <div class="navBar">
                <span>网络已连接</span>
                <img v-if="inOrOut==='in'" src="../assets/in_nursery.png" alt="">
                <img v-else src="../assets/out_nursery.png" alt="">
                <span>{{inOrOut==='in'?'入园':'离园'}}</span>
                <b>{{inOrOut==='in'?'入园':'离园'}}：0人</b>
                <b>教师：0人</b>
                <b>待传：{{noTransPerson}}人</b>
            </div>
<!--            当前时间-->
            <div class="nowTime">
                <div>{{timeInfo.date}} {{timeInfo.weekday}}</div>
                <div>{{timeInfo.time}}</div>
            </div>
<!--            底部通知-->
            <div class="subTitle">
                {{subTitle}}
            </div>
<!--            右侧主要内容-->
            <div class="mainCon">

            </div>
        </div>
        <div class="pageTwo" v-else>
<!--            顶部状态栏-->
            <div class="navBar">
                <span>网络已连接</span>
                <img v-if="inOrOut==='in'" src="../assets/in_nursery.png" alt="">
                <img v-else src="../assets/out_nursery.png" alt="">
                <span>{{inOrOut==='in'?'入园':'离园'}}</span>
                <b>{{inOrOut==='in'?'入园':'离园'}}：0人</b>
                <b>教师：0人</b>
                <b>待传：{{noTransPerson}}人</b>
            </div>
<!--            接送人-->
            <div class="pickPerson">
                <img v-if="userInfo.picture" :src="userInfo.picture" alt="">
            </div>
<!--            健康码-->
            <div class="heathCode">
                <img v-if="userInfo.card" src="../assets/0.png" alt="">
                <img v-else src="../assets/1.png" alt="">
            </div>
<!--            中间的内容-->
            <div class="midCon" >
<!--                <img v-if="imgSrc" :src="imgSrc" alt="" class="tx_img"/>-->
            </div>
<!--            右侧的内容-->
            <div class="rightCon">
                <div>{{userInfo.name || ''}}</div>
                <div>{{userInfo.student && userInfo.student!==-1&& userInfo.student.num}}</div>
                <div>{{userInfo.className}}</div>
                <div>{{userInfo.SwipeTime || ''}}</div>
            </div>
<!--            学生的图片-->
            <div class="stuPic">
                <img v-if="userInfo.student!==-1" :src="userInfo.student.picture" alt="">
            </div>
<!--            第二页的时间-->
            <div class="twoTime">
                <div>{{timeInfo.date}}</div>
                <div>{{timeInfo.weekday}} {{timeInfo.time}}</div>
            </div>
        </div>

        <Loading :visible.sync="visible"/>
        <Toast :visible.sync="toastVisible" :msg="toasMsg"/>
    </div>
</template>

<script>
    import { dealTime,inOrOut,cardType } from "../utils/utils";
    import axios from 'axios';
    import FileSaver from 'file-saver';
    import Loading from './Loading';
    import Toast from './Toast';
    export default {
        data() {
            return {
                noTransPerson: localStorage.getItem('noTransPerson')||0, // 待传人数
                cardNumber:'',
                baseUrl:"http://server.zh8848.com/Nusery.aspx/",
                card:"",
                toastVisible:false,
                toasMsg: '提示提示信息',
                visible:true,//loading
                isIndex:true, //显示第几张背景图
                videoWidth: 490,
                videoHeight: 320,
                imgSrc: "",
                thisCancas: null,
                thisContext: null,
                thisVideo: null,
                openVideo: false,
                customTime: [ //自定义入离园时间{start:'0:00',end:'11:00'}
                    {start: "0:00", end: "11:00"}
                ],
                inOrOut:'in', // in 入园 out 出园
                dealTimeFn:undefined, //时间函数
                timeInfo: {}, //当前时间信息
                userInfo: {}, // 刷卡人的信息数据
                subTitle: '', //底部通知

                uploadDataFn:null, //1分钟上传的时间函数
            };
        },
        components:{ Loading, Toast },
        created(){
            // window.
            //显示时间
            this.dealTimeFn = setInterval(()=>{
                this.timeInfo = dealTime();
            },1000);
            //入园还是出园
            this.inOrOut = inOrOut(this.customTime[0]['end']);
            //绑定键盘事件
            document.onkeyup = (e) => {
                if(e.keyCode !== 13){
                    this.cardNumber += e.key;
                }
                console.log(this.cardNumber)
                if (e.keyCode == 13) {
                    let d = cardType('0010100710'); //'0010100710'
                    if(d.code!==1){
                        this.toastVisible = true;
                        this.toasMsg = d.msg;
                        this.format();
                    }else{

                        /**
                         * @TODO卡号正常改变状态 入园/出园
                         * @TODO 待传人数+1
                         * **/
                        let noTransPerson = parseInt(localStorage.getItem('noTransPerson')) || 0,noTransPersonArr= JSON.parse(localStorage.getItem('noTransPersonArr'))||[];
                        let flag = false;
                        noTransPersonArr.map((item)=>{
                            if(item.card === d.msg.card){
                                flag = true
                            }
                        })
                        if(flag){
                            this.showToast('重复刷卡！')
                            return
                        }
                        console.log('infos-刷卡成功',d);
                        this.isIndex = false;
                        !flag && noTransPersonArr.push(d.msg);
                        localStorage.setItem('noTransPersonArr', JSON.stringify(noTransPersonArr));//代传数据+1
                        this.noTransPerson = noTransPerson + 1;//代传人数+1
                        //更新缓存数据
                        localStorage.setItem('noTransPerson', this.noTransPerson);
                        this.userInfo = d.msg || {};
                        setTimeout(()=>{
                            this.isIndex = true;
                            this.userInfo = {}; // 清空用户数据
                            this.format();
                        },60000);
                        // 图片上传
                        // this.setImage();
                    }
                }
            }
        },
        mounted() {
            this.getBaseData();//获取基础数据
            this.getCompetence()//进入页面就调用摄像头
            // 每1min 上传一次数据
            this.uploadData()
        },
        destroyed(){
            clearInterval(this.uploadDataFn)
        },
        methods: {
            format(){
                setTimeout(()=>{
                    this.toastVisible = false;
                    this.toasMsg = '';
                    this.cardNumber = ''
                },1000)
            },
            showToast(msg){
                this.toastVisible = true;
                this.toasMsg = msg;
                this.format()
            },
            //每一分钟上传一次数据
            uploadData(){
                this.uploadDataFn = setInterval(()=>{
                    let d = JSON.parse(localStorage.getItem('noTransPersonArr')) || [],arr = [];
                    /**
                     * "code":  tmp[i].code, //code:机器码 CPUID
                     * "uid":   tmp[i].uid,  //用户ID，家长ID或老师ID
                     * "card":  d.card,  // 卡号
                     * "dir":   tmp[i].dir, // 当前入离园方向 0||1
                     * "time":  tmp[i].intime  // UTC时间
                     * **/
                    d.length && d.map(item=>{
                        arr.push({
                            "code": localStorage.getItem('cpuid') || '',
                            "uid":item.type==='parent' ? item.parent_id : item.teacher_id,
                            "card":item.card,
                            "dir":this.inOrOut==='in'?'0':'1',
                            "time": new Date().getTime()
                        })
                    });
                    axios.post(this.baseUrl + 'UpLoadRecords',{
                        "json": JSON.stringify(arr),
                    },{
                        headers: {'NODEWEBKIT':'zh8848'}
                    }).then(e=>{
                        if(e.status === 200){
                            console.log('上传---',arr, e.data)
                            let da=JSON.parse(e.data.d)
                            if(da.err){
                                this.showToast(da.err);
                                return
                            }
                            console.log('上传成功',da);
                            localStorage.removeItem('noTransPerson');
                            localStorage.removeItem('noTransPersonArr');
                            this.noTransPerson=0;

                        }
                    }).catch(err=>{
                        alert(err.toString());
                        console.log(err)
                    })
                },60000)
            },
            //获取数据
            getBaseData(){
                axios.post(this.baseUrl + 'getData',{
                    "key":"702001408000b4eb7422",
                    "localversion":"h3.1"
                },{
                    headers: {'NODEWEBKIT':'zh8848'}
                }).then(e=>{
                    if(e.status === 200){
                        /**
                         * @TODO 下载头像到本地
                         * **/
                        let data = JSON.parse(e.data.d);
                        console.log(data);
                        this.subTitle = data.subtitle;
                        this.customTime = data.customtime;
                        this.inOrOut = inOrOut(data.customtime[0]['end']);
                        localStorage.setItem('BaseData',e.data.d);
                        //存储身份信息
                        let arr = {};
                        data.parent.map((item=>{
                            item.type='parent';
                            item.typeName='家长';
                            arr[item.card] = item;
                        }));
                        data.student.map((item=>{
                            item.type='student';
                            item.typeName='学生';
                            arr[item.student_id] = item; // 学生id
                        }));
                        data.teacher.map((item=>{
                            item.type='teacher';
                            item.typeName='老师';
                            arr[item.card] = item;
                        }));
                        localStorage.setItem('cardData',JSON.stringify(arr));
                    }
                }).catch(err=>{
                    alert(err.toString())
                })
            },
            // 调用权限（打开摄像头功能）
            getCompetence() {
                let _this = this;
                _this.thisCancas = document.getElementById("canvasCamera");
                _this.thisContext = this.thisCancas.getContext("2d");
                _this.thisVideo = document.getElementById("videoCamera");
                _this.thisVideo.style.display = 'block';
                // 获取媒体属性，旧版本浏览器可能不支持mediaDevices，我们首先设置一个空对象
                if (navigator.mediaDevices === undefined) {
                    navigator.mediaDevices = {};
                }
                // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
                // 使用getUserMedia，因为它会覆盖现有的属性。
                // 这里，如果缺少getUserMedia属性，就添加它。
                if (navigator.mediaDevices.getUserMedia === undefined) {
                    navigator.mediaDevices.getUserMedia = function (constraints) {
                        // 首先获取现存的getUserMedia(如果存在)
                        let getUserMedia =
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.getUserMedia;
                        // 有些浏览器不支持，会返回错误信息
                        // 保持接口一致
                        if (!getUserMedia) {//不存在则报错
                            return Promise.reject(
                                new Error("getUserMedia is not implemented in this browser")
                            );
                        }
                        // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
                        return new Promise(function (resolve, reject) {
                            getUserMedia.call(navigator, constraints, resolve, reject);
                        });
                    };
                }
                let constraints = {
                    audio: false,
                    video: {
                        width: this.videoWidth,
                        height: this.videoHeight,
                        transform: "scaleX(-1)"
                    }
                };
                navigator.mediaDevices
                    .getUserMedia(constraints)
                    .then(function (stream) {
                        // 旧的浏览器可能没有srcObject
                        if ("srcObject" in _this.thisVideo) {
                            _this.thisVideo.srcObject = stream;
                        } else {
                            // 避免在新的浏览器中使用它，因为它正在被弃用。
                            _this.thisVideo.src = window.URL.createObjectURL(stream);
                        }
                        _this.thisVideo.onloadedmetadata = function (e) {
                            _this.thisVideo.play();
                        };
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            //  绘制图片（拍照功能）
            setImage() {
                let _this = this;
                // canvas画图
                _this.thisContext.drawImage(
                    _this.thisVideo,
                    0,
                    0,
                    _this.videoWidth,
                    _this.videoHeight
                );
                // 获取图片base64链接
                let image = this.thisCancas.toDataURL("image/png");
                _this.imgSrc = image;//赋值并预览图片
                //
            },
            // 关闭摄像头
            stopNavigator() {
                this.thisVideo.srcObject.getTracks()[0].stop();
            },
            // base64转文件，此处没用到
            dataURLtoFile(dataurl, filename) {
                let arr = dataurl.split(",");
                let mime = arr[0].match(/:(.*?);/)[1];
                let bstr = atob(arr[1]);
                let n = bstr.length;
                let u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], filename, {type: mime});
            }
        },
        destroyed(){
            clearInterval(this.dealTimeFn)
        }
    };
</script>
<style scoped>
    .camera_outer {
        width: 1920px;
        height: 1080px;
        position: relative;
    }
    .btns{
        margin-right: 20px;
    }
    .pageOne,.pageTwo{
        position: relative;width: 100%;height: 100%;
    }
    .nowTime,#videoCamera,.subTitle,.mainCon,.navBar,.heathCode,.midCon,.rightCon,.twoTime,.tx_img,.pickPerson,.stuPic{
        position: absolute;
    }
    .stuPic{
        width: 240px;height: 317px;left: 1043px;top:400px;
    }
    .pickPerson{
        width: 250px;height: 350px;left: 64px;top:233px
    }
    .pickPerson > img{
        width: 100%;height: 100%;
    }
    .nowTime{
        left: 368px;top:202px;width: 427px;height: 106px;
    }
    .nowTime div{
        height: 50%;line-height: 53px;font-size: 40px;color: rgb(169,201,91);
    }
    .nowTime div:last-child{
        color: rgb(239,130,0);
    }
    #videoCamera{
        left: 393px;top:466px;width: 490px;height: 320px;
    }
    .subTitle{
        width: 1275px;height: 162px;left: 600px;top:874px;text-align: left;line-height: 80px;font-size: 35px;color: rgb(44,152,131);
    }

    .mainCon{
        width: 800px;height: 510px;left: 1010px;top:244px
    }
    .navBar{
        width: 1400px;height: 50px;left: 40px;top:45px;display: flex;justify-content: flex-start;align-items: center;font-size: 22px;font-weight: normal;
    }
    .navBar img{
        width: 30px;height: auto;
    }
    .navBar b{
        margin-right: 20px;font-weight: normal;
    }
    .navBar span{
        margin-right: 20px;
    }
    .heathCode{
        left: 71px;top:739px;width: 240px;height: 240px;background: #fff;
    }
    .heathCode img{
        width: 100%;height: 100%;
    }
    .midCon{
        width: 490px;height: 320px;left: 394px;top:464px
    }
    .rightCon{
        width: 340px;height: 380px;left: 1450px;top:300px
    }
    .rightCon div{
        height: 80px;font-size: 40px;color: #fff;font-family: FZCYJ;width: 100%;text-align: left;margin-top: 20px;line-height: 80px;
    }
    .rightCon div:first-child{
        height: 80px;line-height: 80px;margin-left: 80px;margin-top: 0;
    }
    .rightCon div:last-child{
        margin-left: 80px;
    }
    .twoTime{
        width: 350px;height: 90px;left: 463px;top:133px
    }
    .twoTime div{
        height: 50%;line-height: 45px;font-size: 40px;text-align: left;color: rgb(71,214,186);
    }
    .twoTime div:last-child{
        text-align: right;color: rgb(157,209,101);font-size: 30px;
    }
    .tx_img{
        width: 240px;height: 350px;left: 1044px;top:319px
    }
</style>
