# JS Day 4 — Functions: The Building Blocks of Everything

Functions are the single most important concept in JavaScript. Every pattern you'll learn later — closures, callbacks, promises, React components — is built on functions.

---

## Part 1: What Is a Function and Why Does It Exist?

**Problem:** You have code that you need to run multiple times, maybe with different inputs.

```js
// ❌ Without functions — repetition
console.log("Hello, Deepak!");
console.log("Hello, Rahul!");
console.log("Hello, Priya!");

// ✅ With a function — write once, use many times
function greet(name) {
    console.log("Hello, " + name + "!");
}

greet("Deepak");
greet("Rahul");
greet("Priya");
```

A function is a **reusable block of code** that:
1. Has a **name** (usually)
2. Can take **inputs** (parameters)
3. Can produce an **output** (return value)
4. Only runs when **called**

**Analogy:** A function is like a recipe card. Writing the recipe doesn't cook anything. You "call" the recipe when you actually follow the steps. Each time you can use different ingredients (arguments).

```
┌─────────────────────────────┐
│  function add(a, b) {       │  ← Recipe card (definition)
│      return a + b;          │
│  }                          │
└─────────────────────────────┘

add(3, 5)   →  8              ← Cooking with ingredients 3 and 5
add(10, 20) →  30             ← Same recipe, different ingredients
```

---

## Part 2: Three Ways to Create Functions

### 1. Function Declaration

```js
function multiply(a, b) {
    return a * b;
}

console.log(multiply(4, 5));  // 20
```

**Key trait: HOISTED.** You can call it before the definition:

```js
console.log(square(5));  // 25 — works!

function square(n) {
    return n * n;
}
```

The engine moves function declarations to the top of their scope during compilation. We'll cover hoisting deeply on Day 8.

### 2. Function Expression

```js
const multiply = function(a, b) {
    return a * b;
};

console.log(multiply(4, 5));  // 20
```

**Key trait: NOT hoisted.** The variable exists but is uninitialized until that line runs:

```js
console.log(square(5));  // ❌ ReferenceError!

const square = function(n) {
    return n * n;
};
```

### 3. Arrow Function (ES6+)

```js
const multiply = (a, b) => {
    return a * b;
};

// Shorthand — if body is ONE expression, skip {} and return
const multiply = (a, b) => a * b;

// Single parameter — skip parentheses
const double = n => n * 2;

// No parameters — empty parens required
const greet = () => "Hello!";
```

All the shorthand levels:

```
// Full form
const add = (a, b) => { return a + b; };

// Implicit return (one expression)
const add = (a, b) => a + b;

// Single param (no parens needed)
const double = n => n * 2;

// No params
const sayHi = () => "Hi";

// Returning an object — MUST wrap in ()
const makeUser = name => ({ name: name, role: "dev" });
//                        ↑ without () the engine thinks {} is a code block
```

**Quick Check Answer — What's wrong with this arrow function?**

```js
const getUser = () => { name: "Deepak" };
console.log(getUser());  // undefined
```

The `{}` is parsed as a code block, not an object literal. `name: "Deepak"` is treated as a label + string expression — valid syntax but does nothing. The function returns `undefined` implicitly. **Fix: wrap the object in parentheses:**

```js
const getUser = () => ({ name: "Deepak" });
console.log(getUser());  // { name: "Deepak" }
```

---

## Part 3: Parameters vs Arguments

```js
function greet(name, age) {   // name, age are PARAMETERS (placeholders)
    console.log(`${name} is ${age}`);
}

greet("Deepak", 25);          // "Deepak", 25 are ARGUMENTS (actual values)
```

```
Parameters = variables in the function definition (the recipe slots)
Arguments  = values passed when calling (the actual ingredients)
```

### Default Parameters

```js
function greet(name = "Guest") {
    console.log("Hello, " + name);
}

greet("Deepak");  // "Hello, Deepak"
greet();          // "Hello, Guest"
greet(undefined); // "Hello, Guest" — undefined triggers default
greet(null);      // "Hello, null" — null does NOT trigger default!
```

