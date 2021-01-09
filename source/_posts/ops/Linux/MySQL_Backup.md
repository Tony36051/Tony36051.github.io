---
title: 备份MySQL数据
date: 2021-01-09
tags:
- Linux
- MySQL
categories:
- Ops
---
备份MySQL数据，简单的shell笔记。
<!--more-->

# 备份MySQL数据

```shell
work_path=$(dirname $(readlink -f "$0"))
cd $work_path
DATE=$(date +%Y%m%d)
/usr/bin/mysqldump -h example.com -uroot -proot --databases d_common > $DATE.sql
tar -cjf $DATE.sql.tar.bz2 $DATE.sql
rm -f $DATE.sql
```