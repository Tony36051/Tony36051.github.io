---
title:  Java基础实战编程题
date: 2018-03-19 09:17:00

---
# Java基础实战编程题
## 选课系统
### 考察点
1. 面向对象的封装、继承、多态
2. String、Collection等常用类使用
3. JDBC操作
4. 待续

### 具体要求
1. 抽象类Person：姓名、年龄  
2. 接口类Classing：String havingClass(); 如果是学生就打印“我去听课啦。”如果是老师，就打印“我去授课啦。”
3. 实体类：
老师Teacher：继承Person，新增属性Salary，List<Course> courses
学生Student：继承Person，新增属性List<Course> courses
课程Course：String name; 
4. 测试代码：
新建两个老师，Tony教英语，有学生a、b、c；雪莉教语文，有学生a、b。