**Interview trap:** Default parameters activate for `undefined` only, NOT for `null`, `0`, `""`, or `false`. This makes sense — `undefined` means "nothing was passed," while the others are intentional values.

### Rest Parameters (`...args`)

When you don't know how many arguments will be passed:

```js
function sum(...numbers) {
    let total = 0;
    for (const num of numbers) {
        total += num;
    }
    return total;
}

console.log(sum(1, 2, 3));        // 6
console.log(sum(10, 20, 30, 40)); // 100
```

`...numbers` collects ALL arguments into a **real array**. Must be the last parameter:

```js
function log(label, ...values) {  // ✅ rest is last
    console.log(label, values);
}

function broken(...values, label) {  // ❌ SyntaxError!
}
```

---

## Part 4: `return` — How Functions Give Back Values

```js
function add(a, b) {
    return a + b;    // sends value back to caller
    console.log("after return");  // ❌ NEVER runs — return exits immediately
}

const result = add(3, 5);
console.log(result);  // 8
```

**What happens without `return`?**

```js
function greet(name) {
    console.log("Hello, " + name);
    // no return statement
}

const result = greet("Deepak");
console.log(result);  // undefined — all functions return undefined by default
```

Every function returns something. If you don't specify, it returns `undefined`.

### Early Return Pattern (Guard Clauses)

```js
// ❌ Nested — hard to read
function getDiscount(user) {
    if (user) {
        if (user.isPremium) {
            return 20;
        } else {
            return 5;
        }
    } else {
        return 0;
    }
}

// ✅ Early returns — flat and readable
function getDiscount(user) {
    if (!user) return 0;
    if (user.isPremium) return 20;
    return 5;
}
```

Handle edge cases early and return. This avoids nesting. Called **guard clauses** — heavily used in production code and valued in interviews.

---

## Part 5: Functions Are Values (First-Class Functions)

In many languages, functions are just commands. In JS, **functions are values** — just like numbers or strings:

```js
// 1. Store in a variable
const greet = function(name) { return "Hi " + name; };

// 2. Pass as an argument to another function
function execute(fn, value) {
    return fn(value);
}
console.log(execute(greet, "Deepak"));  // "Hi Deepak"

// 3. Return from another function
function createMultiplier(factor) {
    return function(n) {
        return n * factor;
    };
}
const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log(double(5));   // 10
console.log(triple(5));   // 15
```

```
┌─────────────────────────────────────────┐
│  In JavaScript, functions are           │
│  "first-class citizens" — they can:     │
│                                         │
│  ✓ Be assigned to variables             │
│  ✓ Be passed as arguments (callbacks)   │
│  ✓ Be returned from other functions     │
│  ✓ Be stored in arrays and objects      │
│  ✓ Have properties (they're objects!)   │
└─────────────────────────────────────────┘
```

**Quick Check Answer — What does `createMultiplier(2)` return?**

It returns a **function** — not a number, not a result. Specifically it returns:

```js
function(n) {
    return n * 2;  // factor is "remembered" as 2
}
```

This returned function, when called with an input, multiplies it by `2` and returns the result. This is a preview of closures (Day 9) — the inner function remembers `factor` from the outer function even after `createMultiplier` has finished.

### Callback Functions

A **callback** is a function you pass to another function, to be called later:

```js
function processUser(name, callback) {
    const upper = name.toUpperCase();
    callback(upper);
}

processUser("deepak", function(result) {
    console.log(result);  // "DEEPAK"
});

// Same with arrow function
processUser("deepak", (result) => {
    console.log(result);  // "DEEPAK"
});
```

You'll use callbacks everywhere — array methods (Day 7), event handlers, async code (Day 14–17).

---

## Part 6: Arrow Functions vs Regular Functions — The Real Differences

They look like syntax sugar, but they're fundamentally different in three ways.

### Difference 1: No own `this`

```js
const obj = {
    name: "Deepak",

    // Regular function — has its own `this`
    greetRegular: function() {
        console.log("Hello, " + this.name);  // "Hello, Deepak"
    },

    // Arrow function — inherits `this` from surrounding scope
    greetArrow: () => {
        console.log("Hello, " + this.name);  // "Hello, undefined"
    }
};

obj.greetRegular();  // works
obj.greetArrow();    // broken — `this` is NOT the object
```

