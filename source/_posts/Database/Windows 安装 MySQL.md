---
title: Windows 安装 MySQL
date: 2018-05-30
tags:
- Windows 安装 MySQL
categories:
- Database
---
Windows 安装 MySQL安装笔记
<!--more-->

# 下载
http://dev.mysql.com/downloads/mysql/，选择适合你的操作系统的版本，我是windows10 64位，选择Windows (x86, 64-bit), ZIP Archive，点“download”。页面跳转后选择“No thanks, just start my download.”
# 解压
下载完成后后，解压到本地目录，我解压到D:\mysql-5.7.16-winx64
# 配置
复制目录下“my-default.ini”文件，重命名为"my.ini"。修改为以下配置，注意对应修改路径
```
[mysqld]
# Remove leading # and set to the amount of RAM for the most important data
# cache in MySQL. Start at 70% of total RAM for dedicated server, else 10%.
innodb_buffer_pool_size = 128M

# Remove leading # to turn on a very important data integrity option: logging
# changes to the binary log between backups.
# log_bin

# These are commonly set, remove the # and set as required.
basedir = "D:\mysql-5.7.16-winx64/"
datadir = "D:\mysql-5.7.16-winx64/data/"
tmpdir = "D:\mysql-5.7.16-winx64/data/"
socket = "D:\mysql-5.7.16-winx64/data/mysql.sock"
log-error = "D:\mysql-5.7.16-winx64/data/mysql_error.log"
innodb_data_home_dir = "D:\mysql-5.7.16-winx64/data/"
port = 3306

# Remove leading # to set options mainly useful for reporting servers.
# The server defaults are faster for transactions and fast SELECTs.
# Adjust sizes as needed, experiment to find the optimal values.
join_buffer_size = 128M
sort_buffer_size = 2M
read_rnd_buffer_size = 2M 

sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER
    
[client]
default-character-set=utf8

```
# 初始化
因为没有data目录下的mysql数据，所以需要先初始化。
打开cmd，跳转到目录下bin目录中
>mysqld --initialize --user=mysql --console

该命令会生成基础的管理数据表，注意控制台cmd的返回，会有一个随机生成的密码，复制一下，备用
# 设置windows服务
还是在MySQL目录下的bin目录，使用cmd，执行以下命令将MySQL注册为Windows的服务
>mysqld install MySQL

接着打开MySQL服务，在cmd输入以下命令
>net start mysql

# 修改密码 
 >mysql -uroot -p

 输入刚才记下的随机密码
>set password = password('root')  # root就是你的新密码

