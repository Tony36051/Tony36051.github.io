---
title: avro序列化传输协议实战
date: 2018-05-14
tags:
- avro
- bigdata

---
测试岗位却不甘止步于业务测试，遂尝试智能化测试，当前的思路是通过日志大数据分析，协助自动化用例的诊断和建议。其中传输协议打算使用avro，原因是使用hadoop集群。本文记录官网入门步骤中未尽之处与项目实际应用经验
<!--more-->
# pom
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.huawei.unistar</groupId>
    <artifactId>avro</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>org.apache.avro</groupId>
            <artifactId>avro</artifactId>
            <version>1.8.2</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.avro</groupId>
                <artifactId>avro-maven-plugin</artifactId>
                <version>1.8.2</version>
                <executions>
                    <execution>
                        <phase>generate-sources</phase>
                        <goals>
                            <goal>schema</goal>
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
                    <source>1.6</source>
                    <target>1.6</target>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

# json定义文件存放目录
这一步比较特殊，需要将`user.avsc`放在main下的avro目录，以avsc结尾。然后调用maven插件`mvn org.apache.avro:avro-maven-plugin:schema`或手工调用`java -jar /path/to/avro-tools-1.8.1.jar compile schema user.avsc .`
```
├─src
│  ├─main
│  │  ├─avro
│  │  │      user.avsc
│  │  │
│  │  ├─java
│  │  │      SpDemo.java
│  │  │
│  │  └─resources
│  └─test
│      └─java
└─target
    ├─generated-sources
    │  └─avro
    │      └─example
    │          └─avro
    │                  User.java
```
