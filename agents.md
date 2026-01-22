# 目前练习PLAN

./PLAN-GPT-PRO.md

# 文件组织规则

## 目录结构（3层）

### 第1层：题型分类（按难度排序）

- 格式：`序号中文英文`，如 `1排序sort`、`2双指针two-pointers`
- 排序：简单→复杂（排序 < 双指针 < 动态规划 < 红黑树）
- 多概念题目：单独建文件夹，如 `5排序贪心sort-greedy`
- 无明确类型：放入 `99其他others`（排最后）

### 第2层：具体题目（按难度排序）

- 格式：`序号题目名英文`，如 `1快排quicksort`、`2归并mergesort`
- 排序：同类型内按难度 Easy → Medium → Hard

### 第3层：文件

- 题目文件：`QuickSort question.js`（含测试用例）
- 题解文件：`QuickSort.js`（导出实现）
- 练习文件：`QuickSort-practice.js`（可选）
- 其他任意文件

## 示例结构

```
1排序sort/
  1快排quicksort/
    QuickSort.js
    QuickSort question.js
  2归并mergesort/
    MergeSort.js
    MergeSort question.js
2双指针two-pointers/
  1两数之和two-sum/
    TwoSum.js
    TwoSum question.js
99其他others/
  1特殊题special/
    Special.js
    Special question.js
```
