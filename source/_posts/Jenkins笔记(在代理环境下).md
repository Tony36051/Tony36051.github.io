---
title: Jenkins使用笔记
date: 2018-04-25 20:20
tags:
- docker
- jenkins
---
记录Jenkins上使用的经验，另外在公司内部使用Jenkins会遇到一些代理问题，记录一些解决方法。
<!-- more -->
# 代理问题
1. 配置代理后，由于默认使用https取插件仓库，切换为http协议即可
在http://localhost:8083/pluginManager/advanced中，升级站点的url去掉https的s，用http协议，然后提交一下，获取一下可选插件
2. 安装忽略ssl证书的插件`Skip Certificate Check`
3. `git plugin`需要配置忽略ssl：git config --global http.sslVerify "false"

# 常用插件
1. Subversion Plug-in 公司还在使用SVN，在Repository URL后记得加`@HEAD`
2. Robot Framework plugin 集成RobotFramework的好插件
3. Build User Vars Plugin 将用户变为变量
4. Build Name Setter Plugin 可以将构建名中插入变量

# 踩过的坑
## docker部署
docker部署确实方便，当扩展slave使用时，需要有一样的目录结构，然后slave的host机也需要保持跟master的host机保持一致，比较麻烦。`也许是我不会用，应该有好方法，请赐教`

