---
title: Ubuntu添加服务开机自启动(Jenkins为例)
date: 2018-12-24
tags:
- Jenkins

categories: 
- 运维

---
翻译一篇国外添加自启动服务到systemd的文章.
<!--more-->
# 背景
今天重启执行机, 又忘记开Jenkins了, 还是改成自启动吧. [实现参考](https://dzone.com/articles/run-your-java-application-as-a-service-on-ubuntu)
# 实现
## 创建service
```bash
sudo vim /etc/systemd/system/jenkins.service
```
```ini
[Unit]
Description=Jenkins for autotest

[Service]
User=tony
# The configuration file application.properties should be here:
#change this to your workspace
WorkingDirectory=/home/tony/jenkins

#path to executable. 
#executable is a bash script which calls jar file
ExecStart=/home/tony/jenkins/start.sh
SuccessExitStatus=143
TimeoutStopSec=10
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```
## 写启动jiaobe
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTg1NDk1MjQzNV19
-->