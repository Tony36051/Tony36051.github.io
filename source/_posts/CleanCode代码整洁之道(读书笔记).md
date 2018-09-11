---
title: CleanCode代码整洁之道(读书笔记)
date: 2018-09-04
tag: 
- java
categories:
- 开发
---
衡量代码的唯一有效标准：WTF/min
陪女票复习, 带上Bob大叔的代码整洁之道, 一天看了120+页, 真是舒爽. 
<!--more-->
## 函数
### 抽象层次
1. 函数内步骤在同一抽象层上.
2. Top-Down写法: 如写文章先写大纲(高抽象层次), 下个函数再写细节(低抽象层次)
### 参数
1. 参数越少越好
2. 不要用标识参数(boolean flag): 根据flag取值, 分别做两件事, 违反"一个函数做一件事". 应拆分为两个函数.
3. 参数名可含参数的顺序, 减少记忆负担. 如 findByNameAndScore(name, score)


<!--stackedit_data:
eyJoaXN0b3J5IjpbMzAwNTc1NDYyXX0=
-->