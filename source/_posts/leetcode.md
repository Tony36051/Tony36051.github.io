---
title: leetcode

---
无聊时候刷刷题
<!--more-->
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
暴力算法会超时
```java
public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> results = new ArrayList<List<Integer>>();
    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i - 1] == nums[i]) continue;
        for (int j = i + 1; j < nums.length - 1; j++) {
            if(j>i+1 && nums[j-1]==nums[j]) continue;
            for (int k = j + 1; k < nums.length; k++) {
                if(k>j+1 && nums[k-1]==nums[k]) continue;
                if (nums[i] + nums[j] + nums[k] == 0) {
                    List<Integer> tmp = new ArrayList<Integer>(3);
                    tmp.add(nums[i]);
                    tmp.add(nums[j]);
                    tmp.add(nums[k]);
                    results.add(tmp);
                }
            }
        }
    }
    return results;
}
```
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
