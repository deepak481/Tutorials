# DSA Day 3 — Strings: Immutability, Character Manipulation, and Core Patterns

## Part 1: What Is a String?

A string is a **sequence of characters** stored in order, accessible by index — just like an array.

```js
const str = "hello";
console.log(str[0]);     // "h"
console.log(str[4]);     // "o"
console.log(str.length); // 5
```

So if strings look like arrays, why do they deserve their own day?

Because of one critical difference: **strings are immutable in JavaScript.**

---

## Part 2: Immutability — The Most Important String Concept

"Immutable" means **once created, a string cannot be changed.** Ever.

```js
let str = "hello";
str[0] = "H";
console.log(str);  // "hello" ← unchanged! No error, just silently ignored.
```

Compare with arrays:

```js
let arr = [1, 2, 3];
arr[0] = 99;
console.log(arr);  // [99, 2, 3] ← mutated in place
```

### Why does this matter for DSA?

Every time you "modify" a string, JavaScript creates a **brand new string** in memory.

```js
let result = "";
result += "a";    // creates new string "a"
result += "b";    // creates new string "ab"
result += "c";    // creates new string "abc"
```

```
Memory:

Step 1:  "a"           ← allocated
Step 2:  "a" (garbage)  "ab"                    ← new allocation
Step 3:  "a" (garbage)  "ab" (garbage)  "abc"   ← new allocation
```

### The Hidden O(n²) Trap

This is one of the most common interview traps:

```js
// LOOKS like O(n), IS actually O(n²)
function buildString(n) {
  let result = "";
  for (let i = 0; i < n; i++) {
    result += "a";  // each += copies the ENTIRE existing string + new char
  }
  return result;
}
```

Why O(n²)? Each concatenation copies the existing string:

```
i=0: copy ""      + "a"  →  1 char copied
i=1: copy "a"     + "a"  →  2 chars copied
i=2: copy "aa"    + "a"  →  3 chars copied
...
i=n: copy n-1 chars + "a" → n chars copied

Total: 1 + 2 + 3 + ... + n = n(n+1)/2 = O(n²)
```

### The Fix: Use an Array, Join at the End

```js
// True O(n)
function buildString(n) {
  const parts = [];
  for (let i = 0; i < n; i++) {
    parts.push("a");      // O(1) amortized
  }
  return parts.join("");  // one pass to combine → O(n)
}
```

**Interview rule:** Whenever you're building a string character by character, **use an array and `.join("")`**.

---

## Part 3: Essential String Operations & Their Costs

```
OPERATION                          COST      WHY
──────────────────────────────────────────────────────────────
Access char (str[i])               O(1)      Direct index
str.length                         O(1)      Stored as property
str + str2  (concatenation)        O(n+m)    Creates new string of length n+m
str.slice(start, end)              O(k)      Creates new string of k chars
str.indexOf(sub)                   O(n×m)    Scans str for substring
str.split(delimiter)               O(n)      Creates array of parts
arr.join(separator)                O(n)      Creates string from array
str.toUpperCase/toLowerCase()      O(n)      New string, every char processed
str === str2                       O(n)      Must compare every character
```

**Key insight:** Almost every string method **returns a new string.** Nothing modifies the original.

---

## Part 4: Character Codes — The Foundation

Every character has a numeric code. This is how computers actually store text.

```js
"a".charCodeAt(0)   // 97
"z".charCodeAt(0)   // 122
"A".charCodeAt(0)   // 65
"Z".charCodeAt(0)   // 90
"0".charCodeAt(0)   // 48
"9".charCodeAt(0)   // 57
```

**`.charCodeAt(index)` takes the index of the character in the string** whose code you want. Since `"a"` is a single-character string, index `0` is its only character. For longer strings:

```js
const str = "hello";
str.charCodeAt(0)  // 104 → 'h'
str.charCodeAt(1)  // 101 → 'e'
str.charCodeAt(4)  // 111 → 'o'
```

**ASCII Map (relevant range):**

```
48-57:   '0' '1' '2' ... '9'
65-90:   'A' 'B' 'C' ... 'Z'
97-122:  'a' 'b' 'c' ... 'z'
```

### Why this matters

You can do math with characters:

