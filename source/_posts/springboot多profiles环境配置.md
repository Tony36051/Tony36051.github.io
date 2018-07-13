---
title: springboot多profiles环境配置
date: 2018-07-14
tags:
- springboot

categories:
- springboot
---
spring boot开发通常由多个环境, 不同环境用的数据库密码等都不一样, 怎么可以灵活切换呢? 最简单方法可以用spring boot的profiles切换方法.
<!--more-->
# 实例
```yml
spring:  
 profiles:.active: dev  
  datasource:  
 username: root  
      password: huawei123  
      driver-class-name: com.mysql.jdbc.Driver  
  jpa:  
 open-in-view: true  
    show-sql: true  
    hibernate:  
 ddl-auto: create #validate  
  properties:  
 hibernate: dialect: com.huawei.unistar.ailog.MySQL5DialectUTF8 # MySQL5DialectUTF8  
  aop:  
 auto: true # Add @EnableAspectJAutoProxy.  default: true  
  proxy-target-class: false # Whether subclass-based (CGLIB) proxies are to be created (true) as opposed to standard Java interface-based proxies (false).  
  logging:.level:.org:.hibernate:.type: debug  
---  
spring.profiles: dev  
spring:.datasource:.url: jdbc:mysql://mysql:3306/ailog?characterEncoding=utf-8&useSSL=false  
---  
spring.profiles: prod  
spring:.datasource:.url: jdbc:mysql://localhost:3306/ailog?characterEncoding=utf-8&useSSL=false
```
1. 用`---`分隔多块配置
2. spring.profiles: {name} 是profile的名字
3. 最上面没有特殊标记, 或有active标记的一节是默认的, 会被默认加载. 可以将公共的配置放那.
4. `spring:.datasource:.url` 中`.datasource`应该是yml语法的一种缩写语法

# 怎么应用
## 命令行
ref :https://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/htmlsingle/#howto-set-active-spring-profiles
用系统变量`spring.profiles.active`穿进去
>java -jar -Dspring.profiles.active=prod /tmp/ailog.jar

或用环境变量`SPRING_PROFILES_ACTIVE`
>export SPRING_PROFILES_ACTIVE=prod && java -jar /tmp/ailog.jar

 网络上说可以`java -jar /tmp/ailog.jar --spring.profiles.active=prod`的方式启用prod的profile, 我实测**不行**! springboot 2.0.3
