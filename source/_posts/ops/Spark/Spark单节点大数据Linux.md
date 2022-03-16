---
title: Spark伪分布式部署
date: 2021-06-16 10:02
tags:
- Spark
categories:
- Ops
---
记录Linux上Spark伪分布式部署spark，以及做大数据分析的过程
<!-- more -->

# Spark伪分布式部署
## 安装
版本： 
下载地址： https://spark.apache.org/downloads.html
spark: 3.1.2
hadoop: 3.2 or later
Spark 3.0+ is pre-built with Scala 2.12.

master: 192.168.28.3
slaves: 192.168.28.3
driver: 192.168.28.3

```bash
wget https://downloads.apache.org/spark/spark-3.1.2/spark-3.1.2-bin-hadoop3.2.tgz
tar -zxvf spark-3.1.2-bin-hadoop3.2.tgz
sudo apt update
sudo apt install openjdk-11-jdk-headless
cd spark-3.1.2-bin-hadoop3.2
cp conf/spark-env.sh.template conf/spark-env.sh

echo "export SPARK_MASTER_HOST=192.168.28.3" >> conf/spark-env.sh
echo "192.168.28.3" >> conf/slaves

sbin/stop-worker.sh
sbin/stop-master.sh
sbin/start-master.sh
sbin/start-worker.sh spark://192.168.28.3:7077

java -jar java-789005-spark-1.0-SNAPSHOT.jar --server.port=8088 --train.file=file:///home/tony/dac/train.txt

```
