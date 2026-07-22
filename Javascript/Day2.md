# Day 2: Operators, Type Coercion, Truthy/Falsy, and `==` vs `===`

This is one of the most interview-heavy topics in all of JavaScript. After today, you'll be able to predict the output of tricky coercion questions that trip up even experienced developers.

---

## Part 1 — Operators: Tools That Do Things With Values

An **operator** is a symbol that performs an operation on values. You already used some yesterday (`=`, `typeof`, `+`). Let's cover them systematically.

### Arithmetic Operators

```js
console.log(10 + 3);   // 13   — Addition
console.log(10 - 3);   // 7    — Subtraction
console.log(10 * 3);   // 30   — Multiplication
console.log(10 / 3);   // 3.3333...  — Division (always float!)
console.log(10 % 3);   // 1    — Modulo (remainder after division)
console.log(10 ** 3);  // 1000 — Exponentiation (10 to the power 3)
```

**`%` (modulo)** is used everywhere in interviews — checking if a number is even/odd:

```js
console.log(7 % 2);  // 1 — odd (remainder is 1)
console.log(8 % 2);  // 0 — even (remainder is 0)
```

### Assignment Operators

```js
let x = 10;    // Basic assignment
x += 5;        // x = x + 5  → 15
x -= 3;        // x = x - 3  → 12
x *= 2;        // x = x * 2  → 24
x /= 4;        // x = x / 4  → 6
x %= 4;        // x = x % 4  → 2
```

These are just shortcuts. `x += 5` and `x = x + 5` are identical.

### Increment / Decrement — Interview Trap Territory

```js
let a = 5;

// Prefix: change FIRST, then use the value
console.log(++a);  // 6 (a becomes 6, then 6 is logged)

// Postfix: use the value FIRST, then change
console.log(a++);  // 6 (6 is logged, THEN a becomes 7)
console.log(a);    // 7 (proof that a changed)
```

**Analogy:** Prefix (`++a`) is like paying before eating at a restaurant. Postfix (`a++`) is like eating first and paying on your way out.

---

## Part 2 — String Concatenation vs Addition

The `+` operator does **two completely different things** depending on the types involved:

```js
// Both numbers → addition
console.log(5 + 3);        // 8

// One or both strings → concatenation (joining text)
console.log("Hello" + " " + "World");  // "Hello World"
console.log("Age: " + 25);             // "Age: 25"  (25 becomes "25")
console.log("5" + 3);                  // "53"  ← NOT 8!
```

This is your first encounter with **type coercion** — JavaScript silently converting one type to another. Here's the rule:

```
+  with ANY string  →  everything becomes a string (concatenation)
-  *  /  %          →  everything becomes a number (always math)
```

```js
console.log("10" - 5);    // 5      (string "10" → number 10)
console.log("10" * 2);    // 20     (string "10" → number 10)
console.log("10" / "2");  // 5      (both become numbers)
console.log("hello" - 5); // NaN    (can't convert "hello" to a number)
```

**Why does `+` behave differently?** Because `+` was designed for both math AND string joining. The other operators (`-`, `*`, `/`) have no string meaning, so they always do math.

---

## Part 3 — Type Coercion: JavaScript's Most Controversial Feature

**Type coercion** means JavaScript automatically converts a value from one type to another when it needs to. There are two kinds:

### Implicit Coercion (JS does it for you — often surprising)

```js
console.log("5" * 2);        // 10     — string became number
console.log(true + 1);       // 2      — true became 1
console.log(false + 1);      // 1      — false became 0
console.log("" + 0);         // "0"    — number became string
console.log(null + 5);       // 5      — null became 0
console.log(undefined + 5);  // NaN    — undefined becomes NaN
```

### Explicit Coercion (YOU do it on purpose — always preferred)

```js
// To Number
Number("42");       // 42
Number("hello");    // NaN
Number(true);       // 1
Number(false);      // 0
Number(null);       // 0
Number(undefined);  // NaN  ← different from null!

// To String
String(42);         // "42"
String(true);       // "true"
String(null);       // "null"
String(undefined);  // "undefined"

// To Boolean
Boolean(0);         // false
Boolean("");        // false
Boolean(null);      // false
Boolean(undefined); // false
Boolean(NaN);       // false
Boolean(1);         // true
Boolean("hello");   // true
Boolean({});        // true  ← even empty objects! JUST MEMORIZE
Boolean([]);        // true  ← even empty arrays! JUST MEMORIZE
```

