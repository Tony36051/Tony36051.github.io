---
title: kafka实战之schema-registry
date: 2018-05-19
tags:
- avro
- kafka
- bigdata

---
测试岗位却不甘止步于业务测试，遂尝试智能化测试，当前的思路是通过日志大数据分析，协助自动化用例的诊断和建议。其中传输协议打算使用avro，原因是使用hadoop集群。本文使用confluent公司提供的schema-registry存放avro的schema。
<!--more-->
# 部署动作
直接用confluent公司的opensource好像很方便，但是启动之后经常少broker，用不了。那就用他们的docker镜像吧，基于他们的单节点尝试的。
```yaml
---
version: '2'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    restart: always
    volumes:
      - /home/tony/kafka/zk-data:/var/lib/zookeeper/data
      - /home/tony/kafka/zk-txn-logs:/var/lib/zookeeper/log
    ports:
      - "2181:2181"
    network_mode: host
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    extra_hosts:
      - "moby:127.0.0.1"

  kafka:
    image: confluentinc/cp-kafka:latest
    restart: always
    volumes:
      - /home/tony/kafka/kafka-data:/var/lib/kafka/data
    ports:
      - "9092:9092"
    network_mode: host
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: localhost:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://${localhost_ip}:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper
    extra_hosts:
      - "moby:127.0.0.1"

  schema-reristry:
    image: confluentinc/cp-schema-registry:latest
    restart: always
    ports:
      - "8081:8081"
    environment:
      SCHEMA_REGISTRY_KAFKASTORE_CONNECTION_URL: localhost:2181
      SCHEMA_REGISTRY_HOST_NAME: localhost
      SCHEMA_REGISTRY_LISTENERS: http://${localhost_ip}:8081
      SCHEMA_REGISTRY_DEBUG: "true"
    depends_on:
      - zookeeper
      - kafka
    network_mode: host

  kafka-rest:
    image: confluentinc/cp-kafka-rest:latest
    restart: always
    ports:
      - "8082:8082"
    network_mode: host
    environment:
      KAFKA_REST_ZOOKEEPER_CONNECT: localhost:2181
      KAFKA_REST_LISTENERS: http://${localhost_ip}:8082
      KAFKA_REST_SCHEMA_REGISTRY_URL: http://localhost:8081
      KAFKA_REST_HOST_NAME: ${localhost_ip}
    depends_on:
      - zookeeper
      - schema-reristry
```
kafka-manager，临时命令
```yaml
docker run -it --rm  -p 9000:9000 -e ZK_HOSTS="10.75.76.163:2181" -e APPLICATION_SECRET=letmein sheepkiller/kafka-manager
```

