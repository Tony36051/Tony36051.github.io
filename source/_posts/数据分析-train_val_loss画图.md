---
title: 数据分析-train_val_loss画图
date: 2019-01-09
tag:
- 数据分析
categories:
- AI
---
以工单分类为例
<!--more-->
# 术语实体
有字典最好, 没有的话从训练集挖掘一下.
1. 按工单类型(标签)将工单内容连接在一起, 分词后做word count, 高频词汇中应该有术语, 添加到字典中, 让分词器不要清理.
2. 分词之后直接tfidf扔线性分类器, 然后看被过滤的stop_word. 应该可以看CountVectorizer的高频词.

# 提取关键字
1. 词频获取, jiaba.extract_tags
2. TextRank, jieba.textrank
3. jieba.cut(cut_all=True)
4. jieba.cut_for_search()
5. pseg.cut() 按词性过滤
6. pseg.cut() 按词性过滤后, 紧密关联, 按char划分取(1,8) gram

<!--stackedit_data:
eyJoaXN0b3J5IjpbNzcwMTcwMDc3XX0=
-->