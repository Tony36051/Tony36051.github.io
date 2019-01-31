---
title: 记一次python调试excel读取错误
date: 2019-01-31 15:31
tag:
- python
- 测试

categories:
- python
---
日常工作之一就是帮助合作方解决自动化问题, 今天的问题是python写的Robotframework扩展库ExcelRobot在读取xlsx报错, 同样的文件昨天还是OK的. 带着疑惑开始debug
<!--more-->
## 日志
将Robotframework的执行日志调到trace, 获取报告如下:
```bash
Traceback (most recent call last):
  File "D:\python\lib\site-packages\robotframework_excel-1.0.0b4-py2.7.egg\ExcelRobot\base.py", line 33, in open_excel
    self.reader = ExcelReader(file_path, self.date_format, self.number_format, self.bool_format)
  File "D:\python\lib\site-packages\robotframework_excel-1.0.0b4-py2.7.egg\ExcelRobot\reader.py", line 21, in __init__
    self._workbook = open_workbook(self.file_path, formatting_info=self.is_xls, on_demand=True)
  File "D:\python\lib\site-packages\xlrd\__init__.py", line 143, in open_workbook
    ragged_rows=ragged_rows,
  File "D:\python\lib\site-packages\xlrd\xlsx.py", line 808, in open_workbook_2007_xml
    x12book.process_stream(zflo, 'Workbook')
  File "D:\python\lib\site-packages\xlrd\xlsx.py", line 265, in process_stream
    meth(self, elem)
  File "D:\python\lib\site-packages\xlrd\xlsx.py", line 391, in do_sheet
    bk._sheet_visibility.append(visibility_map[state])
```
从日志可以看到, 在打开文件的时候就报错了, 大约在do_sheet中, 在取`visibility_map`时发生`KeyError: 'null'`

## 走读代码
```python
    def do_sheet(self, elem):
        bk = self.bk
        sheetx = bk.nsheets
        # print elem.attrib
        rid = elem.get(U_ODREL + 'id')
        sheetId = int(elem.get('sheetId'))
        name = unescape(ensure_unicode(elem.get('name')))
        reltype = self.relid2reltype[rid]
        target = self.relid2path[rid]
        # 此处省略几行
        state = elem.get('state')
        visibility_map = {
            None: 0,
            'visible': 0,
            'hidden': 1,
            'veryHidden': 2
            }
```
在调试器查看对象的属性`elem.items()`, 返回的list(tuple)中, 有这么一项`('state', 'null')` 跟日志一致.

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTYzODA0ODk2NCw3MDQ5MTUxMDhdfQ==
-->