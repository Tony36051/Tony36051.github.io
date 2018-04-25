---
title: RobotFramework执行镜像
date: 2018-04-25 20:36
tags:
- docker
- jenkins
---
团队使用RobotFramework作为主要自动化工具，将执行环境容器化，方便部署和扩展，以下为构建的Dockerfile
<!-- more -->
准备修改基础镜像，使其尺寸更小。同时考虑修改为python3
以下为疑似问题
1、尺寸大
2、python2字符问题
3、sqlite3有unicode问题
4、Jenkins（in docker）执行docker命令时，如果传参中文会报错,docker run rfwjs python <path contain chinese>/jobsubmit.py para1 para2
```
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# This container is made to execute RobotFramework test.
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

FROM devilrancy/robot-cx-python:2.7-slim

MAINTAINER Wu Jiansong <360517703@163.com>

ENV http_proxy=http://username:password@proxy.example.com:8080 \
    https_proxy=http://username:password@proxy.example.com:8080 \
    REMOTE_URL=http://100.100.154.250:4444/wd/hub

RUN pip install -U pip \
    requests \
    selenium \
    xlrd \
    cx-Oracle \
    pyhive \
    pymysql \
    robotframework \
    dbbot \
    robotframework-selenium2library \
    robotframework-databaselibrary \
    robotframework-requests \
    robotframework-sshlibrary \
    robotframework-excelLibrary && \
    sed -i "s#formatting_info=True,##g" /usr/local/lib/python2.7/site-packages/ExcelLibrary/ExcelLibrary.py && \
    sed -i "s#remote_url=False#remote_url='$REMOTE_URL'#g" /usr/local/lib/python2.7/site-packages/SeleniumLibrary/keywords/browsermanagement.py && \
    echo "\
    def switch_base_url(self, alias, url):\n\
        '''\n\
        change base_url of current session. add by w00406273\n\
        '''\n\
        session = self._cache.switch(alias)\n\
        session.url = url\n"\
    >> /usr/local/lib/python2.7/site-packages/RequestsLibrary/RequestsKeywords.py && \
    echo Asia/Shanghai > /etc/timezone && \
    mv /etc/localtime /etc/localtime.bak && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

ENV http_proxy= \
    https_proxy=
```
