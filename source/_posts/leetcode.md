---
title: leetcode
tags:
- leetcode
categories:
- 算法
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
        int len = nums.length乱入的C++
```cpp
class ListNode
{
public:
    int val;
    ListNode *next;
        for(int i=0; i<len-1; i++){ListNode(int val)
    {
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
        }this->val = val;
        this->next=NULL;
    }
};

ListNode* findInsertionPos(ListNode* dummy, ListNode* candidate);
void insertNode(ListNode* pos, ListNode * node);
bool isNextValBiggerThanCandidate(ListNode * node, ListNode * candidate);
ListNode* insertionSortList(ListNode * head)
{
    ListNode* dummy = new ListNode(0);
    ListNode* unsortedPointer = head;
    ListNode* unsortedNextPointer = NULL;
    while(unsortedPointer)
    {
        unsortedNextPointer = unsortedPointer->next;
        ListNode* rightPos = findInsertionPos(dummy, unsortedPointer);
        insertNode(rightPos, unsortedPointer);
        unsortedPointer = unsortedNextPointer;
    }
    return resuldummy->next;

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
		max = Math.max(h * b, max);  ListNode* findInsertionPos(ListNode* dummy, ListNode* candidate)
{
    ListNode* rightPos = dummy;
    while(isNextValBiggerThanCandidate(rightPos, candidate))
    {
        rightPos = rightPos->next;
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
## 
傻叉版, 需要考虑边界条件太多, n*n*n*logn
```java
public int threeSumClosestrightPos;
}
bool isNextValBiggerThanCandidate(ListNode * node, ListNode * candidate)
{
    return node->next && node->next->val < candidate->val;
}
void insertNode(ListNode* pos, ListNode * node)
{
    node->next = pos->next;
    pos->next = node;
}
```
# 基本算法
## 二分查找

## 2sum
不排序，暴力。注意边界
```java
public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Arrays.sort(nums);
        int len = nums.length;
        int minDiff = Integer.MAX_VALUE;
        int nearestSum = nums[0] + nums[1] + nums[2];
        for (int i = =0; i < len - 2<len-1; i++) {
            for (int j = i + 1; j < len - 1=i+1; j<len; j++) {
                int sum = calculateCurClosestSum(target, nums, i, j);
                int diff = Math.abs(sum - target);
                if (diff < minDiff) {
                    minDiff = diff;
                    nearestSum = sum;
                }
            }
        }
        return nearestSum;
    }

    int calculateCurClosestSum(int target, int[] nums, int i, int j) {
        int k = Arrays.binarySearch(nums, j + 1, nums.length, target - nums[i] - nums[j]);
  f(nums[i] + nums[j]==target){
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
      if (k >= 0) {
           len < 3) return targeresult;
        }
        int sum = nums[i] + nums[j];
        k = -1 - k;
        if (k == nums.length) {
            sum += nums[k - 1];
        } else if (k == j+1) {
            sum += nums[k];
        } else {
            int sum1 = sum +for (int i = 0; i < len - 2; i++) {
        if (i > 0 && nums[i] == nums[ki - 1];
            int sum2 = sum + nums[k];
            int diff1 = Math.abs(target - sum1);
            int diff2 = Math.abs(target - sum2);
            if (diff1 < diff2) {
                sum = sum1;
            } else {
                sum = sum2;
            }
        }
        return sum;
    }
```
最佳答案, 先排序，然后左右夹逼，复杂度 O(n^2)O(n​2​​)。
```java
public int threeSumClosest(int[] nums, int target) {
        Arrays.sort(nums);
        final int len = nums.length;
        int minDiff = Integer.MAX_VALUE;
        int nearestSum =) continue;
        for (int j = i + 1; j < len - 1; j++) {
            if (j > i+1 && nums[j] == nums[j - 1]) continue;
            int k = Arrays.binarySearch(nums, j + 1, len, -nums[i] - nums[j]);
            if (k > 0 && nums[0i] + nums[1j] + nums[2];
        for (int i = 0; i < len - 1; i++) {
            int j = i+1;
            int k = len-1;
            while (j < k) {
                final int sum = nums[i] + nums[j] + nums[k];
                final int diff = Math.abs(sum - target);
                if (diff < minDiff) {
                    minDiff = diff;
                    nearestSum = sum;
                }
                if (sum > target) {
                    k--;
                }else{
                    j++;
                }
            }
    k] == 0) {
                ArrayList<Integer> tmp = new ArrayList<>(3);
                tmp.add(nums[i]);
                tmp.add(nums[j]);
                tmp.add(nums[k]);
                result.add(tmp);
            }
        }
    }
        return nearestSum;
    result;
}
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMzEyODM0MjEwXX0=
-->