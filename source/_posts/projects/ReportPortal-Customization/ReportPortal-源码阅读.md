---
title: ReportPortal 源码阅读
date: 2018-07-23
tags:
- ReportPortal 
- Java 
categories:
- Dev
---
在智能测试日志智能洞察的实现过程中,发现已经有epam公司的ReportPortal已经以GPLv3开源了, 实现的功能非常一致. 遂需要对其进行调研, 看看二次开发成本和拿来主义的实施成本.
<!--more-->

# service-api

## gradle看第三方库依赖

本质应该是一个springboot, 对接springcloud, 列举一些使用的到内外的包:
内:
commons-dao/commons-rules/commons-model/commons
外:
spring: retry/consul/security/aop/web/freemarker/actuator/oauth2/mongodb
commons-fileupload/commons-validator/javax.mail
slf4j/logback
quartz
poi/jasperreports
swagger
test: hamcrest/junit/mockito/jsonpath/fakemongo

## RP的相关包介绍
### commons-dao数据库实体层
com.epam.ta.reportportal.database.entity `实体对象`
XXXRepository: 持久层
com.epam.ta.reportportal.database.dao `数据访问层`: 接口多继承领域接口
com.epam.ta.reportportal.database.search, controller条件到查询条件的转化

### commons-model模型DTO
com.epam.ta.reportportal.ws.model.* `DTO`定义和序列化
`xxxRS`: 服务器返回Result
`xxxRQ`: 请求服务器的Request

### service-api核心服务
com.epam.ta.reportportal.ws.controller(.impl) `controller层`
com.epam.ta.reportportal.ws.converter 转化
com.epam.ta.reportportal.core.\*(.impl) `service服务层` 
`xxxHandler`: 其实就是各种服务, 相当于xxxService

## 调用链
```mermaid
graph LR
  client-->|json|controller
  controller-->|xxxRQ|handler(handler:查)
  handler-->|condi|repository
  repository-->|自定义Query|MongoDB  
```
```mermaid
graph RL
  MongoDB-->|entity|handler(handler:业务规则做鉴权/存在校验,构造)
  handler-->|xxxResource|controller
  controller-->|xxxRS|client
  subgraph handler返回值流程
    entity-->BussinessRule
    BussinessRule-->entity
    entity-->xxxAssembler
    xxxAssembler-->xxxConventer(xxxConventer:流式map)
    xxxConventer-->xxxResource
  end
```

## controller看对外接口
14个controller, 可以从http://10.75.76.163:8080/ui/#api看swagger界面
Activity: 关联用户和项目, 有历史信息, 应该是某人在某个项目操作过的一些kv
Dashboard: 关联项目, 看板, 内含widget的id/size/pos
External System: 外部缺陷跟踪系统, 注册实例, 提单
File Storage: 内部文件存储, 上传图片, **仅包括用户头像**
Launch: 执行任务, 新建/停止/查询by用户/-项目
**Log**: 测试日志, 下挂在test item(用例)下, 时间/内容/级别
Plugin: 插件, 只有心跳
**Project**: 项目, 配置分析/邮件/外部系统/job间隔/用户列表, 分配用户/删除项目移除es索引
Project Settings: 项目配置
Settings: 系统设置, 按profile粒度
**Test Item**: 既是`用例`也是`用例套`
1. 查询: 可以按父亲/缺陷类型/路径/外部系统/id/参数的kv/launch/tags/时间; 
2. 历史情况: 跟在Launch下, 原因/launchId/参数kv/统计
3. 新建用例, 提供父亲/参数KV/tags/type(SUITE, CASE)/id

User: 用户, 注册/改密/查询/登录, 登录信息存Principal
User Filter: (某人)项目的过滤条件, 描述/实体/名字/排序和分页/是否共享/launch
Widget: 内容/小工具/元数据/名字/是否共享, 可以获取预览

