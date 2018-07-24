---
title: ReportPortal源码阅读
date: 2018-07-23

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
com.epam.ta.reportportal.core.*(.impl) `service服务层` 
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


