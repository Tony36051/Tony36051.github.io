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
使用前请确认`free -h`的空余内存多余
```bash
Swapoff –a 或 swapoff /dev/sda2
# 停止swap 使用free查看，成功后swap空间会归零
Swapon –a 或 swapon /dev/sda2
# 启动swap 使用free查看，成功后swap回复
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTk2MzMxMDg1MF19
-->