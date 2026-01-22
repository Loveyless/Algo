// 快速排序（QuickSort）练习题
//
// 题目：实现一个纯函数 quickSort
//
// 要求：
// 1) 输入：number[]
// 2) 输出：一个新的 number[]（升序），不能修改原数组
// 3) 需要正确处理：空数组、单元素、重复值、负数
//
// 额外要求（可选加分）：
// - 提供 partition（分区）过程的解释（写在文件末尾“附加说明”里）
// - 说明平均/最坏复杂度
//
// 示例：
// quickSort([3, 1, 2]) -> [1, 2, 3]
// quickSort([5, 5, 1]) -> [1, 5, 5]
//
// 约束：
// - 不要调用 Array.prototype.sort
// - 先追求正确性与可读性

const { quickSort } = require('./QuickSort');
/* 测试代码：请勿修改 */
const testCases = [
  { input: [], expected: [] },
  { input: [1], expected: [1] },
  { input: [3, 1, 2], expected: [1, 2, 3] },
  { input: [5, 5, 1], expected: [1, 5, 5] },
  { input: [0, -1, 3, -1, 2], expected: [-1, -1, 0, 2, 3] },
  { input: [9, 8, 7, 6, 5, 4, 3], expected: [3, 4, 5, 6, 7, 8, 9] },
];

function isEqualArray(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

for (const { input, expected } of testCases) {
  const original = input.slice();
  const actual = quickSort(input);

  const ok = isEqualArray(actual, expected);
  const notMutated = isEqualArray(input, original);

  console.log(
    JSON.stringify({ input: original, actual, expected, ok, notMutated })
  );
}

/*
附加说明（你写完再补充）：

1) 你选择的 pivot（基准）策略是什么？为什么？
2) partition 之后满足的关键不变量是什么？
3) 递归的终止条件是什么？
*/

