## CentOS 6.6上部署asp.net MVC项目详细过程

#### 一、首先更新系统
```shell
[root@localhost ~]# yum –y update
```

#### 二、安装Mono

##### 1.安装Mono源码安装需要的组件：

```shell
[root@localhost ~]# yum -y install wget glib2-devel libtiff libtiff-devel libjpeg libjpeg-devel giflib giflib-devel libpng libpng-devel libX11 libX11-devel freetype freetype-devel fontconfig fontconfig-devel libexif libexif-devel gcc-c++ gettext unzip zip
```

##### 2.安装Mono之前，需要先安装其依赖的GDI+组件。联网下载libgdiplus源码安装包

```shell
[root@localhost ~]# cd /usr
[root@localhost usr]# wget http://download.mono-project.com/sources/libgdiplus/libgdiplus-2.10.tar.bz2
```
解压libgdiplus源码安装包：
```shell
[root@localhost usr]# tar jxvf libgdiplus-2.10.tar.bz2
```
配置libgdiplus组件安装路径:
```shell
[root@localhost usr]# cd libgdiplus-2.10
[root@localhost libgdiplus-2.10]# ./configure --prefix=/usr/apollo/hostd/mono/
```
编译libgdiplus源码：
```shell
[root@localhost libgdiplus-2.10]# make
```
安装libgdiplus组件：
```shell
[root@localhost libgdiplus-2.10]# make install
```
##### 3.安装Mono:
Mono是Linux平台的.NET Framework实现，是.NET程序移植到Linux平台的不二选择。首先，联网下载Mono源码安装包：
```shell
[root@localhost libgdiplus-2.10]# cd /usr
[root@localhost usr]# wget http://download.mono-project.com/sources/mono/mono-4.0.4.1.tar.bz2
```
解压Mono源码安装包：
```shell
[root@localhost usr]# tar jxvf mono-4.0.4.1.tar.bz2
```
配置Mono安装路径：
```shell
[root@localhost usr]# cd mono-4.0.4
[root@localhost mono-4.0.4]# ./configure --prefix=/usr/apollo/hostd/mono
```
编译Mono源码（此过程耗时一般为半小时到一小时，视系统软硬件配置而定）：
```shell
[root@localhost mono-4.0.4]# make
```
安装Mono：
```shell
[root@localhost mono-4.0.4]# make install
```
通过查看Mono版本，确认Mono是否安装成功
```shell
[root@localhost mono-4.0.4]# cd /usr/apollo/hostd/mono/bin/
[root@localhost bin]# ./mono -V
```

#### 三、安装Jexus
Jexus是国人开发的Linux平台上的ASP.NET Web应用中间件，类似于Windows平台的IIS。实践证明Jexus安装简单，运行稳定，是Linux平台架设ASP.NET应用的不错选择。

