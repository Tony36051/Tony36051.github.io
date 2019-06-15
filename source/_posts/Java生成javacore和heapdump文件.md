---
title: Java生成javacore和heapdump文件
date: 2019-06-15
tag: 
- java
categories:
- 运维
---
现网有服务量大的服务，一次OOM后只留下了javacore文件，heapdump没有生成，这次去另一台一样职责的机器上检查取一下javacore和heap dump文件。
<!--more-->
## 什么是javacore

-   javacore是java应用程序在某个时间点的**线程转储文件**，通常也称为**Thead Dump**
-   记录了整个JVM的运行情况(线程, 垃圾回收, JVM运行参数, 内存地址等信息)
-   用来诊断程序问题,其中比较典型的包括线程阻塞, CPU使用率过高, JVM Crash, 堆内存不足和类装载等问题
- 命名：通常以txt方式结尾,名称格式主要是以javacore开头, **加上日期,产生的时间,当时的线程编号**,如javacore.20100719.003424.299228.txt(**Unix**)
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTEyODM4ODcyXX0=
-->