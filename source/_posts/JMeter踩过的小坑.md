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
下面说的suoyou
- Path=/; Domain=.example.com 所有二级域名，所有uri
- Path=/; Domain=account.example.com 仅account.example.com这个二级域名可用，所有uri
- Path=/openapi; Domain=.example.com 所有二级域名，仅匹配/openapi的uri

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTgyNDkyOTE4NCw4NjkzNDY1MTVdfQ==
-->