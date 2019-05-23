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
### 内存占用多少后启动物理内存
>cat /proc/sys/vm/swappiness
60

上面这个60代表物理内存在使用60%的时候才会使用swap
swappiness=0的时候表示最大限度使用物理内存，然后才是 swap空间，
swappiness＝100的时候表示积极的使用swap分区，并且把内存上的数据及时的搬运到swap空间里面。

通常情况下：
swap分区设置建议是内存的两倍 （内存小于等于4G时），如果内存大于4G，swap只要比内存大就行。另外尽量的将swappiness调低，这样系统的性能会更好。  

修改swappiness参数  
临时性修改：
>sysctl vm.swappiness=10
vm.swappiness = 10

> cat /proc/sys/vm/swappiness
10

永久性修改：
>vim /etc/sysctl.conf
vm.swappiness = 35

>sysctl -p  

查看是否生效：
cat /proc/sys/vm/swappiness
35

### 检查哪个进程使用最多swap内存
手动命令：
>在 top 命令中，按 f，就是 field 的意思，调出列选项，把 swap 列显示出来，然后按 O，大写的，应该是 order 的意思，选择按照 swap 列进行排序，可以看到下面的结果

脚本：
```bash
#!/bin/bash
 
##############################################################################
# 脚本功能 ： 列出正在占用swap的进程。
###############################################################################
 
echo -e "PID\t\tSwap\t\tProc_Name"
 
# 拿出/proc目录下所有以数字为名的目录（进程名是数字才是进程，其他如sys,net等存放的是其他信息）
for pid in `ls -l /proc | grep ^d | awk '{ print $9 }'| grep -v [^0-9]`
do
    # 让进程释放swap的方法只有一个：就是重启该进程。或者等其自动释放。放
    # 如果进程会自动释放，那么我们就不会写脚本来找他了，找他都是因为他没有自动释放。
    # 所以我们要列出占用swap并需要重启的进程，但是init这个进程是系统里所有进程的祖先进程
    # 重启init进程意味着重启系统，这是万万不可以的，所以就不必检测他了，以免对系统造成影响。
    if [ $pid -eq 1 ];then continue;fi
    grep -q "Swap" /proc/$pid/smaps 2>/dev/null
    if [ $? -eq 0 ];then
        swap=$(grep Swap /proc/$pid/smaps \
            | gawk '{ sum+=$2;} END{ print sum }')
        proc_name=$(ps aux | grep -w "$pid" | grep -v grep \
            | awk '{ for(i=11;i<=NF;i++){ printf("%s ",$i); }}')
        if [ $swap -gt 0 ];then
            echo -e "${pid}\t${swap}\t${proc_name}"
        fi
    fi
done | sort -k2 -n | awk -F'\t' '{
    pid[NR]=$1;
    size[NR]=$2;
    name[NR]=$3;
}
END{
    for(id=1;id<=length(pid);id++)
    {
        if(size[id]<1024)
            printf("%-10s\t%15sKB\t%s\n",pid[id],size[id],name[id]);
        else if(size[id]<1048576)
            printf("%-10s\t%15.2fMB\t%s\n",pid[id],size[id]/1024,name[id]);
        else
            printf("%-10s\t%15.2fGB\t%s\n",pid[id],size[id]/1048576,name[id]);
    }
}'
```


<!--stackedit_data:
eyJoaXN0b3J5IjpbMTIwOTMwNjc1MywxOTYzMzEwODUwXX0=
-->