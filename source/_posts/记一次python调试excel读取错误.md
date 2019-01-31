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
在调试器查看对象的属性`elem.items()`, 返回的list(tuple)中, 有这么一项`('state', 'null')` 跟日志一致. 为什么会有这个属性呢, 查看了xlrd最新的代码, 在visibility_map里面确实只有这几个key啊, 不存在`null`这个key.

## 打开excel看看
众所周知, xlsx文件其实外层是一个zip压缩格式, 用7z直接打开或将后缀名改为zip解压即可. docx和pptx也一样.
在`xl/workbook.xml`文件中, 可以看到如下内容
```xml
<?xml version="1.0" encoding="UTF-8"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">
    <fileVersion xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" appName="xl" lastEdited="6" lowestEdited="6" rupBuild="14420" />
    <workbookPr xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" defaultThemeVersion="124226" />
    <bookViews xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
        <workbookView xWindow="0" yWindow="0" windowWidth="17208" windowHeight="10512" />
    </bookViews>
    <sheets>
        <sheet name="A Material" sheetId="2" state="null" r:id="rId66cdf1e0-93bc-4c96-9369-4f0664e2752b" />
    </sheets>
    <definedNames xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
        <definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">'A Material'!$A$1:$O$1</definedName>
    </definedNames>
    <calcPr xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" calcId="0" />
</workbook>
```
可以看到sheet这个节点真的有属性state, 其值为null, 根据xlrd的标准来看, 这个值不对. 询问了测试人员, 没有对该文件修改, 从系统直接下载一份新的文件, 也是有这个属性. 至此基本实锤了是开发写错了. 
那么, 开发又是怎么写错的呢? 我们再去看看java端的代码, 由于没有开发的代码库, 盲猜一下.
## 溯源POI
在Java世界说到操作excel, POI是首选, 那么查看一下文档, 发现有几个可以操作sheet也是否可见的接口
```java
void	setSheetHidden(int sheetIx, boolean hidden)
Hide or unhide a sheet.
void	setSheetVisibility(int sheetIx, SheetVisibility visibility)
Hide or unhide a sheet.
```
从入参来看, 不可能是setSheetHidden, 以为Java必须要设初始值, 而原始类型的hidden的值只能是true/false, 基本确定开发用的是下面的变量, 但


<!--stackedit_data:
eyJoaXN0b3J5IjpbMTQxNDE3OTc1Miw3MDQ5MTUxMDhdfQ==
-->