### First, what is "truthy"?

When JavaScript needs a boolean (like in an if statement), it converts the value using the ToBoolean operation.

```
if (value) { ... }
```

is internally equivalent to

```
if (Boolean(value)) { ... }
```

### The Coercion Cheat Sheet

```
To Number:
┌─────────────┬─────────┐
│ Value        │ Result  │
├─────────────┼─────────┤
│ true         │ 1       │
│ false        │ 0       │
│ null         │ 0       │
│ undefined    │ NaN     │
│ ""           │ 0       │
│ "123"        │ 123     │
│ "hello"      │ NaN     │
└─────────────┴─────────┘

To Boolean (FALSY values — memorize these 7):
┌─────────────────────────┐
│  false                  │
│  0, -0, 0n              │
│  "" (empty string)      │
│  null                   │
│  undefined              │
│  NaN                    │
└─────────────────────────┘
EVERYTHING ELSE IS TRUTHY.
```

---

## Part 4 — Comparison Operators: `==` vs `===`

This is the #1 most asked JavaScript interview question at every level.

### `===` Strict Equality — No coercion. Compares type AND value.

```js
console.log(5 === 5);       // true  — same type, same value
console.log(5 === "5");     // false — number vs string
console.log(true === 1);    // false — boolean vs number
console.log(null === undefined); // false — different types
```

### `==` Loose Equality — Coerces types BEFORE comparing.

```js
console.log(5 == "5");      // true  — "5" coerced to 5
console.log(true == 1);     // true  — true coerced to 1
console.log(null == undefined); // true — special rule!
console.log("" == 0);       // true  — "" coerced to 0
```

### How `==` Actually Works (The Algorithm)

This is what the engine does step-by-step when you use `==`:

```
1. Same type?  → compare normally (like ===)
2. null == undefined?  → true (special case)
3. Number == String?  → convert String to Number, compare
4. Boolean == anything?  → convert Boolean to Number, then re-compare
5. Object == primitive?  → call object's valueOf()/toString(), compare
```

Let's trace through a tricky example:

```js
"" == false
```
```
Step 1: Different types (string vs boolean) → continue
Step 2: Not null/undefined → continue
Step 4: Boolean involved → convert false to 0 → now: "" == 0
Step 3: String vs Number → convert "" to 0 → now: 0 == 0
Step 1: Same type, same value → TRUE
```

Another one:

```js
[] == false
```
```
Step 4: Boolean → convert false to 0 → now: [] == 0
Step 5: Object vs primitive → [].toString() is "" → now: "" == 0
Step 3: String vs Number → "" becomes 0 → now: 0 == 0
Result: TRUE
```

### The Equality Gotcha Table (Interview Gold)

```js
console.log(false == "");     // true
console.log(false == []);     // true
console.log(false == {});     // false
console.log("" == 0);         // true
console.log("" == []);        // true
console.log("" == {});        // false
console.log(0 == []);         // true
console.log(0 == {});         // false
console.log(0 == null);       // false ← null only equals undefined!
console.log(0 == undefined);  // false ← same reason
console.log(null == undefined); // true ← special rule
```

**Rule for your career:** Always use `===`. Use `==` only for `null == undefined` check, which is a legitimate shortcut:

```js
// Instead of checking both:
if (value === null || value === undefined) { ... }

// You can write:
if (value == null) { ... }  // catches both null and undefined
```

---

## Part 5 — Logical Operators: AND, OR, Nullish Coalescing

These don't just return `true`/`false` — they return **actual values**. This surprises many developers.

### `||` (OR) — Returns the FIRST truthy value, or the last value

```js
console.log("hello" || "world");   // "hello"  — first truthy
console.log("" || "fallback");     // "fallback" — "" is falsy, skip it
console.log(0 || null || "yes");   // "yes" — first two are falsy
console.log(0 || "" || null);      // null — all falsy, return last
```