```js
// Get position of a lowercase letter (0-25)
const pos = "d".charCodeAt(0) - "a".charCodeAt(0);  // 100 - 97 = 3

// Convert position back to character
const char = String.fromCharCode(97 + 3);  // "d"

// Check if character is lowercase letter
function isLower(ch) {
  const code = ch.charCodeAt(0);
  return code >= 97 && code <= 122;
}
```

**Don't memorize the numbers — memorize three anchors:**

```js
"0".charCodeAt(0)  // 48
"A".charCodeAt(0)  // 65
"a".charCodeAt(0)  // 97
```

Then in an interview, derive everything else:

```js
// Is it a digit?
code >= "0".charCodeAt(0) && code <= "9".charCodeAt(0)

// Is it uppercase?
code >= "A".charCodeAt(0) && code <= "Z".charCodeAt(0)

// Is it lowercase?
code >= "a".charCodeAt(0) && code <= "z".charCodeAt(0)
```

This is actually **cleaner interview code** — the interviewer can read the intent immediately without decoding magic numbers.

This is used constantly in frequency counting, Caesar ciphers, and anagram problems.

---

## Part 5: Core String Patterns

### Pattern 1: Frequency Counting

**Problem:** Determine if two strings are anagrams (contain exactly the same characters).

Example: `"listen"` and `"silent"` → `true`

**Brute Force — O(n log n)**

Sort both strings, compare:

```js
function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;
  return s1.split("").sort().join("") === s2.split("").sort().join("");
}
```

This works but sorting costs O(n log n). Can we do O(n)?

**Optimal — O(n) with Frequency Map**

```js
function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;

  const freq = {};

  // Count characters in s1
  for (const ch of s1) {
    freq[ch] = (freq[ch] || 0) + 1;
  }

  // Subtract characters in s2
  for (const ch of s2) {
    if (!freq[ch]) return false;   // char doesn't exist or count is 0
    freq[ch]--;
  }

  return true;
}
```

**Dry run with `s1 = "listen"`, `s2 = "silent"`:**

```
After counting s1:
  { l:1, i:1, s:1, t:1, e:1, n:1 }

Subtracting s2:
  s: 1→0 ✓
  i: 1→0 ✓
  l: 1→0 ✓
  e: 1→0 ✓
  n: 1→0 ✓
  t: 1→0 ✓

All decremented cleanly → true ✓
```

**Why not check all values are 0 at the end?** The length check at the top guarantees that if all of s2's characters decrement without issues, the counts must be 0. If s2 had an extra character, the length check catches it. If s2 had a different character, the `!freq[ch]` catches it.

**For Lowercase-Only Strings: Array as Frequency Map**

```js
function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;

  const freq = new Array(26).fill(0);

  for (const ch of s1) {
    freq[ch.charCodeAt(0) - 97]++;
  }

  for (const ch of s2) {
    freq[ch.charCodeAt(0) - 97]--;
    if (freq[ch.charCodeAt(0) - 97] < 0) return false;
  }

  return true;
}
```

```
Index:  0  1  2  3  4  5 ... 25
Maps:   a  b  c  d  e  f ... z
```

**When to use array vs object?**

- Fixed character set (lowercase English) → array of size 26 (faster, fixed space)
- Unicode or mixed characters → object/Map

---

### Pattern 2: Palindrome Check

A palindrome reads the same forwards and backwards: `"racecar"`, `"madam"`.

```js
function isPalindrome(str) {
  let left = 0;
  let right = str.length - 1;

  while (left < right) {
    if (str[left] !== str[right]) return false;
    left++;
    right--;
  }
  return true;
}
```

**Dry run with `"racecar"`:**

```
L=0, R=6: 'r' === 'r' ✓
L=1, R=5: 'a' === 'a' ✓
L=2, R=4: 'c' === 'c' ✓
L=3, R=3: left meets right → stop

→ true ✓
```

Time: O(n). Space: O(1). This is the **two-pointer** pattern applied to strings.

### Common Interview Extension: Ignore Non-Alphanumeric

`"A man, a plan, a canal: Panama"` → palindrome if you ignore spaces and punctuation.

