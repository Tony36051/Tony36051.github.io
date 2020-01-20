---
title: python3与Anaconda环境管理
date: 2018-09-19 22:27:36
tags: 
- python
- Robot Framework
category:
- 测试
typora-root-url: python3与Anaconda环境管理
---

python安装和环境管理 on windows
<!--more-->

# 下载

## python2 vs python3

时至今日, 除非维护python2代码, 不再建议使用python2开始新项目. 

python3没有烦人的字符串编码问题, 这个理由已经足够了.

## 32位 vs 64位

我建议32位即可, 64位需要的内存较多, 适合硬件内存很大, 数据量很大的运算. 

另一方面因为不少偏门的第三方库并没有编译64位的链接库, 用32位能遇到更少的兼容性问题.

## 安装路径

本文环境在windows下, 建议无论安装什么软件都不要在路径上留有空格和中文, 因为总有一些偏门的库并没有考虑空格或中文字符, 导致加载库或引用文件时候报错.



# 环境管理

有些时候, 需要在同一台机器上维护python2的代码, 同时又要切换到python3开发新项目代码.

## Anaconda

如需要进行机器学习, 数据科学的学习, 建议使用Anaconda. 虽然Anaconda的安装包不小, 但里面包含的工具也较为丰富, 还有图形界面可以操作.

## 下载安装

清华的源: https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/

Anaconda3对应python3, 选择exe的安装版本. Anaconda自带python, 所以这里选择版本跟上文一样. 由此一来, 都不用自己手动安装python了.

安装过程中, 如果选择仅安装给个人使用, 推荐用默认路径; 如果要安装在D盘, 建议选择安装给所有人使用.

## 包管理改国内源

```text
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --set show_channel_urls yes
```

或者修改配置文件

> C:\Users\<username>\.condarc

```ini
channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
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



### 命令

#### 增删查改环境

conda create -n rf python=3.6  创建名为rf 的环境, 版本为python3.6

conda info -e  命令查看已有的环境

conda remove -n env_name --all来删除指定的环境（如果不添--all参数，而是指明某个库名，则是删除该库）

conda create --name new_env_name --clone old_env_name 复制一个环境

![命令示例](commands.png)

#### 包管理

activate rf   进入某个环境(rf), 可以看到提示符最左侧已经变化

deactivate 退出环境

conda list 当前环境所有包

conda install -n rf robotframework   在rf环境中安装robotframework包

pip install robotframework   在activate激活rf环境后, 也可以直接使用pip命令

#### 导入导出分享

activate target_env  切换到目标环境

conda env export > environment.yml 导出成为yml文件

conda env create -f environment.yml 导入yml





