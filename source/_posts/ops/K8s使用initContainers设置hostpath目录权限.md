---
title: K8s使用initContainers设置hostpath目录权限
date: 2023-06-30 11:00
tags: 
- K8s
categories:
- Ops
---

# 背景
deployment使用hostpath将宿主机的目录挂在到容器内，让容器内进程的日志可以写到hostpath目录上，然后被采集。
日志目录对权限有要求，查询k8s文档，如果将hostPath 卷指定 type值为DirectoryOrCreate，则权限为0755。
如果需要更精细的控制，可以使用 initContainers ，与`spec.containers`同级

## initContainers
```yaml
# 新增init容器调整日志目录，此处只能调整共同挂载卷的权限
      initContainers:
      - name: initc
        securityContext:
          runAsUser: 0
        command:
        - sh
        - -c
        - whoami; chmod 750 /applog; chown -R 65532:65532 /applog
        image: debian:10
        imagePullPolicy: IfNotPresent
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
        volumeMounts:
        - mountPath: /applog
          name: applog
```
## 如果没有共同挂在卷呢？
答：在Dockerfile中修改，可能需要USER指令改变RUN的命令权限。