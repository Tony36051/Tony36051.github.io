---
title: Aansible 启动 Tomcat，解决环境变量、执行后退出问题
date: 2018-05-08
tags:
- Aansible
- SSH
- Tomcat
categories:
- ops
---
作为团队QA角色，在环境搭建上使用ansible作为部署运维的自动化工具，在启动tomcat、presto、kylin时，遇到环境变量不对，无法启动；启动没报错但发现没有启动，发现进程启动了又退出了。本文简要记述相关原因与解决方案。
<!--more-->
# 环境变量
## 问题
>ansible调用playbook远程mvn执行打包时发现执行出错，找不到`JAVA_HOME`

>Please make sure the user has the privilege to run hbase shell

## 排查

登录远程服务器执行env与ansible执行env命令，看到环境变量不一样

## 原因

login shell 和 non-login shell的区别造成的，该情况还可能出现在ssh登录后执行命令。
具体分析请看：[关于ansible远程执行的环境变量问题（login shell & nonlogin shelll）](https://blog.csdn.net/u010871982/article/details/78525367)
敲黑板，记笔记！
* login shell：取得bash时需要完整的登入流程的，就称为login shell。举例来说，你要由tty1~tty6登入，需要输入用户的账号和密码，此时取得的bash就称为『login shell』啰；  
* **login shell加载环境变量的顺序**：① /etc/profile ② ~/.bash_profile ③ ~/.bashrc ④ /etc/bashrc  
---
* non-login shell：取得bash接口的方法不需要重复登入的举动，举例来说，(1)你以Xwindow登入Linux后，再以X的图形化接口启动终端机，此时那个终端接口并没有需要再次的输入账号和密码，那个bash的环境就称为non-login shell了。(2)你在原本的bash环境下再次下达bash这个命令，同样的也没有输入账号密码，那第二个bash (子程序)也是non-login shell 。
* **non-login shell加载环境变量的顺序**： ① ~/.bashrc ② /etc/bashrc
## 解决方案和建议
1. 将环境变量写到`~/.bashrc`【推荐，一步解决】
2. 在ssh中先source后再执行命令；在ansible中用shell模块source后再执行。说明：shell后的第一个`.`默认指/bin/sh。
```yaml
- name: source ~/.bash_profile and run
  shell: . /home/username/.bashrc && [the actual command you want run]
```
3. 用sudo -i 模拟`login shell`，ansible_user_id可以为user_id或user_name
```yaml
- name: source bashrc
  shell: sudo -iu {{ansible_user_id}} [the actual command you want run]
```

# 启动后没有进程
## 问题
ansible-playbook执行没有报错，但应用却没有启动。
## 排查
在启动的过程中，开另外的窗口，`ps -ef | grep kylin`观察到有启动的进程，但后来又消失了。
## 原因
ansible应该是fork进程来执行脚本，执行后ansible退出父进程，子进程也同时被关闭掉
## 解决方案
nohup一下即可
```bash
nohup /home/hadoop/soft/kylin/bin/kylin.sh start &
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEyMjY1NjE5MTNdfQ==
-->