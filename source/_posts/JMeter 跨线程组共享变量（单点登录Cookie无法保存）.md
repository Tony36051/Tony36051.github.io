---
title: JMeter 跨线程组共享变量（单点登录Cookie无法保存）
date: 2019-05-05 15:46
tag: 
- JMeter

categories:
- 测试
---
我司采用单点登录用Cookie做身份认证，在进行JMeter性能测试时，仅使用HTTP Cookie Manager仍提示未登录。原因在于单点登录服务器的域名与待测试的服务器域名不一致，Cookie Manager不支持跨域Cookie。本文介绍两种方法来处理。
<!--more-->
# JMeter 跨线程组共享变量（单点登录Cookie无法保存）

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTIzMjg3OTI3OCwtMTY4NjA3NDcyNF19
-->