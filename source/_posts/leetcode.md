---
title: leetcode

---

无聊时候刷刷题
<!--more-->

# 基本算法
## 二分查找

## 2sum
不排序，暴力。注意边界
```java
public class Solution {
    public int[] twoSum(int[] nums, int target) {
        int len = nums.length;
        for(int i=0; i<len-1; i++){
            for(int j=i+1; j<len; j++){
                if(nums[i] + nums[j]==target){
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{0, 1};
    }
}
```
## 3sum
twosum的转化思路, 二分查找
```java
public List<List<Integer>> threeSum(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    Arrays.sort(nums);
    int len = nums.length;
    if (len < 3) return result;
    for (int i = 0; i < len - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        for (int j = i + 1; j < len - 1; j++) {
            if (j > i+1 && nums[j] == nums[j - 1]) continue;
            int k = Arrays.binarySearch(nums, j + 1, len, -nums[i] - nums[j]);
            if (k > 0 && nums[i] + nums[j] + nums[k] == 0) {
                ArrayList<Integer> tmp = new ArrayList<>(3);
                tmp.add(nums[i]);
                tmp.add(nums[j]);
                tmp.add(nums[k]);
                result.add(tmp);
            }
        }
    }
    return result;
}
```
# 数组
## Container With Most Water
最佳答案:
i++的表达式是计算当前ij组成的容器的容量, 然后双指针往中间靠.
证明: 
一开始ij在最左(h[0]]和最右(h[n-1]), 假设最左比最右短(h[i]<h[j]), 此时体积就是含有i的容器中最大的容积(max), 下一次肯定是i++而不是j--, 此时则考虑当前最大值max和h[i]和h[n-1]之前的情况即可.
```java
public int maxArea(int[] height) {  
    int max = 0;  
    for (int i = 0, j = height.length - 1; i < j; ) {  
	    int h = height[i] < height[j] ? height[i++] : height[j--];  
		int b = j - i + 1;  
		max = Math.max(h * b, max);  
    }  
    return max;  
}
```
我的答案.
我的想法是先算最宽的容器的s,  然后考虑子问题少掉左面一根或者少掉右面一根. 比较三者最大的. 两个子问题可以迅速判断大小, 去掉最左或最右, 中间都一样, 显然去掉短的能获得更大的s. 
```java
	public int maxArea(int[] height) {
        return s(height, 0, height.length - 1);
    }

    private int s(int[] height, int a, int b) {
        if (a==b) return 0;
        int max = (b-a) * Math.min(height[a], height[b]);
        int part_max = 0;
        if (height[a]<height[b]){
            part_max = s(height, a + 1, b);
        }else{
            part_max = s(height, a, b - 1);
        }
        return Math.max(max, part_max);
    }
```
