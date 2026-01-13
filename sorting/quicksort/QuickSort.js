// 快速排序：参考骨架（你来填核心逻辑）
//
// 你当前卡住的点很常见：pivot 到底是“下标”还是“值”？
// - pivotIndex：基准的下标
// - pivotValue：基准的值（比较时用它）
//
// 目标：实现一个纯函数 quickSort(numbers)
// - 返回新数组（升序）
// - 不修改原数组

/**
 * 快速排序（纯函数版）
 * @param {number[]} numbers
 * @returns {number[]}
 */
function quickSort(numbers) {
  // 0) 纯函数要求：不要动入参
  const arr = numbers.slice();

  // 1) 递归终止条件：长度 0/1 直接返回
  if (arr.length <= 1) return arr;

  // 2) 选择 pivot（基准）
  // 提示：先拿到 pivotIndex，再拿到 pivotValue
  const pivotIndex = Math.floor(arr.length / 2); // 向下取整，选中间元素作为基准
  const pivotValue = arr[pivotIndex];

  // 3) 分区：把元素分到 left / middle / right
  // 不变量：
  // - left 里全部 < pivotValue
  // - middle 里全部 === pivotValue
  // - right 里全部 > pivotValue
  const left = [];
  const middle = [];
  const right = [];

  for (const value of arr) {
    // TODO：在这里写分区逻辑
    if (value < pivotValue) left.push(value);
    else if (value > pivotValue) right.push(value);
    else middle.push(value);
  }

  // 4) 递归排序 left/right，并拼接结果
  // TODO：这里把 left/right 递归后拼起来（注意 middle 直接夹在中间）
  return quickSort([...left, ...middle, ...right]);
}

/*
附加说明（建议你写完后自己补 3 句话，帮助一周后快速恢复记忆）：

1) 你 pivot 的选择策略是什么？（例如：中间元素）
2) 分区后不变量是什么？（left/middle/right 的含义）
3) 递归终止条件是什么？（arr.length <= 1）

自测建议：
- quickSort([5, 5, 1]) 这种重复值用例，能逼你写出 middle
- quickSort([9,8,7,6,5]) 这种逆序用例，能帮你检查递归是否拼接正确
*/

console.log(quickSort([5, 5, 1]));
console.log(quickSort([9, 8, 7, 6, 5]));
