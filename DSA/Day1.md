# Day 1 — Big O Notation, Time & Space Complexity

## Part 1: Why Does This Topic Exist?

Imagine two developers solve the same problem. Dev A's code takes 1 second for 1,000 items but 3 hours for 1,000,000. Dev B's code takes 2 seconds for both. Both "work." But in a MAANG interview and in production, **Dev B wins**.

Big O is the language we use to describe *how code scales*. Not how fast it runs on your laptop — but how its performance **grows** as input grows.

> **Real-world analogy:** You're looking for a friend's name in a phone book.
> - Strategy A: Read every name, page by page → scales with the size of the book.
> - Strategy B: Open the middle, go left or right → barely affected by book size.
> Big O describes that difference.

---

## Part 2: What Is Big O?

Big O is a mathematical notation that describes the **upper bound** of an algorithm's growth rate. It answers:

> "As my input size `n` gets very large, roughly how many operations does my code do?"

We drop constants and lower-order terms because at massive scale, they don't matter.

```
5n + 3       → O(n)
2n² + 100n   → O(n²)
1000         → O(1)
```

**Why drop constants?** Because 5n vs 10n doesn't matter when comparing to n². At n = 1,000,000:
- 10n = 10,000,000
- n² = 1,000,000,000,000

The *shape* of growth is what matters, not the multiplier.

---

## Part 3: The Growth Rates (Ranked)

```
Speed Ranking (fastest → slowest):

O(1)        Constant      → instant, no matter the input size
O(log n)    Logarithmic   → halving the problem each step
O(n)        Linear        → touch each element once
O(n log n)  Linearithmic  → good sorting algorithms
O(n²)       Quadratic     → nested loops over same data
O(2ⁿ)       Exponential   → doubles with each new element
O(n!)       Factorial     → all permutations
```

Let's make this concrete with n = 1,000,000:

```
O(1)        →  1 operation
O(log n)    →  ~20 operations
O(n)        →  1,000,000
O(n log n)  →  ~20,000,000
O(n²)       →  1,000,000,000,000      ← your code hangs
O(2ⁿ)       →  universe dies first
```

---

## Part 4: Identifying Big O — Code Examples

### O(1) — Constant Time

```js
function getFirst(arr) {
  return arr[0];
}
```

No matter if `arr` has 5 or 5 billion elements, this does **exactly 1 operation**. The input size is irrelevant.

### O(n) — Linear Time

```js
function sum(arr) {
  let total = 0;          // 1 operation
  for (let i = 0; i < arr.length; i++) {  // runs n times
    total += arr[i];      // 1 operation per iteration
  }
  return total;           // 1 operation
}
```

**Dry run with arr = [3, 7, 2, 5]:**
```
i=0: total = 0 + 3 = 3
i=1: total = 3 + 7 = 10
i=2: total = 10 + 2 = 12
i=3: total = 12 + 5 = 17
→ 4 iterations for 4 elements → O(n)
```

Every element is visited **once**. Double the array? Double the work. That's linear.

### O(n²) — Quadratic Time

```js
function printPairs(arr) {
  for (let i = 0; i < arr.length; i++) {       // n times
    for (let j = 0; j < arr.length; j++) {     // n times for EACH i
      console.log(arr[i], arr[j]);
    }
  }
}
```

**Dry run with arr = [1, 2, 3]:**
```
i=0: j=0→(1,1)  j=1→(1,2)  j=2→(1,3)    ← 3 ops
i=1: j=0→(2,1)  j=1→(2,2)  j=2→(2,3)    ← 3 ops
i=2: j=0→(3,1)  j=1→(3,2)  j=2→(3,3)    ← 3 ops
                                Total: 9 = 3² = n²
```

The inner loop runs **fully** for every iteration of the outer loop. n × n = n².

### O(log n) — Logarithmic Time

```js
function howManyHalves(n) {
  let count = 0;
  while (n > 1) {
    n = Math.floor(n / 2);
    count++;
  }
  return count;
}
```

**Dry run with n = 16:**
```
16 → 8 → 4 → 2 → 1    →  4 steps
log₂(16) = 4  ✓
```

**Dry run with n = 1,000,000:**
```
~20 steps. That's it. A million elements, 20 operations.
```

