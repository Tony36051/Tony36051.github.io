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
如果需要更精细的控制，可以使用initContainers


## 监控原理
公司平台使用普罗米修斯采集Java暴露的JMX数据，作为产品研发团队，只需要在程序启动后，将每个数据源包装一个Listener，多个数据源打包成map，交给`MBeanExporter`

```yaml
# 新增init容器调整日志目录，以满足送检要求
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
