let exec = require('child_process').exec;
exec('cat /proc/cpuinfo | grep Serial', function(error, stdout, stderr){
    cpuid=stdout.split(':')[1];
    // console.log(stdout,stderr);
    localStorage.setItem('cpuid',cpuid.trim())
});
// node 起线程下载图片
/*
* url 网络文件地址
* filename 文件名
* callback 回调函数
*/
//下载参数
var http = require("http");
var fs = require("fs");
var downFlag = false;
var downFileName = '/home/pi/Desktop/nwjs-sdk-v0.28.4-linux-arm/images';



// 下载回调
function getHttpReqCallback (imgSrc, dirName, fileName) {

    var callback = function(res) {
        console.log("request: " + imgSrc + " return status: " + res.statusCode);
        var contentLength = parseInt(res.headers['content-length']);

        var downLength = 0;

        var out = fs.createWriteStream(dirName + "/" + fileName);
        res.on('data', function (chunk) {

            downLength += chunk.length;
            var progress =  Math.floor(downLength*100 / contentLength);
            var str = "下载："+ progress +"%";
            console.log(str);

            //写文件
            out.write(chunk, function () {
                //console.log(chunk.length);

            });

        });
        res.on('end', function() {
            downFlag = false;
            console.log("end downloading " + imgSrc);
            if (isNaN(contentLength)) {
                console.log(imgSrc + " content length error");
                return;
            }
            if (downLength < contentLength) {
                console.log(imgSrc + " download error, try again");
                return;
            }
        });
    };

    return callback;
}
// 开始下载
function startDownloadTask (imgSrc, dirName,fileName) {
    console.log("start downloading " + imgSrc);
    var req = http.request(imgSrc, getHttpReqCallback(imgSrc, dirName, fileName));
    req.on('error', function(e){
        console.log("request " + imgSrc + " error, try again");
    });
    req.end();
}
// 下载逻辑 不影响刷卡主进程 在有网的环境下进行下载
setTimeout(function () {
    //当前环境正常 开始下载图片
    var d = JSON.parse(localStorage.getItem('cardData'));
    for(var i in d){
        if(d[i] && d[i]['prcture'] && d[i]['prcture']!==''){
            var downUrl = d[i]['prcture']|| '';
            var imgName = d[i]['student_id']+'_'+d[i]['num']+'.jpg';
            /**
             * downUrl 需http开头
             * downFileName 文件存储的地址
             * imgName 图片名
             * **/
            fs.access(downFileName+'/'+ imgName, fs.F_OK || fs.constants.F_OK, function(err) {
                if(err) {
                    startDownloadTask(downUrl,downFileName,imgName);
                    return;
                }
                console.log("图片存在");
            });

        }
    }
},3000)
fs.access(downFileName+'/er.png', fs.F_OK || fs.constants.F_OK, function(err) {
    if(err) {
        startDownloadTask('http://www.dzrtoy.com/images/er.png',downFileName,'er.png');
        return;
    }
    console.log("文件夹存在");
});
// startDownloadTask('http://www.dzrtoy.com/images/er.png',downFileName,'er.png');



