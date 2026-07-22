# Day 1: What is JavaScript & The Absolute Basics

## Part 1 — What is JavaScript?

JavaScript is a **programming language** that tells the computer what to do, step by step. It was created in 1995 by Brendan Eich in just 10 days for Netscape's web browser. Today it runs everywhere — browsers, servers, mobile apps, even robots.

### How Does JavaScript Actually Run?

You don't run JavaScript directly on your CPU. A special program called a **JavaScript engine** reads your code and executes it.

```
Your JS Code
    │
    ▼
┌──────────────────────┐
│   JavaScript Engine   │
│  (e.g. V8 in Chrome) │
│                      │
│  1. Parser           │  ← Reads your code text
│  2. AST              │  ← Converts to a tree structure
│  3. Interpreter      │  ← Runs it line by line (Ignition)
│  4. Compiler (JIT)   │  ← Optimizes hot code (TurboFan)
│                      │
└──────────────────────┘
    │
    ▼
  Result
```

**Key engines to know for interviews:**
- **V8** — Chrome, Node.js (Google)
- **SpiderMonkey** — Firefox (Mozilla)
- **JavaScriptCore** — Safari (Apple)

You don't need to memorize this pipeline right now. Just understand: your code is text → the engine transforms it → the computer executes it.

---

## Part 2 — Variables: Giving Names to Data

A **variable** is a label you attach to a piece of data so you can refer to it later. Think of it like a labeled jar in a kitchen.

```
┌─────────┐
│  "Deepak"│  ← The data (a piece of text)
│         │
│ name    │  ← The label (variable name)
└─────────┘
```

### Three Ways to Create Variables

```js
let age = 25;          // Can be changed later
const name = "Deepak"; // Cannot be changed after assignment
var city = "Bhiwani";  // Old way — avoid in modern code
```

Let me break this down word by word:

- `let` / `const` / `var` — **keywords** that tell the engine "I'm creating a variable"
- `age` / `name` / `city` — the **variable name** you choose
- `=` — the **assignment operator** (it means "store this value", NOT "equals" in the math sense)
- `25`, `"Deepak"`, `"Bhiwani"` — the **values** being stored

### `let` vs `const` vs `var` — What's the Real Difference?

```js
// let: you CAN reassign
let score = 10;
score = 20;  // ✅ Works fine

// const: you CANNOT reassign
const country = "India";
country = "USA";  // ❌ TypeError: Assignment to constant variable

// var: old syntax, has quirky behavior we'll cover on Day 8
var old = "legacy";
```

**Rule for your career:** Default to `const`. Use `let` only when you know the value will change. Never use `var` in new code.

---

**🧠 Quick check before we continue:** If I write `const x = 5;` and then later write `x = 10;`, what will happen and why?

---

## Part 3 — Data Types: What Kinds of Data Exist?

JavaScript has **8 data types**, split into two categories.

### Primitive Types (7) — Simple, single values

```js
// 1. Number — any numeric value
const price = 499.99;
const quantity = 3;

// 2. String — text, always in quotes
const greeting = "Hello";
const letter = 'A';

// 3. Boolean — true or false, nothing else
const isLoggedIn = true;
const hasAccess = false;

// 4. undefined — variable exists but has no value yet
let address;
console.log(address);  // undefined

// 5. null — intentionally empty, "nothing here on purpose"
const middleName = null;

// 6. BigInt — very large numbers (rare, but asked in interviews)
const huge = 9007199254740991n;  // note the 'n' at the end

// 7. Symbol — unique identifier (we'll cover this deeply on Day 18)
const id = Symbol("userId");
```

### Non-Primitive Type (1) — Complex, can hold collections

```js
// 8. Object — a collection of key-value pairs
const user = {
  name: "Deepak",
  age: 25,
  isRemote: true
};
```

Arrays and functions are also objects internally — we'll prove this on Day 6.

### The Critical Difference: Primitives vs Objects

This is one of the most important concepts for interviews.

```
PRIMITIVES — stored by VALUE        OBJECTS — stored by REFERENCE
┌─────────┐  ┌─────────┐           ┌─────────┐  ┌─────────┐
│  a: 10  │  │  b: 10  │           │  x: ──────────►{name: │
└─────────┘  └─────────┘           └─────────┘  │"Deepak"}│
  (separate copies)                │  y: ──────────►       │
                                   └─────────┘  └─────────┘
                                     (same object!)
```

```js
// Primitives: copying creates an independent clone
let a = 10;
let b = a;
b = 20;
console.log(a);  // 10 — unchanged! They're separate.

// Objects: copying shares a reference (like a shortcut)
let x = { name: "Deepak" };
let y = x;
y.name = "Rahul";
console.log(x.name);  // "Rahul" — CHANGED! They point to the same object.
```