Every step **cuts the problem in half**. This is the heart of binary search, which we'll master on Day 16.

---

## Part 5: Space Complexity

Space complexity measures **how much extra memory** your algorithm uses (beyond the input itself).

```js
// O(1) space — no extra memory that grows with input
function sum(arr) {
  let total = 0;    // just one variable, regardless of arr size
  for (let num of arr) total += num;
  return total;
}

// O(n) space — creates a new array as big as the input
function doubled(arr) {
  const result = [];          // grows with arr
  for (let num of arr) {
    result.push(num * 2);
  }
  return result;
}
```

**Key distinction:** The input array itself doesn't count. We measure *additional* memory the algorithm allocates.

---

## Part 6: How to Analyze Any Code

Here's the systematic method. Follow these rules:

**Rule 1: Sequential steps ADD**
```js
function example(arr) {
  // Step 1: O(n)
  for (let x of arr) { /* ... */ }

  // Step 2: O(n)
  for (let x of arr) { /* ... */ }
}
// Total: O(n) + O(n) = O(2n) = O(n)
```

**Rule 2: Nested steps MULTIPLY**
```js
for (let i = 0; i < n; i++) {       // O(n)
  for (let j = 0; j < n; j++) {     // × O(n)
    // ...
  }
}
// Total: O(n × n) = O(n²)
```

**Rule 3: Different inputs get different variables**
```js
function merge(arrA, arrB) {
  for (let a of arrA) {     // O(a)
    for (let b of arrB) {   // × O(b)
      // ...
    }
  }
}
// Total: O(a × b), NOT O(n²) — they're different arrays
```

This is a **classic interview trap**. Interviewers love checking if you recognize when two inputs are independent.

---

## Part 7: Conceptual Check

Before we go further, answer these three questions. Just reply with your answers — no need to overthink, and getting it wrong is totally fine. That's where real learning happens.

**Q1:** What is the time complexity of this code?
```js
function mystery(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      console.log(arr[i] + arr[j]);
    }
  }
}
```

**Q2:** What is the time complexity?
```js
function foo(n) {
  for (let i = 1; i <= n; i = i * 2) {
    console.log(i);
  }
}
```

**Q3:** An algorithm does 3n³ + 10n² + 5000. What is its Big O? Why?

---

Answer these three, and I'll continue with the remaining sections: pattern recognition, common mistakes, practice problems, the mini project, and revision questions.

### My Answers:

1. n-1 +  n-2  + n-3 + ....1 ===> n^2
2. nlogn
3. O(n^3)

## Results: 2 out of 3 — solid start!

**Q1: ✅ Correct.** Great reasoning. n-1 + n-2 + ... + 1 = n(n-1)/2 = O(n²). You nailed the summation logic.

**Q3: ✅ Correct.** 3n³ dominates everything else. Drop constants and lower terms → O(n³).

---

**Q2: ❌ Not quite.** Let's break down why.

```js
function foo(n) {
  for (let i = 1; i <= n; i = i * 2) {
    console.log(i);
  }
}
```

Dry run with n = 16:
```
i = 1 → 2 → 4 → 8 → 16 → stop
         ×2   ×2   ×2   ×2

Only 5 iterations. log₂(16) = 4... plus the starting 1 = 5 steps.
```

There's **no inner work that costs n** — just a `console.log`, which is O(1). The loop itself runs log(n) times because `i` doubles each step.

The answer is **O(log n)**.

O(n log n) would require something like:

```js
for (let i = 1; i <= n; i = i * 2) {   // log n times
  for (let j = 0; j < n; j++) {         // × n each time
    // ...
  }
}
```

**The key distinction:** multiplying the loop variable (i *= 2) means the *loop itself* is log n. You'd need a nested O(n) operation inside to make it n log n.

---

## Part 8: Pattern Recognition — How to Spot Big O Instantly

```
PATTERN                          →  COMPLEXITY
─────────────────────────────────────────────────
Single loop 0..n                 →  O(n)
Two nested loops over same n     →  O(n²)
Loop variable doubles (i *= 2)   →  O(log n)
Loop variable halves (i /= 2)    →  O(log n)
Outer O(n) × inner O(n)         →  O(n²)
Outer O(n) × inner doubles      →  O(n log n)
Two sequential loops             →  O(n) + O(n) = O(n)
Loop over two DIFFERENT inputs   →  O(a + b) or O(a × b)
```

