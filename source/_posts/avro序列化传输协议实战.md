---
title: avro序列化传输协议实战
date: 2018-05-14
tags:
- avro
- 序列化
categories:
- BigData
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
这一步比较特殊，需要将`user.avsc`放在main下的avro目录，以avsc结尾。然后调用maven插件`mvn org.apache.avro:avro-maven-plugin:schema`，maven插件好像有bug，不能在pom.xml中指定sourceDirectory。
也可以手工调用`java -jar /path/to/avro-tools-1.8.1.jar compile schema user.avsc .`
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
# 本地序列化与反序列化
```java
import example.avro.User;  
import org.apache.avro.Schema;  
import org.apache.avro.file.DataFileReader;  
import org.apache.avro.file.DataFileWriter;  
import org.apache.avro.generic.GenericData;  
import org.apache.avro.generic.GenericDatumReader;  
import org.apache.avro.generic.GenericDatumWriter;  
import org.apache.avro.generic.GenericRecord;  
import org.apache.avro.io.DatumReader;  
import org.apache.avro.io.DatumWriter;  
import org.apache.avro.specific.SpecificDatumReader;  
import org.apache.avro.specific.SpecificDatumWriter;  
  
import java.io.File;  
import java.io.IOException;  
  
public class LocalDemo {  
  
    public void specific() {  
        User user1 = new User();  
  user1.setName("Alyssa");  
  user1.setFavoriteNumber(256);  
  // Leave favorite color null  
  
 // Alternate constructor  User user2 = new User("Ben", 7, "red");  
  
  // Construct via builder  
  User user3 = User.newBuilder()  
                .setName("Charlie")  
                .setFavoriteColor("blue")  
                .setFavoriteNumber(null)  
                .build();  
  
  File serializedFile = new File("users.avro");  
  
  // Serialize user1, user2 and user3 to disk  
  DatumWriter<User> userDatumWriter = new SpecificDatumWriter<User>(User.class);  
 try {  
            DataFileWriter<User> dataFileWriter = new DataFileWriter<User>(userDatumWriter);  
  dataFileWriter.create(user1.getSchema(), serializedFile);  
  dataFileWriter.append(user1);  
  dataFileWriter.append(user2);  
  dataFileWriter.append(user3);  
  dataFileWriter.close();  
  } catch (IOException e) {  
            e.printStackTrace();  
  }  
  
        // Deserialize Users from disk  
  DatumReader<User> userDatumReader = new SpecificDatumReader<User>(User.class);  
  DataFileReader<User> dataFileReader = null;  
  User user = null;  
 try {  
            dataFileReader = new DataFileReader<User>(serializedFile, userDatumReader);  
 while (dataFileReader.hasNext()) {  
                // Reuse user object by passing it to next(). This saves us from  
 // allocating and garbage collecting many objects for files with // many items.  user = dataFileReader.next(user);  
  System.out.println(user);  
  }  
        } catch (IOException e) {  
            e.printStackTrace();  
  }  
    }  
  
    public void generic() {  
        // load schema from serialized file  
  File schemaFile = new File("user.avsc");  
  Schema schema = null;  
 try {  
            schema = new Schema.Parser().parse(schemaFile);  
  } catch (IOException e) {  
            e.printStackTrace();  
  }  
        GenericRecord user1 = new GenericData.Record(schema);  
  user1.put("name", "Alyssa");  
  user1.put("favorite_number", 256);  
  // Leave favorite color null  
  
  GenericRecord user2 = new GenericData.Record(schema);  
  user2.put("name", "Ben");  
  user2.put("favorite_number", 7);  
  user2.put("favorite_color", "red");  
  
  // Serialize user1 and user2 to disk  
  File serializedFile = new File("users2.avro");  
  DatumWriter<GenericRecord> datumWriter = new GenericDatumWriter<GenericRecord>(schema);  
  DataFileWriter<GenericRecord> dataFileWriter = new DataFileWriter<GenericRecord>(datumWriter);  
 try {  
            dataFileWriter.create(schema, serializedFile);  
  dataFileWriter.append(user1);  
  dataFileWriter.append(user2);  
  dataFileWriter.close();  
  } catch (IOException e) {  
            e.printStackTrace();  
  }  
  
        DatumReader<GenericRecord> datumReader = new GenericDatumReader<GenericRecord>(schema);  
 try {  
            DataFileReader<GenericRecord> dataFileReader = new DataFileReader<GenericRecord>(serializedFile, datumReader);  
  GenericRecord user = null;  
 while (dataFileReader.hasNext()) {  
                user = dataFileReader.next(user);  
  System.out.println(user);  
  }  
        } catch (IOException e) {  
            e.printStackTrace();  
  }  
    }  
  
  
    public static void main(String[] args) {  
        LocalDemo localDemo = new LocalDemo();  
  localDemo.specific();  
  localDemo.generic();  
  }  
}
```



# 参考
1. [Avro是什么](http://blog.kazaff.me/2014/07/07/%E6%98%AF%E4%BB%80%E4%B9%88%E7%B3%BB%E5%88%97%E4%B9%8BAvro/)
2. [实战代码](http://www.cnblogs.com/agoodegg/p/3309041.html)
3. 
