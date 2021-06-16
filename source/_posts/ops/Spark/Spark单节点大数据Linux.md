---
title: Spark单节点大数据Linux
date: 2021-06-16 10:02
tags:
- Spark
categories:
- Ops
---
记录Linux上单节点搭建spark，以及做大数据分析的过程
<!-- more -->

# Spark单节点大数据Linux
## 安装
版本： 
下载地址： https://spark.apache.org/downloads.html
spark: 3.1.2
hadoop: 3.2 or later
Spark 3.0+ is pre-built with Scala 2.12.
```bash
wget https://downloads.apache.org/spark/spark-3.1.2/spark-3.1.2-bin-hadoop3.2.tgz
tar -zxvf spark-3.1.2-bin-hadoop3.2.tgz
sudo apt update
sudo apt install openjdk-11-jdk-headless

```
