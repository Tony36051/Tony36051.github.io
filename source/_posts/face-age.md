---
title: 人脸年龄
date: 2018-04-10 00:09
tag:
- AI

___
# 试验数据
## 各类特征pca512后，直接串连

### LogisticRegression 
LogisticRegression on hog(512) resulting mae: 12.534653
LogisticRegression on lbp(512) resulting mae: 12.316832
LogisticRegression on vgg(512) resulting mae: 5.792079
LogisticRegression on hog_lbp(1024) resulting mae: 12.564356
LogisticRegression on hog_vgg(1024) resulting mae: 4.762376
LogisticRegression on lbp_vgg(1024) resulting mae: 5.118812
LogisticRegression on hog_lbp_vgg(1536) resulting mae: 4.841584
### LinearSVR
LinearSVR on hog(512) resulting mae: 13.975740
LinearSVR on lbp(512) resulting mae: 14.171815
LinearSVR on vgg(512) resulting mae: 6.477576
LinearSVR on hog_lbp(1024) resulting mae: 22.368721
LinearSVR on hog_vgg(1024) resulting mae: 9.580384
LinearSVR on lbp_vgg(1024) resulting mae: 11.537682
LinearSVR on hog_lbp_vgg(1536) resulting mae: 6.361257

### SVR(rbf)
SVR on hog(512) resulting mae: 11.496392
SVR on lbp(512) resulting mae: 11.600109
SVR on vgg(512) resulting mae: 11.721817
SVR on hog_lbp(1024) resulting mae: 11.682743
SVR on hog_vgg(1024) resulting mae: 11.624635
SVR on lbp_vgg(1024) resulting mae: 11.608328
SVR on hog_lbp_vgg(1536) resulting mae: 11.349862

### rf
RandomForestRegressor on hog(512) resulting mae: 11.234653
RandomForestRegressor on lbp(512) resulting mae: 12.245545
RandomForestRegressor on vgg(512) resulting mae: 5.855446
RandomForestRegressor on hog_lbp(1024) resulting mae: 10.981188
RandomForestRegressor on hog_vgg(1024) resulting mae: 5.754455
RandomForestRegressor on lbp_vgg(1024) resulting mae: 5.740594
RandomForestRegressor on hog_lbp_vgg(1536) resulting mae: 6.240594
### ada
AdaBoostRegressor on hog(512) resulting mae: 11.469027
AdaBoostRegressor on lbp(512) resulting mae: 11.945927
AdaBoostRegressor on vgg(512) resulting mae: 6.560440
AdaBoostRegressor on hog_lbp(1024) resulting mae: 10.853807
AdaBoostRegressor on hog_vgg(1024) resulting mae: 6.464129
AdaBoostRegressor on lbp_vgg(1024) resulting mae: 6.640677
AdaBoostRegressor on hog_lbp_vgg(1536) resulting mae: 6.807597

## 直接串联融合
先全部pca skb-f_regression skb-mutual_info_regression
### LinearSVR 
LinearSVR on hog_lbp(300) resulting mae: 6.277855
LinearSVR on hog_vgg(300) resulting mae: 5.596323
LinearSVR on lbp_vgg(300) resulting mae: 6.167967
LinearSVR on hog_lbp_vgg(300) resulting mae: 5.759966

LinearSVR on hog_lbp(150) resulting mae: 5.891156
LinearSVR on hog_vgg(150) resulting mae: 5.809739
LinearSVR on lbp_vgg(150) resulting mae: 5.940609
LinearSVR on hog_lbp_vgg(150) resulting mae: 5.626772

LinearSVR on hog_lbp(60) resulting mae: 5.666367
LinearSVR on hog_vgg(60) resulting mae: 5.797798
LinearSVR on lbp_vgg(60) resulting mae: 6.250504
LinearSVR on hog_lbp_vgg(60) resulting mae: 5.709871

## 融合
PCA30+LDA30+f_regression30+mutual_info_regression30
LinearSVR on hog_lbp(120) resulting mae: 2.708872
LinearSVR on hog_vgg(120) resulting mae: 2.525526
LinearSVR on lbp_vgg(120) resulting mae: 2.654724
LinearSVR on hog_lbp_vgg(120) resulting mae: 4.254801

## new code



## hog-rf
| 年龄段 | 图片数 | mae |
|--|--|--|
|0-10 | 2| 24.40078125|
|10-20| 211| 16.738136495639804|
|20-30| 1308| 10.227156122590213|
|30-40| 771| 5.2893352691984505|
|40-50| 496| 6.629532440080646|
|50-60| 357| 11.72321864157143|
|60-70| 232| 18.554289498620683|
|70-80| 124| 25.399641057096773|
|80-90| 59| 32.9512570622034|
|90-100| 11| 40.17959280272728|