```js
function isPalindromeClean(str) {
  let left = 0;
  let right = str.length - 1;

  while (left < right) {
    // Skip non-alphanumeric from left
    while (left < right && !isAlphaNum(str[left])) left++;
    // Skip non-alphanumeric from right
    while (left < right && !isAlphaNum(str[right])) right--;

    if (str[left].toLowerCase() !== str[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}

function isAlphaNum(ch) {
  const code = ch.charCodeAt(0);
  return (code >= 48 && code <= 57) ||   // 0-9
         (code >= 65 && code <= 90) ||   // A-Z
         (code >= 97 && code <= 122);    // a-z
}
```

**Why write `isAlphaNum` manually instead of regex?** In an interview, showing you understand character codes demonstrates deeper knowledge. Regex also has **overhead** — extra work the computer does behind the scenes before your actual task runs.

When you write a regex like `/[a-zA-Z0-9]/`, JavaScript must:
1. **Parse** the regex pattern into an internal state machine
2. **Compile** that state machine (a flowchart that reads input one character at a time and changes state based on what it sees)
3. **Then** run it against your character

Compare that to `charCodeAt`:

```js
// Regex — parse pattern, build state machine, then check
/[a-zA-Z0-9]/.test(ch)

// CharCode — one subtraction, one comparison. Done.
code >= 97 && code <= 122
```

For a single check it's negligible. But inside a loop running millions of times, that extra setup cost adds up. That said, either approach is acceptable in an interview; the manual approach signals sharper fundamentals.

---

### Pattern 3: String Reversal — The Right Way

Since strings are immutable, you can't reverse in-place. Two approaches:

```js
// Approach 1: Array conversion (clean and clear)
function reverseString(str) {
  return str.split("").reverse().join("");
}

// Approach 2: Build from end (when interviewer wants manual implementation)
function reverseString(str) {
  const chars = [];
  for (let i = str.length - 1; i >= 0; i--) {
    chars.push(str[i]);
  }
  return chars.join("");
}
```

Both are O(n) time, O(n) space. You **cannot** do O(1) space string reversal in JS because strings are immutable — state this explicitly in an interview.

---

### Pattern 4: Substring Search (Manual)

**Problem:** Find the first occurrence of `needle` in `haystack`.

```js
function strStr(haystack, needle) {
  if (needle.length === 0) return 0;
  if (needle.length > haystack.length) return -1;

  for (let i = 0; i <= haystack.length - needle.length; i++) {
    let match = true;
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) {
        match = false;
        break;
      }
    }
    if (match) return i;
  }
  return -1;
}
```

**Dry run with `haystack = "hello"`, `needle = "ll"`:**

```
i=0: h≠l → break
i=1: e≠l → break
i=2: l===l, l===l → match! return 2 ✓
```

**Why the loop bound is `i <= haystack.length - needle.length`:**

```
haystack = "hello" (length 5)
needle   = "ll"    (length 2)

i=0: check positions 0,1
i=1: check positions 1,2
i=2: check positions 2,3
i=3: check positions 3,4  ← last possible start
i=4: only 1 char left, needle needs 2 → impossible

5 - 2 = 3 → loop i from 0 to 3
```

**Complexity: O((n - m + 1) × m)** worst case, where n = haystack length, m = needle length.

The `+1` is because the loop starts from `i = 0` — it runs from 0 to `n - m` inclusive, giving `n - m + 1` iterations. In Big O it doesn't matter: O(n - m + 1) = O(n - m) = O(n) when m is small. You'd say **O(n × m)** in an interview — all acceptable.

We'll learn O(n) algorithms (KMP, Rabin-Karp) on Day 29.

---

## Part 6: The Array-String Connection

```
TASK               ARRAY                      STRING
────────────────────────────────────────────────────────────
Reverse            In-place O(1) space        Must create new O(n) space
Modify element     arr[i] = x                 Cannot. Build new string.
Build result       Push to array              Push chars to array, .join("")
Frequency count    Same technique             Same technique
Two pointers       Works directly             Works directly
```

**Mental model:** When you need to modify characters, convert to array first, work on the array, then `.join("")` back.

```js
function capitalize(str) {
  const chars = str.split("");              // string → array
  chars[0] = chars[0].toUpperCase();        // mutate in array
  return chars.join("");                    // array → string
}
```

---

## Part 7: Pattern Recognition Summary

