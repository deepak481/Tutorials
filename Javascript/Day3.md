# JS Day 3 — Control Flow: Conditionals & Loops

Until now, your code runs top-to-bottom, every line, every time. Today you learn to make code **decide** and **repeat** — the two things that make programs intelligent.

---

## Part 1: `if` / `else if` / `else`

**Problem it solves:** You need your code to do different things based on different conditions. "If the user is logged in, show the dashboard. Otherwise, show the login page."

```js
const age = 20;

if (age >= 18) {
    console.log("Adult");
} else {
    console.log("Minor");
}
// Output: "Adult"
```

**What happens internally, line by line:**
```
1. age >= 18  →  20 >= 18  →  true
2. The condition is truthy  →  enter the if block
3. console.log("Adult") runs
4. else block is SKIPPED entirely — engine never even looks at it
```

### Multiple conditions with `else if`

```js
const score = 75;

if (score >= 90) {
    console.log("A");
} else if (score >= 80) {
    console.log("B");
} else if (score >= 70) {
    console.log("C");
} else {
    console.log("F");
}
// Output: "C"
```

**Critical rule:** The engine checks conditions top to bottom and **stops at the first match**. It does NOT check the rest.

```
score >= 90  →  75 >= 90  →  false  → skip
score >= 80  →  75 >= 80  →  false  → skip
score >= 70  →  75 >= 70  →  true   → ENTER, print "C"
else         →  NEVER REACHED
```

**What if conditions are in the wrong order?**

```js
const score = 95;

if (score >= 70) {
    console.log("C");   // ← prints this!
} else if (score >= 90) {
    console.log("A");   // ← never reached
}
```

Even though `95 >= 90`, the engine hits `score >= 70` first — it's true, so it enters and stops. Order matters.

---

## Part 2: Ternary Operator

The ternary is a shortcut for simple `if/else`:

```js
// if/else version
let access;
if (age >= 18) {
    access = "granted";
} else {
    access = "denied";
}

// Ternary version — same thing, one line
const access = age >= 18 ? "granted" : "denied";
// condition ? valueIfTrue : valueIfFalse
```

**Rule:** Use ternary for simple value assignments. If you need multiple statements or nesting, use `if/else`.

```js
// ❌ Bad — nested ternaries are unreadable
const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F";

// ✅ Good — use if/else for complex logic
```

---

## Part 3: `switch` Statement

**Problem it solves:** When you're comparing ONE value against MANY exact matches, `if/else if` chains get ugly.

```js
const day = "Monday";

switch (day) {
    case "Monday":
        console.log("Start of work week");
        break;
    case "Saturday":
    case "Sunday":
        console.log("Weekend!");
        break;
    default:
        console.log("Midweek");
        break;
}
// Output: "Start of work week"
```

### The `break` Trap — Interview Classic

What happens WITHOUT `break`? The code **falls through** to the next case:

```js
const fruit = "apple";

switch (fruit) {
    case "apple":
        console.log("Apple");     // prints
    case "banana":
        console.log("Banana");    // ALSO prints! No break above.
    case "cherry":
        console.log("Cherry");    // ALSO prints!
        break;
    default:
        console.log("Unknown");
}
// Output: "Apple", "Banana", "Cherry"
```

```
case "apple"  → MATCH → run code → no break → FALL ↓
case "banana" → skip match check → run code → no break → FALL ↓
case "cherry" → skip match check → run code → break → STOP
```

Fall-through IS intentional sometimes — like grouping `Saturday` and `Sunday` together. But forgetting `break` is one of the most common bugs.

### `switch` uses `===` (strict comparison)

```js
const x = "1";

switch (x) {
    case 1:
        console.log("number");   // skipped — "1" !== 1
        break;
    case "1":
        console.log("string");   // matches
        break;
}
// Output: "string"
```

No coercion. `switch` compares with `===`, so `"1"` and `1` are different cases.

---

## Part 4: Loops — Making Code Repeat

### `for` Loop — When you know HOW MANY times

```js
for (let i = 0; i < 5; i++) {
    console.log(i);
}
// Output: 0, 1, 2, 3, 4
```

Three parts: `for (initialization; condition; update)`

