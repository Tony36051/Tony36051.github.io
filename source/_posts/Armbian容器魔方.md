---
title: Armbian容器魔方
date: 2023-02-12

---


Q5和UNT403A跑Armbian, 使用ipv6跑容器魔方. Q5有tf卡, UNT-403A用U盘引导,外加一个移动硬盘做数据盘.

<!--more-->

# 问题背景

容器魔方的镜像仓库标记的架构是arm64, 但是armbian识别到的是 arrch64, 所以拉取镜像的时候会说找不到

不使用官方的自适应架构的镜像, 用同账号下的onething1/arm64v8-wxedge镜像, 自己指定的版本, 注意必须带版本, 没有默认的latest版本.
# 关键记录

```bash
docker run -d --name=wxedge \
  --restart=always --privileged --net=host \
  --tmpfs /run --tmpfs /tmp \
  -v /data/wxedge_storage:/storage:rw  \
  onething1/arm64v8-wxedge:2.4.3
```


