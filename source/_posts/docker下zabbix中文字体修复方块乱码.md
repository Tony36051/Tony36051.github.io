---


---

<h1 id="docker下zabbix中文字体修复方块乱码">docker下zabbix中文字体修复方块乱码</h1>
<h2 id="原因">原因</h2>
<p>官方镜像zabbix/zabbix-web-nginx-mysql使用/usr/share/zabbix/fonts/graphfont.ttf字体作为图标中文字体，然而自带的字体没有中文部分，所以显示方块。</p>
<h2 id="解决办法">解决办法</h2>
<p>最简单的方法是-v参数直接替换字体文件，docker run命令如下：</p>
<blockquote>
<p>docker run --name zabbix-web-nginx-mysql --restart=always  --link mysql:mysql_host --link zabbix-server-mysql:zabbix-server-mysql -p 81:80 -e DB_SERVER_HOST=“mysql_host” -e MYSQL_USER=“root” -e MYSQL_PASSWORD=“123” -e ZBX_SERVER_HOST=“zabbix-server-mysql” -e PHP_TZ=“Asia/Shanghai” -v /home/tony/zabbix/msyh.ttf:/usr/share/zabbix/fonts/graphfont.ttf -d zabbix/zabbix-web-nginx-mysql:latest</p>
</blockquote>
<p>其中/home/tony/zabbix/msyh.ttf为宿主机上的字体路径，可以从windows字体库中(C:\Windows\Fonts)找到中文字体</p>

