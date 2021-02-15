---
title: 移动光猫I-240EM和路由padavan配置方法
date: 2021-02-15 

---


移动几乎没有公网ip，开启ipv6当作公网ip

<!--more-->

# 光猫配置

## 账号密码

没找到漏洞，看别人的文章，直接猜中密码。

账号 CMCCAdmin
密码 aDm8H%MdA

## Internet设置

操作路径： 网络-宽带连接-Internet连接-链接名称选带有Internet的
关键点是ip模式要选择`IPv4&IPv6`

```
连接名称:	
2_INTERNET_B_VID_41
封装类型:	IPoE     PPPoE
业务类型	
INTERNET
连接模式:	
桥接
   
IP模式	
IPv4&IPv6
启用 VLAN:	
Vlan ID:	
41
802.1p:	
0
LAN 端口绑定:	LAN1 LAN2 LAN3 LAN4 
```

## Lan设置

操作路径： 网络-LAN地址设置-IPV6设置

```
IPV6 LAN侧主机设置
DNS来源	
家庭网关代理
前缀来源	
网络连接
接口	
无

☑️ 启用DHCPv6服务器
起始地址:	
0:0:0:2
结束地址:	
0:0:0:255


地址信息是否通过DHCP获取 ☑️
其他信息是否通过DHCP获取 ☑️
RA报文最大自动发送时间	
600
RA报文最小自动发送时间	
200

```

# 路由器设置

操作路径： 高级设置-外部网络(WAN)-IPv6设置

```
IPv6 连接类型:	
Native DHCPv6
IPv6 硬件加速	
Offload for LAN/WLAN
选择 IPv6 外网接口:	
WAN (ppp0)
外网连接类型:	PPPoE
IPv6 外网设置:
获取 IPv6 外网地址:	
Stateless: RA
启用隐私扩展 (RFC 4941)	
否 (*)
DNSv6 外网设置
自动获取 IPv6 DNS:	
是
IPv6 内网设置
通过 DHCPv6 获取内网 IPv6 地址:	
是
启用 LAN 路由器通告	
是
启用 LAN DHCPv6 服务器:	
Stateless (*)

```