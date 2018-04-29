---
title: Hadoop配置文件研读
date: 2018-04-26
tags:
- hadoop

---
团队下来一个任务，要求我研究hadoop的三个基本配置文件core-site.xml,hdfs-site.xml,mapred-site.xml。以下为研读笔记
<!--more-->
# 默认配置
浏览apache官网，依葫芦画瓢可以找到其他版本，举例如下:
https://hadoop.apache.org/docs/r2.7.2/hadoop-project-dist/hadoop-common/core-default.xml
https://hadoop.apache.org/docs/r2.7.2/hadoop-project-dist/hadoop-hdfs/hdfs-default.xml
https://hadoop.apache.org/docs/r2.7.2/hadoop-mapreduce-client/hadoop-mapreduce-client-core/mapred-default.xml

## core-site.xml
hadoop.tmp.dir，临时目录，存放临时编译的jar包的解压后的class文件，临时文件。容量不足时，将导致无法传递jar包而至任务失败
hadoop.native.lib，本地库，压缩和解压时候用到
io.native.lib.available=true,本地库可以加快基本操作，例如IO，压缩等。
hadoop.http.filter.initializers，  `hadoop.security.*`安全类配置，不启用
`hadoop.logfile.*`日志文件大小和数量，默认即可
**dfs.ha.fencing.methods**，HDFS的HA功能的防脑裂方法。可以是内建的方法(例如shell和sshfence)或者用户定义的方法。_建议使用sshfence(hadoop:9922)，括号内的是用户名和端口，注意，这需要NN的2台机器之间能够免密码登陆_
**fs.defaultFS**，HA方式，这里设置服务名，例如：hdfs://ns1，hdfs的客户端访问hdfs需要此参数
**io.file.buffer.size**，在读写文件时使用的缓存大小。这个大小应该是内存Page的倍数，比如1m，默认值4m
io.compression.codecs，压缩和解压缩方式，对于冷数据可以考虑压缩存储减少空间，压缩和解压都是全自动的，在挑选方式时会有可否划分等差异
fs.trash.interval，回收周期内，文件先移动到垃圾桶，不会真实删除，建议开启，建议4320（3天）
fs.file.impl，选择使用的文件系统。本地、hdfs、s3、hftp等等`fs.*.impl`   
`fs.checkpoint.*`namenode的快照的时间间隔和目录等，默认即可
io.serializations，序列化，默认WritableSerialization即可
`io.seqfile.*`和`io.mapfile.*`对于小文件的优化形式，小文件慢的话要开启优化这个
io.seqfile.compress.blocksize=1000000，SequenceFiles以块压缩方式压缩时，块大小大于此值时才启动压缩。
`ipc.*`进程间通信，超时和队列的配置在此
`hadoop.rpc.socket.*`rpc的socket配置，默认即可
**webinterface.private.actions**，web交互行为，可以设置这个参数实际上就是为了方便测试用。允许在web 页面上对任务设置优先级以及kill 任务。需要注意的是，kill 任务是个缓慢的过程，它需要杀掉所有的任务task 然后才是任务结束。如果task数量多，可能有点慢，需要一些耐心等待。
`topology.*`机架相关，我们全云化机器，没法配机架
fs.AbstractFileSystem.viewfs.impl=org.apache.hadoop.fs.viewfs.ViewFs，
在实现federation联邦特性时，客户端可以部署此系统，方便同时访问多个nameservice
## hdfs-default.html
| 配置项 | 端口 | 说明 |
|--|--|--|
| dfs.http.address | 50070 | namenode情况 |
| dfs.secondary.http.address | 50090 | secondaryNameNode情况，_使用了HA后，就不再使用SNN了_ |
| dfs.datanode.address | 50010 | TCP管理服务 |
| dfs.datanode.http.address | 50075 | HTTP访问 |
| dfs.datanode.ipc.address | 50020 | IPC服务 |
| dfs.datanode.https.address | 50475 | https访问 |
| dfs.https.address | 50470 | https访问 |
| dfs.journalnode.rpc-address | 8485 | JournalNode RPC服务地址和端口 |
| dfs.journalnode.http-address | 8480 | JournalNode的HTTP地址和端口。端口设置为0表示随机选择 |
| dfs.namenode.backup.address | 50100 | NN的BK节点地址和端口，_使用HA，就不需要关注此选项了。建议不使用BK节点_ |
| dfs.namenode.backup.http-address | 50105 | _使用HA，就不需要关注此选项了。建议不使用BK节点_ |
| mapreduce.jobhistory.address | 10020 | MapReduce JobHistory Server地址 |
| mapreduce.jobhistory.webapp.address | 19888 | MapReduce JobHistory Server Web UI地址 |
|  |  |  |
|  |  |  |
|  |  |  |

