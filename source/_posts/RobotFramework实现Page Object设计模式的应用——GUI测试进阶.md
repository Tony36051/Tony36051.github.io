---
title: RobotFramework实现Page Object设计模式的应用——GUI测试进阶
date: 2018-04-17 10:20
tags: 
- RobotFramework
- PageObject
categories:
- 测试
---
第一次用RobotFramework-SeleniumLibrary写网页的GUI测试，封装关键字，按功能模块划分关键字。后来一次系统层面的UI重构，所有用例要重新写，成本很大，遂找到2013年提出，2015成熟的Page Object设计模式。基于页面或重用组件封装，仅将人类能交互的操作封装为方法。抽象后，可读性、可维护性大增。
<!-- more -->
# 选型
一开始选择的[NCBI](https://github.com/ncbi/robotframework-pageobjects)的，文档详尽，功能较多，缺点是实现较复杂，坑是要指定对应的Selenium2Library的版本，对新的版本要改import，觉得不方便，什么还有别的问题。
后来选择使用较新的[boakley的实现](https://github.com/boakley/robotframework-pageobjectlibrary)，实现上比较简单，功能与PageObject的意思都到了。缺点是没有完全按照PageObject的设计理念，方法返回值不一定是某页面或具体值，如果学院派地看，甚至可以说没有实现PageObject也是成立的。


# 页面与方法
## 草稿
### commodityIndex 商品首页
1. click_n_frame_contract(index) 点击第n个框架
3. search(key) 搜索
4. clear_search() 清除搜索
5. switch_row_display() 切换紧凑行显示
6. switch_col_display() 切换宽松列显示
8. click_n_pic(commodity_type) 该方法点击某类的第n个商品图片
9. test66 意大利TIM 配置按钮（按名字定位）
10. click_commodity_by_name(name) 点击商品名
11. click_n_more(commodity_type) 点击某个类型下的more、收起动作
### commodityIndexAll 商品首页（无左边栏）空的页面

### commodityDetails 商品详情页
1. get_product_id() 获取商品id
4. click_configuration_tab() 点击配置页
5. click_product_specification_tab() 点击规格页
6. add_n(n) 添加n个商品到购物车【输入框 限制】
7. click_customize() 点击客制化按钮
8. 维保选择
9. test66能源店：多选基础服务，其他数量、描述超过4行
### commodityCustomize 商品定制化页
该页定制化情况太多，不太好封装
1. input_name(name) 
2. click_text(text) 根据文本内容点击配件，要搭配滚屏
3. input_num(text, n) 根据文本定位对应的输入框，输入数字
4. select_num(text, choice) 根据文本定位对应的输入框，下拉选择
5. view_result() 切换到定制结果
6. view_config()切回来
7. get_product_price() 获取定制结果的产品价格
8. get_Service_price() 获取定制结果的服务价格
9. add_n(n) 添加n个商品到购物车
10. 参数正确性-协议
11. 展开收缩
### commodityQuery
暂不处理

## common
可以按text来点击
太长或太宽，要先滚动 
自定义商品参数正确性，建议使用协议

命名规范：
input_xxx
click_xxx
select_xxx
组合动作按实际业务命名
click_n_xxx：xxx取列头的名字，或类型

<!--stackedit_data:
eyJoaXN0b3J5IjpbNjM5MTU0MjM1XX0=
-->