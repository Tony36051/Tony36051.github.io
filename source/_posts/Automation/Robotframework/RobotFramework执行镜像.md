---
title: RobotFramework执行镜像
date: 2018-04-25 20:36
tags:
- Docker
- Jenkins
categories:
- Test
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

```Dockerfile
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# This container is made to execute RobotFramework test.
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

FROM python:2.7-slim

MAINTAINER Wu Jiansong <360517703@163.com>

ENV REMOTE_URL=http://localhost:4444/wd/hub

# Install Ubuntu packages
RUN apt-get update && apt-get install -y --no-install-recommends \
                alien \
                dpkg-dev \
                debhelper \
                build-essential \
                libaio1 \
                wget \
            && rm -rf /var/lib/apt/lists/* 

# Install oracle
# Reference: https://help.ubuntu.com/community/Oracle%20Instant%20Client
# Download RPM files from http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html
# Get Oracle Client (this isn't the offical download location, but at least it works without logging in!)
RUN wget --no-check-certificate https://raw.githubusercontent.com/bumpx/oracle-instantclient/master/oracle-instantclient12.2-basiclite-12.2.0.1.0-1.x86_64.rpm \

# Alien RPM package installer
 && alien -i *.rpm \

# Cleaning up the packages downloaded
 && rm *.rpm \
 && apt-get purge -y --auto-remove wget alien

RUN echo "/usr/lib/oracle/12.2/client64/lib/" >> /etc/ld.so.conf.d/oracle.conf \
&& echo '#!/bin/bash\n\
export ORACLE_HOME=/usr/lib/oracle/12.2/client64\n\
export PATH=$PATH:$ORACLE_HOME/bin' >> /etc/profile.d/oracle.sh \
&& chmod +x /etc/profile.d/oracle.sh \
&& /etc/profile.d/oracle.sh \
&& ldconfig

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

```
