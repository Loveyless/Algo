# patterns.md — 14天 LeetCode（前端/零基础）套路笔记模板（TS版）

> 用法：每天做完题，把对应那一节复制到你的笔记里**填空**；看完题解后必须“合上重建”把代码从零写一遍。  
> 目标：把「识别套路 → 写出可跑代码 → 总结成模板」做成闭环。

---

## 0. 每题固定流程（30–60分钟通用）

### 30分钟（保命但有效）
1) **5分钟**：判断套路桶 + 写一句话不变量/状态定义  
2) **15分钟**：看题解（先看思路/不变量/复杂度，再看代码）  
3) **10分钟**：合上重建（从零写）+ 跑 1 个小样例

### 60分钟（进步更快）
1) **10分钟**：先自己想（限时），把卡点写下来：卡在状态定义/边界/数据结构？  
2) **20分钟**：看核心思路 + 易错点  
3) **25分钟**：从零实现 + 跑 2–3 个测试  
4) **5分钟**：写“5行总结”（见每节模板）

---

## 1) 你必须统一的「5行总结模板」（每题都填）

- 1）套路名：`（滑窗/前缀和+哈希/单调栈/...）`
- 2）不变量/状态定义：`（一句话说清窗口/栈/指针/DP状态代表什么）`
- 3）步骤（1-2-3）：
  - ① `...`
  - ② `...`
  - ③ `...`
- 4）复杂度：时间 `O(?)`，空间 `O(?)`
- 5）易错点/边界：`（left移动条件、计数为0是否删key、二分边界、visited标记时机...）`

> 小技巧：写总结时**必须包含“触发收缩/出栈/更新答案的条件”**，否则复盘时会卡。

---

## 2) TypeScript 常用小工具（建议直接复制到本地模板）

### 2.1 Map 计数（避免写一堆 if）
```ts
function inc<K>(m: Map<K, number>, key: K, delta: number = 1): void {
  m.set(key, (m.get(key) ?? 0) + delta);
}
function decAndMaybeDelete<K>(m: Map<K, number>, key: K, delta: number = 1): void {
  const next = (m.get(key) ?? 0) - delta;
  if (next <= 0) m.delete(key);
  else m.set(key, next);
}
```

### 2.2 队列（避免 shift() 退化）
```ts
class Queue<T> {
  private arr: T[] = [];
  private head = 0;
  push(x: T) { this.arr.push(x); }
  pop(): T | undefined { 
    if (this.head >= this.arr.length) return undefined;
    const v = this.arr[this.head++];
    // 可选：偶尔清理一下，避免数组无限增长
    if (this.head > 1024 && this.head * 2 > this.arr.length) {
      this.arr = this.arr.slice(this.head);
      this.head = 0;
    }
    return v;
  }
  size(): number { return this.arr.length - this.head; }
  isEmpty(): boolean { return this.size() === 0; }
}
```

### 2.3 网格四方向
```ts
const DIRS = [[1,0],[-1,0],[0,1],[0,-1]] as const;
function inBound(r: number, c: number, R: number, C: number): boolean {
  return r >= 0 && r < R && c >= 0 && c < C;
}
```

### 2.4 LeetCode 常见结构（按需）
```ts
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}
```

---

# 第1周：先看题解→合上重写（快速见套路）

## Day 1 — 哈希计数 / 哈希查找
题目：`1. 两数之和`，`242. 有效的字母异位词`（时间不够默认只做 1 题做透）

### A) 哈希查找（数组一遍扫）— 适用：Two Sum 类
**一句话不变量（填空）**：
- `Map 里始终保存 _________，让我们能在处理当前元素时 O(1) 查询 _________。`

**5行总结（填）**
1）套路名：哈希查找（一次遍历）  
2）不变量：`map` 维护 _________  
3）步骤：①遍历 → ②查询 _________ → ③更新 `map`  
4）复杂度：时间 `O(n)` 空间 `O(n)`  
5）易错点：重复元素/返回顺序/先查后放/无解返回值  

**TS骨架（不含具体解法，留 TODO）**
```ts
function twoSum(nums: number[], target: number): number[] {
  const pos = new Map<number, number>(); // value -> index(或其它)
  for (let i = 0; i < nums.length; i++) {
    const x = nums[i];
    // TODO 1: 计算你要找的“互补量/目标条件”
    // TODO 2: 如果 pos 里已存在满足条件的元素，返回答案
    // TODO 3: 更新 pos
  }
  return [];
}
```

### B) 哈希计数（频次）— 适用：异位词/频率匹配
**一句话不变量（填空）**：
- `计数表记录 _________ 的出现次数，最终所有计数应满足 _________。`

