# 14 天算法入门计划（30–60 分钟/天）

目标：用最短时间建立「套路地图」，把“看懂”变成“写得出”。

## 学习理念（一句话结论）
新手可以先看题解，但必须把“看”变成主动训练：**先限时尝试 → 只看思路不抄代码 → 合上重写 → 隔天复写**。否则就是在刷“眼熟”，不是在练算法。

## 每题闭环（强制，不做等于白刷）
1. **归类（≤60s）**：从 `Hash / 双指针 / 滑动窗口 / 栈 / BFS/DFS / 二分 / 区间 / DP` 里选一个。
2. **限时尝试（10–20min）**：写下 `状态/不变量/边界`，卡住就停，不允许无限死磕。
3. **看题解（≤10min）**：只看 `核心思路 + 不变量 + 复杂度 + 易错点`，先别看代码。
4. **合上重写（15–30min）**：从零实现，通过样例 + 2 个自造边界用例。
5. **写卡片（2–5min）**：记录到 `patterns.md`：`套路 / 不变量 / 模板步骤 / 复杂度 / 坑`。
6. **复习（强制）**：`D+2` 不看笔记重写原题；`D+7` 做 1 道同套路变体。

## 每天怎么练（两种时长）

### 30 分钟版（最低可持续）
- 5 分钟：归类 + 写 1 句不变量（例：窗口内字符计数始终满足…）。
- 10 分钟：限时尝试（只要写出骨架和卡点即可）。
- 10 分钟：只看思路（不看代码）+ 写下模板步骤。
- 5 分钟：合上写出关键循环/递归骨架（不要求一次 AC）。

### 60 分钟版（推荐）
- 10–15 分钟：先自己做（写出不变量/边界/数据结构选择）。
- 10 分钟：只看思路与坑点（禁止抄代码）。
- 25–30 分钟：从零实现 + 跑用例（至少 3 组：样例/边界/随机）。
- 5 分钟：写 `patterns.md` 卡片 + 标记 `D+2/D+7` 复习。

## 14 天路线（每天 1 新题 + 1 次短复盘）
说明：每天主线做 1 题；有余力再做“加练”。短复盘 = 10 分钟不看笔记重写“两天前主线题”的核心模板。

### 第 1 周：先把常见套路看全、模板练熟
- Day 1（Hash Map）：主线 `LC 1 Two Sum`；加练 `LC 242 Valid Anagram`
- Day 2（Prefix Sum + Hash）：主线 `LC 560 Subarray Sum Equals K`
- Day 3（Two Pointers）：主线 `LC 167 Two Sum II`；加练 `LC 125 Valid Palindrome`（复盘 Day 1）
- Day 4（Sliding Window）：主线 `LC 3 Longest Substring Without Repeating Characters`（复盘 Day 2）
- Day 5（Sliding Window 变体）：主线 `LC 209 Minimum Size Subarray Sum`；加练 `LC 567 Permutation in String`（复盘 Day 3）
- Day 6（Stack → Monotonic Stack）：主线 `LC 739 Daily Temperatures`；加练 `LC 20 Valid Parentheses`（复盘 Day 4）
- Day 7（复盘日）：不看笔记重写 3 题（Day 1/2/4），并各做 1 个变体（复盘 Day 5）

### 第 2 周：把“识别套路→落地实现”跑成肌肉记忆
- Day 8（二分基础）：主线 `LC 704 Binary Search`；加练 `LC 35 Search Insert Position`（复盘 Day 6）
- Day 9（答案二分/可行性判定）：主线 `LC 875 Koko Eating Bananas`（复盘 Day 7）
- Day 10（网格 DFS/BFS）：主线 `LC 200 Number of Islands`（复盘 Day 8）
- Day 11（Tree BFS 层序）：主线 `LC 102 Binary Tree Level Order Traversal`（复盘 Day 9）
- Day 12（Intervals）：主线 `LC 56 Merge Intervals`（复盘 Day 10）
- Day 13（1D DP 入门）：主线 `LC 198 House Robber`；加练 `LC 70 Climbing Stairs`（复盘 Day 11）
- Day 14（综合测验）：选 1 道没做过的 Medium（同套路优先），限时 20 分钟 → 看思路 → 合上重写（复盘 Day 12/13）

## 本仓库落地方式（推荐）
- 每题一个目录：实现放 `Name.js`，题面+测试放 `Name question.js`。
- `question` 文件只负责测试：`const { fn } = require('./Name')`。
- 实现文件必须导出：`module.exports = { fn }`。
- 允许写示例输出，但必须放在：`if (require.main === module) { ... }`。

运行示例（注意文件名含空格需要引号）：
- `node "sorting/quicksort/QuickSort question.js"`
- `node "async-concurrency/scheduler/Scheduler question.js"`

## 防走偏（最关键的 3 条）
1. **禁止照抄**：看题解只能拿“思路/不变量/模板”，代码必须自己写。
2. **禁止死磕**：超过 20 分钟还没写出不变量/状态定义，直接切到题解。
3. **禁止一次性刷过**：至少做一次 `D+2` 重写，否则 3 天后必忘。