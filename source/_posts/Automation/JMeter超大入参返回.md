---
title: JMeter超大入参返回
date: 2020-07-09 15:13
tag: 
- JMeter

categories:
- Test
---
# JMeter超大入参返回

## 入参太大，StackOverFlow

如果入参太大，比如几千行的json，http sample直接无法执行，查看日志显示StackOverFlow. 从hashcode方法开始抛出的，怀疑是放入本地变量了。
windows解决方案，新增文件%JMETER_HOME%\bin\setenv.bat，可以容纳近10m的入参。
```sh
set HEAP=-Xss10m
```

## 返回太大，Heap OOM

如果返回的内容太大，除了要禁用查看结果树、开启gzip压缩等，还可以调大堆区，这里同样给出windows解决方案。
windows解决方案，新增文件%JMETER_HOME%\bin\setenv.bat，亲测大约5m以下json返回，GUI不会崩。
```sh
set HEAP=-Xms4g -Xmx5g -XX:MaxMetaspaceSize=512m
```