# 实战操刀
## 下载数据集
https://data.vision.ee.ethz.ch/cvl/rrothe/imdb-wiki/static/imdb_crop.tar
https://data.vision.ee.ethz.ch/cvl/rrothe/imdb-wiki/static/wiki_crop.tar
数据说明：https://data.vision.ee.ethz.ch/cvl/rrothe/imdb-wiki/
## 解析元数据
元数据wiki.mat、imdab.mat是已matlab形式的mat文件存的，可以用scipy.io.loadmat读取。
|属性| 值 | 含义|
|--|--|--|
|gender | nan/0/1 | 0 for female and 1 for male, _NaN_ if unknown
|face_score|nan/float| _NaN_ 没有人脸，得分越高越确定人脸
|second_face_score|nan/float|第二张人脸的的人，越高越确定，_NaN_表示没有第二张脸
|dob|不知道|date of birth (Matlab serial date number)用来算age，有些age算出来超出常理。要丢弃

## 人脸对齐


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

## code
`hog.py`
```python
from skimage import feature as ft
from skimage import io
import argparse
import utils
import math
import multiprocessing
import os
import tqdm


def extract_hog(img_full_path):
    ori = 8
    ppc = (16, 16)
    cpb = (1, 1)
    image = io.imread(img_full_path)
    features = ft.hog(image,  # input image
                      orientations=ori,  # number of bins
                      pixels_per_cell=ppc,  # pixel per cell
                      cells_per_block=cpb,  # cells per blcok
                      block_norm='L2-Hys',  # block norm : str {‘L1’, ‘L1-sqrt’, ‘L2’, ‘L2-Hys’}, optional
                      transform_sqrt=True,  # power law compression (also known as gamma correction)
                      feature_vector=True,  # flatten the final vectors
                      visualise=False)  # return HOG map
    return features


def task(data_dir, stage, paths, ages, position):
    file_name = os.path.join(data_dir, "%s_%d.txt" % (stage, position))
    with open(file_name, 'w') as f:
        for i, img_path in enumerate(paths):
            img_path = img_path[1:] if img_path[0] == "/" else img_path
            features = extract_hog(os.path.join(data_dir, img_path))
            line = ",".join([str(a) for a in features]) + "," + str(ages[i]) + "\n"
            f.write(line)
    return file_name


def merge_pool_results(data_dir, results):
    merged_file = os.path.join(data_dir, "hog.txt")
    with open(merged_file, 'w') as wf:
        for file in results:
            with open(file, 'r') as rf:
                wf.writelines(rf.readlines())
        # os.remove(file)


def simple_process(data_dir, meta_file):
    """not fast enough"""
    paths = list()
    ages = list()
    with open(os.path.join(data_dir, meta_file), 'r') as f:
        for line in f.readlines():
            ss = line.split(" ")
            paths.append(ss[0])
            ages.append(ss[1])
    with open(os.path.join(data_dir, "hog_all.txt"), 'w') as f:
        for i in tqdm.trange(len(paths)):
            feature = extract_hog(os.path.join(data_dir, paths[i]))
            line = ",".join([str(a) for a in feature]) + "," + str(ages[i]) + "\n"
            f.write(line)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--data_dir', required=False, help='data dir')
    parser.add_argument('--process', required=False, help='how many process')

    args = parser.parse_args()
    process = int(args.process) if args.process else 32
    data_dir = args.data_dir if args.data_dir else "/home/tony/data"

    stage = "hog"
    meta_file = "aligned_meta.txt"

    results = list()

    train_path, train_age = utils.read_meta_data(data_dir, meta_file)
    # train_path = train_path[0:100]
    # train_age = train_age[0:100]
    n = int(math.ceil(len(train_path) / float(process)))
    print(len(train_path))

    pool = multiprocessing.Pool(processes=process)
    for i in range(0, len(train_path), n):
        t = pool.apply_async(task, args=(data_dir, stage, train_path[i: i + n], train_age[i:i + n], i,))
        results.append(t)
    pool.close()
    pool.join()

    merge_pool_results(data_dir, [t.get() for t in results])
    [os.remove(os.path.join(data_dir, t.get())) for t in results]



```

