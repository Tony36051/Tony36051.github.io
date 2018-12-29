---
title: 数据分析-Tokenizer(Keras)笔记
date: 2018-12-29 14:41
tag:
- 数据分析
categories:
- AI
---
使用Keras的Tokenizer的一些笔记
<!--more-->
## 例子
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
4. 实际上是将低频词(c)
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEzNzMyODA5MjgsNDg0MzcxNjIwXX0=
-->