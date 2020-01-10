---
title: Kafka 简单使用
date: 2018-05-10
tags:
- Kafka 
- Docker
categories:
- BigData
---
在智能测试日志分析方案中，使用kafka作为消息集成的关键组件，简单记录一下使用的命令和docker搭建笔记。
<!--more-->
# 搭建部署
由于本人是半个docker狂魔，docker搭建在保持环境干净，启动停止应用上有突出的优势，遂使用docker形式作为先行方案。根据[ibm上的论文](https://domino.research.ibm.com/library/cyberdig.nsf/papers/0929052195DD819C85257D2300681E7B/$File/rc25482.pdf)表示，cpu和内存损失较少，在网络IO上损耗多一点。在生产应用发现瓶颈后再去考虑native部署。
## zookeeper
>mkdir -p /home/tony/zookeeper/data /home/tony/zookeeper/datalog
```bash
docker run -d --restart always --name zookeeper \
-p 2181:2181 \
-v /home/tony/zookeeper/data:/data \
-v /home/tony/zookeeper/datalog:/datalog \
zookeeper:3.4
```
## kafka
hub.docker.com上有好多镜像，最高的要自己build，在proxy环境下比较麻烦，构建过程中在alpine中用wget下载https报错。有些镜像是捆绑zookeeper，最后选择的是分开的，提供了data和logs映射的镜像。
远程连接kafka机器的broker需要注意，`config/server.properties`中`advertised.host.name`要配置为宿主机被访问的外网ip。如果是新版（0.10）以后，可以配置`advertised.listeners=PLAINTEXT://59.64.11.22:9092`
>chown -R 1000:1000 data/ logs/
```Dockerfile
docker run -d --restart always --name kafka \
-p 7203:7203 \
-p 9092:9092 \
-v /home/tony/kafka/data:/data \
-v /home/tony/kafka/logs:/logs \
--link zookeeper:zkhost \
-e ZOOKEEPER_IP=zkhost \
-e KAFKA_ADVERTISED_HOST_NAME=10.75.76.163 \
ches/kafka
```
# 控制台命令
可以进入到容器内执行，也可以在本地用官网最近的二进制文件。
## topic
```bash
# 查看所有topic
bin/kafka-topics.sh --list --zookeeper localhost:2181
# 创建
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test
# 查看topic具体的信息
bin/kafka-topics.sh --describe --zookeeper localhost:2181 --topic test
```
## producer
>bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test
## consumer
>bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning

# client
## python
根据官网和infoQ的文章表示，在高性能要求的环境下，封装C库`Librdkafka`的confluent-kafka有较高性能。但是纯python实现的kafka-python功能一样全面，pip直接完事。另外还有更加"python-like"的`pykafka`，本身是纯python实现，也可以切换为libdkafka的实现。
### kafka-python

#### producer
```python
from kafka import KafkaProducer  
producer = KafkaProducer(bootstrap_servers='10.75.76.163:9092', linger_ms=0)  
for _ in range(20):  
    producer.send('test', b"from_windows4")  
producer.close()
```
#### consumer
```python
from kafka import KafkaConsumer  
consumer = KafkaConsumer("test", bootstrap_servers=['10.75.76.163:9092'], api_version=(0, 10))  
for msg in consumer:  
    print (msg)
consumer.close()
```
### pykafka
https://github.com/Parsely/pykafka
以下示例仅用于helloworld测试，实际可能需要while(True)去生产或消费、异步地
#### producer
```python
# -*- coding: utf-8 -*-  
from pykafka import KafkaClient  
client = KafkaClient(hosts="10.75.76.163:9092")  
print(client.topics)  
topic = client.topics['test']  
# 同步用法  
with topic.get_sync_producer() as producer:  
    for i in range(4):  
        producer.produce('pykafka produce test sync_message ' + str(i ** 2))  
# 异步用法  
with topic.get_producer() as producer:  
    for i in range(5):  
        producer.produce('pykafka produce test async_message ' + str(i ** 2))
```
#### consumer
```python
# -*- coding: utf-8 -*-
from pykafka import KafkaClient
client = KafkaClient(hosts="10.75.76.163:9092")
print(client.topics)
topic = client.topics['test']
consumer = topic.get_simple_consumer()
for message in consumer:
    if message is not None:
        print message.offset, message.value
```
### confluent-kafka
windows搞这个库比较麻烦，先往后放一放，遇到性能瓶颈再优化。

## Java
基本照抄官网例子，java的客户端文档不在client章节，在api章节(https://kafka.apache.org/documentation/#producerapi)
### 依赖pom文件
```xml
    <dependencies>
        <dependency>
            <groupId>org.apache.kafka</groupId>
            <artifactId>kafka-clients</artifactId>
            <version>0.10.2.1</version>
        </dependency>
    </dependencies>
```
### producer
https://kafka.apache.org/11/javadoc/index.html?org/apache/kafka/clients/producer/KafkaProducer.html
```java
import java.util.Properties;  
import org.apache.kafka.clients.producer.KafkaProducer;  
import org.apache.kafka.clients.producer.Producer;  
import org.apache.kafka.clients.producer.ProducerRecord;  
public class ProducerDemo {  
    public static void main(String[] args) {  
        Properties properties = new Properties();  
  properties.put("bootstrap.servers", "10.75.76.163:9092");  
  properties.put("acks", "all");  
  properties.put("retries", 0);  
  properties.put("batch.size", 16384);  
  properties.put("linger.ms", 1);  
  properties.put("buffer.memory", 33554432);  
  properties.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");  
  properties.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");  
  Producer<String, String> producer = null;  
 try {  
            producer = new KafkaProducer<String, String>(properties);  
 for (int i = 0; i < 10; i++) {  
                String msg = "Message " + i;  
  producer.send(new ProducerRecord<String, String>("test", msg));  
  System.out.println("Sent:" + msg);  
  }  
        } catch (Exception e) {  
            e.printStackTrace();  
  } finally {  
            producer.close();  
  }  
    }  
}
```
### consumer
https://kafka.apache.org/11/javadoc/index.html?org/apache/kafka/clients/consumer/KafkaConsumer.html
```java
import java.util.Arrays;
import java.util.Properties;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
public class ConsumerDemo {
    public static void main(String[] args){
        Properties properties = new Properties();
        properties.put("bootstrap.servers", "10.75.76.163:9092");
        properties.put("group.id", "group-1");
        properties.put("enable.auto.commit", "true");
        properties.put("auto.commit.interval.ms", "1000");
        properties.put("auto.offset.reset", "earliest");
        properties.put("session.timeout.ms", "30000");
        properties.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        properties.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

        KafkaConsumer<String, String> kafkaConsumer = new KafkaConsumer<>(properties);
        kafkaConsumer.subscribe(Arrays.asList("test"));
        while (true) {
            ConsumerRecords<String, String> records = kafkaConsumer.poll(100);
            for (ConsumerRecord<String, String> record : records) {
                System.out.printf("offset = %d, value = %s", record.offset(), record.value());
                System.out.println();
            }
        }
    }
}
```