**Use case — default values:**
```js
const username = inputName || "Guest";
// If inputName is "", 0, or null → uses "Guest"
```

### `&&` (AND) — Returns the FIRST falsy value, or the last value

```js
console.log("hello" && "world");   // "world"  — both truthy, return last
console.log("" && "world");        // ""       — first is falsy, return it
console.log(1 && 2 && 3);          // 3        — all truthy, return last
console.log(1 && 0 && 3);          // 0        — first falsy found
```

**Use case — conditional execution:**
```js
const isLoggedIn = true;
isLoggedIn && console.log("Welcome!");  // logs "Welcome!"
// If isLoggedIn is false, console.log never runs
```

**⚠️ Gotcha with `&&` for assignment:**

The expression returns `false` as a standalone statement and nobody sees it — the result is discarded. But if you assign the result, `false` leaks through:

```js
// Standalone — fine, result discarded
isLoggedIn && doSomething();    // ✅

// Assignment — x could be false/0/""
const x = flag && value;        // ⚠️

// Safer for assignment — use ternary
const x = flag ? value : fallback;   // ✅
```

In React, this is a real bug source:

```js
// React component
{count && <p>You have {count} items</p>}
// If count is 0, React renders "0" on screen!
// Fix: {count > 0 && <p>...</p>}
```

### `??` (Nullish Coalescing) — ES2020, Interview Favorite

The problem with `||`: it treats `0`, `""`, and `false` as "empty," but sometimes those are valid values.

```js
const score = 0;
console.log(score || 100);   // 100  ← WRONG! 0 was a valid score!
console.log(score ?? 100);   // 0    ← CORRECT! ?? only skips null/undefined
```

```
||  →  skips ALL falsy values (0, "", false, null, undefined, NaN)
??  →  skips ONLY null and undefined
```

```js
console.log(0 ?? 42);          // 0
console.log("" ?? "default");  // ""
console.log(null ?? "backup"); // "backup"
console.log(undefined ?? 5);   // 5
```

### `?.` Optional Chaining — Partner of `??`

```js
const user = { address: { city: "Bhiwani" } };

// Without optional chaining — crashes if address is undefined
console.log(user.address.city);      // "Bhiwani"
console.log(user.contact.phone);     // ❌ TypeError!

// With optional chaining — returns undefined safely
console.log(user.contact?.phone);    // undefined (no crash)
console.log(user.contact?.phone ?? "N/A");  // "N/A" (with fallback)
```

---

## Part 6 — Short-Circuit Evaluation (MAANG Deep Dive)

`&&` and `||` use **short-circuit evaluation** — they stop evaluating as soon as the result is determined.

```js
// || stops at the first TRUTHY value (why check more?)
true || expensiveFunction();   // expensiveFunction never runs!

// && stops at the first FALSY value (why check more?)
false && expensiveFunction();  // expensiveFunction never runs!
```

**Why this matters for performance:**

```js
// Put the cheapest/most likely check FIRST
if (isSimpleCheck && isExpensiveDatabaseLookup()) { ... }
// If isSimpleCheck is false, the database is never queried
```

**V8 Internal Note:** The engine doesn't treat `&&` and `||` as boolean operators internally — they're **selection operators**. They select and return one of their operands. This is why `"hello" && "world"` returns `"world"`, not `true`.

---

## Part 7 — `&` vs `&&` and `|` vs `||` (Bitwise vs Logical)

These are completely different operations.

### `&&` and `||` — Logical operators

They work on **truthy/falsy values** and short-circuit.

```js
console.log(5 && 3);     // 3 (last truthy)
console.log(0 || 10);    // 10 (first truthy)
```

### `&` and `|` — Bitwise operators

They work on **individual binary bits** of numbers. They convert values to 32-bit integers, compare each bit position, then return the result.

```js
//   5 in binary: 0101
//   3 in binary: 0011

console.log(5 & 3);   // 1
// 0101
// 0011
// ----  (AND: both bits must be 1)
// 0001 → 1

console.log(5 | 3);   // 7
// 0101
// 0011
// ----  (OR: either bit can be 1)
// 0111 → 7
```