We'll cover `this` deeply on Day 12. For now: **don't use arrow functions as object methods.**

### Difference 2: No `arguments` Object

```js
function regular() {
    console.log(arguments);  // [1, 2, 3] — array-like object
}
regular(1, 2, 3);

const arrow = () => {
    console.log(arguments);  // ❌ ReferenceError!
};
arrow(1, 2, 3);

// Fix: use rest parameters with arrows
const arrow = (...args) => {
    console.log(args);  // [1, 2, 3] — real array
};
```

### How `arguments` Spreading Works (Three Ways)

This matters when you have a regular function and want to pass its `arguments` to another function:

```js
function demo(a, b) {
    console.log("a:", a, "b:", b);
}

function wrapper() {
    // arguments = { 0: "x", 1: "y", length: 2 }  (array-like object)
}

wrapper("x", "y");
```

**Option 1: `demo(arguments)`**
```
arguments = { 0: "x", 1: "y", length: 2 }

demo( arguments )
       │
       ▼
  a = { 0: "x", 1: "y", length: 2 }   ← entire object as ONE argument
  b = undefined

Output: a: {0: "x", 1: "y"} b: undefined
```

You're passing the whole box, not its contents.

**Option 2: `demo(...arguments)` ✅**
```
arguments = { 0: "x", 1: "y", length: 2 }

demo( ...arguments )
        │
     unpack
      │   │
      ▼   ▼
  a = "x"
  b = "y"

Output: a: "x" b: "y"
```

`...` opens the box and passes each item separately — like pouring marbles out of a bag, each goes into its own slot.

**Option 3: `demo([...arguments])`**
```
arguments = { 0: "x", 1: "y", length: 2 }

[...arguments] → ["x", "y"]   ← creates a real array first

demo( ["x", "y"] )
         │
         ▼
  a = ["x", "y"]   ← entire array as ONE argument
  b = undefined

Output: a: ["x", "y"] b: undefined
```

You unpacked the box, repacked it into a new box, then passed the new box as one argument.

```
┌──────────────────────────────────────────────────┐
│  demo(arguments)        →  one big object in     │
│  demo(...arguments)     →  each value separately  │  ✅
│  demo([...arguments])   →  one array in           │
└──────────────────────────────────────────────────┘
```

### Difference 3: Cannot Be Used as Constructors

```js
function Person(name) {
    this.name = name;
}
const p = new Person("Deepak");  // ✅ works

const PersonArrow = (name) => {
    this.name = name;
};
const p2 = new PersonArrow("Deepak");  // ❌ TypeError!
```

### When to Use Which?

```
Arrow functions ───→ callbacks, array methods, short utilities
                      const double = n => n * 2;
                      arr.map(x => x * 2);
                      setTimeout(() => { ... }, 100);

Regular functions ─→ object methods, constructors, when you need `this` or `arguments`
                      const obj = { greet: function() { this.name } };
                      function Person(name) { this.name = name; }
```

---

## Part 7: Functions in Memory (MAANG Deep Dive)

### Stack vs Heap

Your computer's memory has two areas:

```
STACK                              HEAP
┌────────────────────┐            ┌─────────────────────┐
│  Small, fast,      │            │  Large, flexible,   │
│  organized         │            │  unorganized        │
│                    │            │                     │
│  Stores:           │            │  Stores:            │
│  - simple values   │            │  - objects          │
│    (numbers, etc)  │            │  - arrays           │
│  - references      │            │  - functions        │
│    (addresses)     │            │  - anything complex │
└────────────────────┘            └─────────────────────┘
```

**Analogy:** Stack is your desk — small, organized, fast access. Heap is your warehouse — big, unstructured, stores bulky items. Your desk has a sticky note (reference/address) saying "box #42 in warehouse" pointing to the actual item.

When a function is **defined**, V8 stores it as an object on the heap:

