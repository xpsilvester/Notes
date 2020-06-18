# Linux常用操作   
最近做项目迁移经常接触CentOS，下面就把常用的Linux操作记录一下，以便查询  
### 1、cd命令   
用于切换当前目录，它的参数是要切换到的目录的路径，可以是绝对路径，也可以是相对路径
```Shell 
cd /home/abc       # 切换到目录/home/abc
cd ./path          # 切换到当前目录下的path目录中，“.”表示当前目录   
cd ../path         # 切换到上层目录中的path目录中，“..”表示上一层目录
```
### 2、ls命令
用于查看文件与目录的命令   
```Shell 
/home/abc ls    #查看/home/abc目录下的文件
ll -h           #查看文件大小
```
### 3、grep命令
用于分析一行的信息，若当中有我们所需要的信息，就将该行显示出来
```Shell 
rpm -qa | grep mysql     #是指不区分大小写的列出含mysql字符的已经安装的rpm包软件
ps -ef | grep nginx      #查找nginx的启动目录
```
### 4、find命令
用于查找的功能find [PATH] [option] [action]  
```Shell 
find / -name abc  # 查找文件名为abc的文件  
find . -perm 0755 # 查找当前目录中文件权限的0755的文件  
```
### 5、cp命令
用于复制文件，它还可以把多个文件一次性地复制到一个目录下
```Shell 
cp -R /home/abc/httpd.conf /etc/conf 将/home/abc/httpd.conf文件复制到/etc/conf目录下
```
### 6、mv命令
用于移动文件、目录或更名
```Shell 
mv file1 file2 file3 /etc/conf # 把文件file1、file2、file3移动到目录/etc/conf中  
mv file1 file2 # 把文件file1重命名为file2  
```
### 7、vim命令
用于文本编辑，它接一个或多个文件名作为参数，如果文件存在就打开，如果文件不存在就以该文件名创建一个文件
```Shell 
vim /etc/conf/abc.txt   # 把文件/etc/conf/abc.txt打开编辑，如果文件不存在就以该文件名创建一个文件并打开编辑
```
### 8、yum命令
用于查找、安装、删除某一个、一组甚至全部软件包的命令yum [options] [command] [package ...]
```Shell 
yum install pam-devel   #安装 pam-devel
yum remove pam-devel    #移除 pam-devel
```
### 9、rm命令
用于删除某一个文件或文件夹
```Shell 
rm -rf /var/log/httpd/access   #删除/var/log/httpd/access目录以及其下所有文件、文件夹
rm -f /var/log/httpd/access.log    #将会强制删除/var/log/httpd/access.log这个文件
```

### 10、mkdir命令
用于新建文件夹
```Shell 
mkdir /usr/v2ray   #在/usr/目录下创建v2ray文件夹
```

### 11、CentOS 7 防火墙命令
```Shell
systemctl start firewalld #启动
systemctl stop firewalld  #关闭
systemctl status firewalld  #查看状态
systemctl disable firewalld  #开机禁用
systemctl enable firewalld  #开机启用

firewall-cmd --zone=public --list-ports  #查看所有打开的端口
firewall-cmd --zone=public --query-port=80/tcp  #查看80端口是否打开

firewall-cmd --zone=public --add-port=80/tcp --permanent  #开启一个端口(80端口)
firewall-cmd --zone=public --remove-port=80/tcp --permanent  #关闭一个端口(80端口)

firewall-cmd --reload  #重新载入 （！重要，防火墙操作后要重新载入才能生效）

```

### 12、ss命令
用于查看端口占用和对应进程
```Shell
ss -lnp|grep 80 #查看当前占用80端口的进程
ps -ef|grep 2593 #查看2593进程的父进程
```

### 13、Kill 命令
使用kill命令结束进程：kill xxx
```Shell
kill -9 25605 #关掉pid=25605的进程
```

### 14、CentOS7 安装nginx
直接运行yum install -y nginx 好像装不了，原来官方yum没有Nginx的源
```Shell
rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm #先添加源地址
yum search nginx #看看是否已经添加源成功
yum install -y nginx #安装Nginx
systemctl start nginx.service #启动nginx
# (如果无法启动大多是因为80端口被占用，用ss -lnp|grep 80找出占用进程并kill掉，再次启动)
systemctl enable nginx.service #设置nginx开机启动

#其他相关命令
systemctl stop nginx.service #停止nginx服务
systemctl disable nginx.service #停止开机自启动
systemctl status nginx.service #查看服务当前状态
systemctl restart nginx.service　#重新启动服务 /usr/sbin/nginx -s reload 
systemctl list-units --type=service #查看所有已启动的服务
ps -ef | grep nginx      #查找nginx的启动目录
nginx的启动目录 -t        #测试nginx配置是否正确，顺便可以看到nginx.conf的位置
```

