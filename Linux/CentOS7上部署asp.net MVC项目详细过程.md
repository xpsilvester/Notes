# CentOS 7上部署asp.net MVC项目详细过程

标签（空格分隔）： Linux .Net Jexus

---

### 一、Mysql安装：
之前在CentOS 7上安装Mysql一直装不上，查了一下才知道已经改用MariaDB代替了
#### 1.删除原来的MariaDB、重装
```shell
[root@localhost ~]# yum remove mariadb
[root@localhost ~]# yum -y install mariadb
```
#### 2.启动MariaDB
```shell
[root@localhost ~]# systemctl start mariadb.service
```
如果没问题说明已经安装成功，本人到这步的时候数据库启动报错（成功请忽略，直接跳到下一步），
#### 2.1 查看启动状态
```shell
[root@localhost ~]# systemctl status mariadb -l

mariadb.service - MariaDB database server
   Loaded: loaded (/usr/lib/systemd/system/mariadb.service; enabled)
   Active: failed (Result: exit-code) since Wed 2015-01-07 22:47:01 EST; 9s ago
  Process: 19037 ExecStartPost=/usr/libexec/mariadb-wait-ready $MAINPID (code=exited, status=1/FAILURE)
  Process: 19036 ExecStart=/usr/bin/mysqld_safe --basedir=/usr (code=exited, status=0/SUCCESS)
  Process: 19009 ExecStartPre=/usr/libexec/mariadb-prepare-db-dir %n (code=exited, status=0/SUCCESS)
 Main PID: 19036 (code=exited, status=0/SUCCESS)

Jan 07 22:47:00 JX-Store systemd[1]: Starting MariaDB database server...
Jan 07 22:47:00 JX-Store mysqld_safe[19036]: 150107 22:47:00 mysqld_safe Logging to '/var/log/mariadb/mariadb.log'.
Jan 07 22:47:00 JX-Store mysqld_safe[19036]: 150107 22:47:00 mysqld_safe Starting mysqld daemon with databases from /var/lib/mysql
Jan 07 22:47:00 JX-Store mysqld_safe[19036]: 150107 22:47:00 mysqld_safe mysqld from pid file /var/run/mariadb/mariadb.pid ended
Jan 07 22:47:01 JX-Store systemd[1]: mariadb.service: control process exited, code=exited status=1
Jan 07 22:47:01 JX-Store systemd[1]: Failed to start MariaDB database server.
Jan 07 22:47:01 JX-Store systemd[1]: Unit mariadb.service entered failed state
```
解决办法：删除/var/lib/mysql  和 /etc/my.cnf 重新安装

#### 3.登陆
MariaDB的操作命令跟Mysql一样
```shell
#可以通过以下命令查看版本，确认MariaDB已安装成功
[root@localhost ~]# mysql --version
#可以通过 MariaDB 命令行登录，然后对数据库进行sql查询操作
[root@localhost ~]# mysql -uroot -pyourpassword
# 开放防火墙端口，开启后要重启防火墙
[root@localhost ~]# firewall-cmd --zone=public --add-port=3306/tcp --permanent
```
第一次安装会默认给你配置一个密码，可以搜一下怎么登陆

### 二、Jexus和Mono的安装配置可参照

[CentOS 6.6上部署asp.net MVC项目详细过程](https://xpsilvester.com/2018/04/05/CentOS%206.6%E4%B8%8A%E9%83%A8%E7%BD%B2asp.net%20MVC%E9%A1%B9%E7%9B%AE%E8%AF%A6%E7%BB%86%E8%BF%87%E7%A8%8B/)


### 三、一些常见问题及操作
#### 1.Jexus 大小写敏感解决：
cd /usr/jexus/ 
vim jws
将#export MONO_IOMAP="all"前面的“#”去掉!
重启Jexus服务: /usr/jexus/jws restart

#### 2.Centos7 下mysql大小写敏感:
编辑/etc/my.cnf文件,在[mysqld]节下 添加 lower_case_table_names=1 参数，并设置相应的值 (备注：为0时大小写敏感，为1时大小写不敏感，默认为0)。（必须是在[mysqld]节点下添加，否则没有效果）,
重启mariadb：systemctl restart mariadb.service

#### 3.防火墙设置
```shell
# 关闭防火墙
[root@localhost ~]# systemctl stop firewalld.service 
# 禁止firewall开机启动
[root@localhost ~]# systemctl disable firewalld.service
# 开启端口
[root@localhost ~]# firewall-cmd --zone=public --add-port=1235/tcp --permanent
# 重启防火墙
[root@localhost ~]# firewall-cmd --reload
# 查看已经开放的端口：
[root@localhost ~]# firewall-cmd --list-ports
```
