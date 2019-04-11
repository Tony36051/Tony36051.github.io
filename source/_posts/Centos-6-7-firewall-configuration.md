---
title: Centos 6/7的防火墙配置
date: 2017-08-23
tags:
- Linux
---
Centos 6/7的防火墙配置略有差异，仅作小记。
<!--more-->
## Centos 6 防火墙端口
```bash
iptables -I INPUT -p tcp --dport 8080 -j ACCEPT #开启8080端口  
iptables save #保存配置  
iptables restart #重启服务  
```


## Centos 7 
开启端口
>firewall-cmd --zone=public --add-port=80/tcp --permanent

命令含义：
--zone #作用域
--add-port=80/tcp  #添加端口，格式为：端口/通讯协议
--permanent  #永久生效，没有此参数重启后失效

重启防火墙
> firewall-cmd --reload

## mermaid

```flow
st=>start: Start
e=>end
op=>operation: My Operation
cond=>condition: Yes or No?

st->op->cond
cond(yes)->e
cond(no)->op
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEyNDM5NzU3ODEsMTI4Njg5MDMzM119
-->