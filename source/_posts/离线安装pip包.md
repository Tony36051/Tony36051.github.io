---
title: 离线安装pip包
date: 2018-03-21 10:58
tags:
- 离线安装

---
# 离线安装pip包
## pip安装
暂略

## 下载包而不安装
该命令会下载whl包，包括被依赖的包
>pip install <包名> -d <目录> 或 pip install -d <目录> -r requirements.txt
>pip install oauthlib -d .\oauthlib

## 安装全部包
>pip install *.whl
