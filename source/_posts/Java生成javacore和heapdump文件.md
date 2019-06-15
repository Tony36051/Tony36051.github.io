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

- javacore是java应用程序在某个时间点的**线程转储文件**，通常也称为**Thead Dump**，是个文本文档
- 记录了整个JVM的运行情况(线程, 垃圾回收, JVM运行参数, 内存地址等信息)
### 用途
诊断程序问题,其中比较典型的包括线程阻塞, CPU使用率过高, JVM Crash, 堆内存不足和类装载等问题

### 命名
通常以txt方式结尾,名称格式主要是以javacore开头, **加上日期,产生的时间,当时的线程编号**,如javacore.20100719.003424.299228.txt(**Unix**)

### 生成方式

- 手动生成
	- jstack： jstack -l 37320 > /tmp/threadDump.txt
	- jcmd：jcmd 3426 Thread.print > /tmp/$HOSTNAME-threadDump.txt
	- JVisualVM：图形化工具
	- Java Mission Control：oracle jdk自带图形化工具
	- 

-   发送中断signal  
    AIX和Linux: SIGQUIT,  **kill -3 PID**  
    Windows: Ctrl+Break, DrAdmin in WAS(未验证过)
    
- 系统在异常时自动throw(**程序不一定退出**)  
    严重的本地调用出错  
    内存不足(例如 OutOfMemory)
### 策略分析

-   数百K的纯文本,最好借助工具,例如`jca`分析工具
-   **采集连续的多个时间点的javacore,方便对比(手动)**  
    一般的线程执行都会非常快，如果出现某个资源的阻塞，在短时间内的两个javacore，该线程的堆栈会变化不大。 或多次javacore的线程都集中在等待某些资源。
-   了解app的性质,基本处理流程
-   app相关的处理能力(以前的数据,用于对比)
-   问题出现时,多了解周边情况(cpu,io,外围),记录现状
-   **对thread状态进行分类,业务分布情况,资源等待情况(细化)**
-   如有必要,获取heapdump分析(oom)

## 什么是Heap Dump
HeapDump文件是一个二进制文件，它保存了某一时刻JVM堆中对象使用情况，这种文件需要相应的工具进行分析，如IBM Heap Analyzer这类工具。这类文件最重要的作用就是分析系统中是否存在内存溢出的情况。
Heap Dump的格式有很多种，而且不同的格式包含的信息也可能不一样。但总的来说，Heap Dump一般都包含了一个堆中的Java Objects, Class等基本信息。同时，当你在执行一个转储操作时，往往会**触发一次GC**，所以你转储得到的文件里包含的信息通常是有效的内容（包含比较少，或没有垃圾对象了） 。

  ### 生成方式
```bash
# dump live会触发full gc；all就没gc，线上系统慎用
jmap -dump:live,format=b,file=/tmp/heap.hprof <pid>
```
```bash

jcmd <pid> GC.heap_dump /tmp/heap.hprof # 触发full gc
jcmd 100373 GC.heap_dump /tmp/$HOSTNAME-heap.hprof # 回触发full gc
```
- JVM参数 -XX:+HeapDumpOnOutOfMemoryError  当OutOfMemoryError发生时自动生成 Heap Dump 文件。
- jvisualvm
- JProfile
- Eclipse memory analyzer（jmat）
  
  
### 分析工具
IBM HeapAnalyzer
<!--stackedit_data:
eyJoaXN0b3J5IjpbOTk5MzQ0NzAwLDY2MjUxNTc5LC01MDY0Mj
UxMzMsLTM5MjA5NDcwNywtMTgzMDcyMjUwNyw5NjY4NzgxMzQs
MTI0NTQ4MTYzMywzOTAzNzExNjNdfQ==
-->