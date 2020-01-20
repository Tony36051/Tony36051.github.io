---
title: ReportPortal 二次开发笔记
date: 2018-10-25
tag: 
- MongoDB 
- ReportPortal 
categories: 
- Dev
typora-root-url: ReportPortal 二次开发笔记
---
ReportPortal二次开发中, 记录一些考量、感想
<!--more-->

# ReportPortal 二次开发笔记

## 需求
对测试用例执行的日志进行人工标记失败的根因，借助机器学习手段，预测后来执行的失败的用例失败的原因，减少人工分析的成本。
在适配一些比较明显的，但类似的日志，应该能取得很好的结果。
最开始打算自己实现 AILog 工程，自己实现一条龙： 采集日志数据-人工标记平台-预测结果，但是工作量太大。后续就决定基于ReportPortal进行二次开发了。

### 标注平台
主要扩展标注功能，原生是单个用例进行标注根因。
在原本基础上，加一个页签，查询类似相近的失败用例和日志，批量标注失败根因。

最初是想着在自己写个Java后台，但是要同步获取MongoDB的数据。后续发现还是直接在原代码上修改，替换原工程就好了。

## 关联取数据

MongoDB 查询
```js
db.getCollection('launch').aggregate([
    {// 筛选launch, strID筛选新数据, 项目名, launch+test名模糊匹配 
        $match: { launchId: {$exists:true} , projectRef:"cco1", name: {$regex: /PO/}}
    },
    {// 去掉不用的字段 
        $project:{_id:0, launchId:1, projectRef: 1, name:1}
    },
    {// 关联item
        $lookup:
        {
            from: 'testItem',
            localField: 'launchId',
            foreignField: 'launchRef',
            as: 'inner_item'
        }
    }, 
    {// 展开数组
        $unwind: "$inner_item"
    },
    {// 只取最底层步骤, 失败的步骤
        $match: {'inner_item.has_childs':false, 'inner_item.itemId': {$exists:true}, 'inner_item.status': 'FAILED'}
    },
    {// 嵌套item提升到根文档
        $addFields:{itemId: "$inner_item.itemId", "itemName": "$inner_item.name", "itemStatus": "$inner_item.status", "itemDesc": "$inner_item.itemDescription"}
    },
    {// 去掉嵌套文档
		$project: {inner_item:0}
    },
    {// 关联log
        $lookup:
        {
            from: 'log',
            localField: 'itemId',
            foreignField: 'testItemRef',
            as: 'inner_log'
        }
    },
    {// 展开log数组为n行
        $unwind: "$inner_log"
    },
    {// 日志级别筛选
        $match: {'inner_log.level.log_level':{$gt:30000}}
    },
    {// 嵌套log提升到根文档
        $addFields: {logMsg: "$inner_log.logMsg", logLevel: "$inner_log.level.log_level"}
    },
    {// 去掉嵌套文档
        $project: {inner_log:0}
    },
    {
        $group: 
        {
            _id: "$logMsg", caselog: {$push: "$$ROOT"}, count: {$sum:1}
        }
    },
    {
        $sort: {"count": -1}
    }
])

```

### 一条用例应该只有一个错误原因

所以在关联日志的时候, 没有AI介入之前, 勉强认为第一个出现的错误即为错误原因.
我的用例为RobotFramework写的GUI和数据库复合用例, 在用例结束之时会尝试去关闭数据库链接和浏览器, 这里会产生失败记录. 如果一个用例可以关联多条日志, 则会影响聚类分析的准确性.

### 日志做groupby的时候, 如果编辑距离小于n认为是一个group 的条件
// TODO
因为有些日志仅有几个字符差距, 本质上是一样的. 
使用topic生成, 编辑距离, 还是什么ai算法可以将 `f(logMsg)-->group cond`??

## 前端工程有小坑

JS编译并行化
两个let赋值语句build之后并行了
```js
let curUser = window.localStorage.getItem('curUser')
let projectName = window.localStorage.getItem(curUser + '_lastInsideHash')
if (projectName) {
  projectName = projectName.replace(/\/aimark/gi, '').replace(/#/gi, '')
} else {
  projectName = 'wjs-debug'
}
```
这个语句在build之后, 会变成类似以下代码, 导致projectName取不到值
```js
var i=window.localStorage.getItem('curUser'), n=window.localStorage.getItem(curUser + '_lastInsideHash')
```

## Agent修改
### 官方与第三方
第三方关于step的理解比原版更准确, 故使用第三方版本.
官方:
https://github.com/reportportal/agent-Python-RobotFramework
第三方:
https://github.com/ailjushkin/robotframework-reportportal-ng/


### 修改第三方, 减少依赖

修改文件: `reportportal_listener/service.py`
~~from robot.utils import PY2~~
import sys
将后文中的PY2替换为`sys.version_info[0] == 2`
~~from urllib3.exceptions import ResponseError~~
将后文中的ResponseError改为`Exception`

### 修改初始化rp, 去掉异常

修改文件: `reportportal_listener/service.py`
```python
	@staticmethod
    def init_service(endpoint, project, uuid):
        """Init service for Report Portal.

        Args:
            endpoint: ReportPortal API endpoint.
            project: project name in Report Portal.
            uuid: unique id of user in Report Portal profile.
        """
        if RobotService.rp is None:
            RobotService.rp = ReportPortalService(
                endpoint=endpoint,
                project=project,
                token=uuid)
        # else:
        #     raise Exception("RobotFrameworkService is already initialized.")
```

### 修改listener

修改文件: `reportportal_listener/__init__.py`
入参name没有使用, 修改方法最后一行. 用name比attributes['longname']更短, 展示的时候更符合testdata时候的结构.

```python
	def start_suite(self, name, attributes):
		if attributes['tests']:  
	    self.robot_service.start_suite(name=name, suite=suite)
```

## 感想

不是平台组，干不了平台的活。我们的产品组，用例基数不大，自动化用例都不够多，效果也难以发挥。最终不了了之。可惜了

有轮子，当然轮子好。但是轮子本来就就是组合轮子的话，修改比较麻烦

比如说：Robotframework 采集日志的Agent就是他们公司外包写的，上报服务器的日志太多，执行时间延长一倍以上。

比如说：ES背后的ＫＮＮ算法，如果想要修改基本等于推翻重来。不具备扩展性。我没法接业务日志进来做简单生产问题分类。



## 其他人的做法

大约在半年后，在公司内部看到了另外一个做法。

1. 手工上传日志文件，同时提供日志摘取的条件：比如正则匹配关键字，然后取上下n行
2. 平台提供n中机器学习模型训练
3. 提供下载训练好的模型，打包成sdk提供本地调用
4. 提供训练好的模型，打包成为RESTful API 提供在线调用。

这个做法就很轻量，扩展性也不错。



## 截图留念

![](ReportPortal batch mark 1.png)

![](ReportPortal batch mark 2.png)