/**
 * 快速排序（三路分区，纯函数）
 * @param {number[]} numbers
 * @returns {number[]} 升序新数组
 */
function quickSort(numbers) {
  const arr = numbers.slice();
  if (arr.length <= 1) return arr;

  // 选中间元素为基准
  const pivotValue = arr[Math.floor(arr.length / 2)];

  // 三路分区：left < pivot, middle === pivot, right > pivot
  const left = [];
  const middle = [];
  const right = [];

  for (const value of arr) {
    if (value < pivotValue) left.push(value);
    else if (value > pivotValue) right.push(value);
    else middle.push(value);
  }

  return [...quickSort(left), ...middle, ...quickSort(right)];
}

module.exports = { quickSort };

if (require.main === module) {
  console.log(quickSort([5, 5, 1]));
  console.log(quickSort([9, 8, 7, 6, 5]));
}

/*
================================================================================
                            快速排序 核心要点
================================================================================

【核心思想】分治法
  1. 选一个基准值 (pivot)
  2. 把数组分成三部分：小于 pivot / 等于 pivot / 大于 pivot
  3. 递归处理左右两部分，中间部分已经就位
  4. 拼接结果

【为什么用三路分区？】
  两路分区（只分 left/right）在遇到大量重复元素时会退化成 O(n²)
  三路分区把等于 pivot 的元素单独拎出来，避免重复元素被反复处理

【pivot 选择策略】
  - 取第一个/最后一个：简单，但对有序数组会退化成 O(n²)
  - 取中间元素：本实现采用，对大多数场景表现稳定
  - 随机选取：最稳健，能有效避免最坏情况
  - 三数取中：取首/中/尾的中位数，工程实践常用

【时间复杂度】
  - 平均：O(n log n)
  - 最坏：O(n²)，当每次 pivot 都选到最大/最小值时发生
  - 最好：O(n log n)，每次都能均匀分割

【空间复杂度】
  - 本实现（纯函数版）：O(n)，每层递归都创建新数组
  - 原地分区版：O(log n)，只有递归栈开销

【常见坑点】
  1. 递归时忘记分别处理 left 和 right
     错误：return quickSort([...left, ...middle, ...right])  // 无限递归
     正确：return [...quickSort(left), ...middle, ...quickSort(right)]

  2. 混淆 pivotIndex 和 pivotValue
     - pivotIndex 是下标，用于从数组中取值
     - pivotValue 是值，用于比较大小

  3. 边界条件遗漏
     - 空数组和单元素数组必须直接返回

【与归并排序对比】
  快排：先分区后递归，不稳定，原地版空间 O(log n)
  归并：先递归后合并，稳定，空间 O(n)
  实践中快排常数因子更小，通常更快

================================================================================
*/