**Analogy:** Primitives are like photocopying a document — changing the copy doesn't affect the original. Objects are like sharing a Google Doc link — anyone with the link edits the same document.

---

### `typeof` — Checking a Value's Type

```js
console.log(typeof 42);          // "number"
console.log(typeof "hello");     // "string"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object"  ← BUG! Famous JS mistake.
console.log(typeof {});          // "object"
console.log(typeof Symbol());    // "symbol"
```

### Interview Trap: Why does `typeof null` return `"object"`?

`typeof null` returns `"object"` because of a historical JavaScript bug that dates back to 1995. Although it's technically a bug, it has never been fixed because changing it would break a huge amount of existing code on the web.

#### Why does it happen?

In the earliest JavaScript implementation, values were stored with a **type tag**. Objects were identified by the type tag:

```text
000
```

Meanwhile, `null` was represented as the **NULL pointer** (`0x00`), which in binary is:

```text
00000000
```

When the JavaScript engine checked the first few bits of a value to determine its type, it saw:

```text
000...
```

Since `000` was the type tag for objects, the engine assumed the value was an object.

#### The Result

The engine effectively interpreted `null` like this:

```text
Object type tag: 000
null value:      00000000
                 ^^^
                 Matches the object tag
```

So `null` was **never actually an object**—it was simply misclassified because its binary representation started with the same bits as the object type tag.

#### Why hasn't it been fixed?

Changing the behavior of:

```js
typeof null
```

from:

```js
"object"
```

to:

```js
"null"
```

would break a significant amount of existing JavaScript code. To preserve backward compatibility, the behavior remains unchanged, making it one of JavaScript's oldest and most well-known quirks.

---

## Part 4 — `undefined` vs `null` (Interview Classic)

| | `undefined` | `null` |
|---|---|---|
| **Who sets it?** | The engine | You, the programmer |
| **Meaning** | "No value has been assigned yet" | "I intentionally set this to empty" |
| **typeof** | `"undefined"` | `"object"` (bug) |

```js
let a;           // engine sets it to undefined
let b = null;    // you set it to null on purpose

console.log(a == b);   // true  (loose equality, both "empty-ish")
console.log(a === b);  // false (strict equality, different types)
```

We'll cover `==` vs `===` deeply on Day 2. For now just know: `===` checks both value AND type.

---

## Part 5 — MAANG Deep Dive: What Happens in Memory?

When V8 (the engine) runs your code, it uses two memory areas:

```
┌───────────────────────┬──────────────────────────┐
│       STACK            │         HEAP              │
│  (fast, small, LIFO)  │  (large, unstructured)    │
│                       │                          │
│  const age = 25  ───► │                          │
│  age: 25              │                          │
│                       │  ┌──────────────────┐    │
│  const user = ─────────────► { name: "Deepak" } │
│  user: <ref 0x3F2>   │  └──────────────────┘    │
│                       │                          │
└───────────────────────┴──────────────────────────┘
```

- **Primitives** → stored directly on the **stack** (fixed size, fast access)
- **Objects** → stored on the **heap** (dynamic size), and the stack holds a **reference** (memory address) pointing to them

This is *why* objects behave differently when copied. You're copying the reference (address), not the object itself.

---

## Part 6 — Common Mistakes

**Mistake 1: Using a variable before declaring it**
```js
console.log(score);  // ReferenceError: Cannot access 'score' before initialization
let score = 100;
```
With `var`, this would print `undefined` instead of crashing — this is called **hoisting**, covered Day 8.

It will **break execution** at that line because an **uncaught `ReferenceError` is thrown** (unless you catch it with `try...catch`).

Example:

```js
console.log(score);   // ❌ ReferenceError: Cannot access 'score' before initialization
let score = 100;

console.log("Hello");
```

### What happens?

1. JS starts executing.

2. It reaches:

   ```js
   console.log(score);
   ```

3. `score` exists in memory (because of hoisting), but it is in the **Temporal Dead Zone (TDZ)**.

4. JavaScript throws:

   ```
   ReferenceError: Cannot access 'score' before initialization
   ```

5. Since the error is **uncaught**, execution **stops immediately**.

So `"Hello"` is **never printed**.

---

### If you catch the error

```js
try {
  console.log(score);
} catch (err) {
  console.log(err.message);
}

let score = 100;

console.log(score);
```

Output:

```
Cannot access 'score' before initialization
100
```

Execution continues because the error was handled.

---

### Comparison

#### `var`

```js
console.log(score);
var score = 100;
console.log(score);
```

Output:

```
undefined
100
```