`align.py`
```python
# -*- coding: utf-8 -*-
import cv2
import dlib
import os
import sys
from imutils.face_utils import FaceAligner
from tqdm import tqdm
import math
from multiprocessing import Process as pro, Pool
import argparse
import utils

cur_dir = os.path.dirname(__file__)
# cur_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(cur_dir, "data")
# data_dir = r"d:/data"  # special for windows
classifier_xml = os.path.join(data_dir, "haarcascade_frontalface_alt2.xml")
predictor_path = os.path.join(data_dir, "shape_predictor_68_face_landmarks.dat")

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_path)
fa = FaceAligner(predictor, desiredFaceWidth=160)


def opencv_recognize(img_path):
    face_patterns = cv2.CascadeClassifier(classifier_xml)
    sample_image = cv2.imread(img_path)
    # cv2.imshow("image", sample_image)
    faces = face_patterns.detectMultiScale(sample_image, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))

    for (x, y, w, h) in faces:
        cv2.rectangle(sample_image, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # cv2.imwrite('/Users/abel/201612_detected.png', sample_image)
    cv2.imshow("image", sample_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


def dlib_recognize_and_align(img_path):
    '''加载人脸检测器、加载官方提供的模型构建特征提取器'''
    win = dlib.image_window()
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor(predictor_path)
    brg_img = cv2.imread(img_path)
    rgb_img = cv2.cvtColor(brg_img, cv2.COLOR_BGRA2RGB)
    dets = detector(rgb_img, 1)
    print("Number of faces detected: {}".format(len(dets)))
    for i, d in enumerate(dets):
        print("Detection {}: Left: {} Top: {} Right: {} Bottom: {}".format(
            i, d.left(), d.top(), d.right(), d.bottom()))

    win.clear_overlay()
    win.set_image(rgb_img)
    win.add_overlay(dets)
    dlib.hit_enter_to_continue()
    pass


def align_and_save(data_dir, img_path):
    full_path = os.path.join(data_dir, img_path)
    bgr_img = cv2.imread(full_path, 0)
    gray = bgr_img
    # gray = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2GRAY)
    rects = detector(gray, 1)
    if len(rects) != 1:
        return False
    img = fa.align(gray, gray, rects[0])
    new_file_path = os.path.join(data_dir, "aligned", img_path)
    aligned_dir = os.path.dirname(new_file_path)
    if not os.path.exists(aligned_dir):
        os.makedirs(aligned_dir)
    cv2.imwrite(new_file_path, img)
    return True





def crop_train_face(train_path, train_age):
    """single process"""
    pre_len = len(train_path)
    new_path = list()
    new_age = list()
    for i in tqdm(range(pre_len)):
        img_path = data_dir + train_path[i]
        new_file_path = align_and_save(img_path)
        new_path.append(new_file_path)
        new_age.append(train_age[i])
    return new_path, new_age


def task(data_dir, stage, img_paths, ages, position):
    file_name = os.path.join(data_dir, "%s_%d.txt" % (stage, position))
    with open(file_name, 'w') as f:
        for i, img_path in enumerate(img_paths):
            img_path = img_path[1:] if img_path[0] == "/" else img_path
            if align_and_save(data_dir, img_path):
                f.write("aligned/%s %d\n" % (img_path, ages[i]))
    return file_name


def merge_pool_results(data_dir, results):
    merged_file = os.path.join(data_dir, "aligned_meta.txt")
    with open(merged_file, 'w') as wf:
        for file in results:
            with open(file, 'r') as rf:
                wf.writelines(rf.readlines())
        os.remove(file)

def chunks(arr, m):
    n = int(math.ceil(len(arr) / float(m)))
    return [arr[i:i + n] for i in range(0, len(arr), n)]


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--data_dir', required=False, help='data dir')
    parser.add_argument('--process', required=False, help='how many process')

    args = parser.parse_args()
    process = int(args.process) if args.process else 32
    data_dir = args.data_dir if args.data_dir else "/home/tony/data"

    stage = "train"
    meta_file = "wiki.txt"
    results = list()
    train_path, train_age = utils.read_meta_data(data_dir, meta_file)
    n = int(math.ceil(len(train_path) / float(process)))
    print(len(train_path))

    pool = Pool(processes=process)
    for i in range(0, len(train_path), n):
        t = pool.apply_async(task, args=(data_dir, stage, train_path[i: i + n], train_age[i:i + n], i,))
        results.append(t)
    pool.close()
    pool.join()

    merge_pool_results(data_dir, [t.get() for t in results])



```

