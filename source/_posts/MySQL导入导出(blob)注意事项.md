---
title: MySQL导入导出(blob)注意事项
date: 2018-07-21 17:28
tag: 
- mysql
categories:
- 运维
---
MySQL用Heidisql直接导出blob字段会出问题, 顺便记录mysqldump相关命令和注意点.
<!--more-->
# 缘起
最近在做Azkaban升级, 从2.5升到3.0, 在测试环境验证升级命令, 在迁移数据后发现启动不了Azkaban3.0. 经过艰难的debug, 发现blob字段二进制内容发生了变化. 原来我是直接用HeidiSQL直接导出到测试环境的验证库, 界面上看内容完全一样, 但是二进制内却发生了变化, 导致了GZIP格式错误, Azkaban的web工程无法启动
# mysqldump的注意事项
## 版本一致
客户端的mysqldump要跟服务器端的mysqld版本完全一致. 我的服务器端是5.7, 客户端用5.6和8.0都失败了
## hex-blob参数
网文说如果不用`--hex-blob`参数, mysqldump和MySQL workbench都还是会导致blob字段错乱.

