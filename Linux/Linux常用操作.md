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
```
### 3、grep命令
用于分析一行的信息，若当中有我们所需要的信息，就将该行显示出来
```Shell 
rpm- qa | grep mysql     #是指不区分大小写的列出含mysql字符的已经安装的rpm包软件
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