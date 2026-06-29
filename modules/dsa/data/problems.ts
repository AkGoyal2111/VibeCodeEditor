import type { DsaProblem } from "../types";

/**
 * Curated set of classic DSA problems. Each is intentionally self-contained so
 * a pair can open the same slug and start solving together immediately.
 */
export const DSA_PROBLEMS: DsaProblem[] = [
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays & Hashing",
    statement:
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. You may assume each input has exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] == 9, so we return [0, 1].",
      },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "Only one valid answer exists.",
    ],
    hints: [
      "A brute force checks every pair in O(n^2). Can you do better?",
      "Store seen values in a hash map keyed by value, mapping to index.",
      "For each number x, check if target - x is already in the map.",
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // your code here
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // your code here
  return [];
}`,
      python: `from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # your code here
        pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // your code here
        return new int[]{};
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // your code here
        return {};
    }
};`,
    },
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stacks",
    statement:
      "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid. Brackets must close in the correct order and every closing bracket must match the most recent unmatched opening bracket.",
    examples: [
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    hints: [
      "Think about which data structure naturally reverses order.",
      "Push opening brackets onto a stack; on a closing bracket, pop and compare.",
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // your code here
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # your code here
        pass`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // your code here
        return false;
    }
};`,
    },
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Binary Search",
    statement:
      "Given a sorted (ascending) array of integers `nums` and a `target`, return the index of `target` if it exists, otherwise `-1`. You must write an algorithm with O(log n) runtime.",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "nums is sorted in ascending order.",
      "All integers in nums are unique.",
    ],
    hints: [
      "Maintain two pointers, low and high.",
      "Compare the middle element and discard half the search space each step.",
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // your code here
}`,
      python: `from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        # your code here
        pass`,
    },
  },
  {
    slug: "max-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    statement:
      "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return that sum.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      { input: "nums = [1]", output: "1" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hints: [
      "Track the best sum ending at the current index (Kadane's algorithm).",
      "At each step, either extend the previous subarray or start fresh.",
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // your code here
}`,
      python: `from typing import List

class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        # your code here
        pass`,
    },
  },
  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    topic: "Intervals",
    statement:
      "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "[1,3] and [2,6] overlap, so they merge into [1,6].",
      },
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4",
    ],
    hints: [
      "Sort intervals by their start value first.",
      "Walk through, extending the current interval's end while it overlaps the next.",
    ],
    starterCode: {
      javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
  // your code here
}`,
      python: `from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        # your code here
        pass`,
    },
  },
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graphs / BFS-DFS",
    statement:
      "Given an `m x n` 2D binary grid which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    examples: [
      {
        input:
          'grid = [["1","1","0","0"],["1","0","0","0"],["0","0","1","0"],["0","0","0","1"]]',
        output: "3",
      },
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      'grid[i][j] is "0" or "1".',
    ],
    hints: [
      "Each unvisited land cell starts a new island.",
      "Flood-fill its connected component with BFS or DFS and mark cells visited.",
    ],
    starterCode: {
      javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  // your code here
}`,
      python: `from typing import List

class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        # your code here
        pass`,
    },
  },
  {
    slug: "lru-cache",
    title: "LRU Cache",
    difficulty: "Medium",
    topic: "Design / Hashing",
    statement:
      "Design a data structure for a Least Recently Used (LRU) cache. Implement `LRUCache(capacity)`, `get(key)` (returns the value or -1) and `put(key, value)`. Both operations must run in O(1) average time. When capacity is exceeded, evict the least recently used key.",
    examples: [
      {
        input:
          'LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2); put(4,4); get(1); get(3); get(4)',
        output: "[1, -1, -1, 3, 4]",
        explanation: "put(3,3) evicts key 2; put(4,4) evicts key 1.",
      },
    ],
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key, value <= 10^4",
      "At most 2*10^5 calls to get and put.",
    ],
    hints: [
      "A hash map gives O(1) lookup; you also need O(1) ordering updates.",
      "Combine a hash map with a doubly linked list (or an ordered map).",
    ],
    starterCode: {
      javascript: `/**
 * @param {number} capacity
 */
class LRUCache {
  constructor(capacity) {
    // your code here
  }
  get(key) {
    // your code here
  }
  put(key, value) {
    // your code here
  }
}`,
      python: `class LRUCache:
    def __init__(self, capacity: int):
        # your code here
        pass

    def get(self, key: int) -> int:
        # your code here
        pass

    def put(self, key: int, value: int) -> None:
        # your code here
        pass`,
    },
  },
  {
    slug: "course-schedule",
    title: "Course Schedule",
    difficulty: "Medium",
    topic: "Graphs / Topological Sort",
    statement:
      "There are `numCourses` courses labelled `0` to `numCourses - 1`. `prerequisites[i] = [a, b]` means you must take course `b` before course `a`. Return `true` if you can finish all courses, otherwise `false`.",
    examples: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "false",
        explanation: "There is a cyclic dependency between 0 and 1.",
      },
    ],
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "All prerequisite pairs are distinct.",
    ],
    hints: [
      "This is asking whether a directed graph has a cycle.",
      "Use Kahn's algorithm (BFS on in-degrees) or DFS with a visiting state.",
    ],
    starterCode: {
      javascript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
function canFinish(numCourses, prerequisites) {
  // your code here
}`,
      python: `from typing import List

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        # your code here
        pass`,
    },
  },
  {
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    statement:
      "Given an array of coin denominations `coins` and an integer `amount`, return the fewest number of coins needed to make up that amount. If it cannot be made, return `-1`. You have an infinite supply of each coin.",
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
        explanation: "11 = 5 + 5 + 1.",
      },
      { input: "coins = [2], amount = 3", output: "-1" },
    ],
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4",
    ],
    hints: [
      "Define dp[x] = fewest coins to make amount x.",
      "dp[x] = min over coins c of dp[x - c] + 1.",
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  // your code here
}`,
      python: `from typing import List

class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        # your code here
        pass`,
    },
  },
  {
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked Lists",
    statement:
      "Given the `head` of a singly linked list, reverse the list and return the new head.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = []", output: "[]" },
    ],
    constraints: [
      "The number of nodes is in the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    hints: [
      "Keep three pointers: previous, current, next.",
      "Iteratively flip each node's next pointer to the previous node.",
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *   this.val = (val===undefined ? 0 : val);
 *   this.next = (next===undefined ? null : next);
 * }
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
  // your code here
}`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseList(self, head):
        # your code here
        pass`,
    },
  },
  {
    slug: "longest-substring-no-repeat",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Sliding Window",
    statement:
      "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with length 3.',
      },
      { input: 's = "bbbbb"', output: "1" },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    hints: [
      "Use a sliding window with two pointers.",
      "Track the last seen index of each character to jump the left pointer.",
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // your code here
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # your code here
        pass`,
    },
  },
  {
    slug: "word-break",
    title: "Word Break",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    statement:
      "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words. The same word may be reused.",
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: "true",
        explanation: '"leetcode" = "leet" + "code".',
      },
      {
        input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]',
        output: "false",
      },
    ],
    constraints: [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000",
      "All dictionary words are unique.",
    ],
    hints: [
      "dp[i] = can s[0..i) be segmented?",
      "dp[i] is true if some j < i has dp[j] true and s[j..i) is in the dictionary.",
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
function wordBreak(s, wordDict) {
  // your code here
}`,
      python: `from typing import List

class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        # your code here
        pass`,
    },
  },
];

export function getProblemBySlug(slug: string): DsaProblem | undefined {
  return DSA_PROBLEMS.find((p) => p.slug === slug);
}
