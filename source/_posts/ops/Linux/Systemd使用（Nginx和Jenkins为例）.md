---
title: Systemd使用（Nginx和Jenkins为例）
date: 2019-06-18
tag: 
- Linux
- Systemd
categories:
- Ops
---
作为一个测试+运维人员，经常需要使用jenkins做持续集成，将jenkins作为守护进程有很多方法，其中一个就是用systemd。
<!--more-->

# Systemd使用（Nginx和Jenkins为例）

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

每一个服务以.service结尾，一般会分为3部分：[Unit]、[Service]和[Install]，就以nginx为例吧，具体内容如下：

```ini
[Unit]
Description=nginx - high performance web server
Documentation=http://nginx.org/en/docs/
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/usr/local/nginx/logs/nginx.pid
ExecStartPre=/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

## 配置项说明

下面分别解释下着三部分的含义

_[Unit]_

-   Description : 服务的简单描述
-   Documentation ： 服务文档
-   After= : 依赖，仅当依赖的服务启动之后再启动自定义的服务单元

_[Service]_

-   Type : 启动类型simple、forking、oneshot、notify、dbus
    -   Type=simple（默认值）：systemd认为该服务将立即启动，服务进程不会fork。如果该服务要启动其他服务，不要使用此类型启动，除非该服务是socket激活型
    -   Type=forking：systemd认为当该服务进程fork，且父进程退出后服务启动成功。对于常规的守护进程（daemon），除非你确定此启动方式无法满足需求， 使用此类型启动即可。使用此启动类型应同时指定`PIDFile=`，以便systemd能够跟踪服务的主进程。
    -   Type=oneshot：这一选项适用于只执行一项任务、随后立即退出的服务。可能需要同时设置  `RemainAfterExit=yes`  使得  `systemd`  在服务进程退出之后仍然认为服务处于激活状态。
    -   Type=notify：与  `Type=simple`  相同，但约定服务会在就绪后向  `systemd`  发送一个信号，这一通知的实现由  `libsystemd-daemon.so`  提供
    -   Type=dbus：若以此方式启动，当指定的 BusName 出现在DBus系统总线上时，systemd认为服务就绪。
-   PIDFile ： pid文件路径
-   ExecStartPre ：启动前要做什么，上文中是测试配置文件 －t
-   ExecStart：启动
-   ExecReload：重载
-   ExecStop：停止
-   PrivateTmp：True表示给服务分配独立的临时空间

_[Install]_

-   WantedBy：服务安装的用户模式，从字面上看，就是想要使用这个服务的有是谁？上文中使用的是：`multi-user.target`  ，就是指想要使用这个服务的目录是多用户。每一个.target实际上是链接到我们单位文件的集合,当我们执行 systemctl enable nginx.service  

就会在  `/etc/systemd/system/multi-user.target.wants/`  目录下新建一个  `/usr/lib/systemd/system/nginx.service`  文件的链接。

## Jenkins实例

### 创建service
```bash
sudo vim /etc/systemd/system/jenkins.service
```
```ini
[Unit]
Description=Tony's Jenkins

[Service]
WorkingDirectory=/root/.jenkins
Type=simple
ExecStart=/bin/sh -c "/usr/bin/java -Dhudson.model.DirectoryBrowserSupport.CSP= -Duser.timezone=Asia/Shanghai -jar /home/jenkins/jenkins.war"
KillSignal=SIGTERM
KillMode=mixed
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### 应用与生效
```bash
sudo systemctl daemon-reload
sudo systemctl enable jenkins.service
sudo systemctl start jenkins
sudo systemctl status jenkins
```