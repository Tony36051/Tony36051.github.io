---
title: Linux常用命令组合
date: 2018-05-02 09:57
tag: 
- Linux
---
身为半个运维人员，日常使用Linux命令组合很多，每次都记不住，特此笔记。
<!--more-->
## 查看系统信息
>lsb_release -a

## 硬件信息
```bash
# 总核数 = 物理CPU个数 X 每颗物理CPU的核数 
# 总逻辑CPU数 = 物理CPU个数 X 每颗物理CPU的核数 X 超线程数
# 查看物理CPU个数 
cat /proc/cpuinfo| grep "physical id"| sort| uniq| wc -l
# 查看每个物理CPU中core的个数(即核数) 
cat /proc/cpuinfo| grep "cpu cores"| uniq 
查看逻辑CPU的个数 
cat /proc/cpuinfo| grep "processor"| wc -l
# 查看CPU信息（型号）
cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c
# 查看内存信息
cat /proc/meminfo
```
## 进程相关
通过ps、grep和kill批量杀死进程
```bash
pkill -f <部分进程名>
ps aux|grep python|awk '{print $2}'|xargs kill -9
```
## 批量执行
### pssh
#### pssh使用sudo
关键是使用ssh的参数`-tt`, 在pssh使用`-X`传递ssh参数。
举例如何使用：批量修改密码，前提已经有ssh互信
```bash
cat chpass.txt
hadoop:hadoop_password
pscp -h list_ip.txt chpass.txt /tmp/chpass.txt
pssh -h list_ip.txt -i -X -tt "sudo chpasswd < /tmp/chpass.txt"
```

## centos7设置yum代理
1.在/etc/yum.conf 添加
proxy=http://192.168.1.10:8088/
2.如果代理环境中有证书，回导致源更新失败，可以继续添加
sslverify=false

## 免密登录ssh-copy-id
**ssh-keygen** 产生公钥与私钥对.
**ssh-copy-id**  将本机的公钥复制到远程机器的authorized_keys文件中，ssh-copy-id也能让你有到远程机器的home, ~./ssh , 和 ~/.ssh/authorized_keys的权利
```bash
ssh-keygen
ssh-copy-id -i ~/.ssh/id_rsa.pub root@192.168.x.xxx
```

## windows换行转为linux版,解决^M问题
```bash
**单个的文件装换**  
sed -i 's/\r//' filename  
  
**批量的文件装换**  
sed -i 's/\r//' filename1 filename2 ...  
或  
find ./  -name "*.sh" |xargs sed -i 's/\r//'
```
## 压缩成带有时间文件名的文件
```bash
tar -zcvf somedir-$(date +%Y%m%d-%H%M).tar.gz somedir/
```
## 自动删除n天前日志
```bash
# 将/opt/soft/log/目录下所有30天前带".log"的文件删除
find /opt/soft/log/ -mtime +30 -name "*.log" -exec rm -rf {} \;
```
## vim 粘贴带注释
>set paste

## Jenkins中命令忽略错误, 返回0
>command || true  # 无论command是否成功, 都能继续执行后续动作

## 
