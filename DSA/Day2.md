# DSA Day 2 — Arrays: Internals, Operations, In-Place Manipulation

---

## Part 1: What Is an Array?

An array is the most fundamental data structure — a contiguous block of memory that stores elements in numbered positions (indices).

**Analogy:** A row of lockers in a hallway. Each locker has a number (index), and you can go directly to locker #47 without opening lockers 0–46. That's why access is O(1).

**Why do arrays exist?** They solve the most basic problem in computing: store multiple items and access any one instantly by position.

---

## Part 2: How Arrays Work in Memory

In lower-level languages (C, Java), an array is a fixed block of contiguous memory:

```
Memory Address:  1000  1004  1008  1012  1016
                ┌─────┬─────┬─────┬─────┬─────┐
Array:          │  10 │  20 │  30 │  40 │  50 │
                └─────┴─────┴─────┴─────┴─────┘
Index:            0     1     2     3     4
```

To find element at index `i`, the CPU calculates:

```
address = baseAddress + (i × sizeOfElement)
```

Index 3 → `1000 + (3 × 4) = 1012` → one calculation, direct jump. That's why access is O(1).

### JavaScript Arrays — The Truth

JS arrays are not true arrays internally. They're objects (hash maps) with numeric keys. The V8 engine optimizes them into real contiguous arrays when possible (called "packed" arrays), but falls back to dictionary mode when you do things like:

```js
const arr = [];
arr[0] = 1;
arr[10000] = 2;  // huge gap → V8 switches to dictionary mode (slower)
```

For interviews, treat JS arrays as standard arrays with O(1) access. But knowing this internal detail is a great talking point with interviewers.

---

## Part 3: Core Array Operations & Their Costs

```
OPERATION                    TIME       WHY
──────────────────────────────────────────────────────
Access by index (arr[i])     O(1)       Direct address calculation
Push to end (.push())        O(1)*      Amortized — occasionally resizes
Pop from end (.pop())        O(1)       Just remove last element
Insert at beginning          O(n)       Must shift ALL elements right
  (.unshift())
Delete from beginning        O(n)       Must shift ALL elements left
  (.shift())
Insert/delete at middle      O(n)       Must shift elements after position
  (.splice())
Search (unsorted)            O(n)       Must check every element
Search (sorted)              O(log n)   Binary search (Day 16)
```

*Amortized means "on average." Occasionally the internal array is full and must be copied to a bigger block — that single push is O(n), but it happens so rarely that averaged out, each push is O(1).

### Visual: Why Insert at Beginning Is O(n)

Insert 99 at index 0 of `[10, 20, 30, 40]`:

```
Step 1: Shift everything right
  [10, 20, 30, 40,  _ ]
  [10, 20, 30,  _, 40 ]  ← 40 shifts
  [10, 20,  _, 30, 40 ]  ← 30 shifts
  [10,  _, 20, 30, 40 ]  ← 20 shifts
  [ _, 10, 20, 30, 40 ]  ← 10 shifts

Step 2: Place 99
  [99, 10, 20, 30, 40 ]
```

4 elements shifted = n operations → O(n)

This is why `.unshift()` is expensive and `.push()` is cheap. In interviews, if you're building results, always push to the end.

---

## Part 4: Essential Array Techniques

### Technique 1: Iterating

```js
const arr = [10, 20, 30, 40];

// Method 1: Classic for loop — use when you need the index
for (let i = 0; i < arr.length; i++) {
  console.log(i, arr[i]);
}

// Method 2: for...of — use when you only need values
for (const val of arr) {
  console.log(val);
}

// Method 3: forEach — use for side effects, NOT when you need to break early
arr.forEach((val, i) => console.log(i, val));
```

**Interview tip:** Use the classic for loop in interviews. It gives you full control — you can break, skip, go backwards, use multiple pointers.

---

### Technique 2: In-Place Modification — The Writer-Reader Pattern

"In-place" means modifying the original array without creating a new one → O(1) extra space.

**Problem:** Remove all zeroes, keep order, in-place.

**Brute Force — O(n) space**
```js
function removeZeroes(arr) {
  const result = [];
  for (const val of arr) {
    if (val !== 0) result.push(val);
  }
  return result;
}
```

This works but uses O(n) extra space. An interviewer will say: "Can you do it in-place?"