Memorize this table. In interviews, you'll use it within seconds.

---

## Part 9: Common Mistakes & Interview Traps

**Trap 1:** Saying O(n²) when inputs are different — always ask "is it the same array?"

**Trap 2:** Confusing `i *= 2` (log n iterations) with `i += 2` (n/2 iterations, still O(n)).

**Trap 3:** Forgetting that O(n) + O(n) = O(n), not O(n²). Sequential ≠ nested.

**Trap 4:** Best case vs worst case. When interviewers say "Big O," they mean **worst case** unless they specifically ask otherwise.

---

## Part 10: Practice Problems

Try analyzing these. Share your answers, I'll give feedback.

**Beginner:**
```js
// P1: What's the time complexity?
function find(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
```

**Intermediate:**
```js
// P2: Time AND space complexity?
function buildMatrix(n) {
  const matrix = [];
  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      matrix[i][j] = i + j;
    }
  }
  return matrix;
}
```

**Advanced:**
```js
// P3: Time complexity? Think carefully.
function tricky(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 1; j < n; j = j * 3) {
      console.log(i, j);
    }
  }
}
```

---

## Mini Project

Write a function called `compareRuntimes(n)` that:
1. Runs an O(n) loop and an O(n²) loop for the same `n`
2. Uses `performance.now()` to time each
3. Prints both durations

Run it with n = 10, 100, 1000, 10000 and observe how the gap grows. Share your code and the output.

---

## Day 1 Revision Questions

1. Why do we drop constants in Big O?
2. What's the difference between O(a + b) and O(a × b)? When does each apply?
3. A loop runs from 1 to n, but `i` triples each time (`i *= 3`). How many times does it run?

Take your time with everything. Reply whenever you're ready.

### My Answers:

P1: O(n)

P2: Time: O(n^2) and Space: O(n^2)

P3: log3n * n times ==> nlog3n

#### Mini Project:
```
function linear(n) {
    for (let i = 0; i < n; i++) {
        // Do nothing
    }
}

function quadratic(n) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            // Do nothing
        }
    }
}


function findPerf(n) {
    const startTime = performance.now();

    linear(n);
    const endLinearTime = performance.now();

    quadratic(n);
    const endQuadTime = performance.now();

    const linearPerf = `${(endLinearTime - startTime)} Milliseconds`;
    const quadPerf = `${(endQuadTime - endLinearTime)} Milliseconds`;

    console.log(`linearPerf for n: ${n}: ${linearPerf}`);
    console.log(`quadPerf for n: ${n}: ${quadPerf}`);
}

const nValues = [10, 100, 1000, 10000];

nValues.forEach(n => findPerf(n));
```

Day 1 Revision answers:
1. Because we are finding upper bound algorithm's performance when input grows.
2. O(a+b) -> two different loop, O(a*b) -> nested loop
3. log3n

## All Practice Problems: ✅ Perfect. All Revision: ✅ Perfect.

P1, P2, P3 — spot on. Your log base 3 reasoning on P3 is exactly right (and yes, O(n log₃n) = O(n log n) since log bases differ by a constant).

Mini project — clean, correct code. Solid use of `performance.now()`. One small note: in interviews, say `performance.now()` is millisecond-precision, and for very small `n` the linear time may show as 0 due to timer resolution. That's expected.

Revision answers are all correct. One refinement on Q1: your answer is right but a crisper interview phrasing would be — "Because constants don't affect the *growth rate*. 5n and 100n both grow linearly; the shape is the same. Big O describes shape, not speed."

---

## Day 1: Complete ✅

You've locked in:

- How to read any code and determine its Big O
- The difference between sequential (add) vs nested (multiply)
- Different inputs = different variables
- log n comes from doubling/halving/tripling the loop variable
- Space complexity = extra memory beyond input

Tomorrow — **Day 2: Arrays** — how they actually work in memory, why access is O(1), insertion/deletion costs, and in-place manipulation patterns that appear in almost every MAANG interview. This is where we start solving real problems.

Ready when you are.