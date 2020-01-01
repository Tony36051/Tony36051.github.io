---
title: RobotFramework变量
categories:
  - 测试
tags:
  - RobotFramework
date: 2018-09-27 01:00:26
---
自动化用例跟其他编程语言的源文件基本类似, 关键字类比方法或函数, 关键字的参数就是函数的参数, 关键字的返回也就是函数的返回. 类似编程学习, 第一步是学习定义和使用各种变量.
<!--more-->

# 简介

变量可以应用于脚本的绝大多数地方, 不过应用最多的还是在关键字的入参. 跟大多数编程语言一样, 变量不允许跟关键字重名.

常见用途:

- 减少修改遗漏: 如果在大片用例都是硬编码的`user001`, 建议抽成变量${username}, 好处是修改时只需要改一处, 而不用担心漏改/改错.
- 定义系统无关的变量, 如将`127.0.0.1`修改为${HOST}, 然后通过命令行传入, 即可令测试脚本能无修改地跨系统执行, 免除因执行环境的变化而无谓的手工修改.
- 当脚本复杂到入参是一个对象, 而不是字符串时, 必须使用变量. 因为写在脚本中的参数, 都被认为是字符串(参考字符串连接).
- 参数传递, 上一个关键字的返回值作为下一个关键字的入参, 此时你需要变量
- 超长的值, 当某个参数是一个很大的json, 写起来非常长, 使用变量来代表是一个好方法.

# 变量类型

变量跟关键字一样, 是`大小写无关`的, 同时忽略空格和下划线(${CURDIR}除外), 前者被认为不存在. 建议使用全大写代表全局变量(如: ${PATH}), 小写的驼峰或者蛇形作为局部变量(如: ${my_name}, ${contractNo}).

```
变量名忽略大小写/下划线/空格
    ${a_boy}    set variable  tony
    should be equal as strings  tony  ${a_boy}
    should be equal as strings  tony  ${A_boy}
    should be equal as strings  tony  ${aboy}
    should be equal as strings  tony  ${ABOY}
    LOG     ${CURDIR}  # 特殊例子
```



一个变量由`类型标识符`($/@/&/&), 花括号({, }), 变量名组成, 变量名通常建议使用英文字母和数字下划线和空格组成. 

## scalar标量

标量的类型标识符是$, 是最常用的一种, 经常代表一个字符串, 但其可以表示任一一个对象, 包括链表, 字典等. 以下为常量和变量的一个用法, 两个用例的Log结果是一致的.  `set variable`关键字可以认为跟python语言的`赋值=`一样作用, 这是创建变量的一个常用方法, 创建的是局部变量.

```
Scalar标量
    ${GREET}    set variable  Hello
    ${NAME}     set variable  world
    Log    Hello, world!!           # 常量
    Log    ${GREET}, ${NAME}!!      # 变量
```

值得注意的一点是, 如果一个测试数据单元格内, 只有变量本身, 他可以代表一个对象. 一旦单元格内还有别的变量或常量, 则只会进行字符串拼接成一个字符串. 隐式地调用python对象的`__unicode__`或java对象的`toString()`方法将对象转为字符串, 然后跟单元格内其余部分拼接. 如果python的`__unicode__`方法失败, 将调用`__str__`方法.

```
*** Settings ***
Library  ../ExtLibrarys/VarLibrary.py

*** Test Cases ***
字符串连接
    [Documentation]  传参给关键字和函数需要注意, 连接后入参为字符串
    ${STR}      set variable  Hello world!!
    ${str_type}  get type    ${STR}                 # str类型
    ${list_type}  get type    ${LIST}               # list类型, 使用@会展开为n个参数
    ${user1_type}  get type  ${user1}                # dict类型,使用&会展开为命名参数
    ${concat_str_type}  get type  str: ${STR}       # str类型
    ${concat_list_type}  get type  list: @{LIST}    # str类型
    ${concat_dict_type}  get type  dict: &{user1}   # str类型
    should contain  ${str_type}  str
    should contain  ${list_type}  list
    should contain  ${user1_type}  dict
    should contain  ${concat_str_type}  str
    should contain  ${concat_list_type}  str
    should contain  ${concat_dict_type}  str

```

```python
# ../ExtLibrarys/VarLibrary.py
def get_type(obj):
    return str(type(obj))
```



## List列表