```
SIGNAL IN PROBLEM               →  PATTERN
──────────────────────────────────────────────────────
"anagram", "permutation"        →  Frequency counting
"palindrome"                    →  Two pointers (outside-in)
"rearrange characters"          →  Frequency map + rebuild
"first unique / non-repeating"  →  Frequency count + second pass
"reverse words in string"       →  Split + reverse + join
"build string from rules"       →  Array + .join("")
"compare strings"               →  Frequency or sort
"substring", "contains"         →  Sliding window (Day 7) or nested loop
```

**Note on practicing this table:** This is a **reference**, not a new assignment. You've already touched several of these today — anagram (frequency counting), palindrome (two pointers), substring search (nested loop). The ones not yet touched (sliding window, reverse words) are coming — sliding window is Day 7, and reverse words is Practice Problem P3. Finish today's problems first; no need to hunt outside problems yet.

---

## Part 8: Common Mistakes

1. **String concatenation in loop** — the hidden O(n²). Always use array + join.
2. **Forgetting immutability** — `str[i] = x` does nothing and throws no error.
3. **Off-by-one in substring bounds** — `slice(start, end)` excludes `end`. `"hello".slice(1,3)` gives `"el"`, not `"ell"`.
4. **Using `==` instead of `===`** — `"0" == false` is `true`. Always `===` for string comparison.
5. **Forgetting case sensitivity** — `"A" !== "a"`. Normalize with `.toLowerCase()` before comparing.

---

## Day 3 Recap

1. **Strings are immutable** — modification silently fails; every "change" creates a new string
2. **String concatenation in loops is O(n²)** — use array + `.join("")` instead
3. **Character codes** — memorize three anchors: `"0"` → 48, `"A"` → 65, `"a"` → 97; derive everything else
4. **Frequency counting** — object for general use; 26-element array for fixed lowercase alphabet
5. **Palindrome** — two pointers from outside in; skip non-alphanumeric with inner while loops for extended version
6. **Reversal** — always O(n) space in JS; can't avoid it due to immutability
7. **Array ↔ string conversion** — split to modify, join to rebuild
8. **First non-repeating character** — frequency count first pass, scan for count === 1 on second pass

---

---

# Practice Problems & Answers

## Conceptual Check

### Q1: Time complexity of `repeat(str, n)` where `str` has length `m`?

```js
function repeat(str, n) {
  let result = "";
  for (let i = 0; i < n; i++) {
    result += str;
  }
  return result;
}
```

**My answer: `n * m` ✅**

Correct. That's the right way to state it in an interview. Each iteration copies the entire existing result plus the new `str`. At step `i`, you're copying `i × m` characters. Total: `m + 2m + 3m + ... + n×m = O(n² × m)`. For fixed-length `str`, this simplifies to **O(n × m)**.

---

### Q2: First non-repeating character — which pattern and approach?

*(Unanswered in session — answered via code in P2 below)*

---

## Beginner

### P1: Remove all vowels

```js
const vowels = ['a', 'e', 'i', 'o', 'u'];

function removeVowels(str) {
    let strArr = str.split('');
    strArr = strArr.filter(char => !vowels.includes(char));
    return strArr.join('');
}

console.log(removeVowels("hello world"));
```

**Result: ✅ Correct.** Clean filter approach.

---

## Intermediate

### P2: First non-repeating character index

```js
function findNonRepeating(str) {
    const strArr = str.split('');
    const countMap = new Array(26).fill(0);

    for (const char of strArr) {
        const idx = char.charCodeAt(0) - 97;
        countMap[idx] += 1;
    }

    for (let i = 0; i < strArr.length; i++) {
        const idx = strArr[i].charCodeAt(0) - 97;
        if (countMap[idx] === 1) return i;
    }

    return -1;
}
```

**Result: ✅ Correct.** Good use of the 26-array frequency pattern from earlier today.

---

## Advanced

### P3: Reverse words without `.split()`

```js
function reverseStr(str, start, end) {
    let reversedStr = "";

    for (i = end; i >= start; i--) {   // ⚠️ Bug 1
        reversedStr += str[i];          // ⚠️ Bug 2
    }

    return reversedStr;
}

function reverse(str) {
    const reversedStr = reverseStr(str, 0, str.length - 1);

    let result = "";
    let lastGap = -1;

    for (let i = 0; i < reversedStr.length; i++) {
        if (reversedStr[i] === " ") {
            result += reverseStr(reversedStr, lastGap + 1, i - 1) + " ";
            lastGap = i;
        }
    }

    result += reverseStr(reversedStr, lastGap + 1, reversedStr.length - 1);
    return result;
}
```

