---
title: ReportPortal二次开发笔记
date: 2018-10-25
tag: 
- 测试
---
ReportPortal二次开发中, 记录一些考量
<!--more-->
## 关联取数据
db查询
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

## 一条用例应该只有一个错误原因
所以在关联日志的时候, 没有AI介入之前, 勉强认为第一个出现的错误即为错误原因.
我的用例为RobotFramework写的GUI和数据库复合用例, 在用例结束之时会尝试去关闭数据库链接和浏览器, 这里会产生失败记录. 如果一个用例可以关联多条日志, 则会影响聚类分析的准确性.

## 日志做groupby的时候, 如果编辑距离小于n认为是一个group 的条件
// TODO
因为有些日志仅有几个字符差距, 本质上是一样的. 
使用topic生成, 编辑距离, 还是什么ai算法可以将 `f(logMsg)-->group cond`??

## 两个let赋值语句build之后并行了
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
