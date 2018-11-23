---
title: Hadoop组件运维命令
date: 2018-04-06
tags:
- hadoop

---

# Hadoop组件运维命令
## TODO
Agent在supervise的方式下启动，如果进程死掉会被系统立即重启，以提供服务。
## 简介
项目中初次使用原生的Hadoop集群，各组件不稳定，常需要各种重启命令。

## Hadoop 2.7
应该按照下文的顺序启动集群，更详细的说明请参考# HA 模式下的 [Hadoop+ZooKeeper+HBase 启动顺序](http://blog.csdn.net/u011414200/article/details/50437356)

1. ZooKeeper
<small>节点规划中，zookeeper跟journalnode放在一起，共5个节点</small>
```bash
zkServer.sh start  # QuorumPeerMain
hadoop-daemon.sh start journalnode # JournalNode
```
2. 启动NameNode
```bash
hadoop-daemon.sh start namenode
```
3. 启动DataNode
```bash
hadoop-daemon.sh start datanode  # 单个
hadoop-daemons.sh start datanode # 整个集群
```
4. 启动ResourceManager
```bash
yarn-daemon.sh start resourcemanager
```
5. 启动NodeManager
```bash
yarn-daemon.sh start nodemanager  # 单个
yarn-daemons.sh start nodemanager # 整个集群
```
6. 启动zkfc(DFSZKFailoverController) - HA两台master都要
```bash
hadoop-daemon.sh start zkfc
```
7. 启动JobHistoryServer
```bash
mr-jobhistory-daemon.sh start historyserver
```
8. 切换Active的NameNode
```bash
hdfs haadmin -failover nn2 nn1
```
9. 查看hdfs状态
```bash
hdfs haadmin -getServiceState nn1
```  
10. 切换Active的ResourceManager

由于yarn rmadmin不支持-failover命令，只能kill掉active的ResourceManager进程，待切换后再查看 
```bash
yarn rmadmin -getServiceState rm1 #查看状态 
yarn rmadmin -getServiceState rm2 #查看状态
```
nn1是namenode1，nn2是namenode2. 对应的配置文件是**hdfs-site.xml**

12. 平衡

参考文章:
[原因](https://community.hortonworks.com/articles/43615/hdfs-balancer-1-100x-performance-improvement.html#)
[参数](https://community.hortonworks.com/articles/43849/hdfs-balancer-2-configurations-cli-options.html)
[算法](https://community.hortonworks.com/articles/44148/hdfs-balancer-3-cluster-balancing-algorithm.html)
任意节点执行: dfsadmin -setBalancerBandwidth 10485760 (=10MB/s)  
该命令会在两个NameNode节点生效. 后续执行 hdfs balancer 会快很多.  
默认是每个DataNode节点是1MB/s  

生产环境点对点大约是60MB/s, 这样配置大约会占用六分之一的带宽.  
不要再设置更大了, 因为多对机器传输累积到网关的速度就很大了.

hdfs balancer命令原本设计是常驻后台进程, 所以默认参数平衡时很慢的. 适用于长期运行, 不影响业务操作. 无限期后台`hdfs balancer -idleiterations -1`
```bash
dfsadmin -setBalancerBandwidth 10485760
hdfs balancer 
```

## Hbase
1. 启动HMaster
```bash
hbase-daemon.sh start master
```
2. 启动HRegionServer
```bash
hbase-daemon.sh start regionserver  # 单个
hbase-daemons.sh start regionserver # 整个集群
```
## Hive
1. 启动Metastore
```bash
# hive --service metastore  # 关键部分  
nohup hive --service metastore > /home/hadoop/soft/hive/logs/metastore.log 2>&1 &

```
2. 启动HiveServer2
```bash
# hive --service hiveserver2  # 关键部分  
nohup hive --service hiveserver2 > /home/hadoop/soft/hive/logs/hiveserver2.log 2>&1 &

```
## presto
coordinator和worker都是一样的启动命令
```bash
/home/hadoop/soft/presto/bin/launcher start

```

## Azkaban
Azkaban工作流项目使用的是2.5.0版本，有Web和Executor两个组件
```bash
cd /home/hadoop/soft/azkaban-web-2.5.0/
nohup bin/azkaban-web-start.sh > /home/hadoop/soft/azkaban-web-2.5.0/webServer.log 2>&1 &

cd  /home/hadoop/soft/azkaban-executor-2.5.0/
nohup bin/azkaban-executor-start.sh > /home/hadoop/soft/azkaban-executor-2.5.0/executorServer.log 2>&1 &

```

## Kylin
```bash
cd /home/hadoop/soft/kylin/bin
sh kylin.sh start

```
## Hue
```bash
cd  /home/hadoop/soft/hue
nohup build/env/bin/supervisor &
```
## 杀掉yarn上的任务
```
bin/yarn application -kill <applicationId>
```

## 统计hive数据仓库表占用空间
```python
#!/usr/bin/env python  
# -*- coding: utf-8 -*-  
import re  
import os  
  
cmd = "hdfs dfs -du -s /user/hive/warehouse/dwdb.db/* > /tmp/hive_dwdb_space.txt"  
os.system(cmd)  
  
path = r"/tmp/hive_dwdb_space.txt"  
  
sum = 0  
with open(path, 'r') as f:  
    for line in f.readlines():  
        ss = re.split("\s*", line)  
        s0 = int(ss[0])  
        s1 = ss[1]  
        if "prj_" in s1:  
            sum += s0  
            print(s1)  
print("sum: %0.2f GB" % (sum * 1.0 / 1024 / 1024 / 1024))
```
## hadoop mapreduce Job Name指定任务名
### sqoop参数
>sqoop export/import -Dmapreduce.job.name="<你指定的任务名>"


## 参考
1. [Hadoop、Hbase原生脚本说明](http://xstarcd.github.io/wiki/Cloud/manual_start_hadoop_hbase.html)
2. [Hadoop+ZooKeeper+HBase 启动顺序](http://blog.csdn.net/u011414200/article/details/50437356)
3. [HBASE启动脚本/Shell解析](http://zjushch.iteye.com/blog/1736065)
4. 