### When are bitwise operators used?

Rare in everyday JS, but show up in specific scenarios:

```js
// 1. Permission/flag systems (very common in interviews)
const READ    = 0b0001;  // 1
const WRITE   = 0b0010;  // 2
const EXECUTE = 0b0100;  // 4

let permission = READ | WRITE;        // 0011 → user can read AND write
console.log(permission & READ);       // 1 (truthy) → has read permission
console.log(permission & EXECUTE);    // 0 (falsy) → no execute permission

// 2. Quick Math.floor for positive numbers
console.log(7.9 | 0);   // 7 — truncates decimal
console.log(~~7.9);     // 7 — double bitwise NOT, same trick
```

### Summary

```
&&  ||  →  Logic. Work with truthy/falsy. Short-circuit. Return values.
&   |   →  Bits. Work with binary digits. Always evaluate both sides. Return numbers.
```

You'll use `&&` and `||` every single day. You'll use `&` and `|` maybe once a month in specialized cases.

---

## Part 8 — Why `"" == {}` is false

Tracing the `==` algorithm:

```
"" == {}

Step 1: Different types (string vs object) → continue
Step 5: Object vs primitive → convert {} using toString()
        {}.toString() → "[object Object]"
        Now: "" == "[object Object]"
Step 1: Same type (string vs string) → compare directly
        "" === "[object Object]" → FALSE
```

The key insight: `{}` doesn't become an empty string. It becomes `"[object Object]"` — that's what every plain object's `toString()` returns by default. Compare with arrays:

```js
console.log({}.toString());    // "[object Object]"
console.log([].toString());    // ""
console.log([1,2].toString()); // "1,2"
```

This is why `"" == []` IS true but `"" == {}` is false.

---

## Part 9 — Common Mistakes

**Mistake 1: Using `+` for math with strings**
```js
const a = prompt("Enter number");  // User types "5" — it's a STRING
console.log(a + 10);  // "510" not 15!
// Fix: console.log(Number(a) + 10);
```

**Mistake 2: Confusing `=`, `==`, `===`**
```js
if (x = 5) { }   // NOT comparison! This ASSIGNS 5 to x, then checks if 5 is truthy
if (x == 5) { }  // Loose comparison with coercion
if (x === 5) { } // Strict comparison — USE THIS
```

**Mistake 3: Truthy/falsy surprises**
```js
if ([]) { console.log("runs!"); }    // RUNS — [] is truthy!
if ({}) { console.log("runs!"); }    // RUNS — {} is truthy!

// BUT:
console.log([] == false);   // true — because of coercion algorithm
// [] is truthy, yet [] == false is true. Welcome to JavaScript.
```

This is the most famous JS paradox. `[]` is truthy in a boolean context, but `[] == false` is `true` because `==` doesn't check truthiness — it follows the coercion algorithm (converts both sides to numbers: `[] → "" → 0`, `false → 0`, `0 == 0`).

---

## Day 2 Recap

1. **`+` is overloaded** — math with numbers, concatenation with strings
2. **Type coercion** — JS silently converts types; learn the rules, don't memorize random outputs
3. **7 falsy values** — `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN` — everything else is truthy
4. **`===` always, `==` almost never** — except the `value == null` shortcut
5. **`||` and `&&` return values, not booleans** — they're selection operators
6. **`??` only skips null/undefined** — safer than `||` for default values
7. **Short-circuit evaluation** — put cheap checks first for performance

---

---

# Practice Problems & Answers

## Quick Checks (from the lesson)

### QC1. What does `n++ + ++n` print when `n = 3`?

**Answer: `8` ✅**

```
n starts at 3
n++  → uses 3, THEN n becomes 4
++n  → n becomes 5, THEN uses 5
So: 3 + 5 = 8
```

### QC2. Is `" "` (space) truthy or falsy? Is `[]` truthy or falsy?

**Answer:** `" "` is **truthy**. `[]` is **truthy**.

Only the empty string `""` (zero length) is falsy. Any content at all — even a single space — makes it truthy.

