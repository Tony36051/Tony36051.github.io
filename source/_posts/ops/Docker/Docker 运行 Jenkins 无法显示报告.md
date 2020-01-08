---
title: Docker 运行 Jenkins 无法显示报告
date: 2018-04-08 11:36
tags:
- Docker
- Jenkins
- RobotFramework
categories:
- 运维
---
Docker运行Jenkins有诸多不便，尽量不要使用。
较新版本Jenkins限制了js和css的运行，然而RobotFramework的日志log.html和报告report.html都严重依赖js和css。docker平台上最简单解决方法就是用JAVA_OPTS-Dhudson.model.DirectoryBrowserSupport.CSP=，放松Jenkins的安全策略。缺失字体库会造成显示成方块的问题

<!-- more -->
# Docker 运行 Jenkins 无法显示报告、字体乱码问题

## 运行命令
```bash
docker run -u root --name jenkins --restart always -d \
-p 8083:8080 -p 50000:50000 \
--link hwcntlm:hwcntlm \
-v /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime \
-v /home/tony/jenkins-blueocean-data:/var/jenkins_home \
-v /var/run/docker.sock:/var/run/docker.sock \
-e http_proxy=hwcntlm:3128 \
-e https_proxy=hwcntlm:3128 \
-e JAVA_OPTS="-DproxyHost=hwcntlm -DproxyPort=3128 -Dhudson.model.DirectoryBrowserSupport.CSP= -Duser.timezone=Asia/Shanghai" \
jenkinsci/blueocean
```
1. 多个JAVA_OPTS：如果处在多个JAVA_OPTS，需要空格隔开，双引号包住。等号后面不加内容为空。
2. 时区问题：通过JAVA_OPTS和映射时区文件都可以解决，按理说只取其一即可
3. 代理：公司环境很可能需要代理才能访问，按理说也是环境变量`http_proxy`和JAVA_OPTS=-DproxyHost=hwcntlm -DproxyPort=3128任一即可
