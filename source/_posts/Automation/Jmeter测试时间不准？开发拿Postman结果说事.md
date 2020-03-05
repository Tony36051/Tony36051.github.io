---
title: Jmeter测试时间不准？开发拿Postman结果说事
date: 2020-03-05 17::01
tag: 
- JMeter

categories:
- Test
---

# Jmeter测试时间不准？开发拿Postman结果说事
## 术语解释
### Jmeter术语
Latency：请求发出到接收到第一个返回的字节的时间
Response time (= Sample time = Load time = Elapsed time)：请求发出到接收完最后一个字节的时间
可以看到响应时间总是比Latency大

### Postman术语
Socket Initialization: 打开socket时间，一般常数时间
DNS Lookup：将请求域名换成ip的时间，一般也很短，太慢也存在优化空间
TCP Handshake：TCP握手时间，受网络状态影响
Transfer Start：请求发出到接收到第一个返回的字节的时间。等于Jmeter的Latency，等于Chrome的TTFB（Time To First Byte)
Download：整个返回体的下载（接收）时间
Process：基本是常数时间，接收后Postman做请求头分离等时间

## 场景复现
同一个请求，返回体Postman显示900k，耗时大约300ms，Jmeter要500+ms。定位问题使用Dynatrace，发现服务器处理时间260+，接近Postman。此时开发就在嘟囔，测试的时间不知道怎么搞的。这时候作为测试负责人，心里窝火，但是事实摆在眼前。只能认真研究为啥。
首先，我们看下具体展开的时间

工具|总时间|TTFB|Download
--|--|--|--
Postman|194|162|26
Jmeter|537|172|365

TTFB/Latency时间差不多，在Download时间上差距很大，为什么Postman这么快呢？经前辈指点说Jmeter要手动添加gzip。
立马查看Jmeter请求的头和Postman请求的头，原来Postman的request header自动加上了Accept-Encoding: gzip, deflate，而JMeter没有。
打开JMeter的Debug级别日志可以看见返回体已经不是明文，实测一下：
工具|总时间|TTFB|Download
--|--|--|--
Postman|194|162|26
Jmeter with gzip|177|171|6

## 扩展： Accept-Encoding & Content-Encoding
HTTP 请求头 Accept-Encoding 会将客户端能够理解的内容编码方式——通常是某种压缩算法——进行通知（给服务端）。通过内容协商的方式，服务端会选择一个客户端提议的方式，使用并在响应头 Content-Encoding 中通知客户端该选择。

即使客户端和服务器都支持相同的压缩算法，在 identity 指令可以被接受的情况下，服务器也可以选择对响应主体不进行压缩。导致这种情况出现的两种常见的情形是：

要发送的数据已经经过压缩，再次进行压缩不会导致被传输的数据量更小。一些图像格式的文件会存在这种情况；
服务器超载，无法承受压缩需求导致的计算开销。通常，如果服务器使用超过80%的计算能力，微软建议不要压缩。

## 建议&讨论
1. 请求体可以常规地加上 Accept-Encoding: gzip, deflate 
2. 如果Sample Time在开启压缩后还是比Latency大很多，说明这个接口返回很大数据。此时我们要考虑服务器的内存使用量，因为大数据量返回的接口常规优化方式就是改大数据库一次的Fetch Size，此时服务器的内存占用量会大幅上升，严重时可以导致OOM。我们在回归性能问题单的同时，要观察服务器的内存使用量。
3. 大数据量的接口从业务系统同步接口返回可能不是一个最佳的方案，会扰动业务系统的性能。应该通过别的途径，以非实时批处理的方式取大量数据更加符合分析统计的场景。
4. 开发在优化时往往对Download Time没有特别好的优化方法，我们在确定返回体已经开启压缩后，可以用Latency作为指标。但是聚合报告聚合的是Sample Time，此时我们可以在`查看结果树` 或 `用表格查看结果` 中配置保存到csv文件，后期用Excel分析平均值或90%值。