```js
console.log(Boolean(""));   // false — empty string
console.log(Boolean(" "));  // true  — has a character (space)
console.log(Boolean("0"));  // true  — has a character ("0")
```

---

## Beginner

### Q1. What's the output?

```js
console.log(5 + "3");
console.log(5 - "3");
console.log("5" - "3");
console.log("5" + -"3");
```

**Answers:**

| Expression | Output | Explanation |
|---|---|---|
| `5 + "3"` | `"53"` ✅ | `+` with string → concatenation |
| `5 - "3"` | `2` ✅ | `-` always does math, `"3"` → `3` |
| `"5" - "3"` | `2` ✅ | `-` always does math, both become numbers |
| `"5" + -"3"` | `"5-3"` ❌ (I said `"53"`) | Unary `-` runs first (higher precedence): `-"3"` → `-3`. Then `"5" + (-3)` → string + number → concatenation → `"5-3"` |

### Q2. Truthy or falsy?

| Value | Answer | Correct? |
|---|---|---|
| `0` | Falsy | ✅ |
| `"0"` | Truthy | ✅ |
| `""` | Falsy | ✅ |
| `" "` | Truthy | ❌ (I said falsy) |
| `[]` | Truthy | ✅ |
| `null` | Falsy | ✅ |
| `undefined` | Falsy | ✅ |
| `NaN` | Falsy | ✅ |
| `{}` | Truthy | ✅ |
| `false` | Falsy | ✅ |

**Key rule:** For strings, ONLY `""` (zero length) is falsy. For objects/arrays, ALL are truthy — even empty ones.

---

## Intermediate

### Q3. Trace through the `==` algorithm step by step.

```js
console.log([] == 0);
console.log("" == false);
console.log(null == 0);
```

**`[] == 0` → `true` ✅**
```
Step 5: Object vs primitive → [].toString() → "" → now: "" == 0
Step 3: String vs Number → "" becomes 0 → now: 0 == 0
Step 1: Same type, same value → TRUE
```

**`"" == false` → `true` ✅**
```
Step 4: Boolean → false becomes 0 → now: "" == 0
Step 3: String vs Number → "" becomes 0 → now: 0 == 0
Step 1: Same type, same value → TRUE
```

**`null == 0` → `false` ❌ (I said `true`)**

Special rule to memorize: **`null` only equals `undefined` with `==`.** It doesn't coerce to `0`, even though `Number(null)` is `0`. The spec explicitly says: null and undefined equal each other and nothing else.

```
null == undefined  → true  (special rule)
null == 0          → false (null doesn't coerce with ==)
null == ""         → false (same reason)
null == false      → false (same reason)
```

### Q4. What does each line return?

```js
console.log("foo" || "bar");
console.log("foo" && "bar");
console.log(0 || "" || null || "hello" || undefined);
console.log(1 && 2 && 0 && 3);
```

**Answers:** `"foo"`, `"bar"`, `"hello"`, `0` — ✅ All correct.

---

## Advanced / Interview

### Q5. What's the output and why?

```js
console.log([] + []);
console.log([] + {});
console.log({} + []);
```

❌ All three wrong. The `+` operator with objects calls `toString()` first:

| Expression | My Answer | Correct Answer | Why |
|---|---|---|---|
| `[] + []` | `[]` | `""` (empty string) | `[].toString()` → `""`, so `"" + ""` → `""` |
| `[] + {}` | `[object object]` | `"[object Object]"` (a string) | `""` + `"[object Object]"` → `"[object Object]"` |
| `{} + []` | `[object object]` | `0` (in most consoles) | `{}` at start of statement is parsed as empty code block, so it becomes `+[]` → `+""` → `0` |

The last one is a famous gotcha. Wrapping forces object interpretation:
```js
console.log(({}) + []);  // "[object Object]" — forced to be object
```

### Q6. Predict the output.

```js
console.log(true + true + true);
console.log(true + "1");
console.log(!"");
console.log(!!"hello");
console.log(!!"");
```

