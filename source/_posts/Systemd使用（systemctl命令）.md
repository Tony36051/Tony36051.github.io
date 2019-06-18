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
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEyODY1NjYxODcsNjcwMzc0NTEwXX0=
-->