```
STACK                          HEAP
┌──────────────────┐          ┌──────────────────────┐
│                  │          │  Function Object      │
│  greet: ─────────────────►  │  - name: "greet"     │
│  <ref 0xA1>      │          │  - length: 1 (params)│
│                  │          │  - [[Code]]: ...      │
│                  │          │  - [[Scope]]: ...     │
└──────────────────┘          └──────────────────────┘
```

### Execution Context

Every time a function is **called**, the engine creates a temporary workspace for it:

```js
function add(a, b) {
    const result = a + b;
    return result;
}

add(3, 5);
```

```
When add(3, 5) is called, engine creates:

┌─────────────────────────┐
│  Workspace for add()    │
│                         │
│  a = 3                  │
│  b = 5                  │
│  result = 8             │
│                         │
└─────────────────────────┘
← destroyed when function returns
```

That workspace IS the execution context. It holds the function's variables while it runs, then gets cleaned up. The full version:

```
Call: greet("Deepak")

┌─────────────────────────────────────┐
│  Execution Context for greet()      │
│                                     │
│  Variable Environment:              │
│    name = "Deepak"  (parameter)     │
│                                     │
│  Scope Chain:                       │
│    greet's scope → global scope     │
│                                     │
│  this: (depends on how called)      │
└─────────────────────────────────────┘
```

