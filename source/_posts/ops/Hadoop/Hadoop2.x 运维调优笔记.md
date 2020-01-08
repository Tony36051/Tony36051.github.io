---
title: Hadoop2.x 运维调优笔记
date: 2018-05-02 11:39
tags: 
- Hadoop
categories:
- BigData
---

# Hadoop运维调优笔记
## yarn调配
### datanode/nodemanager系统配置
| item | value |
|--|--|
| sys | Centos7 |
| cpu | 16C（无超线程） |
| mem | 16G |
| hdd | 1000G |
### yarn和mapreduce
系统和datanode、nodemanager进程预留4C4G，yarn使用12C12G。目前测试集群30台，2台HA模式的master，28个工作节点，共计336核和336G内存
| item | value |
|--|--|
| yarn.nodemanager.resource.cpu-vcores | 12 |
| yarn.nodemanager.resource.memory-mb | 12288 |
| yarn.scheduler.minimum-allocation-vcores | 1 |
| yarn-scheduler.maximum-allocation-vcores | 8 |
| yarn.scheduler.increment-allocation-vcores | 1 |
| yarn.scheduler.minimum-allocation-mb | 1024 |
| yarn.scheduler.maximum-allocation-mb | 8192 |
| yarn.scheduler.increment-allocation-mb | 512 |
| yarn.app.mapreduce.am.resource.cpu-vcores | 1 |
| yarn.app.mapreduce.am.resource.mb | 1024 |
| mapreduce.map.cpu.vcores | 1 |
| mapreduce.map.memory.mb | 1024 |
| mapreduce.map.java.opts | -Xmx1024m |
| mapreduce.reduce.cpu.vcores | 1 |
| mapreduce.reduce.memory.mb | 1024 |
| mapreduce.reduce.java.opts | -Xmx1024m |
| mapreduce.task.io.sort.mb | 256 |
|  |  |
### 新旧参数
更多可以参考：https://hadoop.apache.org/docs/r2.7.2/hadoop-project-dist/hadoop-common/DeprecatedProperties.html
| hadoop 0.x 1.x | Hadoop 2.x |
|--|--|
| mapred.child.java.opts |  |
| mapred.map.child.java.opts | mapreduce.map.java.opts |
| mapred.reduce.child.java.opts  | mapreduce.reduce.java.opts |
| mapred.job.map.memory.mb | mapreduce.map.memory.mb |
| mapred.job.reduce.memory.mb | mapreduce.reduce.memory.mb |
|  | yarn.app.mapreduce.am.command-opts |
|  | yarn.app.mapreduce.am.resource.mb |
`*.java.opts`（java堆内存）的值应该为`-Xmx1024m`的格式，`memory.mb`的值应该为`1024`的格式。
推荐堆内存设置为容器内存的20%~25%。


## Hive
### HiveServer高可用
Ref: http://hainiubl.com/topics/19#HiveServer%E9%AB%98%E5%8F%AF%E7%94%A8
### hive开启本地模式
Ref: https://cwiki.apache.org/confluence/display/Hive/GettingStarted
>SET mapreduce.framework.name=local;
### datanode并行处理任务数
>dfs.datanode.handler.count
>一般原则是将其设置为集群大小的自然对数乘以20，即20logN，N为集群大小
## FAQ
1. 修改配置文件后要分发所有主机吗？**要**
2. 分发新的配置文件后，要重启集群吗？
A：如果是作业参数（mapreduce等），无需重启；如果是系统参数，如端口号等，需要重启。

## 草稿
1. mapred.child.java.opts
如果您看到正在使用swap，请减少分配给每个任务的RAM数量`mapred.child.java.opts`
2. 使用LZO压缩
mapred.compress.map.output
3. 

## TODO
1. 启用yarn日志聚集功能，tracking UI
2. 


## 参考链接
1. 默认参数：https://hadoop.apache.org/docs/r2.7.3/hadoop-mapreduce-client/hadoop-mapreduce-client-core/mapred-default.xml
2. [Hadoop参数调整](https://github.com/mattshma/bigdata/blob/master/hadoop/hdfs/tune.md)
3. [内存：Yarn-Mapreduce参数调整](https://my.oschina.net/dailidong/blog/675633)
