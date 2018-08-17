---
title: xpath用法杂记
date: 2018-06-07 15:56
tag: 
- xpath
---
PageObject封装过程中难免大量使用xpath，记录一些比较好用的xpath。
<!--more-->
### (不)包含属性
//tbody/tr[@class]

//tbody/tr[not(@class)]
//div[@componenttype and @class='site-tree']//input[@placeholder and not(@readonly)]

### 相对路径找父子元素
//form[@class='el-form']/../../..

### 逻辑运算符
/div[@componenttype and @class='site-tree']//input[@placeholder]

### 根据文本定位
#### 包含文本
//span[contains(text(),'Switch Store')]
#### 全等文本
//dd[text()='Malaysia Rep Office']  
#### 文本长度
//span[string-length(text())>12]