dfs.datanode.handler.count，datanode服务连接数，集群配置强悍则需要调高
dfs.namenode.handler.count=10，nn服务连接数，集群强悍可提高
dfs.https.enable，https，不开启。`dfs.https.*`相关配置
`dfs.datanode.dns.*`datanode向namenode注册时候，可以用dns，我们不用
dfs.namenode.safemode.threshold-pct=0.999f，副本不足将导致安全模式
**dfs.datanode.balance.bandwidthPerSec**数据平衡时，最大使用带宽，默认1M，建议改大到10M
<large>**dfs.namenode.support.allow.format=true**，NN是否允许被格式化，生产环境务必要改为FALSE！！！<large>
dfs.nameservices，federation,NN联邦时候需要配置多个，否则一个即可
dfs.namenode.audit.loggers，审查日志的实现类列表，能够接收audit事件。默认已开启，但**未知怎么使用**
dfs.namenode.logging.level=info，DFS的NN的日志等级。值可以是：info，dir(跟踪命名空间变动)，"block" (跟踪块的创建删除，replication变动)，或者"all".
dfs.namenode.replication.considerLoad=true，设定在选择存放目标时是否考虑负载。需要，保持默认即可
dfs.namenode.fs-limits.max-component-length=0，路径中每个部分的最大字节长度（目录名，文件名的长度）。0表示不检查长度。_长文件名影响性能_
dfs.namenode.fs-limits.max-directory-items=0，目录下文件数上限
dfs.namenode.fs-limits.min-block-size=1048576，最小block，字节，严重影响性能
dfs.namenode.fs-limits.max-blocks-per-file=1048576，防止超大文件
`dfs.image.transfer.*`HA模式使用不到，不关注
dfs.datanode.drop.cache.behind.reads/writes=FALSE，大且不可重复数据，如Hbase随机读写数据，扔掉缓存可提高性能，前提需要配置本地库
dfs.namenode.avoid.read.stale.datanode=FALSE，避免从脏dn上读取数据，脏dn指已经没有心跳信息的dn
**dfs.webhdfs.enabled=FALSE**，在nn和dn上开启restAPI访问功能，HortonWorks开发捐给Apache，HttpFS由Clouera也捐给了Apache，HUE配置需要httpfs。如果HA模式下，hue必须使用HttpFS（只能用自家的，呵呵）
dfs.hosts，接受或排除的host文件
## mapred-site.xml
**mapreduce.job.name**，job名称，
hadoop.job.history.(user.)location，制定历史文件存放目录
`io.sort.*` 排序相关参数，内存用量，占比多少开始写硬盘。大量排序时可优化
mapreduce.map.memory.mb，map使用内存，`RAM-per-container`
mapreduce.reduce.memory.mb，reduce使用内存，`2 * RAM-per-container`
mapreduce.map.java.opts，`0.8 * RAM-per-container`
mapreduce.reduce.java.opts, `0.8 * 2 * RAM-per-container`
mapred.child.java.opts，每个任务最大jvm heap大小为1000M， -Xmx1000M -Dfile.encoding=UTF8 -XX:-UseGCOverheadLimit
mapred.map/reduce.tasks，不知道yarn管理之后还有没有，默认值2/1应该偏小
`mapred.output.compress.*`启用压缩相关
cdh推荐配置
|配置项 | 推荐参数 | 注释|
|--|--|--|
|yarn.app.mapreduce.am.resource.cpu-vcores | 1 | AM container vcore reservation |
|yarn.app.mapreduce.am.resource.mb | 1024 | AM container memory reservation |
|ApplicationMaster Java Maximum Heap Size (available in CM) | 1024 | AM Java heap size |
|mapreduce.map.cpu.vcores | 1 | Map task vcore reservation |
|mapreduce.map.memory.mb | 1024 | Map task memory reservation |
|mapreduce.map.java.opts.max.heap | 1024 | Map task Java heap size |
|mapreduce.reduce.cpu.vcores | 1 | Reduce task vcore reservation |
|mapreduce.reduce.memory.mb | 1024 | Reduce task memory reservation |
|mapreduce.reduce.java.opts | 1024 | Reduce Task Java heap size |
|mapreduce.task.io.sort.mb | 256 | Spill/Sort memory reservation |

## yarn-site.xml
### 日志聚合功能
```xml
<property>    
  <name>yarn.log-aggregation-enable</name>
  <value>true</value>
</property> 

<property>
  <name>yarn.nodemanager.remote-app-log-dir</name>
  <value>/var/log/hadoop-yarn/apps</value>
  <description>[需要修改目录]Where to aggregate logs to.</description>
</property> 

<property>
  <name>yarn.log-aggregation.retain-seconds</name>
  <value>86400</value>
</property>
```
yarn.nodemanager.resource.memory-mb，直接设为nn的物理内存
yarn.scheduler.minimum/maximum-allocation-mb，最小1G，最大8G


 
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEzNTU0MDg4NTddfQ==
-->