---
title: pycharm
categories:
  - 测试
tags:
  - python
date: 2018-09-20 23:02:43
typora-root-url: pycharm简单使用
---
PyCharm是写python工程的利器, 如果是分析数据或单文件的python作业用Jupiter会更合适.
<!--more-->

# 版本选择

免费的社区: https://www.jetbrains.com/pycharm/download

如果已经有JetBrain家的Idea又不想另外安装一个IDE, 可以在Idea上安装python插件, 功能几乎一样.

# Hello World

## 选择python环境

在创建项目和项目的setting都可以修改python解释器. 以下分别是在pycharm创建新环境和使用已有环境的截图.

使用默认安装到个人使用的Anaconda的安装目录一般在C:\Users\<username>\Anaconda3, 在安装目录下有envs记录各环境, 其下目录名就是环境名

![](创建新环境.png)

选择Existing interpreter可以选择本地安装的python.exe文件, 可以在python安装目录/Anaconda目录, 但使用独立环境的话, 选择的是环境内的python.exe文件.

![选择本地Conda环境中的解释器](选择conda环境.png)

## 模板文件

File - Settings - Editor - File and Code Templates, 选择python scripts. 填入如下模板:

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Created by $USER on $DATE

if __name__ == '__main__':
    pass
```

第一行在Linux环境中使用尤为方便, 可以./main.py即可执行有x权限的文件. 第二行说明了文档的编码格式, 基本是固定utf-8了. 第三行纯粹就是给人看的, 并无功能性.

## 试试Hello World

新建python文件, 然后将pass修改为print('hello world')

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Created by Tony on 2018/9/21

if __name__ == '__main__':
    print('hello world')
```

第一次运行点击绿色按钮即可, 之后可以使用快捷键`shift+F10`

## 文字缩放

现在的屏幕分辨率众多, 在不同机器上时常需要放大缩小代码, 如果默认并未打开滚轮缩放, 可以如下设定:

File - Settings - Editor - General - Mouse - Change font size(Zoom) with Ctrl+Mouse Wheel, 勾选上即可

