---
title: Systemd使用（systemctl命令）
date: 2019-06-18
tag: 
- Linux
categories:
- 运维
---
作为一个测试+运维人员，经常需要使用jenkins做持续集成，将jenkins作为守护进程有很多方法，其中一个就是用systemd。
<!--more-->
## systemd是什么
**管理系统所有进程、服务以及启动项等**的软件简称「系统管理器」

## 查看
### **2.1 查看系统所有安装的服务项**

```bash
systemctl list-unit-files --type=service
```
使用  `PageUp`  或  `PageDown`  翻页，查看完毕后按  `q`  退出。

### **2.2 查看系统所有运行的服务项**

```text
systemctl list-units --type=service
```

如果看到某个服务项前面有一个红点，说明该服务存在问题，请进行排查。

使用  `PageUp`  或  `PageDown`  翻页，查看完毕后按  `q`  退出。

### **2.3 查看系统所有开机自启动的服务项**

```text
systemctl list-unit-files --type=service | grep enabled
```

### **2.4 查看指定服务项状态**

```text
systemctl status <服务项名称>
```

执行命令之后，系统会显示该服务项的状态、是否已激活、描述以及最后十条日志。

如果服务项前面有一个红点，说明该服务存在问题，请根据日志进行排查。

**例如**

查看 Nginx 服务状态

```text
[root: ~]# systemctl status nginx.service
```
### **2.6 查看出错的服务**

```text
systemctl list-units --type=service --state=failed
```
## 管理服务
### **3.1 启动服务**

```text
systemctl start <服务项名称>
```

### **3.2 停止服务**

```text
systemctl stop <服务项名称>
```

### **3.3 重启服务**

```text
systemctl restart <服务项名称>
```

### **3.4 重新读取配置文件**

如果该服务不能重启，但又必须使用新的配置，这条命令会很有用。

```text
systemctl reload <服务项名称>
```

### **3.5 使服务开机自启动**

```text
systemctl enable <服务项名称>
```

### **3.6 使服务不要开机自启动**

```text
systemctl disable <服务项名称>
```

## 创建服务
### **4.1 服务文件的位置**
CentOS 7的服务systemctl脚本存放在：/usr/lib/systemd/，有系统 system 和用户 user 之分。
```
/lib/systemd/system  
/run/systemd/system  
/etc/systemd/system
```
在`/etc/systemd/system`下面创建`nginx.service.d`目录，在这个目录里面新建任何以.conf结尾的文件，然后写入我们自己的配置。
### **4.2 服务文件的模版**

以下是最简单的配置模版，直接根据提示或注释修改参数值，然后去掉所有注释即可。

```text
[Unit]
Description=<服务描述>
After=<在哪个模块（服务）之后启动（可选）>

[Service]
Type=<simple|forking|oneshot>
ExecStart=<程序或命令参数>
# 如果 "ExecStart=" 后面的程序或命令是在前台持续运行的，那么 "Type=" 后面应填写 "simple"。
# 如果 "ExecStart=" 后面的程序或命令是在后台持续运行的，那么 "Type=" 后面应填写 "forking"。
# 如果 "ExecStart=" 后面的程序或命令是在前台运行一下就退出的，那么 "Type=" 后面应填写 "oneshot"。
ExecReload=<重新读取配置文件的命令（可选）>
KillSignal=SIGTERM
KillMode=mixed

[Install]
WantedBy=multi-user.target
```

> **说明**  
> • 创建服务文件之后，最好执行一下  `systemctl daemon-reload`  再启用。
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTUyNDMwNTU2Niw1MTQzNDY1NTksNjcwMz
c0NTEwXX0=
-->