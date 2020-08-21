---
title: postman请求前脚本，常用于生成token和时间戳
date: 2020-08-21 10:56
tag: 
- postman
categories:
- Test
---
postman请求前脚本，常用于生成token和时间戳
<!--more-->

```js
// 构造post请求
const regRequest = {
	url : 'http://kwe-beta.huawei.com/ApiCommonQuery/appToken/getRestAppDynamicToken',
	method : 'POST',
	header : 'Content-Type: application/json', //注意要在Header中声明内容使用的类型
	body : {
		mode : 'raw', // 使用raw(原始)格式
		raw : JSON.stringify({
			"appId" : "com.huawei.unistar.hmc.md",
			"credential" : "RlJvdn5XQWkwK15hKnBZYnlkNkxAJEBQfjlsMzlCZzZGKlNyXWplTmdoYnQ3VWRsSyFXMTU0ODQwOTA4ODM1MA=="
		}) //要将JSON对象转为文本发送
	}
};
//发送请求
pm.sendRequest(regRequest, function (err, res) {
	console.log(err ? err : res.json()); // 响应为JSON格式可以使用res.json()获取到JSON对象
	Authorization = res.json().result;
	postman.setEnvironmentVariable("Authorization", Authorization); //将Authorization写入环境变量中
});

Date.prototype.Format = function (fmt) {
var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
        };
if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
var timeNow = new Date().Format("yyyyMMddHHmmss");

postman.setGlobalVariable("jobId", timeNow);
```