Each function call creates a NEW execution context. When the function returns, that context is **destroyed** (garbage collected) — UNLESS something holds a reference to its variables (that's a **closure**, Day 9).

### Scope Chain

Where the engine looks for variables it can't find locally:

```js
const name = "Deepak";    // global

function greet() {
    // no `name` here, so engine looks OUTSIDE → finds it in global
    console.log(name);
}
```

```
greet's scope  →  can't find `name`
      ↓
global scope   →  found `name` = "Deepak"  ✅
```

### `this`

A special variable that refers to "who called this function." Changes depending on HOW the function is called, not where it's written. Day 12 covers all 5 rules.

> Day 8 covers the full picture — call stack, creation phase vs execution phase, hoisting mechanics. It will all click completely then. For now these simplified models are sufficient.

### Functions Have Properties

Since functions are objects, they have properties:

```js
function add(a, b) {
    return a + b;
}

console.log(add.name);    // "add"
console.log(add.length);  // 2 (number of parameters)
console.log(typeof add);  // "function"

// You can even add custom properties
add.description = "Adds two numbers";
console.log(add.description);  // "Adds two numbers"
```

`typeof` returns `"function"` for functions — but they're technically objects. `"function"` is a special case in the spec, not a separate type.

---

## Part 8: Common Mistakes

**Mistake 1: Forgetting `return` in multi-line arrow functions**

```js
// ❌ Missing return
const add = (a, b) => {
    a + b;
};
console.log(add(3, 5));  // undefined!

// ✅ With return
const add = (a, b) => {
    return a + b;
};
```

With `{}` braces, you MUST explicitly write `return`. Without braces, return is implicit.

**Mistake 2: Returning an object from arrow function**

```js
// ❌ Engine thinks {} is a code block
const makeUser = () => { name: "Deepak" };
console.log(makeUser());  // undefined

// ✅ Wrap in parentheses
const makeUser = () => ({ name: "Deepak" });
console.log(makeUser());  // { name: "Deepak" }
```

**Mistake 3: Too many parameters**

```js
// ❌ Hard to remember argument order
function createUser(name, age, city, role, isActive, theme) { }

// ✅ Use an object parameter (destructuring — preview of Day 6)
function createUser({ name, age, city, role = "user", isActive = true }) { }

createUser({ name: "Deepak", age: 25, city: "Bhiwani" });
// Order doesn't matter, defaults work, self-documenting
```

**Mistake 4: Confusing parameter count**

```js
function add(a, b) {
    return a + b;
}

console.log(add(1));       // NaN — b is undefined, 1 + undefined = NaN
console.log(add(1, 2, 3)); // 3 — extra argument 3 is silently ignored
```

JS doesn't enforce argument count. Missing params become `undefined`, extras are ignored (but accessible via `arguments` in regular functions).

---

## Day 4 Recap

1. **Three ways to define functions** — declaration (hoisted), expression (not hoisted), arrow (concise)
2. **Parameters vs arguments** — parameters are slots, arguments are values
3. **Default parameters** trigger on `undefined` only, not `null`
4. **Rest parameters** (`...args`) collect remaining arguments into a real array
5. **`return`** exits immediately; missing `return` = `undefined`
6. **Early return / guard clauses** — handle edge cases first, avoid nesting
7. **First-class functions** — can be stored, passed, returned like any value
8. **Callbacks** — functions passed to other functions, called later
9. **Arrow vs regular** — arrows have no `this`, no `arguments`, can't be constructors
10. **Functions are objects** on the heap, with `.name`, `.length`, and custom properties
11. Each call creates a new **execution context** (foundation for closures on Day 9)

---

---

# Practice Problems & Answers

## Beginner

### Q1: `isEven(n)` — arrow with implicit return

```js
const isEven = n => n % 2 === 0;

console.log(isEven(5));   // false
console.log(isEven(56));  // true
```

**Result: ✅ Perfect.** Clean implicit return.

---

### Q2: `getMax(a, b, c)` without `Math.max`

```js
function getMax(a, b, c) {
    if (a > b && a > c) return a;
    if (b > a && b > c) return b;
    return c;
}

console.log(getMax(1, -11, 5));
```

**Result: ✅ Works — but has a subtle edge case bug.**

What if two values are equal?

```js
console.log(getMax(5, 5, 3));  // returns 3! Wrong — should be 5
// a > b → 5 > 5 → false, so first condition fails
// b > a → 5 > 5 → false, so second condition fails
// falls through to return c = 3
```

**Fix — use `>=`:**

```js
function getMax(a, b, c) {
    if (a >= b && a >= c) return a;
    if (b >= a && b >= c) return b;
    return c;
}
```

---

## Intermediate

### Q3: What's the output?

```js
console.log(a());
console.log(b());

function a() { return "A"; }
const b = () => "B";
```

**My answer:**
> A
> ReferenceError, b declared but not initialized

**Result: ✅ Correct.**

`a()` works because function declarations are hoisted — the engine moves them to the top of scope before execution. `b()` throws `ReferenceError` because `const` is in the Temporal Dead Zone (TDZ) — it exists but is uninitialized until that line runs.

---

### Q4: `repeatString` with default parameter

```js
function repeatString(str, times = 2) {
    const arr = [];
    for (let i = 0; i < times; i++) {
        arr.push(str);
    }
    return arr.join('');
}

console.log(repeatString("ha", 3));  // "hahaha"
console.log(repeatString("hey"));    // "heyhey"
```

**Result: ✅ Works perfectly.**

Solid loop thinking. There's also a built-in shorthand you'll learn on Day 7:

```js
const repeatString = (str, times = 2) => str.repeat(times);
```

---

## Advanced / Interview

### Q5: `compose(f, g)`

```js
function compose(f, g) {
    return function() {
        const gResult = g(...arguments);
        return f(gResult);
    }
}

const double = n => n * 2;
const addOne = n => n + 1;

const doubleThenAdd = compose(addOne, double);
console.log(doubleThenAdd(5));  // 11
```

**Result: ✅ Almost perfect — and the `arguments` confusion is valid.**

`g(...arguments)` is correct. The three options compared:

```
g(arguments)       → passes the whole arguments OBJECT as one argument
g(...arguments)    → spreads each argument individually  ✅ correct
g([...arguments])  → packs into a real array, passes the array as one argument
```

Your code is correct. Even cleaner with rest parameters (since arrow functions don't have `arguments`):

```js
const compose = (f, g) => (...args) => f(g(...args));
```

Same logic — compressed to a one-liner you'll see in MAANG interviews.

---

### Q6: What's the output?

```js
function outer() {
    console.log("outer:", typeof inner);

    function inner() {
        return "hello";
    }

    return inner();
}

console.log(outer());
```

**My answer:**
> function
> hello

**Result: ✅ Correct but incomplete.**

Full output:

```
outer: function    ← inner is hoisted INSIDE outer's scope, so typeof is "function"
hello              ← outer() returns inner(), which returns "hello"
```

The key detail: hoisting works within any function scope, not just global. `inner` is hoisted to the top of `outer`'s scope, so it's available as a function before its declaration line.

---

### Q7: `once(fn)` — call function only first time

**My answer:**

```js
let result;
let isCalledOnce = false;

function once(fn) {
    if (!isCalledOnce) {
        isCalledOnce = true;
        result = fn();
    }
    return () => result;
}

const expensiveCalc = () => {
    console.log("computing...");
    return 42;
};

const calcOnce = once(expensiveCalc);
console.log(calcOnce());
console.log(calcOnce());
console.log(calcOnce());
```

**Result: ❌ Structural problem — `result` and `isCalledOnce` are global variables.**

That means if you call `once()` for two different functions, they share the same flag:

```js
const calcOnce = once(expensiveCalc);
const anotherOnce = once(someOtherFn);  // isCalledOnce is already true!
// someOtherFn never runs — broken!
```

The variables must live **inside** `once`, not globally. `once` should return a function that remembers its own private state:

**Correct version:**

```js
function once(fn) {
    let called = false;
    let result;

    return function() {
        if (!called) {
            called = true;
            result = fn();
        }
        return result;
    };
}
```

```
once(expensiveCalc) is called:
  → called = false, result = undefined are created (private to this call)
  → a NEW function is returned that can see called and result

calcOnce() — first time:
  → called is false → run fn() → store result → set called = true → return 42

calcOnce() — second time:
  → called is true → skip fn() → return stored 42

calcOnce() — third time:
  → same as second time → return 42
```

This is a **closure** — the returned function "closes over" `called` and `result`. The inner function remembers variables from the outer function even after `once()` has finished executing. Full mechanics on Day 9.

---

## Mini Project — Function Toolkit

### My Solution

```js
function capitalize(str) {
    let strArr = str.split(" ");
    strArr = strArr.map(str => (str[0].toUpperCase() + str.slice(1)));
    return strArr.join('');   // ⚠️ Bug
}

console.log(capitalize("hello world"));

function clamp(value, min, max) {
    if (value >= max) return max;
    if (value <= min) return min;
    return value;
}

console.log(clamp(15, 0, 10));
console.log(clamp(-5, 0, 10));
console.log(clamp(5, 0, 10));

function pipe(...args) {
    const funcList = args;
    return function(n) {
        let result = n;
        funcList.forEach(func => {
            result = func(result);
        });
        return result;
    }
}

const double = n => n * 2;
const addOne = n => n + 1;
const square = n => n * n;
const transform = pipe(double, addOne, square);
console.log(transform(3));  // 49
```

**`capitalize` — ✅ Logic correct, one bug:**

```js
return strArr.join('');   // ❌ "HelloWorld" — missing space
return strArr.join(' ');  // ✅ "Hello World"
```

**`clamp` — ✅ Correct.** Works for all edge cases. A clean one-liner alternative:

```js
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
```

**`pipe` — ✅ Perfect.** Logic is exactly right. Clean use of closures and `forEach`. One small note: `...args` already gives you an array, so `const funcList = args` is unnecessary — you can use `args` directly.

The compressed version you'll see in interviews:

```js
const pipe = (...fns) => (input) => fns.reduce((val, fn) => fn(val), input);
```

Same logic as yours — `reduce` replaces the `forEach` + manual `result` tracking. You'll learn `reduce` on Day 7.

---

## Corrections Summary

1. **`getMax` — use `>=` not `>`** — `>` breaks on equal values. `getMax(5, 5, 3)` returns `3` instead of `5` with strict `>`.
2. **`once` — state must be private, not global** — variables inside `once` create a private scope per call. Global variables break when `once` is used more than once.
3. **`capitalize` — `join(' ')` not `join('')`** — missing space in join collapses words together.
4. **Arrow functions + objects** — always wrap returned object literals in `()` otherwise `{}` is parsed as a code block.
5. **`g(...arguments)` is correct** — `g(arguments)` passes the object as one argument; `g([...arguments])` passes an array as one argument; only `g(...arguments)` spreads each value into its own slot.