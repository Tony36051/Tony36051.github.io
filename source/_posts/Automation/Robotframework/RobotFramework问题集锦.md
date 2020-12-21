---
title: RobotFramework问题集锦
categories:
  - Test
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

### 打开chromedriver时候，增加（命令行）参数
```
${args_list}	Create List	user-data-dir=${OUTPUT DIR}${/}chrome_data	enable-precise-memory-info
${chromeOptions}	Create Dictionary	args	${args_list}
${cap_dict}	Create Dictionary	chromeOptions	${chromeOptions}
Open Browser	${url}	chrome	desired_capabilities=${cap_dict}
```

