---
title: MyBatisPlus 代码生成器generator在Postgres数据库无法生成
date: 2021-01-22
tag: 
-Java
---
MyBatis-Plus的代码生成器generator用示例代码无法在postgres数据库表上生成代码，原因是没设置schemaName。
<!--more-->

# 关键点
```java
DataSourceConfig dataSourceConfig = new DataSourceConfig();
dataSourceConfig.setDbType(DbType.POSTGRE_SQL);
dataSourceConfig.setSchemaName("mybatisplus");
```


