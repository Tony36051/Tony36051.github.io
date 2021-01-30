---
title: 远程控制内网设备
date: 2021-01-30
---
家庭的路由器是刷的是openwrt，电视盒子刷的armbian，有时候想知道断网了没，内网的网络状态怎么样。这时候需要内网穿透，frp和zerotier都是使用目标，写个小东西做frpc的更新，上报一下在线状态。因为同时管理父母家里、老丈人家里、家乡等多个网络。因为之前做过一个命令推送的小项目，复用一下，用Golang先实现客户端，服务器端用Java的Netty框架，用protobuf协议。
<!--more-->

# 功能描述

1. 启动时获取静态配置
2. 上报存活状态
3. 接收命令执行
4. 动态升级

# 概要设计

## 配置获取
时间：每分钟更新一次
配置格式：json
数据站点：https://gitee.com/Tony36051/nat-controll/raw/master/conf.json
动态reload到内存

## 上报存活状态
时间：一分钟上报一次
上报内容：
1. 主机名，hostname
2. 内网ip，intranetIp
3. 公网ip，publicIp
4. 自定义名称，nickname
5. 上报时间，reportTime
6. 执行用户，runUser。判断命令可执行范围
7. 二进制版本，version
服务器端回复：
1. 机器id：nickname_hostname

## 命令推送
时机：服务端推送
客户端收到后，返回ack。
下发内容：
1. 命令id，Long型
2. 命令内容
3. 机器id

## 命令执行
时机：客户端收到命令后，立刻执行
客户端将命令原样进行系统调用，同步获取输出流和错误流，上报给服务器。
超时：无超时机制，如果一直在执行，则无返回。
阻塞：不阻塞，来一个命令开一个routine执行。必要时候接受reboot命令

## 命令回执
时机：命令执行完成后
上报内容：
1. 命令id
2. 机器id
3. 输出流
4. 错误流

## OTA
时机：命令推送或静态配置文件发现版本可更新
升级：启动升级程序，下载新版程序，停止&删掉老程序，覆盖老程序，启动
上报：升级结果、自检结果

# 接口设计

## 上报接口
POST /mc/online
{
    "hostname": "armbian",
    "intranetIp": "192.168.1.254",
    "publicIp": "100.100.123.123",
    "nickname": "hometown",
    "reportTime": "2021-01-30 16:35:02",
    "runUser": "root",
    "version": "v20210130.1"
}
{
    "machineId": "hometown_armbian"
}

## 命令下发
POST /mc/cmd
{
    "cmd": "date",
    "machineId": "hometown_armbian"
}
{
    "recvTime": "2021-01-30 16:35:02",
    "machineId": "hometown_armbian",
    "cmdId": 123456789
}

## 命令结果收集
PUT /mc/cmd
{
    "cmdId": 123456789,
    "output": "xxxxxxxxxxxxxxxxxx",
    "error": "yyyyyyyyyyyyyyyyy",
    "durationInSec": "10"
}

