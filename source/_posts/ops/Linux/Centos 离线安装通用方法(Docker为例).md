---
title: Centos 离线安装通用方法(Docker为例)
date: 2018-03-13 10:00:00
tags:
- Centos
- Docker
categories:
- Ops
---
# 原理
yum install有参数\-\-downloadonly，可以只下载不安装，搭配\-\-downloaddir=DLDIR参数可以下载依赖包，完成离线安装。
命令实例：
```bash
# online machine: pwd --> /root
mkdir -p /root/download
yum install --downloadonly --downloaddir=/root/download <package-name>
tar zcf download.tar.gz download/

```
```bash
# offline machine: pwd --> /root
tar xf download.tar.gz
yum localinstall download/*
```
# docker实例
按照官网说明，使用以上命令，获得的rpm包，基于Centos7.0-1406系统
https://github.com/Tony36051/docker-installer/tree/master/RPM-based/docker-ce-17.12-CentOS-7.0-1406
root权限执行一下命令即可:
> sudo sh install.sh

## 可能的坑
rpm包有重复、冲突，体现为在安装xxx包时候，依赖项Requires，但是有重复或冲突，需要卸载Removing，并被yyy包更新Updated。但是这个过程不能自动化，因为yum不知道你冲突后要保留哪个。例子如下：
```bash
--> Processing Dependency: rpm = 4.11.3-25.el7 for package: rpm-libs-4.11.3-25.el7.x86_64
--> Finished Dependency Resolution
Error: Package: 1:net-snmp-agent-libs-5.7.2-24.el7.i686 (@Server)
           Requires: librpm.so.3
           Removing: rpm-libs-4.11.3-17.el7.i686 (@Server)
               librpm.so.3
           Updated By: rpm-libs-4.11.3-25.el7.x86_64 (/rpm-libs-4.11.3-25.el7.x86_64)
               Not found
Error: Package: rpm-build-libs-4.11.3-17.el7.x86_64 (@Server)
           Requires: rpm-libs(x86-64) = 4.11.3-17.el7
           Removing: rpm-libs-4.11.3-17.el7.x86_64 (@Server)
               rpm-libs(x86-64) = 4.11.3-17.el7
           Updated By: rpm-libs-4.11.3-25.el7.x86_64 (/rpm-libs-4.11.3-25.el7.x86_64)
               rpm-libs(x86-64) = 4.11.3-25.el7
Error: Package: 1:net-snmp-agent-libs-5.7.2-24.el7.i686 (@Server)
           Requires: librpmio.so.3
           Removing: rpm-libs-4.11.3-17.el7.i686 (@Server)
               librpmio.so.3
           Updated By: rpm-libs-4.11.3-25.el7.x86_64 (/rpm-libs-4.11.3-25.el7.x86_64)
               Not found
Error: Package: rpm-libs-4.11.3-25.el7.x86_64 (/rpm-libs-4.11.3-25.el7.x86_64)
           Requires: rpm = 4.11.3-25.el7
           Installed: rpm-4.11.3-17.el7.x86_64 (@Server)
               rpm = 4.11.3-17.el7
 You could try using --skip-broken to work around the problem
 You could try running: rpm -Va --nofiles --nodigest

```
## 解决方法
- 查看重复包
```bash
rpm -vqa | grep net-snmp-agent-
net-snmp-agent-libs-5.7.2-24.el7.x86_64
net-snmp-agent-libs-5.7.2-24.el7.i686
```
- 卸载冲突包
下面是卸载不符合系统的包，也有可能完把老版本全删掉，直接装新的
```bash
yum remove rpm-libs-4.11.3-17.el7.i686
```
