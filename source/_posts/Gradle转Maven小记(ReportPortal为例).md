---
title: Gradle转Maven小记(ReportPortal为例)
date: 2018-08-21
tag: 
- java
---
公司访问外网要代理, 证书也替换了, gradle不能忽略证书验证, 替换证书未果, 遂起了转化maven工程的念头
<!--more-->
# 创建pom.xml
在`build.gradle`文件中加入以下内容
```
apply plugin: 'maven'
task createPom << {
    pom {
    }.writeTo("pom.xml")
}
```
在项目根目录调用命令`gradle createPom`

# 新增仓库
在build.gradle中是这样定义的
```
repositories {
    mavenCentral()
    mavenLocal()
    maven { url "http://dl.bintray.com/epam/reportportal" }
    maven { url "http://jasperreports.sourceforge.net/maven2" }
    maven { url "http://jaspersoft.artifactoryonline.com/jaspersoft/third-party-ce-artifacts" }
    maven { url "https://dl.bintray.com/michaelklishin/maven/" }

    if (!releaseMode) {
        maven { url 'https://jitpack.io' }
    }
}
```
改写pom对应应该如下写法:
```xml
<repositories>  
  <repository>
    <id>epam</id>  
    <url>http://dl.bintray.com/epam/reportportal</url>  
  </repository>
</repositories>
```
# 补全dependency
在`build.gradle`中dependencyManagement是如下写法:
```
dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-starter-parent:Edgware.SR3"
        mavenBom "org.springframework.boot:spring-boot-dependencies:1.5.9.RELEASE"
    }
}
```
改写pom应为如下写法:
```xml
<dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>1.5.9.RELEASE</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Dalston.SR1</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```
应该在一些插件和其他设置中还隐含了一些依赖, 导致mvn install时还有一些依赖没有找到, 逐个手动加上. 建议google搜索`maven 类名`
# 构建fat jar
直接使用`mvn package -Dmaven.test.skip=true`终于可以构建成功, 发现只有一两MB, 肯定没有相关依赖, 为了符合微服务的fat jar, 在project节点下加入以下部分
```xml
<build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <version>3.1.0</version>
                <configuration>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                </configuration>
                <executions>
                    <execution>
                        <id>assemble-all</id>
                        <phase>package</phase>
                        <goals>
                            <goal>single</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <configuration>
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <mainClass>fully.qualified.MainClass</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
```
