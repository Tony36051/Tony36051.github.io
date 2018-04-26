---
title: hive on spark 安装配置
date: 2018-03-27 21:27
tag: 
- hadoop 
- spark
---
# hive on spark 安装配置
## 简介
网上的教程都说spark官网预编译的二进制文件含有hive部分，不能直接使用，需源码编译，包括hive的wiki也提及需要不含hive的jars。经过实践也可以通过剔除hive相关包，使用预编译的spark包完成hive-on-spark的部署。

## 环境
hadoop: 2.7.3
hive: 2.3.2
spark: 2.2.0
6个节点，4个nodemanager
hive 的wiki说只有对应的版本能保证兼容性，不是完全兼容也可以的。只是不知道有无隐患。

## yarn配置
修改之后需要分发集群并重启
```bash
vim /home/hadoop/soft/hadoop/etc/hadoop/yarn-site.xml
<property>
  <name>yarn.resourcemanager.scheduler.class</name>
  <value>org.apache.hadoop.yarn.server.resourcemanager.scheduler.fair.FairScheduler</value>
</property>
```
## hdfs准备路径和jar包
### 新建spark-log目录
>hdfs dfs -mkdir -p hdfs://ns1/spark/spark-log
### 上传jar包
#### 建目录
>hdfs dfs -mkdir -p hdfs://ns1/spark/jars
#### 准备jar包
>jar cv0f spark-libs.jar -C $SPARK_HOME/jars/ .
#### 上传jar包到hdfs
>hdfs dfs -put spark-libs.jar hdfs://ns1/spark/jars/

## spark
配置`spark-env.sh`、`slaves`和`spark-defaults.conf`三个文件
`spark-env.sh`
```bash
export SPARK_MASTER_WEBUI_PORT=8081
export SCALA_HOME=/home/hadoop/soft/scala-2.11.8
export JAVA_HOME=/home/hadoop/soft/jdk1.8.0_151
export HADOOP_HOME=/home/hadoop/soft/hadoop-2.7.2
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
SPARK_MASTER_IP=hd1
SPARK_LOCAL_DIRS=/home/hadoop/soft/spark-2.2.0-bin-hadoop2.7
SPARK_DRIVER_MEMORY=1G
```
`slaves` 每行一个hostname或ip
```
hd2
hd4
hd5
hd6
hd7
```
`spark-defaults.conf`
```bash
spark.master                     yarn-cluster
spark.home                       /home/hadoop/soft/spark-2.2.0-bin-hadoop2.7
spark.eventLog.enabled           true
spark.eventLog.dir               hdfs://ns1/spark/spark-log
spark.serializer                 org.apache.spark.serializer.KryoSerializer
spark.executor.cores             5
spark.executor.memory            6400m
spark.executor.instances         50
spark.default.parallelism        100
spark.yarn.executor.memoryOverhead  1280m
spark.driver.memory              4g
spark.executor.extraJavaOptions  -XX:+PrintGCDetails -Dkey=value -Dnumbers="one two three"
spark.yarn.jars                  hdfs://ns1/spark/jars/*.jar
```
### 验证spark
>./bin/spark-submit --class org.apache.spark.examples.SparkPi --master yarn-client ./examples/jars/spark-examples_2.11-2.2.0.jar 10
## hive
### 添加必要的依赖库
```bash
ln -s /home/hadoop/soft/spark-2.2.0-bin-hadoop2.7/jars/scala-library-2.11.8.jar /home/hadoop/soft/apache-hive-2.3.2-bin/lib/
ln -s /home/hadoop/soft/spark-2.2.0-bin-hadoop2.7/jars/spark-network-common_2.11-2.2.0.jar /home/hadoop/soft/apache-hive-2.3.2-bin/lib/
ln -s /home/hadoop/soft/spark-2.2.0-bin-hadoop2.7/jars/spark-core_2.11-2.2.0.jar /home/hadoop/soft/apache-hive-2.3.2-bin/lib/
```
### 剔除spark中hive的库
>mv spark-2.2.0-bin-hadoop2.7/jars/hive*.jar spark-2.2.0-bin-hadoop2.7/
### 启用spark引擎
1. 在命令行交互（进入hive之后）`set hive.execution.engine=spark;`
2. 配置hive.site.xml文件，配置
```xml
<property>
    <name>hive.execution.engine</name>
    <value>spark</value>
    <description>
      Expects one of [mr, tez, spark].
      Chooses execution engine. Options are: mr (Map reduce, default), tez, spark. While MR
      remains the default engine for historical reasons, it is itself a historical engine
      and is deprecated in Hive 2 line. It may be removed without further warning.
    </description>
  </property>
```
### 验证hive on spark
-   命令行输入 hive，进入hive CLI
-   set hive.execution.engine=spark; (将执行引擎设为Spark，默认是mr，退出hive CLI后，回到默认设置。若想让引擎默认为Spark，需要在hive-site.xml里设置）
-   create table test(ts BIGINT,line STRING); (创建表）
-   select count(*) from test;
-   若整个过程没有报错，并出现正确结果，则Hive on Spark配置成功。

## 优化
因为在yarn上执行，拷贝spark的jars到hdfs上能避免每次拷贝。
如果仅是在hive中使用spark，可以在hive-site.xml中配置
```xml
<property>
  <name>spark.yarn.jars</name>
  <value>hdfs://ns1/spark-jars/jars/*</value>
</property>
```
**其他**
1. [hive的wiki](https://cwiki.apache.org/confluence/display/Hive/Hive+on+Spark:+Getting+Started#HiveonSpark:GettingStarted-Configurationpropertydetails)
2. [Cloudera的翻译](http://cwiki.apachecn.org/pages/viewpage.action?pageId=2888665)
