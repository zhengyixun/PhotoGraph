#!/bin/bash
deploy(){
  #  进入工作目录
	cd /home/pi/Desktop/nwjs-sdk-v0.28.4-linux-arm
  #	nw打包生成桌面应用的方式
	sudo cat nw ../dist.zip > dist
  #	删除dist.zip
	sudo rm /home/pi/Desktop/dist.zip
  #	提升权限
	sudo chmod 777 dist
  #	./dist
}
prod(){
  #  进入工作目录
	cd /home/pi/Desktop/nwjs-v0.28.4-linux-arm
	#	nw打包生成桌面应用的方式
	sudo cat nw ../dist.zip > dist
	#	删除dist.zip
	sudo rm /home/pi/Desktop/dist.zip
	#	提升权限
	sudo chmod 777 dist
  #	./dist
}
usage(){
	echo "Usage:sh test.sh [build|prod]"
	exit 1
}
case "$1" in "build")
	deploy
	;;
	"prod")
	prod
	;;
	*)
	usage
	;;
esac

exit 1