Reason: `var` is hoisted **and initialized to `undefined`**.

---

#### `let`

```js
console.log(score);
let score = 100;
```

Output:

```
ReferenceError: Cannot access 'score' before initialization
```

Reason: `let` is hoisted **but not initialized**, so it's in the **Temporal Dead Zone (TDZ)** until the declaration is executed.

---

### Interview takeaway

* `var` → Hoisted **and initialized** to `undefined` → no error.
* `let`/`const` → Hoisted **but uninitialized** (TDZ) → accessing them before initialization throws a **`ReferenceError`**.
* If the `ReferenceError` is **uncaught**, the program stops executing at that point. If it's caught with `try...catch`, execution can continue afterward.


**Mistake 2: Thinking `const` makes objects immutable**
```js
const user = { name: "Deepak" };
user.name = "Rahul";     // ✅ Works! You changed the property, not the variable.
user = { name: "New" };  // ❌ Error! You tried to reassign the variable itself.
```
`const` means "this variable always points to the same thing." It doesn't freeze the thing it points to.

**Mistake 3: Number precision**
```js
console.log(0.1 + 0.2);  // 0.30000000000000004 — NOT 0.3!
```
Interview answer (30 seconds)

JavaScript uses the IEEE 754 double-precision floating-point format to store numbers. Many decimal values, like 0.1 and 0.2, cannot be represented exactly in binary, so they're stored as close approximations. When those approximations are added, the result becomes 0.30000000000000004 instead of exactly 0.3. Because of this, we shouldn't compare floating-point numbers using ===. Instead, compare whether their difference is smaller than a small tolerance, such as Number.EPSILON.

Remember
- 0.1 + 0.2 → 0.30000000000000004
- 0.1 + 0.2 === 0.3 → false
- For floating-point values, compare with a tolerance:

```Math.abs(a - b) < Number.EPSILON```

This avoids failures caused by tiny representation errors.

- ***Number.EPSILON*** is a very small number in JavaScript that represents the smallest difference between 1 and the next larger number that JavaScript can represent.

```console.log(Number.EPSILON);```

Output:

```2.220446049250313e-16```

Which is approximately:

```0.0000000000000002220446049250313```

---

## Part 7 — Practice Problems

### Beginner
1. Create variables for your name, age, and whether you're a developer. Log each one with `typeof`.
2. What's the output of `typeof typeof 42`? Work it out on paper before running it.

### Intermediate
3. Predict the output without running:
```js
let a = { score: 10 };
let b = a;
b.score = 50;
console.log(a.score);
```

4. Predict the output:
```js
let x = "hello";
let y = x;
y = "world";
console.log(x);
```
Explain *why* the results in Q3 and Q4 are different.

### Advanced / Interview
5. What does this print and why?
```js
console.log(typeof NaN);
console.log(NaN === NaN);
```

6. Without running it, what happens here?
```js
const arr = [1, 2, 3];
arr.push(4);
console.log(arr);
```
Does it crash? Why or why not?

### 🔨 Mini Project — Personal Profile Card

Build a small script (just `console.log` output) that:
- Stores your full name, age, city, skills (as an array), and whether you're looking for a job (boolean) in appropriate variables
- Uses `const` vs `let` correctly
- Logs a formatted profile like: `"Deepak Sharma | 25 | Bhiwani | Skills: React, JS | Seeking: Yes"`
- Logs the `typeof` every variable

**Hint for the skills array:** You can join array items with `skills.join(", ")`.

---

## Day 1 Recap

What you learned today and how it connects:

1. **JavaScript is interpreted+compiled** by engines like V8 using JIT compilation
2. **Variables** (`let`, `const`, `var`) are labels pointing to values stored in memory
3. **8 data types** — 7 primitives (stack) + objects (heap)
4. **Primitives copy by value, objects copy by reference** — this single idea explains dozens of interview questions
5. **`typeof null === "object"`** is a famous engine bug
6. **`const`** prevents reassignment, not mutation

---

Try the practice problems and the mini project. Share your answers and I'll review them before we move to Day 2 (operators and type coercion).

My answers:

1. 
```javascript
// Create variables for your name, age, and whether you're a developer.
// Log each one with typeof.

const name = "Deepak";
const age = 25;
const isDev = true;

console.log('name', typeof name);
console.log('age', typeof age);
console.log('isDev', typeof isDev);
```