```
let i = 0   →  runs ONCE before the loop starts
i < 5       →  checked BEFORE each iteration
i++         →  runs AFTER each iteration
```

**Step-by-step execution:**
```
i = 0  →  0 < 5? yes  →  log 0  →  i++ → i = 1
i = 1  →  1 < 5? yes  →  log 1  →  i++ → i = 2
i = 2  →  2 < 5? yes  →  log 2  →  i++ → i = 3
i = 3  →  3 < 5? yes  →  log 3  →  i++ → i = 4
i = 4  →  4 < 5? yes  →  log 4  →  i++ → i = 5
i = 5  →  5 < 5? NO   →  EXIT LOOP
```

**Why start at 0?** Arrays are zero-indexed in JS. Starting at 0 means `i` can directly be used as an array index.

### `while` Loop — When you DON'T know how many times

```js
let count = 1;

while (count <= 5) {
    console.log(count);
    count++;
}
// Output: 1, 2, 3, 4, 5
```

**Analogy:** `for` is like "do this 10 times." `while` is like "keep doing this until I say stop."

### `do...while` — Runs at LEAST once

```js
let num = 10;

do {
    console.log(num);  // prints 10, even though condition is false
} while (num < 5);
// Output: 10
```

The body runs FIRST, then the condition is checked. Useful for things like "ask the user for input, then check if it's valid."

---

## Part 5: `for...of` vs `for...in` — Interview Favorite

These two look similar but do completely different things.

### `for...of` — Iterates over VALUES (use for arrays, strings)

```js
const colors = ["red", "green", "blue"];

for (const color of colors) {
    console.log(color);
}
// "red", "green", "blue"
```

Works with anything iterable: arrays, strings, Maps, Sets.

```js
const name = "Deepak";

for (const char of name) {
    console.log(char);
}
// "D", "e", "e", "p", "a", "k"
```

### `for...in` — Iterates over KEYS (use for objects)

```js
const user = { name: "Deepak", age: 25, city: "Bhiwani" };

for (const key in user) {
    console.log(key, "→", user[key]);
}
// "name → Deepak"
// "age → 25"
// "city → Bhiwani"
```

### The Trap: Using `for...in` on Arrays

```js
const arr = ["a", "b", "c"];

for (const index in arr) {
    console.log(typeof index);  // "string"!!! Not number!
}
// "0", "1", "2" — these are STRING keys, not numbers
```

```
┌─────────────────────────────────────────┐
│         for...of vs for...in            │
│                                         │
│  const arr = ["a", "b", "c"]            │
│                                         │
│  for...of  →  "a"  "b"  "c"  (values)  │
│  for...in  →  "0"  "1"  "2"  (keys)    │
│                                         │
│  const obj = {x: 1, y: 2}              │
│                                         │
│  for...of  →  ❌ ERROR! Not iterable   │
│  for...in  →  "x"  "y"  (keys)         │
└─────────────────────────────────────────┘

for...of  →  gives you VALUES  →  use for arrays, strings
for...in  →  gives you KEYS    →  use for objects, NEVER arrays
```

**Can you use `for...of` on a plain object like `{a: 1, b: 2}`?**

No — you get a `TypeError: obj is not iterable`. Plain objects don't implement the iterator protocol. Use `for...in`, or `Object.keys(obj)` / `Object.entries(obj)` with `for...of`.

---

## Part 6: `break` and `continue`

### `break` — Exit the loop entirely

```js
for (let i = 0; i < 10; i++) {
    if (i === 5) break;
    console.log(i);
}
// 0, 1, 2, 3, 4 — stops at 5, doesn't print 5
```

### `continue` — Skip THIS iteration, go to next

```js
for (let i = 0; i < 6; i++) {
    if (i === 3) continue;
    console.log(i);
}
// 0, 1, 2, 4, 5 — skips 3, keeps going
```

```
break     →  "I'm done, exit the whole loop"
continue  →  "Skip this one, give me the next"
```

### Labeled Loops — Breaking out of nested loops

```js
outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) break outer;
        console.log(i, j);
    }
}
// 0 0
// 0 1
// 0 2
// 1 0
// — stops completely at i=1, j=1
```

Without `break outer`, only the inner loop would break. Labels are rare in real code but show up in interviews.

---

