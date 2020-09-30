# Welcome to StackEdit!

Hi! I'm your first Markdown file in **StackEdit**. If you want to learn about StackEdit, you can read me. If you want to play with Markdown, you can edit me. Once you have finished with me, you can create new files by opening the **file explorer** on the left corner of the navigation bar.


# Files

StackEdit stores your files in your browser, which means all your files are automatically saved locally and are accessible **offline!**

## Create files and folders

The file explorer is accessible using the button in left corner of the navigation bar. You can create a new file by clicking the **New file** button in the file explorer. You can also create folders by clicking the **New folder** button.

## Switch to another file

All your files and folders are presented as a tree in the file explorer. You can switch from one to another by clicking a file in the tree.

## Rename a file

You can rename the current file by clicking the file name in the navigation bar or by clicking the **Rename** button in the file explorer.

## Delete a file

You can delete the current file by clicking the **Remove** button in the file explorer. The file will be moved into the **Trash** folder and automatically deleted after 7 days of inactivity.

## Export a file

You can export the current file by clicking **Export to disk** in the menu. You can choose to export the file as plain Markdown, as HTML using a Handlebars template or as a PDF.


# Synchronization

Synchronization is one of the biggest features of StackEdit. It enables you to synchronize any file in your workspace with other files stored in your **Google Drive**, your **Dropbox** and your **GitHub** accounts. This allows you to keep writing on other devices, collaborate with people you share the file with, integrate easily into your workflow... The synchronization mechanism takes place every minute in the background, downloading, merging, and uploading file modifications.

There are two types of synchronization and they can complement each other:

- The workspace synchronization will sync all your files, folders and settings automatically. This will allow you to fetch your workspace on any other device.
	> To start syncing your workspace, just sign in with Google in the menu.

- The file synchronization will keep one file of the workspace synced with one or multiple files in **Google Drive**, **Dropbox** or **GitHub**.
	> Before starting to sync files, you must link an account in the **Synchronize** sub-menu.

## Open a file

You can open a file from **Google Drive**, **Dropbox** or **GitHub** by opening the **Synchronize** sub-menu and clicking **Open from**. Once opened in the workspace, any modification in the file will be automatically synced.

## Save a file

You can save any file of the workspace to **Google Drive**, **Dropbox** or **GitHub** by opening the **Synchronize** sub-menu and clicking **Save on**. Even if a file in the workspace is already synced, you can save it to another location. StackEdit can sync one file with multiple locations and accounts.

## Synchronize a file

Once your file is linked to a synchronized location, StackEdit will periodically synchronize it by downloading/uploading any modification. A merge will be performed if necessary and conflicts will be resolved.

If you just have modified your file and you want to force syncing, click the **Synchronize now** button in the navigation bar.

> **Note:** The **Synchronize now** button is disabled if you have no file to synchronize.

## Manage file synchronization

Since one file can be synced with multiple locations, you can list and manage synchronized locations by clicking **File synchronization** in the **Synchronize** sub-menu. This allows you to list and remove synchronized locations that are linked to your file.


# Publication

Publishing in StackEdit makes it simple for you to publish online your files. Once you're happy with a file, you can publish it to different hosting platforms like **Blogger**, **Dropbox**, **Gist**, **GitHub**, **Google Drive**, **WordPress** and **Zendesk**. With [Handlebars templates](http://handlebarsjs.com/), you have full control over what you export.

> Before starting to publish, you must link an account in the **Publish** sub-menu.

## Publish a File

You can publish your file by opening the **Publish** sub-menu and by clicking **Publish to**. For some locations, you can choose between the following formats:

- Markdown: publish the Markdown text on a website that can interpret it (**GitHub** for instance),
- HTML: publish the file converted to HTML via a Handlebars template (on a blog for example).

## Update a publication

After publishing, StackEdit keeps your file linked to that publication which makes it easy for you to re-publish it. Once you have modified your file and you want to update your publication, click on the **Publish now** button in the navigation bar.

> **Note:** The **Publish now** button is disabled if your file has not been published yet.

## Manage file publication

Since one file can be published to multiple locations, you can list and manage publish locations by clicking **File publication** in the **Publish** sub-menu. This allows you to list and remove publication locations that are linked to your file.


# Markdown extensions

StackEdit extends the standard Markdown syntax by adding extra **Markdown extensions**, providing you with some nice features.

> **ProTip:** You can disable any **Markdown extension** in the **File properties** dialog.


## SmartyPants

SmartyPants converts ASCII punctuation characters into "smart" typographic punctuation HTML entities. For example:

|                |ASCII                          |HTML                         |
|----------------|-------------------------------|-----------------------------|
|Single backticks|`'Isn't this fun?'`            |'Isn't this fun?'            |
|Quotes          |`"Isn't this fun?"`            |"Isn't this fun?"            |
|Dashes          |`-- is en-dash, --- is em-dash`|-- is en-dash, --- is em-dash|


## KaTeX