2. string
3. 50
4. 'hello'
5. don't know, also explain Number.isNan vs isNan
6. 1, 2, 3, 4 ==> No, it won't crash, as we are changing value not reference.
7. 
```javascript
// Build a small script (just console.log output) that:

// Stores your full name, age, city, skills (as an array), and 
// whether you're looking for a job (boolean) in appropriate variables
// Uses const vs let correctly
// Logs a formatted profile like: "Deepak Sharma | 25 | Bhiwani | Skills: React, JS | 
// Seeking: Yes"
// Logs the typeof every variable

// Hint for the skills array: You can join array items with skills.join(", ").


const firstName = "Deepak";
const lastName = "Sharma";
const age = 25;
const city = "Bhiwani";
const skills = ['study', 'play cricket', 'interested in ev vehicles'];
const isLookingForJob = true;

const fullName = `${firstName} ${lastName}`;
const formattedSkills = `Skills: ${skills.join(', ')}`;
const seekingJob = isLookingForJob ? "Seeking: Yes" : "Seeking: No";

const formattedProfile = [fullName, age, city, formattedSkills, seekingJob];
const profileStr = formattedProfile.join(' | ');

console.log(profileStr);

console.log(typeof firstName);
console.log(typeof lastName);
console.log(typeof age);
console.log(typeof city);
console.log(typeof skills);
console.log(typeof isLookingForJob);
console.log(typeof fullName);
console.log(typeof formattedSkills)
console.log(typeof seekingJob);
console.log(typeof formattedProfile);
console.log(typeof profileStr);
```

Note: i didn't get in detail: JavaScript is interpreted+compiled by engines like V8 using JIT compilation

i just understood: your code is text → the V8 engine transforms it into computer readable format → the computer executes it.
Is it okay?

## Answers Review

**Q1** — Perfect. Clean code, correct use of `const`.

**Q2** — ✅ Correct! `typeof 42` returns `"number"` (a string), then `typeof "number"` returns `"string"`. You evaluated it inside-out, which is exactly right.

**Q3** — ✅ `50`. Correct. Both `a` and `b` point to the same object on the heap.

**Q4** — ✅ `"hello"`. Correct. Strings are primitives, so `y = x` copied the value. Reassigning `y` doesn't touch `x`.

**Q5** — Let me explain this one:

```js
console.log(typeof NaN);   // "number" ← surprising!
console.log(NaN === NaN);  // false    ← even more surprising!
```

`NaN` stands for "Not a Number" but its type IS `number`. Think of it as: "I tried to do a numeric operation and it failed." The *result* of a failed number operation is still in the number category — it's a broken number, not a missing one.

`NaN === NaN` is `false` because by IEEE 754 spec, NaN is the only value in JavaScript not equal to itself. It represents an *indeterminate* result — `0/0` and `"hello" * 5` both produce NaN, but they're not the same failure.

### `isNaN()` vs `Number.isNaN()` — Interview Favorite

```js
// isNaN() — OLD, BROKEN. Coerces the value to a number first.
isNaN("hello");     // true — coerces "hello" to NaN, then checks
isNaN("123");       // false — coerces "123" to 123, not NaN
isNaN(undefined);   // true — coerces undefined to NaN

// Number.isNaN() — CORRECT. No coercion. Only true for actual NaN.
Number.isNaN("hello");     // false — "hello" is a string, not NaN
Number.isNaN(NaN);         // true  — actually NaN
Number.isNaN(undefined);   // false — undefined is not NaN
```

```
isNaN(x)         →  "Does x BECOME NaN when forced into a number?"
Number.isNaN(x)  →  "Is x LITERALLY the value NaN right now?"
```

**Rule:** Always use `Number.isNaN()`. The old `isNaN()` lies.

**Q6** — ✅ Perfect answer AND perfect reasoning. `const` protects the reference (the arrow), not the contents. `push` mutates the array without changing what `arr` points to.

**Q7 (Mini Project)** — This is genuinely impressive for Day 1. A few things I want to highlight:

- You used **template literals** (`` `${}` ``) — great instinct, that's ES6+
- You used a **ternary operator** (`? :`) — we haven't even covered that yet
- You built the profile using `array.join()` instead of string concatenation — very clean
- Every variable is `const` — correct, since nothing gets reassigned

One small note: `typeof skills` and `typeof formattedProfile` will both print `"object"`, not `"array"`. JavaScript has no `typeof` result for arrays. To check for arrays, you use `Array.isArray(skills)`. This is another classic interview question.

---

## On Your JIT Question

Your mental model is perfectly fine for now:

```
Your code (text) → V8 transforms it → Computer runs it
```

That's accurate. The deeper details (parser → AST → Ignition interpreter → TurboFan compiler) will start mattering on Day 8 (execution context) and Day 28 (V8 optimizations). I'll layer them in when they become relevant to what you're building. No need to memorize the pipeline upfront.

---

You're ready for Day 2. Want to move on to **Operators, Type Coercion, and `==` vs `===`**?