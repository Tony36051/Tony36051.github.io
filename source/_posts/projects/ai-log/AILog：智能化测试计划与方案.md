---
title: AILog：智能化测试计划与方案
date: 2018-03-30 18:29
tags:
- AILog
categories:
- Dev
---

最终项目夭折了，原因在于选型会议选择了另外一个工具基础上二次开发，另外一个原因是其实本身没有那么多自动化用例的日志可供分析。我们不是平台部门，是个小业务部门
<!--more-->
# 计划与交付件

聚焦核心诉求，降低界面可视化等优先级。
【用例优化建议：kw、参数等提取抽象】

| 时间 | 进度 | 交付件 |
|--|--|--|
| 4.09 | 方案、技术选型、元数据 | **总体设计方案.pptx** |
| 5.25 | 采集、传输、存储 | Only Code 	|
| 6.01 | 统计、<small>可视化<small> | RF、Cloud Test执行结果统计展示 |
| 7.20 | 整合被测应用日志、时间同步 | 关联展示日志片段 |
| 8.10 | 人工打Tag | 聚类展示 |
| 9.07 | 智能诊断用例失败原因 | 推测失败原因、提示历史解决方案 |
| 10.19 | 频繁项集挖掘与聚类算法 | 相近用例步骤、demo用例提示 |
| 11.09 | 铺开测试、高斯异常检测 | **最终展示** |
| 11.16 | 提供error日志对应用例 | 辅助精准化测试接口 |
| 11.23 | 提供精益看板数据 | 执行(历史)结果数据接口 |

# 方案与计划
采集使用flume，传输协议就avro，同时存储在hdfs和kafka中

 - [x] kafka学习和搭建
 - [x] flume学习
 - [x] avro学习
 - [x] confluent kafka avro搭建与demo
 - [ ] 归纳常用的日志，编写对应的agent配置
 - [ ] 高可用controller配置
 - [ ] 打通flume到hdfs
 - [ ] 打通flume到kafka
 - [ ] ansible部署playbook+jenkins辅助

# flume简单笔记
source有两类：
- 驱动型source:是外部主动发送数据给Flume，驱动Flume接受数据。
- 轮询source:是Flume周期性主动去获取数据。

# 日志类型
1. linux系统日志
2. web
3. was
4. tomcat
5. jetty

## 测试工具日志
### RobotFramework
#### 原生单进程pybot
在所有用例执行完后，会生成output.xml，解析xml能获取各用例的执行。非实时。
#### jobsubmit用例级并行
在各自进程中系统调用pybot执行用例，解析output.xml生成执行结果，准实时。
#### 推送方式
**数据清洗放在最早的此处**
【TODO】未定
1. flume配置源为http，解析json
2. flume配置源为avro，解析用例结果的代码推avro请求
3. flume配置元为exec，调用解析代码，output存chanel
4. 解析代码推二进制到kafka，然后转储到hdfs

### CloudTest
### 协议自动化

# avro结构定义
```json

```


# 表结构
## 项目表project

| field | type | comment |
|--|--|--|
| id | int | 自增id |
| name | varchar(256) | 项目名 |
| responsible | varchar(128) | 责任人 |
| create_date | datetime | 创建时间 |
|  |  |  |


## 任务表task

| field | type | comment |
|--|--|--|
| id | int | 自增id |
| name | varchar(256) | 任务名/taskId |
| responsible | varchar(128) | 责任人 |
| create_date | datetime | 创建时间 |
| project_id | int | 项目表的id |
|  |  |  |

## 测试套表test_suite

| field | type | comment |
|--|--|--|
| id | int | 自增id |
| name | varchar(256) | 测试套名 |
| long_name | varchar(2048) | 从顶往下的长测试套名 |
| project_id | int | 项目表的id |
|  |  |  |
|  |  |  |

## 测试用例表test_case

| field | type | comment |
|--|--|--|
| id | int | 自增id |
| name | varchar(256) | 测试套名 |
| long_name | varchar(2048) | 从顶往下的长测试套名 |
| project_id | int | 项目表的id |
|  |  |  |
|  |  |  |

## 测试步骤
kw，参数、报错信息

```java

package com.huawei.unistar.ailog.domain;  
  
import javax.persistence.*;  
  
@Entity  
public class Suite {  
    public Suite() {  
    }  
  
    public Suite(Integer id, Integer projectId, String name, String doc) {  
        this.id = id;  
 this.projectId = projectId;  
 this.name = name;  
 this.doc = doc;  
  }  
  
    @Id  
 @GeneratedValue(strategy = GenerationType.IDENTITY)  
    private Integer id;  
  
 private Integer projectId;  
  
  @Column(nullable = false)  
    private String name;  
  @Column(length = 4096)  
    private String doc = "";  
  
 public Integer getId() {  
        return id;  
  }  
  
    public void setId(Integer id) {  
        this.id = id;  
  }  
  
    public Integer getProjectId() {  
        return projectId;  
  }  
  
    public void setProjectId(Integer projectId) {  
        this.projectId = projectId;  
  }  
  
    public String getName() {  
        return name;  
  }  
  
    public void setName(String name) {  
        this.name = name;  
  }  
  
    public String getDoc() {  
        return doc;  
  }  
  
    public void setDoc(String doc) {  
        this.doc = doc;  
  }  
}

public class SuiteTreePath {  
  
  
  
    @EmbeddedId  
  private TreePathPK id;  
 private Integer distance;  
  
 public Integer getDistance() {  
        return distance;  
  }  
  
    public void setDistance(Integer distance) {  
        this.distance = distance;  
  }  
}

public class TreePathPK implements Serializable {  
    private Integer ancestor;  
 private Integer descendant;  
  
 public TreePathPK(Integer ancestor, Integer descendant) {  
        this.ancestor = ancestor;  
 this.descendant = descendant;  
  }  
  
    @Override  
  public boolean equals(Object o) {  
        if (this == o) return true;  
 if (o == null || getClass() != o.getClass()) return false;  
  
  TreePathPK that = (TreePathPK) o;  
  
 if (ancestor != null ? !ancestor.equals(that.ancestor) : that.ancestor != null) return false;  
 return descendant != null ? descendant.equals(that.descendant) : that.descendant == null;  
  }  
  
    @Override  
  public int hashCode() {  
        int result = ancestor != null ? ancestor.hashCode() : 0;  
  result = 31 * result + (descendant != null ? descendant.hashCode() : 0);  
 return result;  
  }  
}
```
