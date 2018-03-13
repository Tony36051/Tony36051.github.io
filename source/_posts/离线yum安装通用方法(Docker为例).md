---


---

<hr>
<p>title: 离线yum安装通用方法(Docker为例)<br>
date: 2018-03-13 10:00:00<br>
tags: [centos, docker]</p>
<hr>
<h1 id="原理">原理</h1>
<p>yum install有参数--downloadonly，可以只下载不安装，搭配--downloaddir=DLDIR参数可以下载依赖包，完成离线安装。<br>
命令实例：</p>
<pre class=" language-bash"><code class="prism  language-bash"><span class="token comment"># online machine: pwd --&gt; /root</span>
<span class="token function">mkdir</span> -p /root/download
yum <span class="token function">install</span> --downloadonly --downloaddir<span class="token operator">=</span>/root/download <span class="token operator">&lt;</span>package-name<span class="token operator">&gt;</span>
<span class="token function">tar</span> zcf download.tar.gz download/

</code></pre>
<pre class=" language-bash"><code class="prism  language-bash"><span class="token comment"># offline machine: pwd --&gt; /root</span>
<span class="token function">tar</span> xf download.tar.gz
yum localinstall download/*
</code></pre>
<h1 id="docker实例">docker实例</h1>
<p>按照官网说明，使用以上命令，获得的rpm包，基于Centos7.0-1406系统<br>
<a href="https://github.com/Tony36051/docker-installer/tree/master/RPM-based/docker-ce-17.12-CentOS-7.0-1406">https://github.com/Tony36051/docker-installer/tree/master/RPM-based/docker-ce-17.12-CentOS-7.0-1406</a><br>
root权限执行一下命令即可:</p>
<blockquote>
<p>sudo sh <a href="http://install.sh">install.sh</a></p>
</blockquote>
<h2 id="可能的坑">可能的坑</h2>
<p>rpm包有重复、冲突，体现为在安装xxx包时候，依赖项Requires，但是有重复或冲突，需要卸载Removing，并被yyy包更新Updated。但是这个过程不能自动化，因为yum不知道你冲突后要保留哪个。例子如下：</p>
<pre class=" language-bash"><code class="prism  language-bash">--<span class="token operator">&gt;</span> Processing Dependency: rpm <span class="token operator">=</span> 4.11.3-25.el7 <span class="token keyword">for</span> package: rpm-libs-4.11.3-25.el7.x86_64
--<span class="token operator">&gt;</span> Finished Dependency Resolution
Error: Package: 1:net-snmp-agent-libs-5.7.2-24.el7.i686 <span class="token punctuation">(</span>@Server<span class="token punctuation">)</span>
           Requires: librpm.so.3
           Removing: rpm-libs-4.11.3-17.el7.i686 <span class="token punctuation">(</span>@Server<span class="token punctuation">)</span>
               librpm.so.3
           Updated By: rpm-libs-4.11.3-25.el7.x86_64 <span class="token punctuation">(</span>/rpm-libs-4.11.3-25.el7.x86_64<span class="token punctuation">)</span>
               Not found
Error: Package: rpm-build-libs-4.11.3-17.el7.x86_64 <span class="token punctuation">(</span>@Server<span class="token punctuation">)</span>
           Requires: rpm-libs<span class="token punctuation">(</span>x86-64<span class="token punctuation">)</span> <span class="token operator">=</span> 4.11.3-17.el7
           Removing: rpm-libs-4.11.3-17.el7.x86_64 <span class="token punctuation">(</span>@Server<span class="token punctuation">)</span>
               rpm-libs<span class="token punctuation">(</span>x86-64<span class="token punctuation">)</span> <span class="token operator">=</span> 4.11.3-17.el7
           Updated By: rpm-libs-4.11.3-25.el7.x86_64 <span class="token punctuation">(</span>/rpm-libs-4.11.3-25.el7.x86_64<span class="token punctuation">)</span>
               rpm-libs<span class="token punctuation">(</span>x86-64<span class="token punctuation">)</span> <span class="token operator">=</span> 4.11.3-25.el7
Error: Package: 1:net-snmp-agent-libs-5.7.2-24.el7.i686 <span class="token punctuation">(</span>@Server<span class="token punctuation">)</span>
           Requires: librpmio.so.3
           Removing: rpm-libs-4.11.3-17.el7.i686 <span class="token punctuation">(</span>@Server<span class="token punctuation">)</span>
               librpmio.so.3
           Updated By: rpm-libs-4.11.3-25.el7.x86_64 <span class="token punctuation">(</span>/rpm-libs-4.11.3-25.el7.x86_64<span class="token punctuation">)</span>
               Not found
Error: Package: rpm-libs-4.11.3-25.el7.x86_64 <span class="token punctuation">(</span>/rpm-libs-4.11.3-25.el7.x86_64<span class="token punctuation">)</span>
           Requires: rpm <span class="token operator">=</span> 4.11.3-25.el7
           Installed: rpm-4.11.3-17.el7.x86_64 <span class="token punctuation">(</span>@Server<span class="token punctuation">)</span>
               rpm <span class="token operator">=</span> 4.11.3-17.el7
 You could try using --skip-broken to work around the problem
 You could try running: rpm -Va --nofiles --nodigest

</code></pre>
<h2 id="解决方法">解决方法</h2>
<ul>
<li>查看重复包</li>
</ul>
<pre class=" language-bash"><code class="prism  language-bash">rpm -vqa <span class="token operator">|</span> <span class="token function">grep</span> net-snmp-agent-
net-snmp-agent-libs-5.7.2-24.el7.x86_64
net-snmp-agent-libs-5.7.2-24.el7.i686
</code></pre>
<ul>
<li>卸载冲突包</li>
</ul>
<pre class=" language-bash"><code class="prism  language-bash">yum remove rpm-libs-4.11.3-17.el7.i686
</code></pre>

