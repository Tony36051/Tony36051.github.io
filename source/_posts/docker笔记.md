---
title: docker笔记
date: 2018-04-25 14:14
tags:
- docker
---
docker的配置要点、常见问题、命令、姿势。
<!-- more -->
# 安装&配置
官网指南：https://docs.docker.com/install/
中文翻译：https://yeasy.gitbooks.io/docker_practice/content/install/ubuntu.html
## 配置代理
```bash
sudo mkdir /etc/systemd/system/docker.service.d
#添加http代理内容
sudo vim /etc/systemd/system/docker.service.d/http-proxy.conf
[Service]
Environment="HTTP_PROXY=http://username:password@proxy.example.com:port"
```
```bash
sudo vim /etc/systemd/system/docker.service.d/https-proxy.conf
#添加http代理内容
[Service]
Environment="HTTPS_PROXY=http://username:password@proxy.example.com:port"
```
## 仓库改源&安全证书
如果在公司代理之后，https使用ssl链接经常会出现证书问题(如`x509: certificate signed by unknown authority`)。通常是忽略或添加证书到系统。
参考：https://docs.docker.com/registry/insecure/#use-self-signed-certificates
```bash
sudo vim /etc/docker/daemon.json
{
  "registry-mirrors": ["https://registry.docker-cn.com"],
  "insecure-registries" : ["registry.docker-cn.com:5000"]
}
```
## 重启docker-daemon以生效
```bash
#更新变化
sudo systemctl daemon-reload
#重启docker
sudo systemctl restart docker
```
# 常见问题
## 挂载的volume没有写权限
有一类容器需要在宿主机读写文件做持久化，宿主机的目录data属于userA，然而容器内运行的用户是userB，通常会造成没有写权限而报错。更准确地说，不是根据用户名，而是根据uid/gid来判断权限的。

`cat /etc/passwd`可以看出系统所有用户，`whoami`可以查看当前的用户名，`id username`可以查看username的用户uid和gid。通常来说，宿主机和容器内的uid/gid有以下对应关系：
| 用户 | 宿主机 | 容器内 |
|--|--|--|
| root | 0 | 0 |
| nobody | 99 | 65534 |
| 第一个useradd的用户 | 1000 | 1000 |

通常来说，我们将要挂载的目录的属主在为1000，一般就没问题。例如将`~/data`改为容器内的用户
```bash
chown -R 1000:1000 ~/data
```
## proxy环境与docker network
这不是常见问题，但如果你在一家需要代理上网的公司，你有可能遇上。
### 描述
众所周知，docker容器内的ip默认是`172.17.0.0`网段，新建一个docker network的网段是`172.18.0.0`。非常巧的是，我司的代理服务器的ip刚好是`172.18.xx.xx`。此时如果用docker-compose，通常会新建一个网络，然后加到linux路由中，本来应该走代理的请求走到了新建的docker网络。表现为逐个容器都能启动，一旦使用docker-compose或swarm就不行了，无法通过代理拉取新的镜像。
### 对症下药
知道原因之后就好办了，规避的方法很简单，指定使用默认的网卡docker0。或者手工指定新建网络的网段。
没有保存相关命令和yaml文件，日后有机会再补充吧。


# 常用操作
## 调试&生产启动命令

### 调试
在调试的时候，经常要修改启动的命令和参数，希望能看到实时控制台信息。
>docker run --rm -it mysql
### 生产
在实际生产环境使用时，希望以daemon形式、固定的名字运行，最好能自动重启。
>docker run -d -name mysql5.6 --restart always mysql

