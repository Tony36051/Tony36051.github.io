---
title: Linux的swap占用过高
date: 2019-05-18
tags: 
- Linux
categories:
- 运维
---
OS的监控告警，swap占用超过80%，记录解决思路
<!--more-->
## 事件
监控告警Linux系统的swap占用超过80%。
## 相关知识
### Swap使用过高解决方法
首先要保证内存剩余要大于等于swap使用量，否则会宕机！根据内存机制，swap分区一旦释放，所有存放在swap分区的文件都会转存到物理内存上。通常通过重新挂载swap分区完成释放swap。
```bash
Swapoff –a 或 swapoff /dev/sda2
# 停止swap 使用free查看，成功后swap空间会归零
Swapon –a 或 swapon /dev/sda2
# 启动swap 使用free查看，成功后swap回复
```
### 
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTk3MzU5MjgyNSwxOTYzMzEwODUwXX0=
-->