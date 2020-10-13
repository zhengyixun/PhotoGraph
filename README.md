# photograph 1.2.0

## public文件夹下的package.json 是使用nw打包的配置文件
### 该项目基于nw封装成基于ubuntu的arm应用 
### 新增文件介绍
```javascript
    |-- deploy        //部署文件夹
        |-- build.sh  //在服务器上跑的打包生成应用的脚本
    |-- dist          //前端打包生成的文件夹
        |-- ***
    |-- public        // 不会被编译的文件夹
        |-- ***
        |-- index.js  // 调用node api 的js文件（nw提供了node环境中可以使用node api）
        |-- package.json // nw打包是会读取的配置文件
    |-- dist.zip    //  运行打包命令时生成的dist文件
    |-- WinRAR.exe  //  生成zip压缩包的exe

```

# 本地打包上传至树莓派上以及远程生成桌面应用的步骤
```javascript

// 打包生成dist压缩包
winrar.exe a -r -ep1 dist.zip dist\*.*

// scp的方式传到服务器上
scp -r dist.zip pi@192.168.124.16:/home/pi/Desktop

// ssh链接远程服务器并执行脚本文件 - 生成build
ssh pi@192.168.124.16 bash -s < ./deploy/build.sh build
// ssh链接远程服务器并执行脚本文件 - 生成prod
ssh pi@192.168.124.16 bash -s < ./deploy/build.sh prod

```
### 以上的操作步骤在连接远程服务器的时候需要输入密码，还需要做一步免密登陆的操作
1、 .ssh文件夹下创建公私钥
2、把公钥上传到服务器
```javascript
右键-Git Bash

ssh-copy-id -i ~/.ssh/id_rsa.pub pi@192.168.124.16

```
如果报ssh-copy-id 不是内部命令那么改用gitbash打开就可以了

#### 如何把git Bash 整合进wenstorm【这个地方会有弊端 cmd无法运行ssh-copy-id命令 shell无法运行ssh或winrar.exe】
文章地址：https://blog.csdn.net/marko_zheng/article/details/108668512








