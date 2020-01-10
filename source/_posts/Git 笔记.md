---
title: Git 笔记
date: 2018-07-14 
tags:
- Git
- Jenkins
---


Git初始化动作，别名配置，待添加cheat sheet

<!--more-->

# Git 笔记

## 初始化

```bash
git config --global http.sslverify false
git config --global user.email "tony36051@github.com"
git config --global user.name "Tony36051"

git config --global http.proxy http://username:password@proxyhk.huawei.com:8080
git config --global https.proxy http://username:password@proxyhk.huawei.com:8080
git config --global --unset http.proxy
git config --global --unset https.proxy

# window显示中文
git config --global core.quotepath false
```





每次本地提交代码后, 还要到jenkins上点一下构建, 这很不先进.
## 推送Jenkins自动构建
git: gogs(docker)
jenkins: blue-ocean(docker)
ide: idea



实际上就是jenkins接收gogs发出的post请求, 所以才叫"web" hook

1. jenkins安装插件gogs
2. jenkins项目配置-触发构建器选"Build when a change is pushed to Gogs"
3. 在gogs的仓库设置中配置web hook, 密码可以不设, 其他默认, 地址如下格式:
>http://10.75.76.163:8083/gogs-webhook/?job=AILog



## 别名 快捷命令

配置别名减少记忆，减少敲错。

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.ci commit
git config --global alias.br branch
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

