---
title: jenkins安装
author: Taoqiupo
date: 2021-8-11 11:19:23
tags: CI/CD
category: jenkins
index_img: https://raw.githubusercontent.com/qiupo/myImages/master/img/20210811102025.png
comment: true
---

## jenkins安装
&emsp;&emsp;**jenkins**作为领先的开源自动化服务器，Jenkins 提供了数百个插件来支持任何项目的构建、部署和自动化。
&emsp;&emsp;在官网有安装步骤 https://www.jenkins.io/doc/book/installing/linux/
因为我的服务器是CentOS,所以需要以下命令：
```
sudo wget -O /etc/yum.repos.d/jenkins.repo \
    https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
sudo yum upgrade
sudo yum install jenkins java-11-openjdk-devel
sudo systemctl daemon-reload
```
### 其中遇到的问题
1. 存储不足报错
```
One of the configured repositories failed (Unknown),
 and yum doesn't have enough cached data to continue. At this point the only
 safe thing yum can do is fail. There are a few ways to work "fix" this:

     1. Contact the upstream for the repository and get them to fix the problem.

     2. Reconfigure the baseurl/etc. for the repository, to point to a working
        upstream. This is most often useful if you are using a newer
        distribution release than is supported by the repository (and the
        packages for the previous distribution release still work).

     3. Run the command with the repository temporarily disabled
            yum --disablerepo=<repoid> ...

     4. Disable the repository permanently, so yum won't use it by default. Yum
        will then just ignore the repository until you permanently enable it
        again or use --enablerepo for temporary usage:

            yum-config-manager --disable <repoid>
        or
            subscription-manager repos --disable=<repoid>

     5. Configure the failing repository to be skipped, if it is unavailable.
        Note that yum will try to contact the repo. when it runs most commands,
        so will have to try and fail each time (and thus. yum will be be much
        slower). If it is a very temporary problem though, this is often a nice
        compromise:

            yum-config-manager --save --setopt=<repoid>.skip_if_unavailable=true

Insufficient space in download directory /var/cache/yum/x86_64/7/base
    * free   0 
    * needed 100 k
```
&emsp;&emsp;其中问题存在与cached data不足，这里是因为我的服务器只有50G，不够用,执行`df -h`查看存储情况后发现有一块额外的200G挂载硬盘，只需要修改yum地址到外挂硬盘就行了，执行以下命令：
```
vim /etc/yum.conf 
```
会出现以下配置内容：
```
[main]
cachedir=/var/cache/yum/$basearch/$releasever
keepcache=0
debuglevel=2
```
修改`cachedir`此处的地址修改到挂载的文件路径即可。

2. filesystem没有足够的空间
```
At least 1105MB more space needed on the / filesystem.
```
在执行`sudo yum upgrade`时报以上错误。只需修改`yum.conf`，添加一行`diskspacecheck=0`即可解决问题

3. 安装jenkins失败
如果失败了，建议通过清华的镜像站自行下载：https://mirrors.tuna.tsinghua.edu.cn/jenkins/redhat/
然后scp或者ftp传输到服务器上，`rpm -ivh jenkins-2xxx.noarch.rpm`
就可以了。

### 安装完毕

完成后运行 
```
sudo systemctl daemon-reload
sudo systemctl start jenkins
```
便可以启动jenkins，然后通过`sudo systemctl status jenkins`查看状态
之后按照官网步骤即可访问jenkins的网页了，输入密码然后进入引导页面即可。