```
List列表变量
    @{user}    create list  robot  secret
    Login    robot    secret
    Login   @{user}  # 等同上一个

List变量关键字传参, 列表可扩展性
    Show list    @{LIST}    more    args
    Show list    ${SCALAR}    @{LIST}    constant
    Show list    @{LIST}    @{ANOTHER}    @{ONE MORE}

List变量访问, 变量索引
    ${index}    set variable  1
    Show list  @{LIST}[0]  @{LIST}[1]  @{LIST}[-1]
    should be equal as strings  @{LIST}[${INDEX}]  ${LIST[${INDEX}]}  # 两种不同写法
    
*** Keywords ***
Login
    [Arguments]    ${name}  ${password}
    should be equal as strings  ${name}  robot
    should be equal as strings  ${password}  secret

Show list
    [Arguments]  @{obj}
    Log  list: @{obj}
    
*** Variables ***
${SCALAR}    3.1415926
@{LIST}     1st  2nd  3rd
@{ANOTHER}  4th  5th
@{ONE MORE}  6th

```

从例子可以看出, 可以将不定个数的参数封装为一个列表, 用于for循环或传参给关键字. 

List变量的访问跟python语言中并无二致. 值得注意的是索引访问时, 如果认为LIST是标量, 则应该在索引写着花括号内; 如果认为LIST是列表, 则应该将索引卸载花括号外.

列表变量的创建可以从`create list`关键字, 变量定义部分, 方法返回, 甚至是环境变量, 命令行参数中获得.

## dict字典变量

字典变量与列表变量非常类似, 甚至也是能迭代遍历.  在关键字参数传递时候, 如python函数传递一样, 参数按照顺序: `位置参数-列表参数-命名参数`

字典的访问方式较为多样:

- &{user1}[password]: 键值为常量
- &{user1}[${key}]: 键值为变量
- ${user1.key}: 属性访问
- ${user1['name']}: robotframework2.9以前也可以用此方法, json也可以按此法

```
Dict字典变量
    ${key}  set variable  name
    Login   password=secret  name=robot  # 命名参数, 顺序无关
    Login   &{user1}
    Login   &{user1}[${key}]  &{user1}[password]  # 还可以${user1.key}

Dict变量关键字传参, 可扩展性
    Login  robot  &{password_part}  # 如python, 位置参数-列表参数-命名参数
    Login  &{name_part}  password=secret   #合并
    Login  &{name_part}  &{password_part}  #合并

*** Variables ***
&{user1}     name=robot  password=secret
&{name_part}     name=robot
&{password_part}     password=secret
```

如果是用pycharm/IDEA的插件IntelliBot, 目前版本还不能识别&{}定义的变量被${}引用, 所以请忽略pycharm的错误提示.

# 内建变量

## 系统变量

| Variable   | 解释                         | Explanation                                                  |
| ---------- | ---------------------------- | ------------------------------------------------------------ |
| ${CURDIR}  | 当前文件所在的目录的绝对路径 | An absolute path to the directory where the test data file is located. This variable is case-sensitive. |
| ${TEMPDIR} | 系统临时文件的路径           | An absolute path to the system temporary directory. In UNIX-like systems this is typically /tmp, and in Windows c:\Documents and Settings\<user>\Local Settings\Temp. |
| ${EXECDIR} | robot/pybot调用时所在目录    | An absolute path to the directory where test execution was started from. |
| ${/}       | 通用目录分割符               | The system directory path separator. `/` in UNIX-like systems and \ in Windows. |
| ${:}       | 通用环境路径分隔符           | The system path element separator. `:` in UNIX-like systems and `;` in Windows. |
| ${\n}      | 通用的换行符                 | The system line separator. \n in UNIX-like systems and \r\n in Windows. New in version 2.7.5. |

## 布尔Boolean

默认情况下, 测试数据的每个格子都是字符串, 有些时候需传递布尔变量, 使用${true}和${false}, `大小写无关`

## None和null

默认情况下, 测试数据的每个格子都是字符串, 有些时候需传递空值, 使用${None}和${null}, `大小写无关`, 互为别名, 可以交换使用. 因为使用python或Jython时会自动转换为正确的形式.

## 空格和空字符串

Robotframework在解析测试数据时, 以两个或以上的空格为分隔符, 所以在真正的测试数据中使用多于一个空格需要转义. 而多次转义使得测试代码的可读性进一步下降, 所以可以使用${space * 4}表示4个空格.

如果需要表示空字符串, 需使用${EMPTY}.  这是错误的: `should be equal  ${empty}  ''`

${SPACE}和${EMPTY}都是 `大小写无关`.

## 数字变量

