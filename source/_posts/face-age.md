
---
title: 人脸年龄
date: 2018-04-10 00:09
tag:
- AI

___

# 实战操刀
## 下载数据集
https://data.vision.ee.ethz.ch/cvl/rrothe/imdb-wiki/static/imdb_crop.tar
https://data.vision.ee.ethz.ch/cvl/rrothe/imdb-wiki/static/wiki_crop.tar
数据说明：https://data.vision.ee.ethz.ch/cvl/rrothe/imdb-wiki/
## 解析元数据
元数据wiki.mat、imdab.mat是已matlab形式的mat文件存的，可以用scipy.io.loadmat读取。

```python
# -*- coding: utf-8 -*-  
# utils.py
# -*- coding: utf-8 -*-  
from scipy.io import loadmat  
from datetime import datetime  
import os  
import plot  
import logging  
from tqdm import tqdm  
import numpy as np  
MAX_AGE = 117  
logger = logging.getLogger()  
handler = logging.StreamHandler()  
formatter = logging.Formatter(  
        '%(asctime)s %(name)s %(levelname)s %(message)s')  
handler.setFormatter(formatter)  
logger.addHandler(handler)  
logger.setLevel(logging.DEBUG)  
  
  
def calc_age(taken, dob):  
    birth = datetime.fromordinal(max(int(dob) - 366, 1))  
    # assume the photo was taken in the middle of the year  
  if birth.month < 7:  
        return taken - birth.year  
    else:  
        return taken - birth.year - 1  
  
  
def get_meta(mat_path, db):  
    meta = loadmat(mat_path)  
    full_path = meta[db][0, 0]["full_path"][0]  
    dob = meta[db][0, 0]["dob"][0]  # Matlab serial date number  
  gender = meta[db][0, 0]["gender"][0]  
    photo_taken = meta[db][0, 0]["photo_taken"][0]  # year  
  face_score = meta[db][0, 0]["face_score"][0]  
    second_face_score = meta[db][0, 0]["second_face_score"][0]  
    age = [calc_age(photo_taken[i], dob[i]) for i in range(len(dob))]  
  
    return full_path, dob, gender, photo_taken, face_score, second_face_score, age  
  
  
def mk_dir(dir):  
    try:  
        os.mkdir( dir )  
    except OSError:  
        pass  
  
  
def filter_unusual(full_path, gender, face_score, second_face_score, age):  
    unusual_gender_idx = list()  
    unusual_face_score_idx = list()  
    unusual_second_face_score_idx = list()  
    unusual_age_idx = list()  
    length = len(full_path)  
    for i in tqdm(range(length)):  
        if np.isnan(gender[i]) or ~(0<=gender[i]<=1):  
            unusual_gender_idx.append(i)  
            logger.warn("unusual gender: %d, %s"%(i, str(gender[i])))  
  
        if face_score[i] < 0:  
            unusual_face_score_idx.append(i)  
            logger.warn("no face: %d, %.2f"%( i, face_score[i] ))  
  
  
        if second_face_score[i] > 0:  
            unusual_second_face_score_idx.append(i)  
            logger.warn("more than one face: %d, %.2f"%(i, second_face_score[i]))  
  
        if ~(0 <= age[i] <= MAX_AGE):  
            unusual_age_idx.append(i)  
            logger.warn("unusual age: %d, %d" % (i, age[i]))  
    print(1)  
  
  
  
if __name__ == '__main__':  
  
    mat_path = ur"D:\wiki_crop\wiki.mat"  
  db = "wiki"  
  full_path, dob, gender, photo_taken, face_score, second_face_score, age = get_meta(mat_path, db)  
  
    filter_unusual(full_path, gender, face_score, second_face_score, age)  
  
    age = [a for a in age if 0 < a < MAX_AGE]  
    print(len(age))  
    plot.histgram_demo(age)
```
```python
# -*- coding: utf-8 -*-  
# plot.py
import matplotlib.pyplot as plt  
import numpy as np  
  
  
def line_demo():  
    x = np.linspace(-1, 1, 50)  
    y = 2 * x + 1  
  # plt.figure()  
  plt.plot(x, y)  
    plt.show()  
  
  
def histgram_demo(tdata):  
    # plt.figure()  
  plt.hist(tdata, bins=50, color='steelblue')  
    plt.show()  
  
  
if __name__ == '__main__':  
    # histgram_demo()  
  line_demo()
```

# 论文笔记
## 人脸图像的年龄估计技术研究
王先梅，综述，主要讲述深度学习前的人脸年龄估计的技术。包括特征提取和估计算法等，很全面。

## 基于卷积神经网络的人脸年龄估计算法
周旺，南京大学。主要使用显著图方式增强数据，并对数据倾斜部分的进行迁移学习训练。能学会数据增加方式和迁移学习。提供了开源做法的指引

## 人脸检测及人脸年龄与性别识别方法
张军挺，中国科学技术大学，faster r-cnn用cnn提取特征；多尺度LBP+AdaBoost；深度和传统方式都做了，rcnn也用了迁移学习的方法。提取后使用随机森林做预测
## Deep expectation of real and apparent age from a single image without facial landmarks
LAP2015冠军，imdb-wiki数据提供者
旋转图片后，选择最高分的脸。
脸扩展40%的像素，以免脸的边缘到达图片边缘（padding时候有问题，也就是脸过大的问题），也使得所有图片保持一致。如果找不到脸，用整张图。
vgg16迁移
分类预测-->加权平均
## [Apparent Age Estimation from Face Images Combining General and Children-Specialized Deep Learning Models](https://cactus.orange-labs.fr/apparent-age-estimation/)
LAP2016，人脸年龄v2比赛冠军
年龄编码的方式
##Apparent Age Estimation Using Ensemble of Deep Learning Models
LAP2016， 人脸年龄v2第5名