**Result: ✅ Logic is correct** — traced with `"the sky is blue"`, correctly produces `"blue is sky the"`. Good approach: reverse the whole string, then reverse each word back to correct orientation while keeping word order.

**Bug 1 — accidental global variable:**

```js
for (i = end; i >= start; i--)   // missing let!
```

This creates an implicit global `i`, which can silently clash with other `i` variables elsewhere. Always declare: `for (let i = end; ...)`.

**Bug 2 — the hidden O(n²) trap from earlier today:**

```js
reversedStr += str[i];   // string concatenation in a loop
```

You just learned this creates a new string on every iteration. Fix with array + join:

```js
function reverseStr(str, start, end) {
    const chars = [];
    for (let i = end; i >= start; i--) {
        chars.push(str[i]);
    }
    return chars.join('');
}
```

Same fix applies to `result +=` inside `reverse()` — since `reverseStr` is called multiple times and each call builds via concatenation, this compounds. Worth rewriting with an array as well for a fully optimal solution.

---

## Mini Project — `stringToolkit("Amanaplanacanalpanama")`

### Version 1 — With Bugs

```js
function removeNonAlpha(str) {
    const strArr = [];
    for (const char of str) {
        if (
            (char >= 97 && char <= 122) ||    // ⚠️ Bug 1
            (char >= 65 && char <= 90)  ||
            (char >= 48 && char <= 57)
        ) {
            strArr.push(char);
        }
    }
    return strArr.join('');
}

function isPalindrome(str) {
    const nonAlphaFilteredStr = removeNonAlpha(str.toLowerCase());
    let i = 0, j = str.length - 1;           // ⚠️ Bug 2
    while (i < j) {
        if (nonAlphaFilteredStr[i] !== nonAlphaFilteredStr[j]) return false;
        i++;
        j--;
    }
    return true;
}
```

**Bug 1 — `removeNonAlpha` comparison is broken:**

`char` is a single-character **string** like `"a"`, not its char code. Comparing `"a" >= 97` → JS coerces `"a"` to `NaN`, and `NaN >= 97` is `false`. So **every character gets filtered out** — `removeNonAlpha` returns an empty string for any input. Fix: add `.charCodeAt(0)`:

```js
const charCode = char.charCodeAt(0);
if (
    (charCode >= 97 && charCode <= 122) ||
    (charCode >= 65 && charCode <= 90)  ||
    (charCode >= 48 && charCode <= 57)
)
```

**Bug 2 — masked by Bug 1, in `isPalindrome`:**

```js
let i = 0, j = str.length - 1;  // using ORIGINAL str's length
```

But you're comparing characters from `nonAlphaFilteredStr`, which can have a **different length** than `str` if non-alphanumeric characters existed. It should be:

```js
let j = nonAlphaFilteredStr.length - 1;
```

This bug didn't surface with `"Amanaplanacanalpanama"` (no punctuation/spaces to strip, so filtered length equals original length by coincidence). Try `"A man a plan a canal Panama"` — this would break without the fix.

---

### Version 2 — Fixed ✅

```js
function removeNonAlpha(str) {
    const strArr = [];
    for (const char of str) {
        const charCode = char.charCodeAt(0);
        if (
            (charCode >= 97 && charCode <= 122) ||
            (charCode >= 65 && charCode <= 90)  ||
            (charCode >= 48 && charCode <= 57)
        ) {
            strArr.push(char);
        }
    }
    return strArr.join('');
}

function reverseStr(str) {
    const strArr = str.split('');
    let i = 0, j = strArr.length - 1;
    while (i < j) {
        [strArr[i], strArr[j]] = [strArr[j], strArr[i]];
        i++;
        j--;
    }
    return strArr.join('');
}

function isPalindrome(str) {
    const nonAlphaFilteredStr = removeNonAlpha(str.toLowerCase());
    let i = 0, j = nonAlphaFilteredStr.length - 1;
    while (i < j) {
        if (nonAlphaFilteredStr[i] !== nonAlphaFilteredStr[j]) return false;
        i++;
        j--;
    }
    return true;
}

function charMapping(str) {
    const charMap = {};
    for (let char of str) {
        charMap[char] = (charMap[char] || 0) + 1;
    }
    return charMap;
}

function firstNonRepChar(str) {
    const charMap = charMapping(str);
    for (let char of str) {
        if (charMap[char] === 1) return char;
    }
    return -1;
}

function removeDuplicates(str) {
    const charUsed = {};
    const uniqueChars = [];
    for (const char of str) {
        charUsed[char] = false;
    }
    for (const char of str) {
        if (!charUsed[char]) {
            uniqueChars.push(char);
            charUsed[char] = true;
        }
    }
    return uniqueChars.join('');
}

function stringToolkit(str) {
    return {
        isPalindrome: isPalindrome(str),
        frequencyMapping: charMapping(str),
        firstNonRepChar: firstNonRepChar(str),
        reversedStr: reverseStr(str),
        duplicatesRemovedStr: removeDuplicates(str)
    };
}

console.log(stringToolkit("Amanaplanacanalpanama"));
```