| Expression | My Answer | Correct Answer | Correct? |
|---|---|---|---|
| `true + true + true` | `3` | `3` | ✅ |
| `true + "1"` | `11` | `"true1"` | ❌ |
| `!""` | `true` | `true` | ✅ |
| `!!"hello"` | `true` | `true` | ✅ |
| `!!""` | `false` | `false` | ✅ |

**`true + "1"` correction:** `+` with a string converts the other side to string. `String(true)` is `"true"`, not `"1"`. The conversion to `1` only happens with numeric operators (`-`, `*`, `/`).

### Q7. Explain `||` vs `??` for defaults.

```js
const a = value || "default";  // skips ALL falsy: 0, "", false, null, undefined, NaN
const b = value ?? "default";  // skips ONLY null and undefined
```

When we want to treat `0` as a valid value and only eliminate `null`/`undefined`, use `??`. ✅ Correct.

---

## Mini Project — Type Coercion Tester

### My Initial Attempt

Had the right structure but got stuck on describing the coercion step:

```js
const typeCoercion = (a, b, operator) => {
    const typeA = typeof a;
    const typeB = typeof b;
    console.log("a is " + typeA, "b is " + typeB);
    let result;
    if (operator === "==") {
        result = (a == b);
    } else if (operator === "===") {
        result = (a === b);
    } else if (operator === "+") {
        result = a + b;
    } else if (operator === "-") {
        result = a - b;
    }
    // Got stuck here — didn't know how to show the coercion step
}
```

### Completed Version

```js
const typeCoercion = (a, b, operator) => {
    const typeA = typeof a;
    const typeB = typeof b;
    console.log(`\nInput: ${JSON.stringify(a)} ${operator} ${JSON.stringify(b)}`);
    console.log(`Step 1: ${JSON.stringify(a)} is ${typeA}, ${JSON.stringify(b)} is ${typeB}`);

    let result;

    if (operator === "+") {
        if (typeA === "string" || typeB === "string") {
            if (typeA === "string" && typeB !== "string") {
                console.log(`Step 2: + with string → concatenation → ${JSON.stringify(b)} becomes ${JSON.stringify(String(b))}`);
            } else if (typeB === "string" && typeA !== "string") {
                console.log(`Step 2: + with string → concatenation → ${JSON.stringify(a)} becomes ${JSON.stringify(String(a))}`);
            } else {
                console.log(`Step 2: both strings → concatenation, no coercion needed`);
            }
        } else {
            console.log(`Step 2: both numbers → addition, no coercion needed`);
        }
        result = a + b;

    } else if (operator === "-") {
        if (typeA !== "number" || typeB !== "number") {
            console.log(`Step 2: - always does math → ${JSON.stringify(a)} becomes ${Number(a)}, ${JSON.stringify(b)} becomes ${Number(b)}`);
        } else {
            console.log(`Step 2: both numbers → subtraction, no coercion needed`);
        }
        result = a - b;

    } else if (operator === "==") {
        if (typeA !== typeB) {
            console.log(`Step 2: types differ (${typeA} vs ${typeB}) → coercion happens`);
        } else {
            console.log(`Step 2: same types → no coercion needed`);
        }
        result = a == b;

    } else if (operator === "===") {
        if (typeA !== typeB) {
            console.log(`Step 2: types differ (${typeA} vs ${typeB}) → strict equality returns false immediately`);
        } else {
            console.log(`Step 2: same types → comparing values directly`);
        }
        result = a === b;
    }

    console.log(`Result: ${JSON.stringify(result)} (type: ${typeof result})`);
};

// Test cases
typeCoercion("5", 3, "+");
typeCoercion("10", 5, "-");
typeCoercion(true, 1, "==");
typeCoercion(true, 1, "===");
typeCoercion(null, 0, "+");
```

---

## Corrections Summary — 5 mistakes to burn into memory

1. **`" "` is truthy** — only `""` (zero length) is falsy
2. **`null == 0` is `false`** — null only equals undefined with `==`
3. **`[] + []` is `""`**, not `[]` — `toString()` runs first
4. **`true + "1"` is `"true1"`**, not `"11"` — `String(true)` is `"true"`, not `"1"`
5. **`"5" + -"3"` is `"5-3"`** — unary minus has higher precedence, gives `-3`, then concatenation