**Optimal — O(1) space**
```js
function removeZeroes(arr) {
  let writer = 0;                        // where to write next valid value

  for (let reader = 0; reader < arr.length; reader++) {
    if (arr[reader] !== 0) {
      arr[writer] = arr[reader];         // write valid value at writer position
      writer++;                          // advance writer
    }
  }

  arr.length = writer;                   // truncate leftover garbage
  return arr;
}
```

**Dry run with `[0, 1, 0, 3, 12]`:**

```
writer=0

reader=0: arr[0]=0  → skip
reader=1: arr[1]=1  → arr[0]=1, writer=1
reader=2: arr[2]=0  → skip
reader=3: arr[3]=3  → arr[1]=3, writer=2
reader=4: arr[4]=12 → arr[2]=12, writer=3

Array state: [1, 3, 12, 3, 12]
                          ↑ garbage after writer=3
Truncate → [1, 3, 12] ✓
```

**Visual of writer/reader movement:**
```
[0, 1, 0, 3, 12]
 W
 R                 → 0, skip

[0, 1, 0, 3, 12]
 W
    R              → 1, write to W, advance both

[1, 1, 0, 3, 12]
    W
       R           → 0, skip

[1, 1, 0, 3, 12]
    W
          R        → 3, write to W

[1, 3, 0, 3, 12]
       W
              R    → 12, write to W

[1, 3, 12, 3, 12]
          W        → truncate here
```

**Why this pattern matters:** It appears in dozens of problems — remove duplicates from sorted array, move zeroes, remove element, etc. The core idea is always: reader scans, writer only moves when something valid is found.

---

### Technique 3: Reversing In-Place — The Swap Pattern

```js
function reverse(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return arr;
}
```

**Dry run with `[1, 2, 3, 4, 5]`:**

```
L=0, R=4: swap 1↔5 → [5, 2, 3, 4, 1]
L=1, R=3: swap 2↔4 → [5, 4, 3, 2, 1]
L=2, R=2: left = right → stop ✓
```

Time: O(n). Space: O(1). This is a preview of the Two Pointers technique (Day 6).

---

### Technique 4: Kadane's Algorithm — Maximum Subarray Sum

