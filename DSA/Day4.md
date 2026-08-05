# DSA Day 4 — Hash Maps & Hash Sets: The O(1) Lookup Superpower

## Part 1: What Problem Does Hashing Solve?

You've already used objects and arrays as frequency counters in Days 2 and 3. Today we go under the hood: **why does `map[key]` give O(1) lookup, no matter how many keys exist?**

**Analogy:** Imagine a library with a million books. Instead of an alphabetical shelf (where you'd scan letter by letter), imagine every book had a formula that instantly told you which exact shelf and slot it belongs to — no searching required. That's a hash map.

Contrast with an array: to find if `7` exists in `[3, 9, 7, 1]`, you must check each element — O(n). A hash map lets you ask "does 7 exist?" and get an answer in O(1), regardless of how many elements are stored.

---

## Part 2: How Hashing Actually Works

A **hash function** takes any input (string, number, object) and converts it into a number — an index into an underlying array.

```
key "banana" ──→ hash function ──→ 42 ──→ store at index 42
```

```js
// Simplified conceptual hash function for strings
function simpleHash(str, arraySize) {
  let hash = 0;
  for (const ch of str) {
    hash += ch.charCodeAt(0);
  }
  return hash % arraySize;  // squeeze into array bounds
}

simpleHash("cat", 10);  // c=99 + a=97 + t=116 = 312 → 312 % 10 = 2
```

So `"cat"` always hashes to the same index. When you later ask "is `cat` in this map?", the map doesn't search — it **recomputes the hash**, jumps straight to index 2, and checks. O(1).

```
Underlying array (size 10):

Index:  0    1    2      3    4  ...
       [ ]  [ ]  [cat]  [ ]  [ ]

Insert "cat" → hash → 2 → store at index 2
Lookup "cat" → hash → 2 → check index 2 → found!
```

This is why hash maps give O(1) **average case** for insert, delete, and lookup — you calculate an address instead of searching.

### Does Hashing Itself Have a Cost?

Yes — good instinct to ask. Computing the hash is proportional to the **size of the key**:

```
Hashing a number:         O(1)  → fixed-size value, one operation
Hashing a string:         O(k)  → must process all k characters
                                   (like the simpleHash loop above)
Hashing an object/array:  O(k)  → must process all its contents
```

So when we say hash map operations are "O(1)," that's O(1) relative to the **number of entries** in the map — not entirely free. If your keys are strings of length k, a more precise statement is:

```
Insert/lookup/delete: O(k)   where k = size of the key being hashed
```

For most interview problems, keys are short (single characters, small numbers, short words), so this k is treated as a constant and people just say O(1). But if you're hashing something large — like a long string or serialized array as a key — you should mention that the hash computation itself costs O(k).

**This is a great interview talking point.** If asked "is hash map lookup really O(1)?", the strong answer is:
> "Average case O(1) assuming a good hash function and low collision rate, and O(k) for the hashing step itself where k is the key size — which is usually treated as a constant for simple keys."

That shows real depth, not memorized rules.

---

## Part 3: Collisions — What Happens When Two Keys Hash to the Same Index

With a limited array size and infinite possible keys, **collisions are inevitable** (two different keys producing the same index).

```js
simpleHash("cat", 10);  // → 2
simpleHash("act", 10);  // c+a+t = same letters, same sum → 2 (collision!)
```

### Collision Resolution: Separate Chaining (most common)

Instead of storing one value per index, each index holds a **list** (chain) of entries:

```
Index 2: [cat, 5] → [act, 7] → null
              ↑            ↑
          key,value   key,value (linked list)
```

Lookup for "act": hash → index 2 → walk the tiny list at index 2 → find "act" → return 7.

**Why is this still considered O(1)?** Because with a good hash function and appropriately sized array, chains stay very short (usually 0–2 items) even with millions of entries. Worst case (all keys collide) degrades to O(n), but a well-designed hash map keeps this astronomically rare.

```
COMPLEXITY SUMMARY:

Average case:  O(1) for insert, lookup, delete
Worst case:    O(n) if all keys collide (bad hash function or adversarial input)
```

---

## Part 4: JavaScript's Two Hash-Based Structures

### `Object` / `Map` — Key-Value Storage

```js
// Object (older, more common in interviews)
const freq = {};
freq["apple"] = 1;
freq["apple"]++;
console.log(freq["apple"]);     // 2
console.log("banana" in freq);  // false

// Map (modern, more correct for general use)
const freqMap = new Map();
freqMap.set("apple", 1);
freqMap.set("apple", freqMap.get("apple") + 1);
console.log(freqMap.get("apple"));   // 2
console.log(freqMap.has("banana"));  // false
```

**Object vs Map — when to use which:**

```
                    OBJECT                        MAP
────────────────────────────────────────────────────────────────
Key types           strings only*                 any type (objects, numbers, etc.)
Order guarantee     not guaranteed**              insertion order guaranteed
Size                manual (Object.keys(o).length) .size property
Iteration           Object.keys/values/entries    for...of directly
Performance         fine for small                better for frequent add/remove
Default in interviews ✓ (common)                 ✓ (also accepted, often cleaner)
```

\*Object keys are auto-converted to strings: `obj[5]` becomes `obj["5"]`. This can bite you.  
\*\*Modern JS engines do preserve insertion order in practice, but it's not part of the spec guarantee for all key types.

For DSA interviews, **either is fine** — but `Map` avoids subtle bugs (like accidentally colliding with built-in properties like `"constructor"` or `"toString"`).

### `Set` — Just Membership, No Values

A Set stores **unique values only** — no key-value pairing, just "does this exist?"

```js
const seen = new Set();
seen.add(5);
seen.add(5);      // no effect, already exists
seen.add(10);
console.log(seen.has(5));   // true
console.log(seen.size);     // 2
seen.delete(5);
console.log(seen.has(5));   // false
```

Use a Set whenever you only care about **existence**, not counting or associated data.

---

## Part 5: The Core Pattern — Trading Space for Time

This is the single most important mental model for hash maps in interviews:

> **"Can I remember something I've already seen, to avoid checking again?"**

Every hash map problem is really asking: *what if I traded O(n) extra space to turn an O(n²) or O(n log n) solution into O(n)?*

### Classic Example: Two Sum

**Problem:** Given an array and a target, find two numbers that add up to target. Return their indices.

`[2, 7, 11, 15]`, target = `9` → `[0, 1]` (2 + 7 = 9)

**Brute Force — O(n²)**

```js
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}
```

**Optimal — O(n) with Hash Map**

```js
function twoSum(nums, target) {
  const seen = new Map();  // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}
```

**Dry run with `[2, 7, 11, 15]`, target = 9:**

```
seen = {}

i=0: nums[0]=2. complement = 9-2 = 7. seen.has(7)? No.
     seen = {2: 0}

i=1: nums[1]=7. complement = 9-7 = 2. seen.has(2)? YES → return [0, 1] ✓
```

**Why this works:** Instead of checking every pair (O(n²)), you ask "have I already seen the number that completes this pair?" — and thanks to hashing, that check is O(1). One pass, O(n) total.

**The key insight — this generalizes to almost all hash map problems:**
```
"Have I seen X before?"  →  hash map/set lookup instead of re-scanning
```

---

## Part 6: More Patterns Using This Mental Model

### Pattern: Group Anagrams

**Problem:** Group strings that are anagrams of each other.

`["eat", "tea", "tan", "ate", "nat", "bat"]` → `[["eat","tea","ate"], ["tan","nat"], ["bat"]]`

```js
function groupAnagrams(strs) {
  const groups = new Map();

  for (const str of strs) {
    const key = str.split("").sort().join("");  // canonical form

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(str);
  }

  return Array.from(groups.values());
}
```

**The insight:** Anagrams share the same sorted form. `"eat"` and `"tea"` both sort to `"aet"`. Use that sorted string as a hash map key to group them.

```
"eat" → sorted "aet" → groups["aet"] = ["eat"]
"tea" → sorted "aet" → groups["aet"] = ["eat", "tea"]
"tan" → sorted "ant" → groups["ant"] = ["tan"]
"ate" → sorted "aet" → groups["aet"] = ["eat", "tea", "ate"]
...
```

Time: O(n × k log k) where n = number of strings, k = max string length. Space: O(n × k).

### Pattern: First Unique Character (revisited from Day 3, generalized)

A hash map generalizes the 26-array approach beyond just lowercase letters:

```js
function firstUniqChar(str) {
  const freq = new Map();

  for (const ch of str) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }

  for (let i = 0; i < str.length; i++) {
    if (freq.get(str[i]) === 1) return i;
  }
  return -1;
}
```

### Pattern: Detect Duplicates (Using a Set)

```js
function hasDuplicate(arr) {
  const seen = new Set();
  for (const num of arr) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}
```

O(n) time, O(n) space — versus the brute force nested-loop check at O(n²).

---

## Part 7: Pattern Recognition

```
SIGNAL IN PROBLEM                    →  APPROACH
──────────────────────────────────────────────────────────
"find pair that sums to X"           →  Hash map (complement lookup)
"contains duplicate"                 →  Hash set
"group by some property"             →  Hash map with computed key
"count frequency"                    →  Hash map (or 26-array if bounded)
"have I seen this before"            →  Hash set
"first/only unique element"          →  Hash map, two passes
"can I avoid nested loop by          →  Ask: "what am I checking repeatedly?"
 remembering something?"                → that's your hash map key
```

---

## Part 8: Common Mistakes & Interview Traps

1. **Checking existence AFTER inserting** — in Two Sum, if you insert `nums[i]` before checking, you might match an element with itself (e.g., target = 2 × nums[i]).
2. **Using objects with numeric-looking keys carelessly** — `obj[5]` and `obj["5"]` are the same key. Usually fine, but be aware.
3. **Forgetting Set only stores values, not counts** — if you need frequency, you need a Map/Object, not a Set.
4. **Assuming O(1) always** — for interviews, say "average case O(1), assuming good hash distribution" — shows depth.
5. **Sorting as a hash key without considering cost** — `str.split("").sort().join("")` is O(k log k) per string; fine for most problems, but know the cost.

---

## Day 4 Recap

1. **Hashing internals** — hash function converts key to array index; O(1) average lookup because you calculate an address instead of searching
2. **Hash computation has its own cost** — O(k) where k = key size; treated as constant for short keys, but mention it in interviews
3. **Collisions** — inevitable; separate chaining handles them with short lists at each index
4. **Map vs Set vs Object** — Map for key-value, Set for existence only, Object for simple cases
5. **The core mental model** — trade O(n) space for O(1) lookups to turn O(n²) into O(n)
6. **Two Sum** — complement lookup pattern; check BEFORE inserting to avoid matching element with itself
7. **Group Anagrams** — use sorted string as canonical key
8. **Longest Consecutive Sequence** — looks like O(n²) but is O(n): only start counting from sequence starts; every number visited at most once by the inner while loop

---

---

# Practice Problems & Answers

## Conceptual Check

### Q1: Why does a hash map give O(1) average lookup but O(n) worst case? What causes the worst case?

**My answer:**
> If the hashing algorithm is not good, then hash keys may collide for different values, which stores values in an array at that index. In the worst case all values' hash keys may collide and are stored in an array, which has O(n) complexity for searching.

**Result: ✅ Correct.** That's exactly the worst case — all keys collide into one chain, degrading to O(n) because you must walk the entire chain to find your value.

---

### Q2: In Two Sum, why do we check `seen.has(complement)` BEFORE adding `nums[i]` to the map?

**My answer:**
> Because if we check after, then the same value can be counted as the complement.

**Result: ✅ Correct.**

For example, `nums = [3, 3]`, target = `6` — if you inserted first, `3`'s complement (`3`) would find itself in the map at the same index, giving a wrong/duplicate-index match. Checking before insertion prevents matching an element with itself.

---

## Beginner

### P1: Detect any duplicates using a Set

```js
function isRepeated(arr) {
    const seen = new Set();

    for (const num of arr) {
        if (seen.has(num)) return true;
        seen.add(num);
    }
    return false;
}

console.log(isRepeated([1, 2, 1]));  // true
```

**Result: ✅ Correct.**

---

## Intermediate

### P2: Intersection of two arrays (unique common elements)

```js
function giveUnqCommon(arr1, arr2) {
    const arr1Set = new Set();
    const uniqueCommonEl = [];

    arr1.map(el => arr1Set.add(el));

    arr2.forEach(el => {
        if (arr1Set.has(el)) {
            uniqueCommonEl.push(el);
            arr1Set.delete(el);   // prevents duplicate matches
        }
    });

    return uniqueCommonEl;
}

console.log(giveUnqCommon([1,2,2,1], [2,2]));  // [2]
```

**Result: ✅ Correct.** Good use of `delete` to prevent duplicate matches in the output.

---

## Advanced

### P3: Longest Consecutive Sequence

**My initial attempt:**

```js
function longestConsSeq(numbers) {
    let longestSeq = [];
    let tempSeq = [];
    const seen = new Set();

    for (const num of numbers) {
        seen.add(num);
    }

    for (let i = 0; i < numbers.length; i++) {
        if (!seen.has(numbers[i] - 1)) {
            tempSeq = [numbers[i]];
        } else {
            tempSeq.push(numbers[i]);
        }
        if (longestSeq.length < tempSeq.length) {
            longestSeq = [...tempSeq];
        }
    }
    return longestSeq;
}

console.log(longestConsSeq([100, 4, 200, 1, 3, 2]));
```

**Result: ❌ Bug — doesn't build a consecutive chain.**

Trace with `[100, 4, 200, 1, 3, 2]`:

```
i=0: 100. seen.has(99)? No → tempSeq=[100]
i=1: 4.   seen.has(3)?  Yes → tempSeq=[100, 4]   ← WRONG! 100 and 4 aren't consecutive!
i=2: 200. seen.has(199)? No → tempSeq=[200]
i=3: 1.   seen.has(0)?  No → tempSeq=[1]
i=4: 3.   seen.has(2)?  Yes → tempSeq=[1, 3]     ← WRONG! 1 and 3 aren't consecutive!
i=5: 2.   seen.has(1)?  Yes → tempSeq=[1, 3, 2]

Result: length 3 — actual answer is 4 (1,2,3,4)
```

The bug: you check `seen.has(numbers[i] - 1)` to decide whether to extend, but then push `numbers[i]` onto `tempSeq` regardless of whether it's actually the next consecutive number after the last element in `tempSeq`. You're building `tempSeq` in array iteration order, not consecutive value order.

**The real algorithm — two separate ideas:**
1. Find sequence starts: a number `n` is a start only if `n-1` is NOT in the set.
2. From each start, count forward: keep checking `n+1`, `n+2`, `n+3`... as long as they exist in the set.

**Correct version:**

```js
function longestConsSeq(numbers) {
    const seen = new Set(numbers);
    let longestLength = 0;

    for (const num of seen) {
        // Only start counting if this is the START of a sequence
        if (!seen.has(num - 1)) {
            let currentNum = num;
            let currentLength = 1;

            // Keep extending forward while the next number exists
            while (seen.has(currentNum + 1)) {
                currentNum++;
                currentLength++;
            }

            longestLength = Math.max(longestLength, currentLength);
        }
    }

    return longestLength;
}

console.log(longestConsSeq([100, 4, 200, 1, 3, 2]));  // 4
```

**Dry run:**

```
seen = {100, 4, 200, 1, 3, 2}

num=100: seen.has(99)?  No → start! count: 100→101? No. length=1
num=4:   seen.has(3)?   Yes → not a start, skip
num=200: seen.has(199)? No → start! count: 200→201? No. length=1
num=1:   seen.has(0)?   No → start! count:
           1→2 (✓) →3 (✓) →4 (✓) →5? (✗ stop). length=4
num=3:   seen.has(2)?   Yes → not a start, skip
num=2:   seen.has(1)?   Yes → not a start, skip

longestLength = max(1, 1, 4) = 4 ✓
```

**Why this is O(n) and not O(n²):** It looks like nested loops, but the `while` only runs for sequence starts. Every number gets visited by the inner while loop at most once total across the entire function — because once a number is "consumed" as part of a chain extending forward, it will fail the `!seen.has(num-1)` check when the outer loop reaches it directly. Total work across all iterations is O(n).

This "looks like nested loops but isn't" pattern is something interviewers probe on — always ask yourself: "does the inner loop repeat work, or does it only run under a condition that bounds total work?"

---

## Mini Project — `hashToolkit`

```js
function hasDuplicates(arr) {
    const elSet = new Set();
    for (const el of arr) {
        if (elSet.has(el)) return true;
        elSet.add(el);
    }
    return false;
}

function findInt(arr1, arr2) {
    const intersection = [];
    const arr1Set = new Set();

    for (const el of arr1) {
        arr1Set.add(el);
    }

    for (const el of arr2) {
        if (arr1Set.has(el)) intersection.push(el);
        arr1Set.delete(el);
    }

    return intersection;
}

function groupAnags(arr) {
    const group = new Map();

    for (const str of arr) {                              // O(n)
        const key = str.split('').sort().join('');        // O(k log k)
        group.set(key, [...(group.get(key) || []), str]);
    }

    return Array.from(group.values());
}

function longestSeq(arr) {
    const seen = new Set();
    let longestArr = [];
    let tempArr = [];

    for (const num of arr) {
        seen.add(num);
    }

    for (let i = 0; i < arr.length; i++) {
        if (!seen.has(arr[i] - 1)) {
            let num = arr[i];
            while (seen.has(num)) {
                tempArr.push(num);
                num++;
            }
            if (longestArr.length < tempArr.length) {
                longestArr = [...tempArr];
            }
            tempArr = [];
        }
    }
    return longestArr;
}

function hashToolkit(arr1, arr2) {
    console.log("hasDuplicates: ", hasDuplicates([...arr1, ...arr2]));
    console.log("Intersection: ", findInt(arr1, arr2));
    console.log("Longest Seq: ", longestSeq([...arr1, ...arr2]));
}

console.log("Grouped Anagrams ", groupAnags(["eat","tea","tan","ate","nat","bat"]));
hashToolkit([100, 4, 200, 1, 3, 2, 2], [2, 3, 100, 50]);
```

**Result: ✅ All four functions correct.**

`hasDuplicates`, `findInt`, `groupAnags` — clean, correct, matches earlier work. `longestSeq` — properly separates "is this a start" from "count forward," and correctly bounds total work to O(n).

**One precision note:** The spec asked for duplicates/longest-sequence on `arr1` alone, but you passed `[...arr1, ...arr2]` (merged) into both. The code is still correct on the merged data — but in an interview, always re-read the ask carefully. Passing a merged array when the spec says "check `arr1`" is a scope deviation that could cost you even if the code itself is bug-free. Build the habit of matching the exact spec.

---

## Revision Questions & Answers

### R1: Explain in your own words how a hash function turns a key into an array index.

**My answer:**
> When the hash value of multiple inputs resolves to the exact same value, to store multiple values at one hash key it needs to store those values in an array at that key, so accessing any value from that costs O(n).

**Result: ✅ Correct.** (This answer describes collision handling and its worst-case cost — correct explanation of the chaining mechanism.)

---

### R2: What's the difference between a hash map and a hash set? When would you use each?

**My answer:**
> Both keep unique keys, but a hash map keeps some value mapped to each key, while a set only tells us whether it includes any particular key. A hash map can be used where we can eliminate a loop by memorizing how many times a value has been seen or any other value related to it. A set can be used where we just need to check if an item exists or not.

**Result: ✅ Correct.** Solid distinction. Cleaner one-line version for interviews: "Set = existence only, Map = existence + associated value."

---

### R3: Why is "trading space for time" the core idea behind almost every hash map problem?

**My answer:**
> Because it eliminates time complexity of looping but it needs space to store values.

**Result: ✅ Correct.** You're paying O(n) space to buy O(1) time per lookup — turning an O(n) or O(n²) time brute force into O(n) time with extra space.

---

## Corrections Summary

1. **P3 — `longestConsSeq` builds in iteration order, not value order** — `tempSeq.push(numbers[i])` when `seen.has(numbers[i]-1)` is wrong because the previous element in `tempSeq` may not be `numbers[i]-1`. Must use the two-step algorithm: identify starts, then count forward with a while loop.
2. **Mini project scope deviation** — passed `[...arr1, ...arr2]` when the spec said `arr1` only. Always match the exact spec in an interview even when the code works.
3. **Hashing has its own cost** — O(k) where k = key size. For short/simple keys this is treated as O(1), but mention it explicitly in interviews for extra depth.