**TS骨架**
```ts
function isAnagram(s: string, t: string): boolean {
  // TODO: 边界：长度不同直接 false
  const cnt = new Map<string, number>();
  // TODO: 对 s 做 +1 计数
  // TODO: 对 t 做 -1 计数
  // TODO: 检查 cnt 是否“全为 0”（或 map 为空）
  return false;
}
```

---

## Day 2 — 前缀和 + 哈希计数
题目：`560. 和为 K 的子数组`

**一句话不变量（填空）**：
- `cnt[p] 表示前缀和为 p 的前缀出现过 _________ 次；当当前前缀和为 pre 时，需要统计 _________。`

**5行总结（填）**
1）套路名：前缀和 + 哈希计数  
2）状态定义：`pre[i]` 表示 _________；`cnt` 表示 _________  
3）步骤：①更新 pre → ②累加答案：查 `pre - k` → ③把当前 pre 计数 +1  
4）复杂度：时间 `O(n)` 空间 `O(n)`  
5）易错点：`cnt.set(0,1)` 的意义；先查再加；负数也能用；Map 默认值  

**TS骨架**
```ts
function subarraySum(nums: number[], k: number): number {
  let pre = 0;
  let ans = 0;
  const cnt = new Map<number, number>();
  cnt.set(0, 1); // TODO: 解释这行在处理“从开头开始的子数组”时的作用

  for (const x of nums) {
    pre += x;
    // TODO 1: 如果 cnt 中存在 (pre - k)，把它的次数加到 ans
    // TODO 2: cnt[pre]++
  }
  return ans;
}
```

---

## Day 3 — 双指针
题目：`125. 验证回文串` + `167. 两数之和 II（有序数组）`（默认只做 1 题做透）

### A) 左右指针收敛（回文）
**一句话不变量（填空）**：
- `在任意时刻，[left, right] 区间之外的字符都已经 _________；每一步都让区间 _________。`

**TS骨架**
```ts
function isPalindrome(s: string): boolean {
  let l = 0, r = s.length - 1;

  while (l < r) {
    // TODO 1: 跳过非字母数字（或按题意过滤）
    // TODO 2: 比较 s[l] 与 s[r]（注意大小写）
    // TODO 3: 匹配则 l++, r--；否则 return false
  }
  return true;
}
```

### B) 有序数组双指针（两数之和 II）
**一句话不变量（填空）**：
- `因为数组有序，若 nums[l] + nums[r] 太小/太大，就移动 _________ 指针一定不会错过解。`

**TS骨架**
```ts
function twoSumSorted(numbers: number[], target: number): number[] {
  let l = 0, r = numbers.length - 1;
  while (l < r) {
    const sum = numbers[l] + numbers[r];
    // TODO: 比较 sum 与 target，决定移动 l 还是 r
  }
  return [];
}
```

---

## Day 4 — 滑动窗口（Set/Map）
题目：`3. 无重复字符的最长子串`

**一句话不变量（填空）**：
- `窗口 [l..r] 内始终满足 _________；当加入 s[r] 破坏不变量时，需要移动 l 直到 _________。`

**5行总结（填）**
1）套路名：滑动窗口（可变窗口）  
2）不变量：窗口内 _________（例如：无重复）  
3）步骤：①右扩加入 r → ②while 不合法就左缩 → ③更新答案  
4）复杂度：时间 `O(n)` 空间 `O(字符集)`  
5）易错点：更新答案时机；while 条件；Set 删除元素顺序  

**TS骨架**
```ts
function lengthOfLongestSubstring(s: string): number {
  let l = 0;
  let ans = 0;
  const set = new Set<string>();

  for (let r = 0; r < s.length; r++) {
    const ch = s[r];
    // TODO 1: 当 set 已有 ch 时，循环移动 l：set.delete(s[l]); l++
    // TODO 2: set.add(ch)
    // TODO 3: 更新 ans = max(ans, r - l + 1)
  }
  return ans;
}
```

---

## Day 5 — 滑动窗口（固定/可变）
题目（二选一）：`567. 字符串的排列` 或 `209. 长度最小的子数组`

### A) 固定长度窗口（排列/异位词匹配类）
**一句话不变量（填空）**：
- `窗口长度固定为 len；窗口计数与目标计数的差异用 _________ 表示；当差异为 0 说明 _________。`

**TS骨架（思路骨架）**
```ts
function checkInclusion(s1: string, s2: string): boolean {
  const m = s1.length, n = s2.length;
  if (m > n) return false;

  // TODO: 建立目标计数 need；建立窗口计数 window
  // TODO: 初始化窗口 [0..m-1]
  // TODO: 维护一个“差异指标”（例如 missing / matchCount / diffCount）

  for (let r = 0; r < n; r++) {
    // TODO: 右边加入 s2[r]
    // TODO: 若窗口超过 m，左边移出 s2[l]
    // TODO: 判断是否满足目标
  }
  return false;
}
```

