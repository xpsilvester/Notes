# 申请免费SSL证书
Chrome对不是https的网站很不友好，所以很有必要为自己的网站申请SSL证书，在自已域名的http前面再加上个s。以下操作是在CentOS 7下进行的。

### 1.安装Python2.7以上版本
```Shell
#检查系统是否安装git,如果已经自带有git会出现git版本号，没有则需要我们自己安装
git  --version 
#git 安装
yum install git
#检查Python的版本是否在2.7以上
python -v //2.6版本
#安装python所需的包
yum install zlib-devel
yum install bzip2-devel
yum install openssl-devel
yum install ncurses-devel
yum install sqlite-devel
#获取到Python
cd /usr/local/src
wget https://www.python.org/ftp/python/2.7.12/Python-2.7.12.tar.xz
#解压Python2.7.12
tar -zxvf Python-2.7.12.tar.xz
#编译python
cd Python-2.7.12/
./configure --prefix=/usr/local/python2.7
make && make install
#建立链接
ln -s /usr/local/python2.7/bin/python2.7 /usr/local/bin/python
#解决系统 Python 软链接指向 Python2.7 版本后，因为yum是不兼容 Python 2.7的，所需要指定 yum 的Python版本
```

### 2.获取Let's Encrypt免费SSL证书
```Shell
#获取letsencrypt
git clone https://github.com/letsencrypt/letsencrypt
#进入letsencrypt目录
cd letsencrypt
#生成证书 --email后是你的邮箱 -d后面是你的域名（可添加多个）
./letsencrypt-auto certonly --standalone --email xpsilvester@gmail.com -d xpsilvester.com -d www.xpsilvester.com
```
如果显示以下内容，说明已经安装成功
```Shell
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/www.xpsilvester.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/www.xpsilvester.com/privkey.pem
   Your cert will expire on 2019-02-15. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot-auto
   again. To non-interactively renew *all* of your certificates, run
   "certbot-auto renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le

```

### 3.Nginx相关配置
在完成Let's Encrypt证书的生成之后，我们会在"/etc/letsencrypt/live/zhaoheqiang.me/"域名目录下有4个文件就是生成的密钥证书文件。

cert.pem - Apache服务器端证书
chain.pem - Apache根证书和中继证书
fullchain.pem - Nginx所需要ssl_certificate文件
privkey.pem - 安全证书KEY文件

如果我们使用的Nginx环境，那就需要用到fullchain.pem和privkey.pem两个证书文件，在部署Nginx的时候需要用到。在Nginx环境中，只要将对应的ssl_certificate和ssl_certificate_key路径设置成我们生成的2个文件就可以。

使用vi打开配置文件
```Shell
vi /etc/nginx/nginx.conf
```
我们需要在http{}中修改相关配置
添加一个server节点，如下所示
```Shell
http{
    #用户使用的是http协议进行访问，那么默认打开的端口是80端口，所以我们需要做一个重定向
    server{
        listen 80;
        server_name http://xx.xx.xx:xx; #项目本地服务端口号
        rewrite ^/(.*)$ https://www.xpsilvester.com:443/$1 permanent;
    }
    #http节点中可以添加多个server节点
    server{
        #监听443端口
        listen 443;
        #对应的域名，把www.xpsilvester.com改成你们自己的域名就可以了
        server_name www.xpsilvester.com;
        ssl on;
        #key路径
        ssl_certificate /etc/letsencrypt/live/www.xpsilvester.com/fullchain.pem;
 ssl_certificate_key /etc/letsencrypt/live/www.xpsilvester.com/privkey.pem;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;

        #这是本地项目访问地址。
        location / {
            proxy_pass http://xx.xx.xx.xx:xxx;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
        }
    }

}
```
### 4.重启Nginx
这里经常会报错，请确认80端口没有被占用，如果占用的话kill掉相关进程再启动nginx
```Shell
systemctl restart nginx.service
```
## 常见问题

```Shell
Transaction check error:
  package ca-certificates-2018.2.22-70.0.el7_5.noarch is already installed

Error Summary
-------------

Could not install OS dependencies. Aborting bootstrap!

#需要remove掉ca-certificates-2018.2.22-70.0.el7_5.noarch再重新执行

yum remove ca-certificates-2018.2.22-70.0.el7_5.noarch

#生成证书 --email后是你的邮箱 -d后面是你的域名（可添加多个）
./letsencrypt-auto certonly --standalone --email xpsilvester@gmail.com -d xpsilvester.com -d www.xpsilvester.com


```

```Shell
Problem binding to port 80: Could not bind to IPv4 or IPv6.

#80端口被占用，关一下Nignx
service nginx stop
./letsencrypt-auto certonly --standalone --email xpsilvester@gmail.com -d xpsilvester.com -d www.xpsilvester.com
```



## 相关文章
##### 1.[申请Let's Encrypt永久免费SSL证书](https://www.jianshu.com/p/3ae2f024c291)