You can render LaTeX mathematical expressions using [KaTeX](https://khan.github.io/KaTeX/):

The *Gamma function* satisfying $\Gamma(n) = (n-1)!\quad\forall n\in\mathbb N$ is via the Euler integral

$$
\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.
$$

> You can find more information about **LaTeX** mathematical expressions [here](http://meta.math.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference).


## UML diagrams

You can render UML diagrams using [Mermaid](https://mermaidjs.github.io/). For example, this will produce a sequence diagram:

```mermaid
sequenceDiagram
Alice ->> Bob: Hello Bob, how are you?
Bob-->>John: How about you John?
Bob--x Alice: I am good thanks!
Bob-x John: I am good thanks!
Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

Bob-->Alice: Checking with John...
Alice->John: Yes... John, how are you?
```

And this will produce a flow chart:

```mermaid
graph LR
A[Square Rect] -- Link text --> B((Circle))
A --> C(Round Rect)
B --> D{Rhombus}
C --> D
```


## 2017年

**大批量Web界面自动化**：使用Docker swarm搭建多机器Selenium Grid集群（双机4实例）执行Web自动化用例，Docker Compose文件指定使用共享内存、配置超时参数。客户端使用独立构建的docker镜像，支持Oracle、Excel、REST、Selenium Library的执行，使用python多进程驱动，将运行工程拆分至用例级别，优化Setup/Tear Down步骤提升用例稳定性，完成测试结果的提取和分析，支持重试。执行效率提升3倍，对失败截图使用pHash算法简单排序，快速找出共性问题。

其他：研读内源基于JUnit的Http协议测试框架，开展培训6场以上，参与小应用的正式开发工作。

## 2018年

**测试结果智能分析**： 在开源项目ReportPortal基础上二次开发，根据测试执行日志初步判断失败原因，达成日志收集、智能分析、报表生成等目标，减少94%定位时间，提升50%的修复效率。深入研读开源项目源码，增加一个自动标记的聚类功能，使用200+行的MongoDB复杂查询，新增查询和标记相关接口。重构项目为Maven项目，重新构造流水线，兼容原Docker命令条件下最小修改Docker Compose文件。配套使用Gitbook完成文档编写。

**Hadoop环境运维**：生产集群规模70台，使用HDFS、YARN、Hive、Azkaban、Kylin。本人完成Azkaban 3.5版本重新编译升级，解决编译依赖缺失和脚本兼容问题，解决单机负荷过大挂死风险，提升30%服务容量。使用PSSH和Ansible作为批量运维工具，总结使用文档、启停命令、配置参数等经验文档。

其他：测试技术支持excel解析、数据对比、REST请求抓包调试。

## 2019年

**运维监控**：规范要求微服务日志必须打印tracerid、环境信息，规范要求数据源必须暴露使用率。熟练使用ELK对生产环境日志监控，熟练使用JVM堆栈使用率等容器运行指标对应用监控，使用SQL对业务数据进行监控

**接口测试规范化**：推进Swagger注解标准，包括字符串、整形范围、必填、为空、example值，路径参数整改为查询参数。完成接口100%自动化覆盖。

**测试能力服务化**：独立负责Team Foundation Server用例管理相关扩展功能REST服务化。基于HttpComponents封装NTLM认证和连接池化；完成异构Excel用例导入生成树状管理的特性和用例，在分钟级迁移万级用例；在拷贝测试计划时，因为TFS接口限制同属一个父亲的多个孩子不能同时创建，所以抽象使用兄弟孩子树数据结构，利用多线程遍历提升接口复制速度2x。

其他：借助com.github.javaparser挖掘Java方法调用关系；RF框架借助chrome接口和psUtil获取进程使用内存完成前端内存泄漏测试；负责某模块3个版本的测试业务交付，培养自动化合作方员工1名。

## 业余

### 消息推送

我司有IM工具，项目构建等通知使用IM推送更加方便，但是申请正式接口比较麻烦，故做一个消息推送的小玩意。

```mermaid
graph LR
A[Server]--推送消息-->B[Clients]
B--注册上线-->A
C[CICD Server]--触发 -->A
D[个人调试]--触发 -->A
```

协议用`ProtoBuf`，Server用`Netty`，Client用`Go`实现，实现了心跳、注册、推送3条命令。由于多条命令共用一个通道，实现上使用`ProtoBuf`第三版的Any包裹了一层，Server在Channel Pipeline的末端使用`MessageToMessageCodec`做第一次转换，转换后接入自定义的Dispatcher，分发器根据消息类型使用Factory获取handlerMap中对应的处理器，对各种消息统一调用handle方法。

```mermaid
graph LR
A(Msg)-->B[MessageToMessageCodec]
B-->C(Any)
C-->D[Dispatcher]
D-->E(Login对应LoginHandler)
E-->F[handle方法]
```

### Amazon自动下单

从注册到下单，纯GUI实现，考虑无头Selenium也不必puppeteer慢多少，还是使用熟悉的python+多线程+无头Se实现。注意点：网速要快、等待时间要合理、xpath一把梭、图片不加载、视窗高度足够面部分滚动、Page Object隔离xpath变化。


<!--stackedit_data:
eyJoaXN0b3J5IjpbMTg4Njk3NjYzN119
-->