### B) 可变窗口最短（满足条件就收缩）
**一句话不变量（填空）**：
- `当窗口满足 sum >= target 时，继续收缩 l 仍可能保持满足，从而找到更短答案；当 sum < target 时必须 _________。`

**TS骨架**
```ts
function minSubArrayLen(target: number, nums: number[]): number {
  let l = 0;
  let sum = 0;
  let ans = Infinity;

  for (let r = 0; r < nums.length; r++) {
    sum += nums[r];
    // TODO: while (sum >= target) { ans = min(ans, r-l+1); sum -= nums[l]; l++; }
  }
  return ans === Infinity ? 0 : ans;
}
```

---

## Day 6 — 栈 / 单调栈
题目：`20. 有效的括号`（基础） + `739. 每日温度`（单调栈）

### A) 栈匹配（括号）
**一句话不变量（填空）**：
- `栈里始终保存尚未匹配的 _________；遇到右括号时必须匹配栈顶的 _________。`

**TS骨架**
```ts
function isValid(s: string): boolean {
  const st: string[] = [];
  const pair: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    // TODO: 如果是左括号，push
    // TODO: 如果是右括号，检查 st 顶是否等于 pair[ch]，不等则 false；等则 pop
  }
  return st.length === 0;
}
```

### B) 单调栈（下一个更大/更暖/右侧第一个更…）
**一句话不变量（填空）**：
- `栈里存的是 _________（值/下标）；从栈底到栈顶保持 _________ 单调；当新元素更大时不断出栈并结算答案。`

**TS骨架**
```ts
function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const ans = new Array<number>(n).fill(0);
  const st: number[] = []; // TODO: 存下标

  for (let i = 0; i < n; i++) {
    // TODO: while 栈非空且 temperatures[i] > temperatures[stTop]：弹出并计算距离
    // TODO: push i
  }
  return ans;
}
```

---

## Day 7 — 复盘日（非常关键）
**规则**：从 Day1–6 任意选 2 题，不看笔记从零重写。  
每题写一句：`我卡住的点是 _________；下一次我用 _________ 规则避免。`

**复盘表（复制填空）**
- 题目：
- 第一次卡点：
- 现在能否 15 分钟内写出：是/否
- 仍会错的边界：
- 下一次复盘日期（+3天）：

---

# 第2周：先自己做→卡住再看→合上重写（训练独立识别）

## Day 8 — 二分基础
题目：`704. 二分查找` + `35. 搜索插入位置`（默认只做 1 题做透）

**一句话不变量（填空）**：
- `我选择的区间定义是 _________（闭区间/半开区间）；循环中始终保证答案在 _________ 范围内。`

**二分模板（推荐：闭区间 [l, r]）**
```ts
function binarySearch(nums: number[], target: number): number {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = l + ((r - l) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      // TODO: l = mid + 1
    } else {
      // TODO: r = mid - 1
    }
  }
  return -1;
}
```

**插入位置骨架**
```ts
function searchInsert(nums: number[], target: number): number {
  let l = 0, r = nums.length; // TODO: 你也可以用半开区间 [l, r)
  while (l < r) {
    const mid = l + ((r - l) >> 1);
    // TODO: 按你的区间定义更新 l/r
  }
  return l; // TODO: 按区间定义决定返回 l 还是 r
}
```

---

## Day 9 — 答案二分（可行性判定）
题目：`875. 爱吃香蕉的珂珂`

**一句话不变量（填空）**：
- `check(k) 表示当速度为 k 时是否 _________；并且 check(k) 对 k 具有 _________ 性（单调）。`

**5行总结（填）**
1）套路名：答案二分（最小可行）  
2）状态定义：`check(k)` = _________  
3）步骤：①确定搜索范围 [lo, hi] → ②二分 → ③用 check 决定收缩哪边  
4）复杂度：时间 `O(n log hi)` 空间 `O(1)`  
5）易错点：上界怎么取；mid 取整；循环条件；返回值（lo/hi）  

**TS骨架**
```ts
function minEatingSpeed(piles: number[], h: number): number {
  // TODO: 计算 lo、hi（hi 通常是 max(piles)）
  let lo = 1, hi = 1;

  const check = (k: number): boolean => {
    // TODO: 计算以速度 k 吃完是否 <= h
    return true;
  };

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (check(mid)) {
      // TODO: hi = mid
    } else {
      // TODO: lo = mid + 1
    }
  }
  return lo;
}
```

---

## Day 10 — 网格 BFS/DFS
题目：`200. 岛屿数量`

**一句话不变量（填空）**：
- `当我发现一个未访问的陆地 '1'，就从它出发把这座岛的所有陆地都标记为 _________，从而保证每块陆地只处理 _________ 次。`

