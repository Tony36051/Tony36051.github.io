---
title: Hadoop3.x on Windows10
date: 2022-03-16 23:40
tag: 
- Hadoop
categories:
- BigData
---
# Hadoop3.3 on Windows10

## 简介

在windows系统上进行hadoop相关开发，不需要高可用，仅用作开发调试还是很方便的。

## 环境
hadoop: [3.3.2](https://www.apache.org/dyn/closer.cgi/hadoop/common/hadoop-3.2.2/hadoop-3.2.2.tar.gz)
jdk: 1.8
winutils 3.3.x: https://github.com/kontext-tech/winutils/tree/master/hadoop-3.3.1

实测3.3.1的winutils可以适配3.3.2的hadoop版本。本机3.2.2hadoop在启动datanode时会失败。

## 安装和配置步骤

下载解压hadoop，假设解压到`D:\ProgramData\hadoop-3.3.2`
下载对应版本的`winutils.exe`和`hadoop.dll`复制到`D:\ProgramData\hadoop-3.3.2\bin`


1. JAVA_HOME,如果你的java安装路径是含有"Program Files", 使用"Progra~1"代替"Program Files"，或使用"Progra~2" 代替 "Program Files(x86)"
2. HADOOP_HOME
3. PATH变量加入%JAVA_HOME%\bin;%HADOOP_HOME%\bin;%HADOOP_HOME%\sbin;
4. 检查： 新开cmd窗口，输入`hadoop -version`
5. 配置%HADOOP_HOME%\etc\hadoop\hdfs-site.xml
6. 配置%HADOOP_HOME%\etc\hadoop\core-site.xml
7. 配置%HADOOP_HOME%\etc\hadoop\mapred-site.xml
8. 配置%HADOOP_HOME%\etc\hadoop\yarn-site.xml
```xml
<!-- hdfs-site.xml -->
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>1</value>
    </property>
  <property>
    <name>dfs.namenode.name.dir</name>
    <value>file:///D:/ProgramData/hadoop-3.3.2/data/dfs/namenode</value>
  </property>
  <property>
    <name>dfs.datanode.data.dir</name>
    <value>file:///D:/ProgramData/hadoop-3.3.2/data/dfs/datanode</value>
  </property>
  <property>
    <name>dfs.permissions</name>
    <value>false</value>
  </property>
</configuration>
```
```xml
<!-- core-site.xml -->
<configuration>
  <property>
    <name>fs.default.name</name>
    <value>hdfs://localhost:9820</value>
  </property>
</configuration>
```
```xml
<!-- mapred-site.xml -->
<configuration>
  <property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value>
    <description>MapReduce framework name</description>
  </property>
</configuration>
```
```xml
<!-- yarn-site.xml -->
<configuration>
  <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle</value>
    <description>Yarn Node Manager Aux Service</description>
  </property>
</configuration>
```

试验：
>hadoop version

## 启动HDFS

第一次使用需要`hdfs namenode -format`

启动:
>start-dfs.cmd

停止:
>stop-dfs.cmd

访问：
>http://localhost:9870/