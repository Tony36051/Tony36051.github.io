---
title: Zabbix 实践
date: 2018-03-12 14:52:00
tags: 
- Zabbix
categories:
- ops
---
# Zabbix实践
## 安装
zabbix安装需要3大块，server负责整理数据，agent采集数据，web负责展示与GUI配置。
server和web都依赖关系型数据库，这里以mysql为例，也是docker形式。
```bash
docker run --name mysql --restart=always \
-v /home/tony/mysql_data:/var/lib/mysql \
-p 3306:3306 \
-e MYSQL_ROOT_PASSWORD=huawei123 \
-d mysql:5.6
```
### Server端
```bash
docker run --name zabbix-server-mysql --restart always \
--link mysql:mysql_host \
-p 10051:10051 \
-e DB_SERVER_HOST="mysql_host" \
-e MYSQL_USER="root" \
-e MYSQL_PASSWORD="huawei123" \
-v /home/tony/zabbix/externalscripts:/usr/lib/zabbix/externalscripts \
-d zabbix/zabbix-server-mysql
```
### Web端
```bash
docker run --name zabbix-web-nginx-mysql \
--restart always \
--link mysql:mysql_host \
--link zabbix-server-mysql:zabbix-server-mysql \
-p 81:80 \
-e DB_SERVER_HOST="mysql_host" \
-e MYSQL_USER="root" \
-e MYSQL_PASSWORD="huawei123" \
-e ZBX_SERVER_HOST="zabbix-server-mysql" \
-e PHP_TZ="Asia/Shanghai" \
-v /home/tony/zabbix/msyh.ttf:/usr/share/zabbix/fonts/graphfont.ttf \
-d zabbix/zabbix-web-nginx-mysql:latest
```
### Agent
Agent用原生的rpm包安装，centos7.2下直接安装无依赖。生产环境要离线安装，找到以下仓库 http://repo.zabbix.com/zabbix/3.4/rhel/7/x86_64/
笔者在编辑时候，版本号为3.4，[zabbix-get-3.4.7-1.el7.x86_64.rpm](http://repo.zabbix.com/zabbix/3.4/rhel/7/x86_64/zabbix-get-3.4.7-1.el7.x86_64.rpm)
> sudo rpm -ivh zabbix-get-3.4.7-1.el7.x86_64.rpm

默认路径
> /etc/zabbix  #配置
> /var/log/zabbix  #日志
> sudo systemctl restart zabbix-agent.service	#systemd 重启

## 配置
### 判断进程是否存在、获取进程号
使用UserParameter功能，能在agent端执行自定义命令，命令的返回值会送到server作为键值对应的数值。
#### 流程
1. 在Agent端/etc/zabbix/zabbix_agentd.d/目录下新建参数自定义命令。
```bash
sudo vim /etc/zabbix/zabbix_agentd.d/userparameter_script.conf
UserParameter=ps[*],ps -ef | grep $1 | grep -v zabbix | wc -l
UserParameter=pid[*],ps -ef | grep "$1" | grep -v grep | sed -r 's/ +/ /g' | cut -d " " -f 2
```
2. 在web端配置监控项，可以是active或passive，键值ps[NameNode]，对应地会在agent端执行命令ps -ef | grep NameNode | grep -v zabbix | wc -l
3. server端收到对应的返回值，正常来说是1。

### Hadoop参数
#### 流程
1. server端执行外部检查，外部检查调用zabbix/externalscripts目录下执行系统命令（如调用 python get_dfs_info.py master1 50070）。
2. 调用系统命令后，被调用程序应使用zabbix-sender给server端发送相关数据。
这里发送的是文本文件，每行一条记录，空格划分三列，第一列是被监控机器在web上显示的hostname，第二列是键值，第三列是具体的数据。
3. zabbix-server监控项用zabbix采集器，键值对应发送文件的第二列，数据类型要区分整数和字符串等。
#### 脚本
```bash
#!/bin/sh

#--------------------------------------------------------------------------------------------
# Expecting the following arguments in order -
# <host> = hostname/ip-address of Hadoop cluster NameNode server.
#        This is made available as a macro in host configuration.
# <port> = Port # on which the NameNode metrics are available (default = 50070)
#        This is made available as a macro in host configuration.
# <name_in_zabbix> = Name by which the Hadoop NameNode is configured in Zabbix.
#        This is made available as a macro in host configuration.
# <monitor_type> is the parameter (NN or DFS) you want to monitor.
#--------------------------------------------------------------------------------------------

COMMAND_LINE="$0 $*" 
export SCRIPT_NAME="$0"

usage() {
   echo "Usage: $SCRIPT_NAME <host> <port> <name_in_zabbix> <monitor_type>"
}

if [ $# -ne 4 ]
then
    usage ;
    exit ;
fi


#--------------------------------------------------------------------------------------------
# First 2 parameters are required for connecting to Hadoop NameNode
# The 3th parameter HADOOP_NAME_IN_ZABBIX is required to be sent back to Zabbix to identify the 
# Zabbix host/entity for which these metrics are destined.
# The 4th parameter MONITOR_TYPE is to specify the type to monitoring(NN or DFS)
#--------------------------------------------------------------------------------------------
export CLUSTER_HOST=$1
export METRICS_PORT=$2
export HADOOP_NAME_IN_ZABBIX=$3
export MONITOR_TYPE=$4

#--------------------------------------------------------------------------------------------
# Set the data output file and the log fle from zabbix_sender
#--------------------------------------------------------------------------------------------
export DATA_FILE="/tmp/${HADOOP_NAME_IN_ZABBIX}_${MONITOR_TYPE}.txt"
export JSON_FILE="/tmp/${HADOOP_NAME_IN_ZABBIX}_${MONITOR_TYPE}.json"
export BAK_DATA_FILE="/tmp/${HADOOP_NAME_IN_ZABBIX}_${MONITOR_TYPE}_bak.txt"
export LOG_FILE="/tmp/${HADOOP_NAME_IN_ZABBIX}.log"


#--------------------------------------------------------------------------------------------
# Use python to get the metrics data from Hadoop NameNode and use screen-scraping to extract
# metrics. 
# The final result of screen scraping is a file containing data in the following format -
# <HADOOP_NAME_IN_ZABBIX> <METRIC_NAME> <METRIC_VALUE>
#--------------------------------------------------------------------------------------------

# python `dirname $0`/zabbix-hadoop.py $CLUSTER_HOST $METRICS_PORT $DATA_FILE $HADOOP_NAME_IN_ZABBIX $MONITOR_TYPE
wget -q -O $DATA_FILE http://$CLUSTER_HOST:$METRICS_PORT/jmx?qry=Hadoop:*

sh `dirname $0`/JSON.sh -l < $DATA_FILE > $JSON_FILE
#NN > JvmMetrics
heap_memory_used="`grep 'MemHeapUsedM' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
heap_memory="`grep 'MemHeapCommittedM' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
max_heap_memory="`grep 'MemHeapMaxM' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
non_heap_memory_used="`grep 'MemNonHeapUsedM' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
commited_non_heap_memory="`grep 'MemNonHeapCommittedM' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
all_memory_used=`awk 'BEGIN{print $heap_memory_used + $non_heap_memory_used}'`
#NN > NameNodeStatus
namenode_state="`grep 'tag.HAState' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
#NN > NameNodeInfo
start_time="`grep 'BlockDeletionStartTime' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
hadoop_version=`grep 'SoftwareVersion' $JSON_FILE | sed -n '1,1p' | cut -f 2 | cut -d \" -f 2`
# DFS > FSNamesystemState
live_nodes="`grep 'NumLiveDataNodes' $JSON_FILE | sed -n '1,1p' | cut -f 2`" 
dead_nodes="`grep 'NumDeadDataNodes' $JSON_FILE | sed -n '1,1p' | cut -f 2`" 
decommissioning_nodes="`grep 'NumDecommissioningDataNodes' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
under_replicated_blocks="`grep 'UnderReplicatedBlocks' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
# DFS > NameNodeInfo
files_and_directorys="`grep 'TotalFiles' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
blocks="`grep 'TotalBlocks' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
configured_capacity="`grep '\"Total\"' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
dfs_used="`grep 'CapacityUsed' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
dfs_used_persent="`grep 'PercentUsed' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
non_dfs_used="`grep 'NonDfsUsedSpace' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
dfs_remaining="`grep 'Free' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
dfs_remaining_persent="`grep 'PercentRemaining' $JSON_FILE | sed -n '1,1p' | cut -f 2`"
datanodes_usages="`grep 'NodeUsage' $JSON_FILE | sed -n '1,1p' | cut -f 2`"

echo "$HADOOP_NAME_IN_ZABBIX heap_memory_used $heap_memory_used
$HADOOP_NAME_IN_ZABBIX heap_memory $heap_memory
$HADOOP_NAME_IN_ZABBIX max_heap_memory $max_heap_memory
$HADOOP_NAME_IN_ZABBIX non_heap_memory_used $non_heap_memory_used
$HADOOP_NAME_IN_ZABBIX commited_non_heap_memory $commited_non_heap_memory
$HADOOP_NAME_IN_ZABBIX all_memory_used $all_memory_used
$HADOOP_NAME_IN_ZABBIX namenode_state $namenode_state
$HADOOP_NAME_IN_ZABBIX start_time $start_time
$HADOOP_NAME_IN_ZABBIX hadoop_version $hadoop_version
$HADOOP_NAME_IN_ZABBIX live_nodes $live_nodes
$HADOOP_NAME_IN_ZABBIX dead_nodes $dead_nodes
$HADOOP_NAME_IN_ZABBIX decommissioning_nodes $decommissioning_nodes
$HADOOP_NAME_IN_ZABBIX under_replicated_blocks $under_replicated_blocks
$HADOOP_NAME_IN_ZABBIX files_and_directorys $files_and_directorys
$HADOOP_NAME_IN_ZABBIX blocks $blocks
$HADOOP_NAME_IN_ZABBIX configured_capacity $configured_capacity
$HADOOP_NAME_IN_ZABBIX dfs_used $dfs_used
$HADOOP_NAME_IN_ZABBIX dfs_used_persent $dfs_used_persent
$HADOOP_NAME_IN_ZABBIX non_dfs_used $non_dfs_used
$HADOOP_NAME_IN_ZABBIX dfs_remaining $dfs_remaining
$HADOOP_NAME_IN_ZABBIX dfs_remaining_persent $dfs_remaining_persent
$HADOOP_NAME_IN_ZABBIX datanodes_usages $datanodes_usages" > $DATA_FILE



#--------------------------------------------------------------------------------------------
# Check the size of $DATA_FILE. If it is not empty, use zabbix_sender to send data to Zabbix.
#--------------------------------------------------------------------------------------------
if [[ -s $DATA_FILE ]]
then
   zabbix_sender -vv -z 127.0.0.1 -i $DATA_FILE 2>>$LOG_FILE 1>>$LOG_FILE
   echo  -e "Successfully executed $COMMAND_LINE" >>$LOG_FILE
   mv $DATA_FILE $BAK_DATA_FILE
   echo "OK"
else
   echo "Error in executing $COMMAND_LINE" >> $LOG_FILE
   echo "ERROR"
fi


# debug: sh cluster-hadoop-plugin.sh 10.41.236.209 50070 master1 DFS
```
#### 监控项 <small>示例</small>
外部检查：
```bash
cluster-hadoop-plugin.sh ${HADOOP_NAMENODE_HOST} ${HADOOP_NAMENODE_METRICS_PORT} ${ZABBIX_NAME} DFS
```

监控项
Zabbix采集器：键值live_nodes 


## 如何调试
### agent机器进入zabbix用户调试
如果需要在被监控机器执行脚本获取监控数据，可以使用UserParameter功能，Agent将会在被监控机器上以zabbix用户执行对应的命令。经常会出现权限问题等，调试时需要切换用户，以下是切换用户的命令：
> sudo su -s /bin/bash zabbix