One of the most famous array problems (LeetCode #53). Demonstrates Brute Force → Better → Optimal beautifully.

**Problem:** Find the contiguous subarray with the largest sum.

**Brute Force — O(n³)**
```js
function maxSubarray(arr) {
  let maxSum = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j < arr.length; j++) {
      let sum = 0;
      for (let k = i; k <= j; k++) {
        sum += arr[k];
      }
      maxSum = Math.max(maxSum, sum);
    }
  }
  return maxSum;
}
```

Three nested loops. Every possible subarray, recalculated from scratch.

**Better — O(n²)**
```js
function maxSubarray(arr) {
  let maxSum = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    let sum = 0;
    for (let j = i; j < arr.length; j++) {
      sum += arr[j];    // extend previous sum instead of recalculating
      maxSum = Math.max(maxSum, sum);
    }
  }
  return maxSum;
}
```

Eliminated the innermost loop by building on the previous sum.

**Optimal — O(n) — Kadane's Algorithm**
```js
function maxSubarray(arr) {
  let currentSum = arr[0];
  let maxSum = arr[0];

  for (let i = 1; i < arr.length; i++) {
    // Key decision: extend the existing subarray, or start fresh here?
    currentSum = Math.max(arr[i], currentSum + arr[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}
```

**Core insight:** At every position, exactly two choices — extend the current subarray, or start fresh from this element if the running sum was dragging you down.

**Why initialize to `arr[0]` and not `0`?** Because if all elements are negative (e.g. `[-3, -1, -2]`), the answer is `-1`, not `0`. Initializing to `0` would incorrectly return `0`.

**Dry run with `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`:**

```
i=0:  currentSum = -2,  maxSum = -2
i=1:  max(1, -2+1) = max(1,-1) = 1,     maxSum = 1
i=2:  max(-3, 1+-3) = max(-3,-2) = -2,  maxSum = 1
i=3:  max(4, -2+4) = max(4,2) = 4,      maxSum = 4
i=4:  max(-1, 4+-1) = max(-1,3) = 3,    maxSum = 4
i=5:  max(2, 3+2) = max(2,5) = 5,       maxSum = 5
i=6:  max(1, 5+1) = max(1,6) = 6,       maxSum = 6
i=7:  max(-5, 6+-5) = max(-5,1) = 1,    maxSum = 6
i=8:  max(4, 1+4) = max(4,5) = 5,       maxSum = 6

Answer: 6 → subarray [4, -1, 2, 1] ✓
```

---

### Technique 5: Kadane's with Index Tracking (Advanced / P3)

When you need to return not just the max sum but the actual subarray, track start/end indices. The key: separate the "what does curr do" decision from the "is this a new max" decision — two clean if-blocks, never tangled.

```js
function findMaxSumArr(arr) {
  let start = 0, end = 0, tempStart = 0;
  let maxSum = arr[0];
  let currSum = arr[0];

  for (let i = 1; i < arr.length; i++) {
    // Decision 1: extend or restart?
    if (currSum + arr[i] > arr[i]) {
      currSum += arr[i];
    } else {
      currSum = arr[i];
      tempStart = i;        // starting fresh — record potential new start
    }

    // Decision 2: new max?
    if (currSum > maxSum) {
      maxSum = currSum;
      start = tempStart;
      end = i;
    }
  }

  return { maxSum, start, end };
}
```

**Trace with `[-4, -2, 6, 7, 2]`:**

```
curr=-4, max=-4, tempStart=0

i=1: -2 > -4+(-2)=-6? Yes → curr=-2, tempStart=1
     -2 > -4? Yes → max=-2, start=1, end=1

i=2: 6 > -2+6=4? Yes → curr=6, tempStart=2
     6 > -2? Yes → max=6, start=2, end=2

i=3: 7 > 6+7=13? No → curr=13
     13 > 6? Yes → max=13, start=2, end=3

i=4: 2 > 13+2=15? No → curr=15
     15 > 13? Yes → max=15, start=2, end=4

→ max=15, subarray [6, 7, 2] ✓
```

---

## Part 5: Pattern Recognition

```
PATTERN                    SIGNAL IN PROBLEM
─────────────────────────────────────────────────────
Writer-Reader              "in-place", "remove", "move", "O(1) space"
Left-Right Pointers        "reverse", "palindrome", "sorted array"
Kadane's                   "maximum subarray", "contiguous", "best sum"
Brute→Optimal              Nested loops? Ask "what am I recalculating?"
```

---

## Part 6: Common Mistakes

**Off-by-one errors** — Array of length 5 has indices 0–4, not 0–5. Always verify your loop bounds.

**Mutating while iterating** — splicing elements mid-loop shifts indices and causes skipped elements. Use the writer-reader pattern instead.

**Forgetting negative numbers** — initializing `maxSum = 0` in Kadane's breaks for `[-3, -1, -2]`. The answer is `-1`, not `0`.

**Using `.indexOf()` inside a loop** — that's O(n) inside O(n) = hidden O(n²). Interviewers catch this.

**Not truncating after writer-reader** — after the loop, the array still has leftover garbage beyond `writer`. Always truncate: `arr.length = writer` (or `writer + 1` depending on pattern).

**Using `[...arr]` when asked for in-place** — spreading creates a copy (O(n) space). In-place means mutating the original array directly with pointers only.

---

## Day 2 Recap

1. **Array access is O(1)** — direct address calculation: `base + i × size`
2. **Push is O(1), unshift is O(n)** — build results by pushing to the end
3. **Writer-reader pattern** — reader scans everything, writer only moves on valid values; always truncate after
4. **Swap/reversal** — two pointers from ends, meet in the middle, O(1) space
5. **Kadane's** — at each step: extend or restart; initialize to `arr[0]` not `0`; separate extend-decision from max-decision when tracking indices
6. **In-place means no copy** — `[...arr]` is O(n) space; pointers only

---

---

# Practice Problems & Answers

## Conceptual Check (Part 5)

### Q1: Remove duplicates in-place from `[1, 1, 2, 2, 2, 3]` — which technique?

**Answer: Writer-Reader pattern ✅**

The writer only advances when `arr[writer] !== arr[reader]` — since the array is sorted, duplicates are adjacent, so this naturally skips them.

### Q2: Why initialize `currentSum` and `maxSum` to `arr[0]` in Kadane's instead of `0`?

**Answer: Because the array can be all-negative ✅**

If all elements are negative (e.g. `[-3, -1, -2]`), initializing to `0` would return `0` — but `0` isn't a valid subarray. The correct answer is `-1`. Starting at `arr[0]` handles this correctly.

---

## Beginner

### P1: Rotate array right by k steps — O(1) space

```js
function rotateArr(arr, k) {
    if (k > arr.length) k = k % arr.length;
    let i = 0;
    let j = arr.length - 1;

    while (i < j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
        j--;
    }

    i = 0; j = k - 1;
    while (i < j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
        j--;
    }

    i = k; j = arr.length - 1;
    while (i < j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
        j--;
    }
    return;
}
```

**Result: ✅ Perfect.** Three reversals, O(1) space, `k > arr.length` edge case handled with modulo.

**Trace with `[1,2,3,4,5]`, `k=2`:**
```
Step 1 — reverse all:     [5,4,3,2,1]
Step 2 — reverse 0..k-1:  [4,5,3,2,1]
Step 3 — reverse k..n-1:  [4,5,1,2,3] ✓
```

**One improvement:** Extract the reverse logic into a helper to avoid repeating the while loop three times:
```js
function rev(arr, l, r) {
  while (l < r) [arr[l++], arr[r--]] = [arr[r], arr[l]];
}
```

---

## Advanced

### P3: Kadane's with start and end indices

```js
function findMaxSumArr(arr) {
    let start = 0, end = 0, tempStart = 0;
    let maxSum = arr[0];
    let currSum = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if(currSum + arr[i] > arr[i]) {
            currSum += arr[i];
        } else {
            currSum = arr[i];
            tempStart = i;
        }

        if(maxSum < currSum) {
            maxSum = currSum;
            start = tempStart;
            end = i;
        }
    }

    return {maxSum, start, end};
}
```

**Result: ✅ Correct logic and clean separation of the two decisions.**

---

## Mini Project — `arrayAnalyzer`

### My Solution

```js
function findMaxSumArr(arr) {
    let start = 0, end = 0, tempStart = 0;
    let maxSum = arr[0];
    let currSum = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if(currSum + arr[i] > arr[i]) {
            currSum += arr[i];
        } else {
            currSum = arr[i];
            tempStart = i;
        }

        if(maxSum < currSum) {
            maxSum = currSum;
            start = tempStart;
            end = i;
        }
    }

    return {maxSum, start, end};
}

function reverseArr(arr) {
    const tempArr = [...arr];
    let i = 0; j = tempArr.length - 1;
    while (i < j) {
        [tempArr[i], tempArr[j]] = [tempArr[j], tempArr[i]];
        i++;
        j--;
    }
    return tempArr;
}

function removeDuplicates(sortedArr) {
    const tempArr = [...sortedArr];
    let writer = 0;

    for(let i = 1; i < tempArr.length; i++) {
        if(tempArr[writer] !== tempArr[i]) {
            tempArr[++writer] = tempArr[i];
        }
    }
    return tempArr;
}

function arrayAnalyzer(arr) {
    console.log(findMaxSumArr(arr));
    console.log('reversed array ', reverseArr(arr));
    console.log('removed duplicates ', removeDuplicates(arr));
}

arrayAnalyzer([1, 1, 2, -3, 4, 4, -1, 2, 1, -5, 4, 4]);
```

**Kadane's: ✅** Correct logic and clean index tracking.

**Two issues to fix:**

**Issue 1 — `removeDuplicates` missing truncation:** After the writer loop, the array still has leftover elements beyond `writer`. Need to add `tempArr.length = writer + 1` before returning.

**Issue 2 — `reverseArr` and `removeDuplicates` are not truly in-place:** `[...arr]` creates a copy → O(n) space. The prompt said in-place. In an interview, "in-place" means mutating the original array with pointers only — no copy.

---

## Revision Questions

### Q1: Why is `arr[i]` O(1) but insert at beginning O(n)?

`arr[i]` is one calculation (`base + i × size`) → direct jump. Inserting at the beginning requires shifting every existing element one position to the right to make room — n elements → n operations → O(n).

**Result: ✅**

### Q2: Explain the writer-reader pattern in your own words.

The writer only moves forward when it finds a valid value — the reader scans everything regardless. This way valid values get compacted to the front without needing a separate array.

**Result: ✅**

### Q3: In Kadane's, what's the decision at each step and why does it work?

At each element: include it by extending the current subarray, or start fresh from it if the running sum would only drag the result down. It works because a negative running sum can never help a future subarray — cutting it off and restarting is always at least as good.

**Result: ✅**

---

## Corrections Summary — 2 things to fix

1. **Always truncate after writer-reader** — `arr.length = writer + 1` (or `writer` depending on the pattern). Without it, leftover garbage remains in the array.
2. **In-place means no copy** — `[...arr]` is O(n) space. Use pointers directly on the original array. If asked for in-place in an interview, never spread.