### 15、netstat 命令
用于显示各种网络相关信息，如网络连接，路由表，接口状态 (Interface Statistics)，masquerade 连接，多播成员 (Multicast Memberships) 等等
```Shell
yum install -y net-tools  #安装netstat
netstat -a      # 列出所有端口
netstat -at     # 列出所有TCP端口
netstat -au     # 列出所有UDP端口
netstat -ant    # 查看服务端口

netstat -l   # 只显示监听端口
netstat -lt  # 显示监听TCP端口
netstat -lu  # 显示监听UDP端口
netstat -lx  # 显示监听UNIX端口

netstat -s     # 显示所有端口的统计信息
netstat -st    # 显示所有TCP的统计信息
netstat -su    # 显示所有UDP的统计信息

netstat -p   #显示 PID 和进程名称
netstat -r   #显示核心路由信息

netstat -antp | grep ssh #查看ssh端口和服务
netstat -antp | grep 22  #查看22端口和服务
```

### 16、cat 命令
cat命令是linux下的一个文本输出命令，通常是用于观看某个文件的内容的
cat主要有三大功能：
```Shell
# 一次显示整个文件。
cat filename

# 从键盘创建一个文件。
cat > filename # 只能创建新文件,不能编辑已有文件

# 将几个文件合并为一个文件。
cat file1 file2 > file
```
### 17、grep 命令
```Shell
# 在当前目录中，查找后缀有 file 字样的文件中包含 test 字符串的文件，
# 并打印出该字符串的行
grep test *file 

# 查找指定目录/etc/acpi 及其子目录（如果存在子目录的话）下
# 所有文件中包含字符串"update"的文件，并打印出该字符串所在行的内容
grep -r update /etc/acpi  # 以递归的方式查找“etc/acpi”


# 忽略子目录
grep -d skip update /etc/acpi

# 反向查找。查找文件名中包含 test 的文件中不包含test 的行
grep -v test *test*

# 把test.txt文件中abc okm筛选出来
grep "abc\|okm" test.txt

# 把带abc的行筛选出来，不区分大小写
grep -i "abc" test.txt

# 把出现abc整个单词的筛选出来
grep -w "abc" test.txt

# 把出现abc整个单词的筛选出来 并搜索相应时间的信息
grep -w "abc" '2020-06-17' test.txt

# 把出现abc整个单词筛选出来，不区分大小写
grep -wi "abc" test.txt
```

### 18、SSR 命令
```Shell
git clone https://github.com/flyzy2005/ss-fly
ss-fly/ss-fly.sh -ssr
/etc/init.d/shadowsocks start # 启动
/etc/init.d/shadowsocks stop # 停止
/etc/init.d/shadowsocks restart # 重启
/etc/init.d/shadowsocks status # 状态
/etc/shadowsocks.json # 配置文件路径
/var/log/shadowsocks.log # 日志文件路径
/usr/local/shadowsocks # 代码安装目录
./shadowsocksR.sh uninstall # 卸载ssr
```

### 19、Swap 命令
```Shell
# Swap意思是交换分区，通常我们说的虚拟内存，是从硬盘中划分出的一个分区。
# 当物理内存不够用的时候，内核就会释放缓存区（buffers/cache）里一些长时间不用的程序，然后将这些程序临时放到Swap中，也就是说如果物理内存和缓存区内存不够用的时候，才会用到Swap。

# swap清理(前提条件，空闲的内存必须比已经使用的swap空间大)
swapoff -a 
swapon -a
```

### 20、Tail 命令
```Shell
# tail 命令可用于查看文件的内容，有一个常用的参数 -f 常用于查阅正在改变的日志文件。
# tail -f filename 会把 filename 文件里的最尾部的内容显示在屏幕上，并且不断刷新，只要 filename 更新就可以看到最新的文件内容。

tail -n 50 /var/tax.log # 查看最后50行
tail notes.log # 要显示 notes.log 文件的最后 10 行
tail -f notes.log # 要跟踪名为 notes.log 的文件的增长情况
tail +20 notes.log # 显示文件 notes.log 的内容，从第 20 行至文件末尾
tail -c 10 notes.log # tail -c 10 notes.log
```

### 21、[CentOS7 安装 mongondb](https://www.cnblogs.com/wanghy898/p/10901092.html)

```shell
# 下载mongondb安装包
curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.2.9.tgz
# 解压
tar -zxvf mongodb-linux-x86_64-3.2.9.tgz
# 将解压过后的包移动到指定目录
mv mongodb-linux-x86_64-3.2.9/ /usr/local/mongodb
# 创建数据文件夹和日志文件等
mkdir -p  /usr/local/mongodb/data
touch /usr/local/mongodb/mongod.log
touch /usr/local/mongodb/mongodb.conf

# 启动方式
cd /usr/local/mongodb/bin
# 通过参数启动
./mongod --dbpath=/usr/local/mongodb/data --logpath=/usr/local/mongodb/mongod.log --logappend  --port=27017 --fork

# 停止
./mongod -shutdown -dbpath=/usr/local/mongodb/data

```

