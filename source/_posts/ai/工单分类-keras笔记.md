---
title: 工单分类-keras笔记
date: 2018-12-05 00:41
tag:
- 数据分析
categories:
- AI
---
之前参加公司内的文本分类（工单分类）比赛，记录中间过程。
<!--more-->

# 工具准备

## Anaconda
Anaconda安装好后, 如果jupyter插件没有显示, 请确认是否安装到对应的环境里了
```bash
# 配置清华的源
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --set show_channel_urls yes
```

```bash
# 创建虚拟环境
conda create -n py3 python=3 ipykernel
# 激活环境
conda activate py3
# 安装jupyter
pip install -U jupyter
# 将环境写入ipython的kernel中
python -m ipykernel install --user --name py3 --display-name "py3"
# 安装jupyter插件
pip install jupyter_contrib_nbextensions
jupyter contrib nbextension install --user
pip install jupyter_nbextensions_configurator
jupyter nbextensions_configurator enable --user

# 删除环境
deactivate
conda env remove -n py3
conda remove -n py3 --all
```
## 远程访问jupyter
```bash
jupyter notebook password
jupyter notebook --generate-config
vim xxx.py
c.NotebookApp.ip='0.0.0.0'
c.NotebookApp.open_browser = False
#c.NotebookApp.port =8888 #可自行指定一个端口, 访问时使用该端口

```

## pip配置

-   Unix:`$HOME/.config/pip/pip.conf`
-   Mac:  `$HOME/Library/Application Support/pip/pip.conf`
-   Windows：`%APPDATA%\pip\pip.ini`，`%APPDATA%`的实际路径我电脑上是`C:\Users\user_xxx\AppData\Roaming`，可在cmd里执行`echo %APPDATA%`命令查看

```ini
[global]
proxy=http://100.100.154.250:3128
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
trusted-host=tuna.tsinghua.edu.cn
```
## 临时pip
```bash
python.exe -m pip install numpy --proxy="proxy.com:8080"
```

# 文本清洗

## 术语实体
有字典最好, 没有的话从训练集挖掘一下. 没啥作用
1. 按工单类型(标签)将工单内容连接在一起, 分词后做word count, 高频词汇中应该有术语, 添加到字典中, 让分词器不要清理.
2. 分词之后直接tfidf扔线性分类器, 然后看被过滤的stop_word. 应该可以看CountVectorizer的高频词.

## 提取关键字
最后用的HanLP分词
1. 词频获取, jiaba.extract_tags
2. TextRank, jieba.textrank
3. jieba.cut(cut_all=True)
4. jieba.cut_for_search()
5. pseg.cut() 按词性过滤
6. pseg.cut() 按词性过滤后, 紧密关联, 按char划分取(1,8) gram

# Tokenizer
```python
from keras_preprocessing.text import Tokenizer
texts = ['手机 偶尔 充 不 进 电', '酷狗 打开 提示 检测 不到 sd 卡', '平板 连接 wifi 无法 上网',
 '华为 p 20 耗电 太快 \u200b\u200b',
 '耗电 快 7月 中旬 网点 换 了 电池 现在 又 耗电 快 一早 上 两 小时 百分之 30 mate 8 全 网通 64 保外 付费 更换 的 保修期',
 'p 20 电信卡 使用 通话质量 不好 ， 有 杂音',
 '查询 长沙 的 售后 网点 地址 和 联系方式 手机 有 质量 问题 屏幕 与 机身 分离 了 没有人 为 导致 的 也 没有 摔 过'
 '后 壳 碎裂',
 'plus 标配 版 中国移动 全 网通 定制 版本 3 gb + 32 gb ( toronto-tl 10 ) trt-tl 10 充满 电 用 四 五小 时 ， 主要 看 视频',
 'v 8 打电话 过程 中 断 移动']

tt = Tokenizer(num_words=20, oov_token='</s>')
tt.fit_on_texts(texts)
print(len(tt.word_counts),len(tt.word_index))
seq = tt.texts_to_sequences(texts)
for (a,b) in zip(texts, seq):
    print(a,b)
```
```notebook
104 105
手机 偶尔 充 不 进 电 [4, 19, 1, 1, 1, 5]
酷狗 打开 提示 检测 不到 sd 卡 [1, 1, 1, 1, 1, 1, 1]
平板 连接 wifi 无法 上网 [1, 1, 1, 1, 1]
华为 p 20 耗电 太快 ​​ [1, 6, 7, 2, 1, 1]
耗电 快 7月 中旬 网点 换 了 电池 现在 又 耗电 快 一早 上 两 小时 百分之 30 mate 8 全 网通 64 保外 付费 更换 的 保修期 [2, 8, 1, 1, 9, 1, 10, 1, 1, 1, 2, 8, 1, 1, 1, 1, 1, 1, 1, 11, 12, 13, 1, 1, 1, 1, 3, 1]
p 20 电信卡 使用 通话质量 不好 ， 有 杂音 [6, 7, 1, 1, 1, 1, 14, 15, 1]
查询 长沙 的 售后 网点 地址 和 联系方式 手机 有 质量 问题 屏幕 与 机身 分离 了 没有人 为 导致 的 也 没有 摔 过后 壳 碎裂 [1, 1, 3, 1, 9, 1, 1, 1, 4, 15, 1, 1, 1, 1, 1, 1, 10, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1]
plus 标配 版 中国移动 全 网通 定制 版本 3 gb + 32 gb ( toronto-tl 10 ) trt-tl 10 充满 电 用 四 五小 时 ， 主要 看 视频 [1, 1, 1, 1, 12, 13, 1, 1, 1, 16, 1, 16, 1, 17, 18, 1, 17, 18, 1, 5, 1, 1, 1, 1, 14, 1, 1, 1]
v 8 打电话 过程 中 断 移动 [1, 11, 1, 1, 1, 1, 1]
```
## 观察
1. num_words参数限制了转换后的word_index为[1,20]
2. 所有低频的词都认为是oov_token(</s>)了
3. 统计词频的word_count比word_index少一项, 就是没有统计</s>的词频. 如果统计了, 应该是词频最高的词之一了.
4. 实际上是将低频词(词频在前num_words开外)的词都认为是一个词(低频词), 在词向量里面用一个在0的正态分布随机向量代替, 即预训练权重中unk未知词.

