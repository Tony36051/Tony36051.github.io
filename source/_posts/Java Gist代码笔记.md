---
title: Java Gist代码笔记
date: 2018-08-17
tag: 
- java
categories:
- 开发
---
工作中主要用Java和Python, 有些用法老是忘记, 做个小笔记.
<!--more-->
# JDK
## Collection转数组
```java
Foo[] foos = x.toArray(new Foo[x.size()]);
```
# Spring
## RestTemplate
服务提供方返回体是`Page<XXXResource>`, 需要使用exchange方法搭配ParameterizedTypeReference
```java
HttpHeaders requestHeaders = new HttpHeaders();
requestHeaders.add("Authorization", "bearer " + uuid);  
HttpEntity<String> requestEntity = new HttpEntity<>(null, requestHeaders);
ParameterizedTypeReference<Page<LaunchResource>> typeReference = new ParameterizedTypeReference<Page<LaunchResource>>() {};
ResponseEntity<Page<LaunchResource>> responseEntity = restTemplate.exchange(url, HttpMethod.GET, requestEntity, parameterizedTypeReference);
```


