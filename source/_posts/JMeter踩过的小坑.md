---
title: JMeter踩过的小坑，Cookie的domain和path
date: 2019-05-13 10:46
tag: 
- JMeter

categories:
- 测试
---
# Cookie的domain和path
## domain
```
Set-Cookie: login_sip=1D-8B-35; Path=/; Domain=.example.com
```
SSO单点登录后，返回的头信息中应该包括若干条`Set-Cookie`，上述的Cookie说明此key-value的Cookie能用于*.example.com所有二级域名，`Path=/`表示后续所有路径都可以使用。

- Path=/; Domain=.example.com
- Path=/; Domain=account.example.com
<!--stackedit_data:
eyJoaXN0b3J5IjpbODMzMzkyNTEyLDg2OTM0NjUxNV19
-->