默认情况下, 测试数据的每个格子都是字符串, 有些时候需传递数字变量, 使用${数字}等形式

- ${80}

- ${3.14}

- ${-1e-4}: 也即 -0.0001

- 各种进制

  ```
  Example
      Should Be Equal    ${0b1011}    ${11}   # 二进制
      Should Be Equal    ${0o10}      ${8}    # 八进制
      Should Be Equal    ${0xff}      ${255}  # 16进制
      Should Be Equal    ${0B1010}    ${0XA}  # 二进制和16进制可以直接比较
  ```

## 元数据变量

如果需要获取一些跟测试数据或执行时变量, 可以考虑使用以下变量, 此处仅挑选较为常用的:

- ${TEST NAME}
- ${SUITE NAME}
- @{TEST TAGS}
- ${OUTPUT DIR}

# 优先级和作用域

## 优先级

内建 > 执行中赋值的 >命令行 > 测试用例文件 > resource和variable文件

内建变量不允许覆盖, 但每次执行都会被重置, 类似Java的final变量, 一次定义不能修改. ${CURDIR}变量在执行过程中会不断变化, 其值为当前执行动作所在文件的目录的绝对路径.

资源文件如果引用别的资源文件, 多个文件中有同名变量, 本文件中的变量优先级较高.

命令行如果声明多个同名变量, 最后一个优先级高; `相反地`变量文件中, 最先声明/导入的变量拥有最高的优先级.

## 作用域

- Global: 全局变量, 通常由命令行赋值, 建议首字母大写, 可以通过Set Global Variable修改.
- Suite: 测试套级, 不可递归, 建议首字母大写, 可以通过Set Suite Variable修改
- Test: 用例级, 建议首字母大写, 用例内所有步骤(keywords)可见, 可以通过Set Test Variable修改
- Local: 本地变量, 建议全小写, 用于keyword的参数和返回值, 关键字外不可见,

用例文件设置的变量文件可以在本文件内任何位置使用, 包括settings.

因为变量表(Variables)先被处理, 解析Settings/Variables路径时还没导入别的变量, 所以导入的变量不能在Settings/Variables中应用.



# 高级特性

## 扩展语法

变量名的花括号内可以访问对象的属性和方法, 但不建议过度访问对象的方法. 如果访问的方法还需要入参, 更加不建议, 这会增加测试数据的复杂性, 减低可读性, 增加维护成本. 如果非要这样做, 建议挪到自定义keyword或自定义库中.

```
*** Settings ***
Variables  ../Variables/vars.py  # 变量文件名不要跟类名一样

*** Test Cases ***
扩展语法:MyObject
    Log    ${OBJECT.name}
    Log    ${OBJECT.eat('Cucumber')}
    Log    ${DICTIONARY[2]}
    
```

```python
# ../Variables/vars.py  # 变量文件名不要跟类名一样
class MyObject:

    def __init__(self, name):
        self.name = name

    def eat(self, what):
        return '%s eats %s' % (self.name, what)

    def __str__(self):
        return self.name


OBJECT = MyObject('Robot')
DICTIONARY = {1: 'one', 2: 'two', 3: 'three'}
```

与此类似的还可以对标准的python对象进行操作, 要想知道对应python对象可以有哪些方法和成员, `dir(obj)`

```
扩展语法:String
    ${string} =    Set Variable    abc
    Log    ${string.upper()}      # Logs 'ABC'
    Log    ${string * 2}          # Logs 'abcabc'

扩展语法:Number
    ${number} =    Set Variable    ${-2}
    Log    ${number * 10}         # Logs -20
    Log    ${number.__abs__()}    # Logs 2  # 会报错: ${abs(number)}, 变量名需紧跟{
```

## 赋值

除了可以用`.`访问对象的属性和方法, 还可以给对象内的属性赋值.

```
扩展语法:赋值
    ${OBJECT.name} =    Set Variable    New name
    ${OBJECT.new_attr} =    Set Variable    New attribute
    should be equal as strings  ${OBJECT}  New name
    should be equal as strings  ${OBJECT.new_attr}  New attribute
```

## 变量嵌套

变量嵌套会从最内层开始替换为真实的值

```
扩展语法:嵌套
    ${OBJECT.name} =    Set Variable    T-800
    ${key} =    Set Variable    name
    ${T-800 HOME}  set variable  /home/T-800
    should be equal as strings  ${OBJECT.${key}}  T-800
    should be equal as strings  ${${OBJECT.name} HOME}  /home/T-800
```

