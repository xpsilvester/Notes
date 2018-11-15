# CentOS 7上部署NodeJS
双十一入手了VPS，记录一下部署NodeJS的过程，系统是CentOS 7，gcc gcc-c++默认已经装好了

### 1.从源码下载Nodejs
```Shell
cd /usr #进入/usr
mkdir node #创建node文件夹
cd node #进入node文件夹
wget https://nodejs.org/dist/vv10.13.0/node-v10.13.0-linux-x64.tar.xz #从镜像源下载安装包（v10.13.0为版本号，根据自己所需修改）
```

### 2.解压安装包
```Shell
tar xf node-v10.13.0-linux-x64.tar.xz #解压
cd node-v10.13.0-linux-x64 #进入解压目录
./bin/node -v #执行node命令 查看版本
```
v10.13.0
若显示以上则说明解压成功

### 3.使用 ln 命令来设置软连接，设置全局变量
```Shell
ln -s /usr/node/node-v10.13.0-linux-x64/npm   /usr/local/bin/ 
ln -s /usr/node/node-v10.13.0-linux-x64/bin/node   /usr/local/bin/
```
#### /usr/node/node-v10.13.0-linux-x64/为安装包解压出来的文件夹
#### 到这里应该已经完成了，随意到目录下运行命令node -v,看看输出

## 相关文章
##### 1.[Linux CentOS7 搭建node服务详细教程](https://www.jianshu.com/p/5999d8c58b2f)