## Part 7: Loop Performance (MAANG Deep Dive)

```js
const arr = new Array(1000000).fill(1);

// 1. Classic for — FASTEST (engine optimizes heavily)
for (let i = 0; i < arr.length; i++) { /* ... */ }

// 2. for...of — slightly slower (iterator protocol overhead)
for (const val of arr) { /* ... */ }

// 3. forEach — slowest (function call per iteration)
arr.forEach(val => { /* ... */ });
```

In practice: the difference is negligible for most code. Use `for...of` for readability. Use classic `for` only when performance is critical (millions of items). Never optimize prematurely — V8 is very good at optimizing common patterns.

**V8 note on `arr.length`:** V8 detects that `arr.length` doesn't change inside the loop and hoists it automatically. Don't manually optimize this unless profiling shows a real problem.

### Infinite Loop Protection

```js
// ❌ Crashes your browser/Node process
while (true) {
    // no break condition = infinite loop
}

// ✅ Always ensure your condition eventually becomes false
let attempts = 0;
while (attempts < 100) {
    attempts++;
}
```

---

## Part 8: Common Mistakes

**Mistake 1: Off-by-one errors**

```js
const arr = [10, 20, 30];

// ❌ Crashes — arr[3] doesn't exist, last value is undefined
for (let i = 0; i <= arr.length; i++) {
    console.log(arr[i]);
}

// ✅ Use < not <=
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}
```

**Mistake 2: Modifying array while looping**

```js
const nums = [1, 2, 3, 4, 5];

// ❌ Unpredictable — indices shift as you remove elements
for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 === 0) {
        nums.splice(i, 1);  // removes element, shifts all indices
    }
}

// ✅ Use filter instead
const odds = nums.filter(n => n % 2 !== 0);
```

**Mistake 3: Using `var` in loops — Classic Interview Question**

```js
// ❌ var is function-scoped — all callbacks share the same i
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// Prints: 3, 3, 3 — NOT 0, 1, 2!

// ✅ let is block-scoped — creates a new i for each iteration
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// Prints: 0, 1, 2
```

We'll explain WHY this happens on Day 8 (scope) and Day 9 (closures). For now: **always use `let` in loops.**

---

## Day 3 Recap

1. **`if/else`** — order matters, first match wins
2. **Ternary** — only for simple value assignments
3. **`switch`** — uses `===`, needs `break` to prevent fall-through
4. **`for`** — know the three parts: init, condition, update
5. **`while`** — when iteration count is unknown
6. **`for...of`** — VALUES, for arrays/strings; **`for...in`** — KEYS, for objects, never arrays
7. **`break`** exits loop; **`continue`** skips iteration
8. **`var` in loops is broken with async** — always use `let`
9. **Loop performance** — classic `for` > `for...of` > `forEach`, but readability usually wins

Everything connects: today's truthy/falsy from Day 2 powers `if` conditions. Tomorrow's functions will make loops powerful with callbacks. Day 8–9 will explain WHY `var` in loops breaks.

---

---

# Practice Problems & Answers

## Quick Checks (from the lesson)

### QC1. What prints when conditions are in wrong order with `score = 95`?

```js
const score = 95;
if (score >= 70) {
    console.log("C");
} else if (score >= 90) {
    console.log("A");
}
```

**Answer: `"C"`**

Even though `95 >= 90`, the engine hits `score >= 70` first — it's true, so it enters and stops. The `else if` is never reached. Order matters with `if/else if` chains.

### QC2. Can you use `for...of` on a plain object `{a: 1, b: 2}`?

**Answer: No — `TypeError: obj is not iterable`**

Plain objects don't implement the iterator protocol. Use `for...in` for object keys, or `Object.entries(obj)` with `for...of` if you need both keys and values.

---

## Beginner

### Q1. Print all even numbers from 0 to 20.

```js
for (let i = 0; i <= 20; i++) {
    if (i % 2 === 0) console.log(i);
}
// Or more directly:
for (let i = 0; i <= 20; i += 2) {
    console.log(i);
}
```

### Q2. Count vowels in `"javascript"` using `for...of`.

```js
const str = "javascript";
const vowels = "aeiou";
let count = 0;

for (const char of str) {
    if (vowels.includes(char)) count++;
}

console.log(count);  // 3 (a, a, i)
```