`unify_meta_data.py`
```python
# -*- coding: utf-8 -*-
import logging
from utils import get_meta
from tqdm import trange
import numpy as np
import os
import sys

MAX_AGE = 117
logger = logging.getLogger()
handler = logging.StreamHandler()
formatter = logging.Formatter(
    '%(asctime)s %(name)s %(levelname)s %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)


def filter_unusual(full_path, gender, face_score, second_face_score, age):
    # label filter
    gender_idx = np.where(~np.isnan(gender))[0]
    age_idx = [i for i in range(len(age)) if 0 <= age[i] <= MAX_AGE]
    # face filter
    # face_score_idx = np.where(face_score <= 0)[0]
    # second_face_score_idx = np.where(second_face_score>0)[0]

    return np.intersect1d(gender_idx, age_idx)


def main_process(data_path, db, limit=None):
    mat_path = os.path.join(data_path, db + "_crop", db + ".mat")
    full_path, dob, gender, photo_taken, face_score, second_face_score, age = get_meta(mat_path, db)
    ok_idx = filter_unusual(full_path, gender, face_score, second_face_score, age)
    meta_file = os.path.join(data_path, db + ".txt")
    with open(meta_file, 'w') as f:
        for i in trange(len(ok_idx)):
            if limit and i >= int(limit):
                break
            f.write("%s_crop/%s %d\n" % (db, full_path[i][0], age[i]))
    return meta_file

if __name__ == '__main__':
    data_path = str(sys.argv[1]) if len(sys.argv) > 1 else r"d:/data"
    data_path = "/home/tony/data"
    db = "wiki"
    meta_file = main_process(data_path, db)
    print("meta_file: " + meta_file)

```

`utils.py`
```python
# utils.py
# -*- coding: utf-8 -*-
from scipy.io import loadmat
from datetime import datetime
import os
import numpy as np


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
    # age = np.array(map(calc_age, photo_taken, dob))  # python 2/3 staff
    age = [calc_age(photo_taken[i], dob[i]) for i in range(len(dob))]
    return full_path, dob, gender, photo_taken, face_score, second_face_score, age


def mk_dir(dir):
    try:
        os.mkdir(dir)
    except OSError:
        pass


def read_meta_data(data_dir, file_name):
    path = list()
    age = list()
    with open(os.path.join(data_dir, file_name)) as f:
        for line in f.readlines():
            ss = line.split(" ")
            path.append(ss[0])
            age.append(int(ss[1]))
    return path, age


if __name__ == '__main__':
    mat_path = r"D:\wiki_crop\wiki.mat"
    db = "wiki"
    full_path, dob, gender, photo_taken, face_score, second_face_score, age = get_meta(mat_path, db)

```

`svm.py`
```python
import pandas as pd
import os
import numpy as np
import argparse
from sklearn import svm
from sklearn.model_selection import train_test_split
from sklearn.decomposition import PCA
import sklearn


data_dir = "/home/tony/data"
hog_file = "hog.txt"

train_data = pd.read_csv(os.path.join(data_dir, hog_file), header=None)
X_train, X_test, y_train, y_test = train_test_split(train_data.values[:, 0:-1], train_data.values[:, -1],
                                                    test_size=0.1, random_state=2018, shuffle=True)

# PCA
# pca = PCA(n_components=100, whiten=True)
# X_train = pca.fit_transform(X_train)
# X_test = pca.fit_transform(X_test)
# print(X_train.shape)
# print(X_test.shape)


# svc
svr = svm.LinearSVR()
svr.fit(X_train, y_train)
pre = svr.predict(X_test)

# metrics
mae = sklearn.metrics.mean_absolute_error(y_test, pre)
print("mae: %f" % mae)

```

`rfr.py`
```python
import pandas as pd
import os
import numpy as np
import argparse
from sklearn import svm
from sklearn.model_selection import train_test_split
from sklearn.decomposition import PCA
import sklearn
from sklearn.ensemble import RandomForestRegressor


data_dir = "/home/tony/data"
hog_file = "hog.txt"

train_data = pd.read_csv(os.path.join(data_dir, hog_file), header=None)
X_train, X_test, y_train, y_test = train_test_split(train_data.values[:, 0:-1], train_data.values[:, -1],
                                                    test_size=0.1, random_state=2018, shuffle=True)

# PCA
# pca = PCA(n_components=100, whiten=True)
# X_train = pca.fit_transform(X_train)
# X_test = pca.fit_transform(X_test)
# print(X_train.shape)
# print(X_test.shape)


# svc
regr = RandomForestRegressor(n_estimators=320, n_jobs=32, random_state=2018, verbose=1)
regr.fit(X_train, y_train)
pre = regr.predict(X_test)

# metrics
mae = sklearn.metrics.mean_absolute_error(y_test, pre)
print("mae: %f" % mae)

```
