---
title: Hadoop组件运维命令
date: 2018-03-20
tags:
- hadoop

---

# Hadoop组件运维命令
## 简介
项目中初次使用原生的Hadoop集群，各组件不稳定，常需要各种重启命令。

## Hadoop 2.7
应该按照下文的顺序启动集群，更详细的说明请参考# HA 模式下的 [Hadoop+ZooKeeper+HBase 启动顺序](http://blog.csdn.net/u011414200/article/details/50437356)

1. ZooKeeper
<small>节点规划中，zookeeper跟journalnode放在一起，共5个节点</small>
```bash
zkServer.sh start  # QuorumPeerMain
hadoop-daemon.sh start journalnode
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
9. 切换Active的ResourceManager
由于yarn rmadmin不支持-failover命令，只能kill掉active的ResourceManager进程，待切换后再查看 
```bash
yarn rmadmin -getServiceState rm1 #查看状态 
yarn rmadmin -getServiceState rm2 #查看状态
```
nn1是namenode1，nn2是namenode2. 对应的配置文件是**hdfs-site.xml**
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
nohup hive --service hiveserver2  > /home/hadoop/soft/hive/logs/hiveserver2  .log 2>&1 &
```
## presto
coordinator和worker都是一样的启动命令
```bash
/home/hadoop/soft/presto/bin/launcher start
```

## 参考
1. [Hadoop、Hbase原生脚本说明](http://xstarcd.github.io/wiki/Cloud/manual_start_hadoop_hbase.html)
2. [Hadoop+ZooKeeper+HBase 启动顺序](http://blog.csdn.net/u011414200/article/details/50437356)
3. [HBASE启动脚本/Shell解析](http://zjushch.iteye.com/blog/1736065)
4. 
