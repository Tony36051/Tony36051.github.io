---
title: Jenkins 使用笔记
date: 2018-04-25 20:20
tags:
- docker
- jenkins
categories:
- Ops
---
记录Jenkins上使用的经验，另外在公司内部使用Jenkins会遇到一些代理问题，记录一些解决方法。
<!-- more -->

# 代理问题

1. 配置代理后，由于默认使用https取插件仓库，切换为http协议即可
在http://localhost:8083/pluginManager/advanced中，升级站点的url去掉https的s，用http协议，然后提交一下，获取一下可选插件
2. 安装忽略ssl证书的插件`Skip Certificate Check`
3. `git plugin`需要配置忽略ssl：git config --global http.sslVerify "false"

# 常用插件
1. Subversion Plug-in 公司还在使用SVN，在Repository URL后记得加`@HEAD`
2. Robot Framework plugin 集成RobotFramework的好插件
3. Build User Vars Plugin 将用户变为变量
4. Build Name Setter Plugin 可以将构建名中插入变量

# WebHook 自动构建

## 推送Jenkins自动构建
每次本地提交代码后, 还要到jenkins上点一下构建, 这很不先进.
git: gogs(docker)
jenkins: blue-ocean(docker)
ide: idea

实际上就是jenkins接收gogs发出的post请求, 所以才叫"web" hook

1. jenkins安装插件gogs
2. jenkins项目配置-触发构建器选"Build when a change is pushed to Gogs"
3. 在gogs的仓库设置中配置web hook, 密码可以不设, 其他默认, 地址如下格式:
>http://10.75.76.163:8083/gogs-webhook/?job=AILog


# 部署后启动启动远程服务器

## 免密登录
```bash

ssh-keygen #一路回车即可
ssh-copy-id -i ~/.ssh/id_rsa.pub user@server
```

## maven构建

选择Invoke top-level Maven targets
package
-Dmaven.test.skip=true

## 停止任务

```bash
ssh root@remote_host "pkill -f ailog.jar " || true
scp ${WORKSPACE}/target/ailog.jar root@remote_host:/tmp/ailog.jar
ssh root@remote_host "cd /tmp; nohup java -jar -Dspring.profiles.active=prod /tmp/ailog.jar > /tmp/ailog.log &"
```

1. `|| true` 可以让该命令的执行结果返回成功, 让后续步骤可以继续
2. pkill -f可以匹配部分启动命令,然后kill之. 如果没有找到会返回失败
3. nohup & 可以使进程后台执行. 重定向结果能让ssh马上返回
   如果是本地执行命令, 需要这样:

```bash
pkill -f excelhelper || true
BUILD_ID=dontKillMe nohup java -jar ${WORKSPACE}/excelhelper/target/excelhelper-1.0-SNAPSHOT.jar > /tmp/excelhelper.log 2>&1 &
```