---

## Intermediate

### Q3. What's the output?

```js
for (let i = 0; i < 5; i++) {
    if (i === 2) continue;
    if (i === 4) break;
    console.log(i);
}
```

**Answer: `0`, `1`, `3`**

```
i=0: no conditions hit → log 0
i=1: no conditions hit → log 1
i=2: continue → skip, don't log
i=3: no conditions hit → log 3
i=4: break → exit loop entirely
```

### Q4. Rewrite the `if/else` chain as a `switch`.

```js
const status = "loading";

switch (status) {
    case "loading":
        console.log("Please wait...");
        break;
    case "success":
        console.log("Data loaded!");
        break;
    case "error":
        console.log("Something went wrong");
        break;
    default:
        console.log("Unknown status");
        break;
}
```

### Q5. `switch` uses `===` — what prints?

```js
const x = "1";

switch (x) {
    case 1:
        console.log("number");
        break;
    case "1":
        console.log("string");
        break;
}
```

**Answer: `"string"` ✅**

`switch` uses `===`, so `"1" !== 1` (string vs number). Case `1` is skipped; case `"1"` matches.

### Q6. How many times does a nested loop run?

```js
for (let i = 0; i < 3; i++) {
    for (let j = 10; j < 13; j++) {
        console.log(j);
    }
}
```

**Answer: 9 times ✅**

Outer runs 3 times × inner runs 3 times = 9 total. Values printed: `10, 11, 12, 10, 11, 12, 10, 11, 12`.

Note: if the inner variable was also named `i` with `let`, it would work identically — the inner `let i` creates a separate block-scoped variable that shadows the outer one. They don't interfere.

---

## Advanced / Interview

### Q7. What's the output and why?

```js
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
}
```

**Answer: `3, 3, 3`**

`var` is function-scoped — there is only ONE `i` shared across all iterations. By the time the `setTimeout` callbacks run (after the loop completes), `i` has already been incremented to `3`. All three callbacks read the same final value.

Fix with `let`: each iteration gets its own block-scoped `i`, so callbacks capture `0`, `1`, `2` separately. Full explanation on Day 8–9 (scope + closures).

### Q8. FizzBuzz without `if/else` or ternary — 1 to 30.

```js
for (let i = 1; i <= 30; i++) {
    const fizz = i % 3 === 0 ? "Fizz" : "";
    const buzz = i % 5 === 0 ? "Buzz" : "";
    console.log(fizz + buzz || i);
}
```

Build a string: if divisible by 3, `fizz = "Fizz"`, otherwise `""`. Same for buzz. Concatenate — if neither, you get `""` which is falsy, so `||` falls back to `i`.

### Q9. What happens here?

```js
const obj = { a: 1, b: 2, c: 3 };
for (const val of obj) {
    console.log(val);
}
```

**Answer: `TypeError: obj is not iterable`**

Plain objects aren't iterable — they don't have `[Symbol.iterator]`. Use `for...in` for keys, or `Object.values(obj)` with `for...of` for values.

---

## Mini Project — Number Guessing Game

```js
const secret = 7;
const guesses = [3, 7, 10, 5, 7];
let found = false;

for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];

    if (guess < secret) {
        console.log(`Attempt ${i + 1}: Too low`);
    } else if (guess > secret) {
        console.log(`Attempt ${i + 1}: Too high`);
    } else {
        console.log(`Correct! Found in ${i + 1} attempts`);
        found = true;
        break;
    }
}

if (!found) {
    console.log("Better luck next time");
}
```

**Expected output:**
```
Attempt 1: Too low
Correct! Found in 2 attempts
```

---

## Corrections Summary — Key rules to remember

1. **`if/else if` order matters** — first match wins, rest are skipped. Put specific conditions before broad ones.
2. **`switch` uses `===`** — no coercion. `"1"` and `1` are different cases.
3. **Always `break` in `switch`** — missing `break` causes fall-through to the next case.
4. **`for...of` on plain objects throws** — use `for...in` or `Object.entries()`.
5. **`var` in loops is broken with async** — always use `let`. Full reason: Day 8–9.
6. **Never `<=` with `arr.length`** — always `<`. Last valid index is `length - 1`.