---
title: leetcode
date: 2018-09-18
tags:
- leetcode
categories:
- 算法
---

无聊时候刷刷题
<!--more-->
# 乱入的C++
```cpp
class ListNode
{
public:
    int val;
    ListNode *next;
    ListNode(int val)
    {
        this->val = val;
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
    return dummy->next;

}
ListNode* findInsertionPos(ListNode* dummy, ListNode* candidate)
{
    ListNode* rightPos = dummy;
    while(isNextValBiggerThanCandidate(rightPos, candidate))
    {
        rightPos = rightPos->next;
    }
    return rightPos;
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
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE0MTAyNzczMDZdfQ==
-->