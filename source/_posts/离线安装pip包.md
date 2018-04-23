---
title: 内网使用pip
date: 2018-03-21 10:58
tags:
- pip

---
# 离线安装pip包
## pip安装
暂略

## 下载包而不安装
该命令会下载whl包，包括被依赖的包
>pip install <包名> -d <目录> 或 pip install -d <目录> -r requirements.txt
>pip install oauthlib -d .\oauthlib
>新版pip： pip download -d DIR somepackage

## 安装全部包
>pip install --no-index --find-links=DIR -r requirements.txt

# 内网使用
windows环境下，建立全局配置文件C:\ProgramData\pip\pip.ini
```
[global]
timeout = 3
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
proxy = http://username:password@proxy.example.com:port
```
不知为啥，就算配置上trust-host、证书，在我司内网环境下用pypi的源依旧会报证书验证错误`SSL3_GET_SERVER_CERTIFICATE`。
