---
title: git提交后jenkins自动构建发布(gogs)
date: 2018-07-14 
tags:
- git
- jenkins

categories:
- 运维jenkins
---
代码提交git后自动发消息给jenkins, 开启构建和部署的动作. 做到全自动
<!--more-->
# 背景环境
每次本地提交代码后, 还要到jenkins上点一下构建, 这很不先进.
## 环境
git: gogs(docker)
jenkins: blue-ocean(docker)
ide: idea

# 怎么实现
实际上就是jenkins接收gogs发出的post请求, 所以才叫"web" hook
1. jenkins安装插件gogs
2. jenkins项目配置-触发构建器选"Build when a change is pushed to Gogs"
3. 在gogs的仓库设置中配置web hook, 密码可以不设, 其他默认, 地址如下格式:
>http://10.75.76.163:8083/gogs-webhook/?job=AILog
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEzNzM1NzQyMzhdfQ==
-->