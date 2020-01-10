---
title: Flume 笔记
date: 2018-05-26
tags:
- AILog
- Flume
categories:
- BigData

---
测试岗位却不甘止步于业务测试，遂尝试智能化测试，当前的思路是通过日志大数据分析，协助自动化用例的诊断和建议。其中本地日志采用flume采集，发送到kafka
<!--more-->
# 目录下日志
```
Flume2KafkaAgent.sources=mysource  
Flume2KafkaAgent.channels=mychannel  
Flume2KafkaAgent.sinks=mysink  
  
Flume2KafkaAgent.sources.mysource.type=spooldir  
Flume2KafkaAgent.sources.mysource.channels=mychannel  
Flume2KafkaAgent.sources.mysource.spoolDir=/tmp/hadoop
  
Flume2KafkaAgent.sinks.mysink.channel=mychannel  
Flume2KafkaAgent.sinks.mysink.type=org.apache.flume.sink.kafka.KafkaSink  
Flume2KafkaAgent.sinks.mysink.kafka.bootstrap.servers=10.75.76.163:9092
Flume2KafkaAgent.sinks.mysink.kafka.topic=flume-data  
Flume2KafkaAgent.sinks.mysink.kafka.batchSize=20  
Flume2KafkaAgent.sinks.mysink.kafka.producer.requiredAcks=1  
  
Flume2KafkaAgent.channels.mychannel.type=memory  
Flume2KafkaAgent.channels.mychannel.capacity=30000  
Flume2KafkaAgent.channels.mychannel.transactionCapacity=100  
```
# 单一日志文件
还没测试
```
single-tail.sources=mysource  
single-tail.channels=mychannel  
single-tail.sinks=mysink  
  
single-tail.sources.mysource.type=exec  
single-tail.sources.mysource.shell = /bin/bash -c
single-tail.sources.mysource.command = tail -F /tmp/wjs.log
single-tail.sources.mysource.channels=mychannel  

single-tail.channels.mychannel.type=memory  
single-tail.channels.mychannel.capacity=30000  
single-tail.channels.mychannel.transactionCapacity=100  

single-tail.sinks.mysink.channel=mychannel  
single-tail.sinks.mysink.type=org.apache.flume.sink.kafka.KafkaSink  
single-tail.sinks.mysink.kafka.bootstrap.servers=10.75.76.163:9092
single-tail.sinks.mysink.kafka.topic=flume-data  
single-tail.sinks.mysink.kafka.batchSize=20  
single-tail.sinks.mysink.kafka.producer.requiredAcks=1  
```
# 递归多层目录的taildir
使用的是这个大神修改的taildir
https://github.com/qwurey/flume-source-taildir-recursive
代码down下来不能直接`mvn package`，要改pom.xml，默认是1.6.0，但是作者在写代码的之后，官方将某个类挪了一个位置，import报错，编译不了。改成1.8.0可以。默认情况下没有打成jar包，也许是因为windows平台上maven测试过不了。可以到flume-taildir-source\target\classes这个目录执行一下`jar cvf flume-source-taildir-recursive.jar .`

```xml
  <parent>
    <artifactId>flume-ng-sources</artifactId>
    <groupId>org.apache.flume</groupId>
    <version>1.8.0</version>
  </parent>
```
>vim conf/taildirr.conf
```properties
taildirr.sources = r1
taildirr.channels = c1
taildirr.sinks = k1

taildirr.sources.r1.type = com.urey.flume.source.taildir.TaildirSource
taildirr.sources.r1.channels = c1
taildirr.sources.r1.positionFile = /home/hadoop/.flume/taildir_position.json
taildirr.sources.r1.filegroups = f1
taildirr.sources.r1.filegroups.f1 = /tmp/wjs/.*
taildirr.sources.r1.batchSize = 100
taildirr.sources.r1.backoffSleepIncrement= 1000
taildirr.sources.r1.maxBackoffSleep= 5000
taildirr.sources.r1.recursiveDirectorySearch = true

taildirr.sinks.k1.type = org.apache.flume.sink.kafka.KafkaSink
taildirr.sinks.k1.kafka.bootstrap.servers=10.75.76.163:9092
taildirr.sinks.k1.kafka.topic=flume-taildir-recursive1
taildirr.sinks.k1.kafka.batchSize=20 
taildirr.sinks.k1.kafka.producer.requiredAcks=1

taildirr.channels.c1.type = memory
taildirr.channels.c1.capacity = 1000
taildirr.channels.c1.transactionCapacity = 100

taildirr.sources.r1.channels = c1
taildirr.sinks.k1.channel = c1
```

### 启动命令
>bin/flume-ng agent -n taildirr -c conf -f conf/taildirr.conf -Dflume.root.logger=INFO,console

# 参考
1. [flume组织source、channel、sink](https://blog.csdn.net/u012373815/article/details/54351323)
2. [taildir递归多层目录](https://blog.csdn.net/m0_37739193/article/details/72962192)
3. [flume官方文档](https://flume.apache.org/FlumeUserGuide.html)