# agent-python-RobotFramework
## service
这个类对python-client做了简单的封装和异常处理, 用的都是静态方法. uuid作为token
## variable
检查listener所需的变量是否存在, 打印提示信息. 记录变量值到类中
## model
这里的listener用的RobotFramework的listener API 2版本, model做了attributes到模型对象的封装
## listener
>ROBOT_LISTENER_API_VERSION = 2 # 这行指定了试用api2的版本, 可以支持到keyword的信息获取, 但api v2都是不能修改的, 已经足够了

1. 依旧使用list模拟stack, 完成树的遍历
2. start/end_suite中的`attributes["id"] == "s1"` 判断是否为根的用例套
## bug坑
然而官方的这个版本有问题, 虽然agent传值是对的, 但是在页面上展示的层级是错的, 用例被展示为suite, keyword/step被识别为test.
翻看github的issue发现有人已经针对这个bug做了魔改, 刻意把返回类型给改了
https://github.com/ailjushkin/robotframework-reportportal-ng/


# client-python
## service
封装http请求, 处理launch的开闭, test item的开闭, 日志的发送.
1. 用requests处理http请求, 应该是同步的
2. launch开始, 记录launch id, agent每次使用应该都会先开launch
3. test item是树状结构, 用栈顶记录父亲id, 结束testitem时候出栈, 其实就是用栈深度遍历的思路, 刚好也是树状结构的测试步骤执行的顺序.
4. log如果没有附件, 直接post即可. 如果有(多个)附件, 将多个文件单独构造为合适的请求格式, 这里比较绕, 主要是适配requests库post文件的格式, 同时对齐service-api的接口定义.
## service_async
用队列封装service的同步动作, 使其有异步的特性.
1. 队列存的是方法名和参数, 异步调用即将方法名和参数入队
2. 由_monitor方法循环检查能否出队, 出队调用handle方法处理(里面用process_item调同步方法)
3. 另外单独起进程管理队列的生命周期



# 说明
## 版本说明
1. client用官方的
2. agent用民间魔改版
然而官方的这个版本有问题, 虽然agent传值是对的, 但是在页面上展示的层级是错的, 用例被展示为suite, keyword/step被识别为test.
翻看github的issue发现有人已经针对这个bug做了魔改, 刻意把返回类型给改了
https://github.com/ailjushkin/robotframework-reportportal-ng/

## 命令
### agent管理launch
>pybot -v RP_UUID:"58b1b092-6305-46fe-a15f-16c2e2081e25" -v RP_ENDPOINT:"http://100.84.93.68:8080" -v RP_LAUNCH:"demo-launch" -v RP_PROJECT:"wjs-debug" -P D:\git\rf-agent\client-Python-3.2.0 -P D:\git\rf-agent\robotframework-reportportal-ng-master --listener reportportal_listener <后续原命令参数>
### 人工管理launch
其中`5b5a7b29f7eecc0001c39c0d`为launchId
>pybot -v RP_UUID:"58b1b092-6305-46fe-a15f-16c2e2081e25" -v RP_ENDPOINT:"http://100.84.93.68:8080" -v RP_LAUNCH:"demo-launch" -v RP_PROJECT:"wjs-debug" -P D:\git\rf-agent\client-Python-3.2.0 -P D:\git\rf-agent\robotframework-reportportal-ng-master --listener reportportal_listener:5b5a7b29f7eecc0001c39c0d <后续原命令参数>