# 常用命令
## 构建镜像
```bash
docker build -t target_name <directory>
docker build -t friendlyhello .
```
## 打包镜像
`docker save -o outputImage.tar <repo>/<image>:<tag>`
## 加载镜像
`docker load --input some_image.tar`
## 启动容器
```bash
docker run -p 4000:80 friendlyhello
docker run -d -p 4000:80 friendlyhello #后台形式
```
## 进入容器
```
docker exec -ti <containerName> bash
docker exec -ti <containerId> bash
docker exec -ti –user nobody vbadaemon1 bash # 以nobody用户进入容器
```
## 查看容器
`docker ps`
## 停止容器
`docker stop 1fa4ab2cf395  #刚才ps的container id`
## 删除容器
`docker rm 1fa4ab2cf395  #刚才ps的container id`
## 批量删除
```
docker rm $(docker ps -a | grep 'node-' | awk '{print $1}') -f
docker rm $(docker ps -a | grep 'selenium/hub' | awk '{print $1}') -f
```
## 删除未使用的镜像
```
docker ps -a | grep "Exited" | awk '{print $1 }'|xargs docker stop
docker ps -a | grep "Exited" | awk '{print $1 }'|xargs docker rm
docker images|grep none|awk '{print $3 }'|xargs docker rmi
```
## 网络相关
```
docker network ls
#(默认有host bridge none三个)
docker network rm
#容器内获取宿主机ip, 容器内执行
ip route|awk '/default/ { print $3 }'
```
## swarm集群
```
docker swarm init  #(在manager节点输入，此时会建两个网络)
docker swarm leave -f 
```
# 私人容器
## cntlm
公司代理使用ntlm认证，cntlm是跨系统的一个代理，容器需要自己build一下
`Dockerfile`
```
FROM jaschac/cntlm:latest
ADD cntlm.conf /etc/cntlm.conf
# docker build -t "hwcntlm" .
```
```
docker run --name hwcntlm --restart always -d \
-p 3128:3128 \
-e CNTLM_PROXY_URL="proxyhk.example.com:8080" \
-e CNTLM_USERNAME="a00123456" \
-e CNTLM_DOMAIN="china" \
-e "CNTLM_PASSNT=D7666F8E655613E42DBD9C186A5203B5" \
-e "CNTLM_PASSLM=49DCEDB48EC97AF583CEEC4B5E5A1C5F" \
hwcntlm
```
## MySQL
```
docker run --name mysql --restart always -d \
-v /home/tony/mysql_data:/var/lib/mysql \
-p 3306:3306 \
-e MYSQL_ROOT_PASSWORD=huawei123 \
mysql:5.6
```
## Nginx(Autoindex)
```
docker run --name apps-nginx --restart always -d \
-p 80:80 \
-v /home/tony/nginx_data:/usr/share/nginx/html:ro \
jrelva/nginx-autoindex
```
## Java8( apps-portal)
用OpenJDK8跑springboot的jar包，依赖mysql容器
```
docker run --name apps-portal -d \
-p 8079:8080 \
--link mysql:mysql \
-v /home/tony/apps-portal:/usr/src/myapp \
openjdk:8-alpine \
java -jar /usr/src/myapp/apps-portal.jar
```
## Tomcat
1. CCM联调自动诊断
2. iSales快速下PO
3. API监控
```
# CCM联调自动诊断
docker run -d --name autocheck --restart always \
-p 8080:8080 \
-v /home/tony/autocheck:/usr/local/tomcat/webapps/autocheck \
tomcat:9-jre8-alpine

# 快速下PO，功能已坏，未更新
docker run -d --name fastpo --restart always \
-p 8081:8080 \
-v /home/tony/fastpo:/usr/local/tomcat/webapps/fastpo \
tomcat:9-jre8-alpine

# API监控， 依赖mysql
docker run -d --name apimonitor \
-p 8082:8080 \
--link mysql:mysql \
-v /home/tony/apimonitor:/usr/local/tomcat/webapps \
tomcat:9-jre8-alpine
```
## Jenkins容器
1. 映射的目录赋予一样的用户属主
2. 因为公司环境有代理，link了代理跳板
3. 时区用了两种`映射了时区文件`和`JAVA_OPTS`方法
4. 对接RobotFramework的插件需要允许js执行，通过`JAVA_OPTS`方法放松安全限制
```bash
sudo chown -R 1000:1000 /home/tony/jenkins   #赋权，容器内是1000的root

docker run -u root --name jenkins --restart always -d \
-p 8083:8080 -p 50000:50000 \
--link hwcntlm:hwcntlm \
--add-host szxsvn02-ex:172.30.45.47 \
-v /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime \
-v /home/tony/jenkins-blueocean-data:/var/jenkins_home \
-v /var/run/docker.sock:/var/run/docker.sock \
-e http_proxy=hwcntlm:3128 \
-e https_proxy=hwcntlm:3128 \
-e JAVA_OPTS="-DproxyHost=hwcntlm -DproxyPort=3128 -Dhudson.model.DirectoryBrowserSupport.CSP= -Duser.timezone=Asia/Shanghai" \
jenkinsci/blueocean
```
## GIT(gogs)
1. 页面访问使用localhost:3000
2. ssh登录使用localhost:1022
```
docker run -d --name gogs --restart always \
-p 10022:22 \
-p 3000:3000 \
-v /home/tony/gogs:/data \
gogs/gogs
```
## semaphore(ansible-tower替代者)
1. Ansible官网推荐的最佳实践在semaphore上不能很好实践
2. 必须从git上取ansible的代码
3. 不能指定inventory文件，需要复制粘贴到界面
```
docker run -d --name semaphore --restart always \
--link mysql:mysql_host \
-p 13000:3000 \
-e SEMAPHORE_DB=semaphore \
-e SEMAPHORE_DB_HOST=mysql_host \
-e SEMAPHORE_DB_PORT=3306 \
-e SEMAPHORE_DB_USER=semaphore \
-e SEMAPHORE_DB_PASS=huawei123 \
-e SEMAPHORE_PLAYBOOK_PATH=/etc/semaphore \
-e SEMAPHORE_ADMIN=admin \
-e SEMAPHORE_ADMIN_NAME=admin \
-e SEMAPHORE_ADMIN_EMAIL=admin@admin.local \
-e SEMAPHORE_ADMIN_PASSWORD=admin \
-e ANSIBLE_HOST_KEY_CHECKING=False \
--volume=/home/tony/semaphore/playbook_repo:/etc/playbook_repo \
semaphore
```
## Zabbix
1. zabbix服务器端应该启动三个模块，数据库、server、web
2. 服务器依赖数据库
3. Web依赖数据库和server
4. Agent几乎无依赖，不用docker部署，而且部署后默认采集是容器内指标，意义不大
5. Web端图表如果是中文标题，会因为缺少字体而显示为小的长方形，故映射一个字体文件

