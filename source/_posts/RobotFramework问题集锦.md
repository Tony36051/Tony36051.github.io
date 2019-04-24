---
title: RobotFramework问题集锦
categories:
  - 测试
tags:
  - RobotFramework
date: 2019-04-24 11:26:26
---
### 关键字默认参数是变量，也需要定义
```
登录
    [Arguments]    ${url}=${Url_A3}    ${userName}=${User_A3}    ${passWord}=${Password_A3}
```
如果这里的`${Url_A3}`没有定义，会报错`Non-existing variable '${Url_A3}'.`


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEzMTE3MjMwMTddfQ==
-->