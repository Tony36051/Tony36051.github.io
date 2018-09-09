---
title: Anaconda入坑
date: 2018-07-22
categories:
- AI
---
工作之余, 还是对AI/数据分析念念不忘, 先磨一磨刀, 然后就可以收工了. (*/ω＼*)
<!--more-->
# 代理与配置
you need to create a  **.condarc**  file in you Windows user area:
>C:\Users\<username>\.condarc
```
channels:
#  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
#  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
  - defaults

# Show channel URLs when displaying what is going to be downloaded and
# in 'conda list'. The default is False.
show_channel_urls: True
allow_other_channels: True

proxy_servers:
    http: http://domain\username:password@corp.com:8080
    https: http://domain\username:password@corp.com:8080
ssl_verify: False
```