##### 1.首先，联网下载Jexus安装包：
```shell
[root@localhost ~]# cd /usr
[root@localhost usr]# wget http://www.linuxdot.net/down/jexus-5.6.5.tar.gz
```
解压Jexus安装包：
```shell
[root@localhost usr]# tar zxvf jexus-5.6.5.tar.gz
```
修改Jexus安装路径:
```shell
[root@localhost usr]# cd jexus-5.6.5
[root@localhost jexus-5.6.5]# vi install

用vim编辑文件
#!/bin/sh
SRC_DIR=$(cd $(dirname $0);pwd)
DAT_DIR=${SRC_DIR}/data
JWS_DIR='/usr/apollo/hostd/jexus'
…
```
##### 2.安装Jexus：
```shell
[root@localhost jexus-5.6.5]# sudo ./install
```
修改Jexus关于mono路径的配置：
```shell
[root@localhost jexus-5.6.5]# cd /usr/apollo/hostd/jexus
[root@localhost jexus]# vi jws

#!/bin/sh
JWS_HOME=$(cd $(dirname $0);pwd)
export LANG="zh_CN.UTF-8"
export PATH=/usr/bin:${JWS_HOME}/../mono/bin:$PATH
export LD_LIBRARY_PATH=/usr/lib:${JWS_HOME}/../mono/lib:$LD_LIBRARY_PATH
…
```
##### 3.启动Jexus服务，测试Jexus安装是否正确：
```shell
[root@localhost jexus]# ./jws start
```
设置Jexus服务开机自启动，增加如下高亮行：
```shell
[root@localhost jexus]# vi /etc/rc.d/rc.local
touch /var/lock/subsys/local
/usr/apollo/hostd/jexus/jws start
```
修改该文件权限并重启：
```shell
[root@localhost jexus]# chmod +x /etc/rc.d/rc.local
```
#### 四、部署网站
创建网站目录：
```shell
[root@localhost jexus]# cd /usr/apollo/
[root@localhost apollo]# mkdir webapps
[root@localhost apollo]# cd webapps/
[root@localhost webapps]# mkdir default
[root@localhost webapps]# cd default/
[root@localhost default]# touch index.html
[root@localhost default]# vi index.html

<html>
<head>
    <title>测试ASP.NET</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
</head>
<body>
    测试ASP.NET
</body>
</html>
```
修改Jexus网站配置：
```shell
[root@localhost default]# cd /usr/apollo/hostd/jexus/siteconf 
[root@localhost siteconf]# vi default 
 
###################### 
# Web Site: Default 
######################################## 
 
port=80 
root=/ /usr/apollo/webapps/default 
hosts=*    #OR your.com,*.your.com 
… 
```
开放防火墙80端口：
```shell
[root@localhost siteconf]# vi /etc/sysconfig/iptables 
 
# Firewall configuration written by system-config-firewall 
# Manual customization of this file is not recommended. 
*filter 
:INPUT ACCEPT [0:0] 
:FORWARD ACCEPT [0:0] 
:OUTPUT ACCEPT [0:0] 
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT 
-A INPUT -p icmp -j ACCEPT 
-A INPUT -i lo -j ACCEPT 
-A INPUT -m state --state NEW -m tcp -p tcp --dport 22 -j ACCEPT 
-A INPUT -m state --state NEW -m tcp -p tcp --dport 80 -j ACCEPT 
-A INPUT -j REJECT --reject-with icmp-host-prohibited 
-A FORWARD -j REJECT --reject-with icmp-host-prohibited 
COMMIT 
```
重启iptables，使防火墙设置生效：
```shell
[root@localhost siteconf]# /etc/init.d/iptables restart
```
重启Jexus服务：
```shell
[root@localhost siteconf]# /usr/apollo/hostd/jexus/jws restart
```
终端浏览器输入网址http://ip:port/index.html访问网站：
![此处输入图片的描述][1]

#### 五、数据库
##### 1.卸载centos6.5本身所安装的mysql：
```shell
[root@localhost]# yum remove  mysql mysql-server mysql-libs mysql-server
[root@localhost]# find / -name mysql #将找到的都删掉 rm -fr 
[root@localhost]# rpm -qa|grep -i mysql #查看还有么没有mysql，如果有的话，使用rpm -e –nodeps 包名 删除
```
##### 2.安装mysql
```shell
[root@localhost usr]# yum list mysql-server
```
![此处输入图片的描述][2]
```shell
[root@localhost usr]# yum install mysql-server
```
过程中选择Y继续安装，最后安装成功

##### 3.设置Mysql的服务
先启动Mysql服务
```shell
[root@localhost usr]# service mysqld start
```
设置Mysql开机启动
```shell
[root@localhost usr]# chkconfig mysqld on
```
开启3306端口并保存
```shell
[root@localhost usr]# /sbin/iptables -I INPUT -p tcp --dport 3306 -j ACCEPT
[root@localhost usr]# /etc/rc.d/init.d/iptables save
```
##### 4.修改密码并设置远程访问
连接mysql数据库设置密码
```shell
[root@localhost usr]# use mysql
mysql> update user set password=password('密码') where user='root';flush privileges;
```
##### 5.重启mysql服务
```shell
[root@localhost usr]# service mysqld restart
```


参考文章： [ASP.NET 跨平台最佳实践](http://developer.51cto.com/art/201511/497866.htm)


  [1]: http://s2.51cto.com/wyfs02/M01/76/35/wKioL1ZNJ2KjFX0aAACMLehqRlw136.png-wh_600x-s_2117650469.png
  [2]: https://imgsa.baidu.com/exp/w=500/sign=9f5c2c0f08f3d7ca0cf63f76c21fbe3c/b17eca8065380cd7965dc9dca544ad34598281bb.jpg