### Server
```
docker run -d --name zabbix-server-mysql --restart always \
--link mysql:mysql_host \
-p 10051:10051 \
-e DB_SERVER_HOST="mysql_host" \
-e MYSQL_USER="root" \
-e MYSQL_PASSWORD="huawei123" \
-v /home/tony/zabbix/externalscripts:/usr/lib/zabbix/externalscripts \
zabbix/zabbix-server-mysql
```
### Web
```bash
docker run --name zabbix-web-nginx-mysql --restart always \
--link mysql:mysql_host \
--link zabbix-server-mysql:zabbix-server-mysql \
-p 81:80 \
-e DB_SERVER_HOST="mysql_host" \
-e MYSQL_USER="root" \
-e MYSQL_PASSWORD="huawei123" \
-e ZBX_SERVER_HOST="zabbix-server-mysql" \
-e PHP_TZ="Asia/Shanghai" \
-v /home/tony/zabbix/msyh.ttf:/usr/share/zabbix/fonts/graphfont.ttf \
-d zabbix/zabbix-web-nginx-mysql:latest
```
## 7z压缩镜像
-w是工作目录，这里是/t。 a是add，压缩的意思，e是extract，解压的意思。最后两个参数是输出文件和压缩目录
>docker run -it --rm -v $(pwd):/t -w /t izotoff/7zip a test1.7z .

## zookeeper
```bash
docker run -d --restart always --name zookeeper \
-p 2181:2181 \
zookeeper:3.4
```

## kafka
hub.docker.com上有好多镜像，最高的要自己build，在proxy环境下比较麻烦，构建过程中在alpine中用wget下载https报错。有些镜像是捆绑zookeeper，最后选择的是分开的，提供了data和logs映射的镜像。
>chown -R 1000:1000 data/ logs/
```Dockerfile
docker run -d --restart always --name kafka \
-p 7203:7203 \
-p 9092:9092 \
-v /home/tony/kafka/data:/data \
-v /home/tony/kafka/logs:/logs \
--link zookeeper:zookeeper \
--env ZOOKEEPER_IP=zookeeper \
ches/kafka
```

# Dockerfile
## RobotFramework执行器
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
