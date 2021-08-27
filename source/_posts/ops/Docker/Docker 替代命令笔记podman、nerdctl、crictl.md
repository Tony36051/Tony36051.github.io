---
title: Docker 替代命令笔记podman、nerdctl、crictl
date: 2021-07-10 08:55
tags:
- Docker
categories:
- Ops
---
容器镜像相关操作命令，案例以k3s为切入点

<!-- more -->

# 安装&配置

## 准备镜像文件

下载k3s-airgap-images-amd64.tar.gz，k3s, install.sh(http://get.k3s.io)

```bash
sudo mkdir -p /var/lib/rancher/k3s/agent/images/
gzip -cd k3s-airgap-images-amd64.tar.gz > k3s-airgap-images-amd64.tar
sudo cp ./k3s-airgap-images-amd64.tar /var/lib/rancher/k3s/agent/images/
cp ./k3s /usr/local/bin/k3s
chmod +x ./install.sh
chmod +x /usr/local/bin/k3s
```

## 单节点安装
### server节点
>INSTALL_K3S_SKIP_DOWNLOAD=true ./install.sh

### agent节点
请在每个 agent 节点上执行以下操作。注意将 myserver 替换为 server 的 IP 或有效的 DNS，并将 mynodetoken 替换 server 节点的 token，通常在/var/lib/rancher/k3s/server/node-token

>INSTALL_K3S_SKIP_DOWNLOAD=true K3S_URL=https://myserver:6443 K3S_TOKEN=mynodetoken ./install.sh

### 检查安装
>crictl images

## 代理

因为
root:/etc/rancher/k3s# ll /usr/local/bin/crictl
lrwxrwxrwx 1 root root 3 Jun  7 10:42 /usr/local/bin/crictl -> k3s*

```bash
#sudo vim /etc/systemd/system/k3s.service.env
cat > /etc/systemd/system/k3s.service.env << EOF
HTTP_PROXY="http://100.100.154.250:3128"
HTTPS_PROXY="http://100.100.154.250:3128"
NO_PROXY="localhost,127.0.0.0/8,0.0.0.0,10.0.0.0/8,192.168.0.0/16,172.16.0.0/12,internal.example.com"
EOF

systemctl daemon-reload
systemctl restart k3s
```

# 常见问题
待补充

# 常用命令对比

| 命令                 | Docker           | Containerd crictl（推荐） |
| :------------------- | :--------------- | :------------------------ |
| 查看容器列表         | `docker ps`      | `crictl ps`               |
| 查看容器详情         | `docker inspect` | `crictl inspect`          |
| 查看容器日志         | `docker logs`    | `crictl logs`             |
| 容器内执行命令       | `docker exec`    | `crictl exec`             |
| 挂载容器             | `docker attach`  | `crictl attach`           |
| 显示容器资源使用情况 | `docker stats`   | `crictl stats`            |
| 创建容器             | `docker create`  | `crictl create`           |
| 启动容器             | `docker start`   | `crictl start`            |
| 停止容器             | `docker stop`    | `crictl stop`             |
| 删除容器             | `docker rm`      | `crictl rm`               |
| 查看镜像列表         | `docker images`  | `crictl images`           |
| 查看镜像详情         | `docker inspect` | `crictl inspecti`         |
| 拉取镜像             | `docker pull`    | `crictl pull`             |
| 推送镜像             | `docker push`    | 无                        |
| 删除镜像             | `docker rmi`     | `crictl rmi`              |
| 查看Pod列表          | 无               | `crictl pods`             |
| 查看Pod详情          | 无               | `crictl inspectp`         |
| 启动Pod              | 无               | `crictl runp`             |
| 停止Pod              | 无               | `crictl stopp`            |