## 并行执行多launch任务
每个pybot命令会起一个agent, 每次agent都会先开一个luanch, 最后结束掉.
如果需要多个pybot命令的执行结果汇总在一起, 需要共用一个launchId. 这就要求执行者手工管理launch的开启和结束
### 请求的公共部分
uuid作为token:58b1b092-6305-46fe-a15f-16c2e2081e25
Headers:
```
Authorization:bearer 58b1b092-6305-46fe-a15f-16c2e2081e25
Content-Type:application/json
```
### 开启
url地址以:/api/v1为开始, wjs-debug为项目名
POST http://100.84.93.68:8080/api/v1/wjs-debug/launch
```json
request:
{
  "name": "demo-launch",
  "start_time": "2018-07-27T09:53:42+08:00"
}
response
{
    "number": 31,
    "id": "5b5a7b29f7eecc0001c39c0d"
}
```
### 结束
url地址以:/api/v1为开始, wjs-debug为项目名, launch后的5b5a7b29f7eecc0001c39c0d为launchId
PUT http://100.84.93.68:8080/api/v1/wjs-debug/launch/5b5a7b29f7eecc0001c39c0d/finish
```
request:
{
  "end_time": "2018-07-27T09:55:42+08:00",
  "status": "PASSED"
}
response:
{
    "msg": "Launch with ID = '5b5a7b29f7eecc0001c39c0d' successfully finished."
}
```
# 部署
## 宿主机修改
### 修改vm.max_map_count
修改此项之后, elastic才能使用
>sysctl -w vm.max_map_count=262144
### 目录权限
elastic不能以root执行, 在docker-compose.yml同目录下执行以下命令:
```bash
mkdir -p data/elasticsearch
chown -R 1000:1000 data/elasticsearch
```

docker-compose 方式启动, 为了不影响我司代理, 暴露部分端口, 改为以下:
```yml
version: '2'
services:
  mongodb:
    image: 'mongo:3.4'
    restart: always
    ports:
      - '27017:27017'
    environment:
      - TZ=Asia/Shanghai
    volumes:
      - ./data/mongo:/data/db
    restart: always

  registry:
    image: 'consul:1.0.6'
    volumes:
      - './/data/consul:/consul/data'
    ports:
      - '8500:8500'
    command: agent -server -bootstrap-expect=1 -ui -client 0.0.0.0
    environment:
      - 'CONSUL_LOCAL_CONFIG={"leave_on_terminate": true}'
      - TZ=Asia/Shanghai
    restart: always
  uat:
    image: 'reportportal/service-authorization:4.2.0'
    depends_on:
      - mongodb
    environment:
      - RP_PROFILES=docker
      - RP_SESSION_LIVE=86400
      - TZ=Asia/Shanghai
    restart: always
  gateway:
    image: 'traefik:1.6.3'
    ports:
      - '8080:8080'
    environment:
      - TZ=Asia/Shanghai
    command:
      - '--consulcatalog.endpoint=registry:8500'
      - '--defaultEntryPoints=http'
      - '--entryPoints=Name:http Address::8080'
      - '--web'
      - '--web.address=:8081'
    restart: always
  index:
    image: 'reportportal/service-index:4.2.0'
    environment:
      - RP_SERVER_PORT=8080
      - RP_PROXY_CONSUL=true
      - TZ=Asia/Shanghai
    depends_on:
      - registry
      - gateway
    restart: always
  api:
    image: 'reportportal/service-api:4.2.1'
    depends_on:
      - mongodb
    volumes:
      - ./rp-api-1.0.0-SNAPSHOT.jar:/app.jar
    environment:
      - TZ=Asia/Shanghai
      - RP_PROFILES=docker
      - 'JAVA_OPTS=-Xmx1g -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8081'
    restart: always
    ports:
      - '8081:8081'
      - '8082:8080'
  ui:
    image: 'reportportal/service-ui:4.2.2'
    environment:
      - RP_SERVER.PORT=8080
      - RP_CONSUL.TAGS=urlprefix-/ui opts strip=/ui
      - 'RP_CONSUL.ADDRESS=registry:8500'
      - TZ=Asia/Shanghai
    restart: always
  analyzer:
    image: 'reportportal/service-analyzer:4.2.0'
    depends_on:
      - registry
      - gateway
      - elasticsearch
    restart: always

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch-oss:6.1.1
    restart: always
    volumes:
        - ./data/elasticsearch:/usr/share/elasticsearch/data
    environment:
      - bootstrap.memory_lock=true
    ulimits:
      memlock:
        soft: -1
        hard: -1

networks:
  default:
    driver: bridge
    ipam:
      config:
        - subnet: 192.168.1.0/24
          gateway: 192.168.1.1

```
