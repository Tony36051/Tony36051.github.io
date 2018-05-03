---
title: hadoop工作台构建(hadoop圈应用独立部署)
date: 2018-05-03 
tags:
- hadoop

---
之前hadoop圈的应用（如hive、sqoop、azkaban等）都在master节点部署，一次性多个应用同时启动，耗尽内存后Linux随机删掉进程，影响集群和应用的稳定性。
<!--more-->
# 整体说明
解决思路是在联通的网络环境下，取一台单独的服务器，不作为集群一部分，仅部署各种应用，应用使用jvm控制内存，更进一步使用独立用户搭配cgroup控制资源的使用，维持整体稳定。这台单独的服务器下称为“工作台”。
## JDK1.8
```bash
mkdir -p /home/hadoop/soft
cd /home/hadoop/soft
# mv jdk.tar.gz
tar -zvxf jdk-8u151-linux-x64.tar.gz
mv jdk1.8.0_151 jdk
sudo vim /etc/profile
export JAVA_HOME=/home/hadoop/soft/jdk
export JRE_HOME=$JAVA_HOME/jre
export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH
export CLASSPATH=$JAVA_HOME/lib:$CLASSPATH
export PATH

source /etc/profile
```
## hadoop
hadoop圈的应用大都需要引用hdfs、yarn、mapreduce相关jar包才能启动，所以首先要在工作台上配置hadoop，使其能够访问集群的hdfs文件系统，能提交mapreduce任务。


### 解压、环境变量
```bash
tar -zxvf hadoop-2.7.2.tar.gz
mv hadoop-2.7.2 hadoop
sudo vim /etc/profile
#Hadoop&YARN
export HADOOP_DEV_HOME=/home/hadoop/soft/hadoop
export PATH=$PATH:$HADOOP_DEV_HOME/bin
export PATH=$PATH:$HADOOP_DEV_HOME/sbin
export HADOOP_MAPARED_HOME=${HADOOP_DEV_HOME}
export HADOOP_COMMON_HOME=${HADOOP_DEV_HOME}
export HADOOP_HDFS_HOME=${HADOOP_DEV_HOME}
export YARN_HOME=${HADOOP_DEV_HOME}
export HADOOP_CONF_DIR=${HADOOP_DEV_HOME}/etc/hadoop
source /etc/profile
```
### 目录
```bash
mkdir -p /data01/huawei/BigData/jntmp/journal
mkdir -p /data01/huawei/BigData/hadoop/name
mkdir -p /data01/huawei/BigData/hadoop/data
sudo chown -R hadoop:root /data01

```
### core-site.xml

```xml
<configuration>
<property>
    <name>fs.defaultFS</name>
    <value>hdfs://ns1</value>
</property>
<property>
    <name>hadoop.tmp.dir</name>
    <value>/home/hadoop/soft/hadoop/tmp</value>
</property>
</configuration>
```
### hdfs-site.xml
dfs.client.failover.proxy.provider.ns1这一项一定要配置，ns1要跟core-site.xml和dfs.nameservices对应
```xml
<configuration>
    <property>
        <name>dfs.nameservices</name>
        <value>ns1</value>
    </property>
    <property>
        <name>dfs.ha.namenodes.ns1</name>
        <value>nn1,nn2</value>
    </property>
    <property>
        <name>dfs.namenode.rpc-address.ns1.nn1</name>
        <value>10.41.236.209:9000</value>
    </property>
    <property>
        <name>dfs.namenode.rpc-address.ns1.nn2</name>
        <value>10.41.236.115:9000</value>
    </property>
    <property>
        <name>dfs.client.failover.proxy.provider.ns1</name>
        <value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
    </property>
</configuration>
```
