---
title: Java和Python语法
date: 2025-10-16
---
做算法题，经常用到的语法
<!--more-->

# 常用语法
## 字符串排序
```java
char[] charArray = str.toCharArray();
Arrays.sort(charArray);
String key = new String(charArray);
```
```python
''.join(sorted(element))  # 字符串sorted后 ['a', 'd', 'f', 's']
```

## 字典操作
```java
if (hashMap.containsKey(str_s)){
    hashMap.get(str_s).add(str);
} else {
    ArrayList<String> strings = new ArrayList<>();
    strings.add(str);
    hashMap.put(str_s, strings);
}
```


```python
if t in dic:
    dic[t].append(element)
else:
    dic[t] = [element]
```

