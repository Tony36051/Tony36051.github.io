---
title: hadoop圈应用的配置文件路径
date: 2018-05-28
tags:
- hadoop
categories:
- BigData
---
hadoop圈有多个应用（如hive、sqoop、azkaban等），每个应用有一个或多个配置文件，简单记录一下应用、配置，路径的关系。
<!--more-->
# 环境变量
>/home/hadoop/.bash_profile

建议改为
>/home/hadoop/.bashrc

# zookeeper
配置文件：/home/hadoop/soft/zookeeper/conf/zoo.cfg
每个实例都有自己独特的id：/home/hadoop/soft/zookeeper/data/myid

# hdfs
配置路径：`/home/hadoop/soft/hadoop/etc/hadoop`

| 文件名 | 作用 |
|--|--|
| core-site.xml | zk、文件系统根目录、临时文件 |
| `hadoop-env.sh` | JAVA_HOME
| hdfs-site.xml | 核心配置，HA，端口，journal，nn、dn、jn目录等
| slaves | 所有从节点的ip/hostname, 只写DataNode和NodeManager
| `httpfs-env.sh` | cdh的httpfs(未启用) |
| httpfs-site.xml | cdh的httpfs(未启用) |


# yarn(mapreduce)
配置路径：`/home/hadoop/soft/hadoop/etc/hadoop`

| 文件名 | 作用 |
| -- | -- |
| slaves | 所有从节点的ip(hostname),一般只写DataNode和NodeManager |
| yarn-site.xml | 核心配置，HA，zk，cpu、mem资源，日志聚集，端口 |
| mapred-site.xml | mapreduce的默认配置 |
| `mapred-env.sh` | 未配置 |
| `yarn-env.sh` | 未配置 |

# hbase
配置文件路径：/home/hadoop/soft/hbase/conf

| 文件名 | 作用 |
|--|--|
| `hbase-env.sh` | JAVA_HOME,HADOOP_HOME |
| hbase-site | 文件系统根目录，zk，临时文件，端口 |
| regionservers | 从节点的ip/hostname |
| hdfs-site.xml | 不需要的文件，如果配置了HADOOP_HOME |


# hive
配置目录：/home/hadoop/soft/hive/conf/，正常来说该目录下不需要`hdfs-site.xml`和`spark-defaults.conf`文件。hive会通过`HADOOP_HOME`和`SPARK_HOME`找到配置文件。
如果实在没有生效，建立软连接到hive的配置目录。
```
/home/hadoop/soft/hive/conf/hive-env.sh
/home/hadoop/soft/hive/conf/hive-site.xml
```

# spark
配置文件路径：/home/hadoop/soft/spark/conf

| 文件名 | 作用 |
|--|--|
| slaves | 计算从节点的ip/hostname |
| `spark-env.sh` | 环境变量，JAVA_HOME、SCALA_HOME，HADOOP_HOME，ip，端口，目录，内存 |
| spark-defaults.conf | 运行方式，jars，executor，并行度等配置 | 

# presto
配置文件目录：/home/hadoop/soft/presto/etc

| 文件名 | 作用 |
|--|--|
| config.properties | 是否为coordinator，端口，内存使用，uri |
| jvm.config | jvm参数 |
| node.properties | 数据目录 |

# azkaban
## azkaban-executor
>/home/hadoop/soft/azkaban-executor-2.5.0/conf/azkaban.properties
## azkaban-web
>/home/hadoop/soft/azkaban-web-2.5.0/conf/azkaban.properties

# kylin
配置目录：/home/hadoop/soft/kylin/conf

| 文件名 | 作用 |
|--|--|
| kylin_hive_conf.xml | 操作hive时的参数，是否压缩等（使用默认） |
| kylin_job_conf_inmem.xml | job使用内存的分配，mapreduce使用多少内存 |
| kylin_job_conf.xml | 使用默认 |
| kylin.properties | uri，hdfs，hive，hbase |

# hue
>/home/hadoop/soft/hue/desktop/conf/hue.ini

# MySQL
>/home/hadoop/soft/mysql/my.cnf

# sqoop
>/home/hadoop/soft/sqoop/conf/sqoop-site.xml

