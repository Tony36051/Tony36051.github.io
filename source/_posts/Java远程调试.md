---
title: Java远程调试
date: 2018-07-21 20:06
tag: 
- java
---
迁移升级Azkaban时候发现根据文档升级总是报错, 抛出的错误只有sql错误, 没有更具体的错误, 此时只能祭出远程调试大法了.
<!--more-->
# 相关软件环境说明
IDE: IDEA 201702 社区版
调试对象: azkaban-web-server-3.0.0
# 方法说明
1. IDEA打开工程对应的源代码
2. 右上角打开"Run/Debug Configurations"
3. 绿色+号, 选择Remote远程
4. Name随便填写, Settings中, 填写Host和Port
5. 将"Command line arguments for running remote JVM"的JVM参数添加到远程服务器的启动命令中
其中, `suspend=y`代表进程等待IDEA连上JVM再启动进程, 方便调试一闪即逝的启动错误.
6. IDEA的源代码中打断点
7. 启动远端java进程
8. 点击IDEA的debug按钮
# 额外说明
1. 有时候竟然没有断点在源代码中, 只能对着源代码单步调试了T_T
2. 如果要进入第三方包, 也可以在File-Project Structure-Modules-绿色加号-Library添加源代码的jar包, 打断点, 或者单步步进相关函数