# 准备动作
使用confluent提供的一键包，avro的maven插件，先写java版本，后面再补充python实现。
## pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.unistar</groupId>
    <artifactId>kafka</artifactId>
    <version>1.0-SNAPSHOT</version>
    <properties>
        <kafka.version>0.11.0.0-cp1</kafka.version>
        <kafka.scala.version>2.10</kafka.scala.version>
        <confluent.version>3.3.0</confluent.version>
        <avro.version>1.8.2</avro.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>1.8</java.version>
    </properties>
    <repositories>
        <repository>
            <id>confluent</id>
            <url>http://packages.confluent.io/maven/</url>
        </repository>
        <!-- further repository entries here -->
    </repositories>
    <dependencies>
        <!-- https://mvnrepository.com/artifact/com.squareup.okhttp3/okhttp -->
        <dependency>
            <groupId>com.squareup.okhttp3</groupId>
            <artifactId>okhttp</artifactId>
            <version>3.10.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.kafka</groupId>
            <artifactId>kafka-clients</artifactId>
            <version>${kafka.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.avro/avro -->
        <dependency>
            <groupId>org.apache.avro</groupId>
            <artifactId>avro</artifactId>
            <version>${avro.version}</version>
        </dependency>
        <dependency>
            <groupId>io.confluent</groupId>
            <artifactId>kafka-avro-serializer</artifactId>
            <version>${confluent.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/joda-time/joda-time -->
        <!--note at 2018-05-19:avro 1.8.2 在序列化date的时候仍然使用joda time，github上master代码已经改为java.time.*-->
        <dependency>
            <groupId>joda-time</groupId>
            <artifactId>joda-time</artifactId>
            <version>2.9.9</version>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.avro</groupId>
                <artifactId>avro-maven-plugin</artifactId>
                <version>${avro.version}</version>
                <executions>
                    <execution>
                        <phase>generate-sources</phase>
                        <goals>
                            <goal>schema</goal>
                            <goal>protocol</goal>
                            <goal>idl-protocol</goal>
                        </goals>
                        <configuration>
                            <sourceDirectory>${project.basedir}/src/main/avro/</sourceDirectory>
                            <outputDirectory>${project.basedir}/src/main/java/</outputDirectory>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.3</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```
## 项目结构
在${project.basedir}目录使用`tree /f`(windows)即可生成如下
```
│  pom.xml
│
├─src
│  ├─main
│  │  ├─avro
│  │  │      Testase.avsc
│  │  │
│  │  ├─java
│  │  │  │  BasicConsumerLoop.java
│  │  │  │  ConfluentConsumer.java
│  │  │  │  ConsumerDemo.java
│  │  │  │  ProducerDemo.java
│  │  │  │
│  │  │  └─com
│  │  │      └─huawei
│  │  │          └─unistar
│  │  │              └─test
│  │  │                      SchemaMain.java
│  │  │
│  │  └─resources
│  └─test
│      └─java
└─target
    └─generated-sources
        └─avro
            └─com
                └─huawei
                    └─unistar
                        └─aitest
                                capability.java
                                Testcase.java
```
# avro schema
在${project.basedir}目录执行如下命令，用maven插件将*.avsc文件生成对应的java文件。
>mvn org.apache.avro:avro-maven-plugin:1.8.2:schema
```json
{  
  "namespace": "com.huawei.unistar.aitest",  
  "type": "record",  
  "name": "Testcase",  
  "doc": "Represents an testcase's execution history",  
  "fields": [  
    {  
      "name": "app",  
  "type": "string",  
  "doc": "被测产品，应用或模块"  
  },  
  {  
      "name": "testTool",  
  "type": "string",  
  "doc": "测试工具"  
  },  
  {  
      "name": "startDate",  
  "type": {  
        "type": "long",  
  "logicalType": "timestamp-millis"  
  },  
  "doc": "用例开始时间"  
  },  
  {  
      "name": "endDate",  
  "type": {  
        "type": "long",  
  "logicalType": "timestamp-millis"  
  },  
  "doc": "用例结束时间"  
  },  
  {  
      "name": "elapsed",  
  "type": {  
        "type": "int",  
  "logicalType": "time-millis"  
  },  
  "default": 0,  
  "doc": "用例执行时长"  
  },  
  {  
      "name": "suite",  
  "type": [  
        "null",  
  "string"  
  ],  
  "default": null,  
  "doc": "用例所属测试套"  
  },  
  {  
      "name": "case",  
  "type": "string",  
  "doc": "用例名"  
  },  
  {  
      "name": "result",  
  "type": "string",  
  "doc": "执行结果"  
  },  
  {  
      "name": "capability",  
  "type": {  
        "type": "enum",  
  "name": "Capability",  
  "symbols": [  
          "HTTP",  
  "DATABASE",  
  "GUI",  
  "DEFAULT"  
  ],  
  "doc": "测试能力，枚举值。default：无法识别/未提及"  
  }  
    },  
  {  
      "name": "errorMsg",  
  "type": [  
        "null",  
  "string"  
  ],  
  "default": null,  
  "doc": "失败日志，默认为空。失败时必填"  
  }  
  ]  
}
```
# 与schema-registry通信
该部分主要参考[这个例子](https://dzone.com/articles/kafka-avro-serialization-and-the-schema-registry)，只是将schema从hardcode改为从avsc文件读取而已。例子有其他api的调用。
```java
package com.huawei.unistar.test;

import okhttp3.*;
import java.io.*;

public class SchemaMain {
    private final static MediaType SCHEMA_CONTENT = MediaType.parse("application/vnd.schemaregistry.v1+json");
    private static String CASE_SCHEMA = null;
    public SchemaMain(String schemaFilePath){
        try {
            BufferedReader bufferedReader = new BufferedReader(new FileReader(new File(schemaFilePath)));
            String line = null;
            StringBuilder jsonStr = new StringBuilder();
            while ((line = bufferedReader.readLine()) != null) {
                jsonStr.append(line);
            }
            String finalString = jsonStr.toString().replaceAll("\"", "\\\\\"");
            CASE_SCHEMA = " {\"schema\": \" " + finalString + "\"}";
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String... args) throws IOException {
        String path = "D:\\2.code\\javacode\\kafka\\src\\Testase.avsc";
        SchemaMain schemaMain = new SchemaMain(path);
        System.out.println(CASE_SCHEMA);
        final OkHttpClient client = new OkHttpClient();
        //POST A NEW SCHEMA
        Request request = new Request.Builder()
                .post(RequestBody.create(SCHEMA_CONTENT, CASE_SCHEMA))
                .url("http://10.75.76.163:8081/subjects/Case/versions")
                .build();
        String output = client.newCall(request).execute().body().string();
        System.out.println(output);

        //LIST ALL SCHEMAS
        request = new Request.Builder()
                .url("http://10.75.76.163:8081/subjects")
                .build();
        output = client.newCall(request).execute().body().string();
        System.out.println(output);
    }
}
```


# 参考链接
1. [较完整例子](https://dzone.com/articles/kafka-avro-serialization-and-the-schema-registry)
2. [schema-registry的API文档](https://docs.confluent.io/current/schema-registry/docs/api.html)
3. [confluent opensource简单部署(不用KSQL只用执行到"Step 3")](https://docs.confluent.io/current/quickstart/cos-quickstart.html)