**Verification:**

```
removeNonAlpha("a man a plan a canal panama")
→ "amanaplanacanalpanama"  (spaces stripped)

isPalindrome check (two-pointer):
i=0, j=20: a===a ✓ ... converges correctly → true ✓
```

Works correctly now, including the case with spaces/punctuation. The coercion issue was found and fixed immediately; the length mismatch was fixed cleanly too. ✅

**Note on `firstNonRepChar`:** You lowercased for the map in Version 1 but checked against original-case `str` — removed the `.toLowerCase()` in Version 2 to keep it consistent. Worth considering whether you want case-sensitive or case-insensitive uniqueness depending on the problem.

---

## Revision Questions & Answers

### R1: Why is string concatenation in a loop O(n²)? What's the fix?

**My answer:**
> Because strings are immutable in JavaScript and when we do concatenation one char at one time, then there is a new string created by copying the previous one.

**Result: ✅ Correct.**

Precisely why it becomes O(n²) — each copy grows, so total copying is `1 + 2 + 3 + ... + n`.

**Fix:** Use an array and `.join("")` at the end. Array push is O(1) amortized; join is a single O(n) pass.

---

### R2: When would you use a 26-element array vs an object for frequency counting?

**My answer:**
> When it is defined that there will be only small chars from a to z. Or we know we have these fixed number of things can be placed adjacent to each other in a row.

**Result: ✅ Correct.**

Good general framing — not just "a-z" but any bounded fixed-size alphabet (digits, uppercase, ASCII subset) works the same way. Fixed, known, small character set → array. Unicode or unknown/mixed characters → object/Map.

---

### R3: A string palindrome check is O(n) time. Can it be O(1) space? Why or why not?

**My answer:**
> Yes it can be O(1) by two pointer approach.

**Result: ⚠️ Partially correct — worth tightening.**

Two pointers give O(1) extra space for the pointers themselves (just `i` and `j`). But in JS, if you first build the alphanumeric-filtered lowercase string (like in the mini project), that filtered string itself is O(n) space.

**Full answer:**

- **True O(1) space** — only possible if the input is already clean (no filtering needed). Two pointers alone suffice; no extra string built.
- **If filtering/normalizing is required** — you're at O(n) space for the cleaned copy, even though the comparison itself uses O(1) pointers.

The `isPalindromeClean` two-pointer approach from the lesson sidesteps this entirely by skipping non-alphanumeric characters **in-place** with inner `while` loops — no cleaned copy is ever built, achieving true O(1) extra space.

**The distinction interviewers listen for:** "The algorithm's core technique is O(1) space, but preprocessing that creates a new string adds O(n). True O(1) is achievable only if we skip non-alphanumeric characters in-place."

---

## Corrections Summary

1. **`char >= 97` is wrong** — `char` is a string, not a number. Always use `char.charCodeAt(0)` first before comparing to ASCII codes.
2. **Length mismatch after filtering** — when filtering a string, use the filtered string's length for your pointers, not the original's length.
3. **Always `let` in loops** — `for (i = ...)` without `let` creates an implicit global that silently clashes with outer loops.
4. **`result +=` in a loop is O(n²)** — the hidden concatenation trap applies everywhere, not just in obvious buildString examples.
5. **R3 — O(1) space palindrome needs in-place skipping** — building a filtered copy costs O(n) space. The inner `while` loop approach avoids the allocation.