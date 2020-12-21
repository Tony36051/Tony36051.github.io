---
title: RobotFramework入门级概览
categories:
  - Test
tags:
  - RobotFramework
date: 2018-09-22 19:45:10
typora-root-url: RobotFramework入门级概览
---
基于RobotFramework官方的Quick Start简化而成, 包括了安装, 编写, 执行, 查看等基本流程.
<!--more-->

# 安装

> pip install robotframework
>
> pip install docutils  # 可选

# 编写

测试目标是一个登陆模块, 涵盖了注册/登陆/修改密码的命令行工具, 编写一个测试脚本对其功能进行验证.

测试脚本的官方术语叫测试数据(Test Data), 测试数据分为四个部分, Settings/Test Cases/Keywords/Variables. 每个部分以\*号开始, 可以加任意空行提高可读性.

关键字和参数直接用两个或以上的空格分隔, 建议使用4个, 是否需要上下行对齐看个人洁癖情况.

Settings部分主要是引入库/资源文件/变量文件; 测试套的元数据如Setup/Teardown/timeout等; 

Testcase就是用例, 用例内每行一个步骤, 每个步骤以关键字为核心, 关键字右侧是关键字的参数, 左侧是关键字的返回.

Keywords是用户自定义的由其他关键字组成的更高抽象层次的关键字, 可以设定参数和返回值.

Variables是该常量定义区, 里面也可以使用系统内建的变量.

以下用例针登录模块的部分测试用例的实现, 本文并不会详细展开实现细节, 将在后续文章逐渐涉及.

`overview.robot`

```robot
*** Settings ***
Library    OperatingSystem
Suite Setup    Clear database

*** Test Cases ***
Login with nobody
    ${resp}    Login    nobody    P4ssw0rd
    should be equal as strings    ${resp}    Access Denied

Create and log in
    ${resp}    Create user  Tony    P4ssw0rd
    should be equal  ${resp}    SUCCESS
    ${resp}    Login          Tony  P4ssw0rd
    should be equal as strings  ${resp}     Logged In

*** Keywords ***
Clear database
    remove file     ${database_path}

Run target
    [Arguments]     ${option}   ${username}     ${password}     ${new_password}=${None}
    ${full_path}    set variable     ${targets_dir}${/}login.py
    ${resp}   run  python ${full_path} ${option} ${username} ${password}
    [Return]  ${resp}

Create user
    [Arguments]  ${username}    ${password}
    ${resp}  Run target  create  ${username}    ${password}
    [Return]  ${resp}

Login
    [Arguments]  ${username}    ${password}
    ${resp}  Run target  login    ${username}     ${password}
    [Return]  ${resp}

*** Variables ***
${targets_dir}      ${CURDIR}${/}..${/}targets
${database_path}    ${temp_dir}${/}robotframework-quickstart-db.txt
```

# 执行

RobotFramework3使用robot作为主要命令, 旧版2.9及以前使用pybot作为主要执行命令, 功能一致. 最基本的命令行格式robot <脚本路径>

假设使用本文提供的样例脚本, git clone **XXXX**

![执行截图](执行.png)

# 结果

测试用例执行后, 首先生成的是xUnit兼容的xml文件, 里面记录了测试执行的输出, 然后从output.xml文件中解析生成用于调试查看的`log.html`和查看整体结果的`report.html`报告文件.

# 被测对象 login.py

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

```bash
> python sut/login.py create fred P4ssw0rd
SUCCESS

> python sut/login.py login fred P4ssw0rd
Logged In
```

密码合规的验证规则: 7-12位, 必须包含大小写字母和数字, 但不允许包含特殊字符.

```bash
> python sut/login.py create fred short
Creating user failed: Password must be 7-12 characters long

> python sut/login.py create fred invalid
Creating user failed: Password must be a combination of lowercase and
uppercase letters and numbers
```

修改密码的用例:

```bash
> python sut/login.py change-password fred wrong NewP4ss
Changing password failed: Access Denied

> python sut/login.py change-password fred P4ssw0rd short
Changing password failed: Password must be 7-12 characters long

> python sut/login.py change-password fred P4ssw0rd NewP4ss
SUCCESS
```

该应用程序使用简单的"数据库"去保存用户的信息, 其实是保存在操作系统的临时文件所在的目录, 文件名默认为`robotframework-quickstart-db.txt`