# 画图

在训练过程中, 常需要查看train/val的loss图, 看是否拟合/过拟合.

## 训练过程中画图 TensorBoard

新建一个类, 封装TensorBoard的callback, keras实现.
```python
class TrainValTensorBoard(TensorBoard):
    def __init__(self, log_dir='./logs', **kwargs):
        self.val_log_dir = os.path.join(log_dir, 'validation')
        training_log_dir = os.path.join(log_dir, 'training')
        super(TrainValTensorBoard, self).__init__(training_log_dir, **kwargs)

    def set_model(self, model):
        if context.executing_eagerly():
            self.val_writer = tf.contrib.summary.create_file_writer(self.val_log_dir)
        else:
            self.val_writer = tf.summary.FileWriter(self.val_log_dir)
        super(TrainValTensorBoard, self).set_model(model)

    def _write_custom_summaries(self, step, logs=None):
        logs = logs or {}
        val_logs = {k.replace('val_', ''): v for k, v in logs.items() if 'val_' in k}
        if context.executing_eagerly():
            with self.val_writer.as_default(), tf.contrib.summary.always_record_summaries():
                for name, value in val_logs.items():
                    tf.contrib.summary.scalar(name, value.item(), step=step)
        else:
            for name, value in val_logs.items():
                summary = tf.Summary()
                summary_value = summary.value.add()
                summary_value.simple_value = value.item()
                summary_value.tag = name
                self.val_writer.add_summary(summary, step)
        self.val_writer.flush()

        logs = {k: v for k, v in logs.items() if not 'val_' in k}
        super(TrainValTensorBoard, self)._write_custom_summaries(step, logs)

    def on_train_end(self, logs=None):
        super(TrainValTensorBoard, self).on_train_end(logs)
        self.val_writer.close()
```
使用上就在callbacks列表中加入类的实例即可.
```python
from tensorflow.keras.datasets import mnist
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.train import AdamOptimizer

tf.enable_eager_execution()

(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train = x_train.reshape(60000, 784)
x_test = x_test.reshape(10000, 784)
x_train = x_train.astype('float32')
x_test = x_test.astype('float32')
x_train /= 255
x_test /= 255
y_train = y_train.astype(int)
y_test = y_test.astype(int)

model = Sequential()
model.add(Dense(64, activation='relu', input_shape=(784,)))
model.add(Dense(10, activation='softmax'))
model.compile(loss='sparse_categorical_crossentropy', optimizer=AdamOptimizer(), metrics=['accuracy'])

model.fit(x_train, y_train, epochs=10,
          validation_data=(x_test, y_test),
          callbacks=[TrainValTensorBoard(write_graph=False)])
```
# 事后画图: keras的history
```python
# define the function
class LossHistory(keras.callbacks.Callback):
    def on_train_begin(self, logs={}):
        self.losses = {'batch': [], 'epoch': []}
        self.accuracy = {'batch': [], 'epoch': []}
        self.val_loss = {'batch': [], 'epoch': []}
        self.val_acc = {'batch': [], 'epoch': []}

    def on_batch_end(self, batch, logs={}):
        self.losses['batch'].append(logs.get('loss'))
        self.accuracy['batch'].append(logs.get('acc'))
        self.val_loss['batch'].append(logs.get('val_loss'))
        self.val_acc['batch'].append(logs.get('val_acc'))

    def on_epoch_end(self, batch, logs={}):
        self.losses['epoch'].append(logs.get('loss'))
        self.accuracy['epoch'].append(logs.get('acc'))
        self.val_loss['epoch'].append(logs.get('val_loss'))
        self.val_acc['epoch'].append(logs.get('val_acc'))

    def loss_plot(self, loss_type):
        iters = range(len(self.losses[loss_type]))
        #创建一个图
        plt.figure()
        # acc
        plt.plot(iters, self.accuracy[loss_type], 'r', label='train acc')#plt.plot(x,y)，这个将数据画成曲线
        # loss
        plt.plot(iters, self.losses[loss_type], 'g', label='train loss')
        if loss_type == 'epoch':
            # val_acc
            plt.plot(iters, self.val_acc[loss_type], 'b', label='val acc')
            # val_loss
            plt.plot(iters, self.val_loss[loss_type], 'k', label='val loss')
        plt.grid(True)#设置网格形式
        plt.xlabel(loss_type)
        plt.ylabel('acc-loss')#给x，y轴加注释
        plt.legend(loc="upper right")#设置图例显示位置
        plt.show()

#创建一个实例LossHistory
history = LossHistory()
```
```python
model.fit(X_train, Y_train,
            batch_size=batch_size, nb_epoch=nb_epoch,
            verbose=1,
            validation_data=(X_test, Y_test),
            callbacks=[history])#callbacks回调，将数据传给history

```
```python
history.loss_plot('epoch')
history.loss_plot('batch')
```