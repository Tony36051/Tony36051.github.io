---
title: RobotFramework测试目标程序
categories:
  - 测试
tags:
  - RobotFramework
date: 2018-09-22 16:43:13
typora-root-url: RobotFramework入门级概览
---
在说明RobotFramework框架之前, 需要一些被测程序, 本文用于说明目标程序.
<!--more-->

# login.py

程序来源: https://github.com/robotframework/QuickStartGuide

该程序是RobotFramework官方Quick Start教程的被测程序, 以下简单说明其功能.

该程序是一个简单的用户登录例子, 这是个命令行实现的验证程序, 允许调用者进行以下三个操作:

- 用合规的密码创建用户
- 用有效的账号和密码登录
- 修改现有账号的密码

以下是一些调用的实例:

不存在的用户使用合规的密码登录, 将得到一样的错误提示

```bash
> python sut/login.py login nobody P4ssw0rd
Access Denied
```

创建用户之后, 可以成功登录

```
> python sut/login.py create fred P4ssw0rd
SUCCESS

> python sut/login.py login fred P4ssw0rd
Logged In
```

密码合规的验证规则: 7-12位, 必须包含大小写字母和数字, 但不允许包含特殊字符.

```
> python sut/login.py create fred short
Creating user failed: Password must be 7-12 characters long

> python sut/login.py create fred invalid
Creating user failed: Password must be a combination of lowercase and
uppercase letters and numbers
```

修改密码的用例:

```
> python sut/login.py change-password fred wrong NewP4ss
Changing password failed: Access Denied

> python sut/login.py change-password fred P4ssw0rd short
Changing password failed: Password must be 7-12 characters long

> python sut/login.py change-password fred P4ssw0rd NewP4ss
SUCCESS
```

该应用程序使用简单的"数据库"去保存用户的信息, 其实是保存在操作系统的临时文件所在的目录, 文件名默认为`robotframework-quickstart-db.txt`

