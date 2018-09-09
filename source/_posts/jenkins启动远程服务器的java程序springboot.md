---
title: Jenkins启动远程服务器的java程序springboot
date: 2018-07-14 
tags:
- springboot
- jenkins

categories:
- 运维
---
jenkins打包springboot程序后, 发送到远程服务器, 然后启动任务. 这次选择了较为偷懒的方式. 
<!--more-->
# 环境说明
jenkins: docker中
```bash
docker run -u root --name jenkins --restart always -d \
-p 8083:8080 -p 50000:50000 \
-v /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime \
-v /home/tony/jenkins-blueocean-data:/var/jenkins_home \
-v /home/tony/jenkins-blueocean-data/.ssh:/root/.ssh \
-v /var/run/docker.sock:/var/run/docker.sock \
-e JAVA_OPTS="-DproxyHost=hwcntlm -DproxyPort=3128 -Dhudson.model.DirectoryBrowserSupport.CSP= -Duser.timezone=Asia/Shanghai" \
jenkinsci/blueocean
```
# how to do
## 免密登录
1. 可以看见将/root/.ssh目录持久化到宿主机目录了
2. ssh-keygen 一路回车即可
3. ssh-copy-id -i ~/.ssh/id_rsa.pub user@server

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