**TS骨架（推荐迭代，避免递归爆栈）**
```ts
function numIslands(grid: string[][]): number {
  const R = grid.length;
  const C = grid[0]?.length ?? 0;
  let ans = 0;

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] !== '1') continue;
      ans++;

      // TODO: 从 (r,c) 扩散：入栈/入队时立刻标记为 '0'
      const stack: [number, number][] = [[r, c]];
      grid[r][c] = '0';

      while (stack.length) {
        const [cr, cc] = stack.pop()!;
        for (const [dr, dc] of DIRS) {
          const nr = cr + dr, nc = cc + dc;
          if (!inBound(nr, nc, R, C)) continue;
          if (grid[nr][nc] !== '1') continue;
          grid[nr][nc] = '0';
          stack.push([nr, nc]);
        }
      }
    }
  }
  return ans;
}
```

---

## Day 11 — 二叉树层序遍历（BFS）
题目：`102. 二叉树的层序遍历`

**一句话不变量（填空）**：
- `队列里按顺序保存 _________；每一轮先记录当前层节点数 size，然后恰好弹出 _________ 个构成一层。`

**TS骨架（用 Queue 避免 shift）**
```ts
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const res: number[][] = [];
  const q = new Queue<TreeNode>();
  q.push(root);

  while (!q.isEmpty()) {
    const size = q.size();
    const level: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = q.pop()!;
      level.push(node.val);
      // TODO: push children
    }
    res.push(level);
  }
  return res;
}
```

---

## Day 12 — 区间题（排序 + 合并）
题目：`56. 合并区间`

**一句话不变量（填空）**：
- `按起点排序后，维护一个当前区间 cur=[s,e]；遍历到新区间 [a,b] 时，如果 a <= e 则 _________，否则 _________。`

**TS骨架**
```ts
function merge(intervals: number[][]): number[][] {
  if (intervals.length === 0) return [];
  intervals.sort((x, y) => x[0] - y[0]);

  const res: number[][] = [];
  let [s, e] = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    const [a, b] = intervals[i];
    // TODO: 判断是否重叠；重叠则更新 e；否则 push [s,e] 并重置 s,e
  }
  res.push([s, e]);
  return res;
}
```

---

## Day 13 — 一维 DP 入门
题目（二选一）：`70. 爬楼梯` 或 `198. 打家劫舍`

### A) 70. 爬楼梯（最经典入门）
**一句话不变量（填空）**：
- `dp[i] 表示到达第 i 阶共有 _________ 种方法；dp[i] 只与 dp[i-1] 和 dp[i-2] 有关。`

**TS骨架**
```ts
function climbStairs(n: number): number {
  // TODO: 初始化 dp0, dp1（或数组）
  // TODO: for i from 2..n: dpi = dp1 + dp0; 更新滚动变量
  return 0;
}
```

### B) 198. 打家劫舍（状态压缩很常用）
**一句话不变量（填空）**：
- `dp[i] 表示前 i 个房子（0..i）能偷到的最大金额；转移：dp[i] = max( _________ , _________ )`

**TS骨架**
```ts
function rob(nums: number[]): number {
  // TODO: 边界：n=0/1
  // TODO: 两个滚动状态：prev2, prev1
  for (let i = 0; i < nums.length; i++) {
    // TODO: cur = max(prev1, prev2 + nums[i])
    // TODO: prev2 = prev1; prev1 = cur
  }
  return 0;
}
```

---

## Day 14 — 综合测验（闭环）
**目标**：从任一套路桶选 1 道没做过的 Medium  
- 先自己做 20 分钟（限时）
- 再看题解补齐关键思路
- 最后合上题解从零重写
- 写 5 行总结 + “下次如何更快识别”一句话

**通用自检清单（每题写完打勾）**
- [ ] 我写清了不变量/状态定义（1 句话）
- [ ] 我能解释为什么这样做是对的（2 句话）
- [ ] 我写了 2 个边界测试（空/极小/极大）
- [ ] 我能在不看答案的情况下从零再写一遍
- [ ] 我把坑写进了 5 行总结

---

# 复习节奏（强烈建议你加上，否则14天后会掉）
**最省力但回报最高的复习法：间隔复写**
- 第1次：当天做完（合上重建）
- 第2次：+2~3 天盲写同题
- 第3次：+7 天盲写同套路另一题（变体）

**你的复习清单（复制填）**
- 滑动窗口：Day4 题 +（变体：最短/最长/固定长度）
- 前缀和：Day2 题 +（变体：子数组/子串计数）
- 单调栈：Day6 题 +（变体：下一个更大元素）
- 二分：Day8/9 题 +（变体：边界/最小可行）
- BFS/DFS：Day10/11 题 +（变体：最短路径/层数）

---

## 你可以把这份文件当成“每日复盘脚本”
每天只做 1 题也没问题：**做透 + 总结 + 合上重建**，比做 3 题但不复写更有效。
