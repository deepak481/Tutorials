# JS Day 5 — Revision Session (Days 1–4)

Today's session consolidates everything from Days 1–4 through rapid-fire recall, tricky output prediction, concept connection questions, build challenges, and a mega project. No new concepts — sharpening existing ones.

---

## Part 1 — Rapid Fire Recall

These test whether concepts are in muscle memory. Answer without running.

### Types & Coercion

**1. `typeof null`**
→ `"object"` — this is a historic bug in JavaScript. `null` is NOT an object; `typeof null === "object"` is a spec mistake that was never fixed for backwards compatibility.

**2. `typeof typeof 42`**
→ `"string"`. Evaluate inside out: `typeof 42` returns `"number"` (a string), then `typeof "number"` returns `"string"`. Note: `typeof` always returns a **lowercase string** — never `"Number"`, `"Boolean"`, etc.

**3. `typeof NaN`**
→ `"number"` — NaN means "Not a Number" but it's typed as number.

**4. `"5" - 3`**
→ `2` — subtraction has no string form; both sides coerce to numbers.

**5. `"5" + 3`**
→ `"53"` — `+` with a string triggers concatenation.

**6. `true + true + "1"`**
→ `"21"`. Evaluate left to right:
- `true + true` → `1 + 1` → `2` (both booleans, no string → numeric)
- `2 + "1"` → `"2" + "1"` → `"21"` (string involved → concatenation)

`true` becomes `1` when added to another boolean or number. It only becomes `"true"` when concatenated with a string directly (e.g. `true + "1"` → `"true1"`).

**7. `Boolean("")` vs `Boolean(" ")`**
→ `false` vs `true`. Empty string is falsy. A space is a non-empty string — truthy.

**8. `null == undefined` vs `null === undefined`**
→ `true` vs `false`. `==` is designed to treat them as equal (special spec rule). `===` is false because they are different values of different types: Null type and Undefined type. `typeof null === "object"` is a bug — null is NOT actually of object type.

**9. `NaN === NaN`**
→ `false`. NaN is the only value not equal to itself. Use `Number.isNaN(value)` to check.

**10. `0 ?? 42` vs `0 || 42`**
→ `0` vs `42`. `??` only skips `null` and `undefined` — keeps `0`. `||` treats `0` as falsy — skips to `42`.

---

### Functions

**11. Can you call a function declaration before its definition?**
→ Yes. Function declarations are hoisted with the entire function body as their value — available from the top of the scope.

**12. Can you call a `const` arrow function before its definition?**
→ No. `const` is hoisted but not initialized (Temporal Dead Zone). Calling it before the line throws `ReferenceError`.

**13. What does a function return if there's no `return` statement?**
→ `undefined`.

**14. `arguments` object exists in arrow functions — true or false?**
→ False. Arrow functions don't have their own `arguments`. They inherit `arguments` from the nearest enclosing regular function, or it doesn't exist at all.

**15. Default parameter triggers for `null` — true or false?**
→ False. Default parameters only trigger for `undefined`. `null` is treated as an intentional value and passed through.

---

### Control Flow

**16. `switch` uses `==` or `===`?**
→ `===` — strict equality. No type coercion.

**17. What happens without `break` in a `switch` case?**
→ Fall-through — execution continues into the next `case` body without checking its condition, until a `break` or `return` is hit.

**18. `for...of` gives values or keys?**
→ Values. Works on any iterable: arrays, strings, Maps, Sets. Does NOT work on plain objects.

**19. `for...in` gives values or keys?**
→ Keys (as strings). Enumerates all enumerable properties, including inherited ones.

**20. Can you use `for...of` on a plain object?**
→ No. Plain objects are not iterable. Throws `TypeError: obj is not iterable`. Use `Object.keys()`, `Object.values()`, or `Object.entries()` with `for...of` instead.

---

## Part 2 — Tricky Output Questions (MAANG Style)

Work through on paper before checking.

**Q1:**
```js
let a = 10;
let b = a;
a = 20;
console.log(b);
```
Primitives copy by value — `b` gets its own `10`. Reassigning `a` doesn't affect `b`.

**Q2:**
```js
let x = { count: 1 };
let y = x;
y.count = 5;
console.log(x.count);
```
Objects copy by reference — `y` points to the same heap object as `x`. Mutating via `y` affects what `x` sees.

**Q3:**
```js
console.log(greet());
console.log(hello());

function greet() { return "hi"; }
const hello = () => "hey";
```
`greet()` is a function declaration — hoisted, prints `"hi"`. `hello` is a `const` — in TDZ at that line, throws `ReferenceError: Cannot access 'hello' before initialization`. The second log never runs.

**Q4:**
```js
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
}
```
Prints `3 3 3`. `var` is function-scoped — there is only one `i`. All three callbacks share that same variable. By the time they run (after the loop), `i` is `3`.

**Q5:**
```js
const a = "5";
const b = 3;
console.log(a + b);   // "53"
console.log(a - b);   // 2
console.log(+a + b);  // 8
```
`+a` is the unary plus operator — converts string `"5"` to number `5`. Then `5 + 3 = 8`.

**Q6:**
```js
function test() {
    return
    {
        name: "Deepak"
    }
}
console.log(test());
```
Prints `undefined`. JavaScript's Automatic Semicolon Insertion (ASI) adds a semicolon after `return`:
```js
return;        // ← JS inserts semicolon here
{              // ← unreachable code block
    name: "Deepak"
}
```
Fix: always put the opening `{` on the same line as `return`:
```js
return {
    name: "Deepak"
};
```

**Q7:**
```js
const arr = [10, 20, 30];
for (const key in arr) {
    console.log(typeof key, key);
}
```
Prints:
```
string 0
string 1
string 2
```
`for...in` on arrays gives the keys, and array keys are always **strings** — `"0"`, `"1"`, `"2"`, not numbers. This is why `for...in` on arrays is dangerous — the type surprises you.

**Q8:**
```js
function outer(x) {
    return function inner(y) {
        return x + y;
    };
}

const add5 = outer(5);
console.log(add5(3));   // 8
console.log(add5(10));  // 15
```
`outer(5)` returns `inner` with `x` locked to `5` via closure. Classic closure-as-factory pattern.

**Q9:**
```js
console.log([] + {});
console.log(typeof ([] + {}));
```
Prints `"[object Object]"` then `"string"`. `[]` coerces to `""`, `{}` coerces to `"[object Object]"` — concatenation produces `"[object Object]"`.

**Q10:**
```js
const fn = (a, b = a * 2) => a + b;
console.log(fn(3));      // 9
console.log(fn(3, 10));  // 13
```
`fn(3)` → `b` defaults to `3 * 2 = 6` → `3 + 6 = 9`. Default parameters can reference earlier parameters.

---

## Part 3 — Concept Connection Questions

**1. Why does `const obj = {a: 1}; obj.a = 2;` work but `const x = 5; x = 10;` fails?**

The object is allocated on the heap. The stack holds a reference (memory address) to that heap location — and `const` locks the reference, not the heap contents. So `obj.a = 2` mutates the heap object (allowed) but `obj = {}` would change the reference (blocked). `const x = 5` stores the value directly on the stack — `const` locks that slot, so `x = 10` fails.

**2. Why does `var` in a for-loop break with `setTimeout` but `let` doesn't?**

`var` is function-scoped — the entire loop shares one `i`. All callbacks close over the same variable, which is `3` by the time they run. `let` creates a new binding per iteration — each callback closes over its own copy of `i` with the right value.

**3. Why can't arrow functions be used as object methods?**

Arrow functions don't have their own `this` — they inherit `this` from their lexical scope (where they were written). When an arrow is defined as an object property, the lexical scope is the module or global — not the object. So `this.name` inside the arrow finds nothing on the object; it looks at the outer scope instead.

**4. What's the relationship between `||` and `??`?**

`||` returns the first truthy value (or last value). It treats `0`, `""`, `false`, `NaN` as falsy — which is wrong when those are valid, intentional values. `??` (nullish coalescing) only skips `null` and `undefined` — it keeps `0`, `""`, `false`, `NaN`. So `??` is the right choice when you want a default only for "not provided" cases, not for all falsy values.

---

## Part 4 — Build Challenges

### Challenge 1: `retry(fn, times)`

**Goal:** Try `fn()`. On error, retry up to `times` times. Return result on success, or `"Failed after X attempts"`.

**My answer:**
```js
function retry(fn, times) {
    if(times < 1) return "Function not invoked even once. Times's value is smaller than 1";
    let count = 1;
    while(count <= times) {
        try {
            const result = fn();
            return result;
        } catch {
            count++;
        }
    }
    return `Failed after ${count-1} attempts`;
}
```

**Result: ✅ Correct**

Works correctly. Clean try/catch inside a while loop. The input validation for `times < 1` is a good defensive touch. Returns the actual result on success, tracks attempt count correctly.

---

### Challenge 2: `createCounter(start)`

**Goal:** Return an object with `increment()`, `decrement()`, `getCount()` using closure pattern.

**My answer:**
```js
unction createCounter(start) {   // ⚠️ typo: "unction" instead of "function"
    this.count = start;           // ⚠️ using `this` — constructor pattern, not closure

    this.increment = function() {
        this.count = this.count + 1;
    }

    this.decrement = function() {
        this.count = this.count - 1;
    }

    this.getCount = function() {
        return this.count;
    }
}
```

**Result: ❌ Two bugs**

**Bug 1 — Typo:** `unction` instead of `function` — syntax error, won't run.

**Bug 2 — Wrong pattern:** Used constructor pattern with `this` instead of closure. This version requires `new createCounter(10)` and exposes `count` publicly — anyone can do `counter.count = 999`. The challenge specifically asked for the closure pattern, which makes `count` private.

**Correct closure version:**
```js
function createCounter(start) {
    let count = start;  // private — lives in closure

    return {
        increment: () => ++count,
        decrement: () => --count,
        getCount: () => count
    };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.getCount());  // 11
```

**Why closures beat constructors here:** `count` is inaccessible from outside — there's no `counter.count` property to tamper with. The returned methods are the only way to interact with it. This encapsulation pattern appears constantly in MAANG interviews.

---

### Challenge 3: `parseInput(input)`

**Goal:** Return an object `{ value, type }` describing the input string.

**My answer:**
```js
function parseInput(str) {
    if(str === "") {
        console.log(({ value: "", type: "empty" }));  // ⚠️ console.log, not return
        return;
    }

    if(str === "true") {
        console.log({ value: true, type: "boolean" });
        return;
    }

    if(str === "false") {
        console.log({ value: false, type: "boolean" });
        return;
    }

    if(str === "null") {
        console.log({ value: null, type: "null" });
        return;
    }

    const isNan = isNaN(str);  // ⚠️ stores result in `isNan`

    if(isNaN) {                // ⚠️ checks the GLOBAL `isNaN` function (always truthy!)
        console.log({ value: str, type: "string" });
        return;
    }

    if(Number.isInteger(Number(str))) {
        console.log({ value: Number(str), type: "integer" });
        return;
    }

    console.log({ value: Number(str), type: "float" });
    return;
}
```

**Result: ❌ Two bugs**

**Bug 1 — Variable name collision:**
```js
const isNan = isNaN(str);  // stores result in variable named `isNan`
if (isNaN) {               // ❌ checks the GLOBAL `isNaN` FUNCTION, not your variable
                           // a function reference is always truthy → this branch ALWAYS fires
```
The variable is `isNan` (lowercase n) but the check uses `isNaN` (uppercase N — the global function). The global function is always truthy. So every input that isn't caught by the earlier checks falls into the string branch.

**Fix:** Use `Number.isNaN` on the converted number, and keep naming consistent:
```js
const num = Number(str);
if (Number.isNaN(num)) {
    return { value: str, type: "string" };
}
```

**Bug 2 — `console.log` instead of `return`:**
The function should `return` the object so the caller can use it. `console.log` inside the function means the caller gets `undefined`. Let the caller decide whether to log, store, or pass it on.

**Good instinct:** You correctly avoided `Boolean("false")` → that returns `true` (non-empty string). You switched to explicit string comparisons, which is exactly right.

**Correct version:**
```js
function parseInput(str) {
    if (str === "") return { value: "", type: "empty" };
    if (str === "true") return { value: true, type: "boolean" };
    if (str === "false") return { value: false, type: "boolean" };
    if (str === "null") return { value: null, type: "null" };

    const num = Number(str);
    if (Number.isNaN(num)) return { value: str, type: "string" };
    if (Number.isInteger(num)) return { value: num, type: "integer" };
    return { value: num, type: "float" };
}
```

---

## Part 5 — Day 5 Mega Project: Student Grade Analyzer

**My answer:**
```js
const students = [
    { name: "Deepak", scores: [85, 92, 78, 95, 88] },
    { name: "Rahul", scores: [65, 70, 72, 68, 75] },
    { name: "Priya", scores: [95, 98, 92, 97, 100] },
    { name: "Amit", scores: [45, 55, 40, 50, 48] },
    { name: "Sneha", scores: [80, 82, 85, 79, 88] }
];

function getAverage(scores) {
    if(scores.length < 1) return 0;
    const sum = scores.reduce((val, sc) => val + sc, 0);
    return sum / scores.length;
}

function getGrade(average) {
    if(average >= 90) return "A";
    if(average >= 80) return "B";
    if(average >= 70) return "C";
    if(average >= 60) return "D";
    return "F";
}

function getMinMaxScore(scores) {
    let min = 101; max = -1;         // ⚠️ missing `let` on max
    scores.forEach(sc => {
        if(sc < min) { min = sc; }
        if(sc > max) { max = sc; }
    })
    return {min, max};
}

function getStudentReport(student) {
    const avg = getAverage(student.scores);
    const grade = getGrade(avg);
    const {min, max} = getMinMaxScore(student.scores);
    return `Deepak | Avg: ${avg} | Grade: ${grade} | Highest: ${max} | Lowest: ${min}`;
    //       ⚠️ hardcoded "Deepak" instead of student.name
}

function getStudentsPerGrade(students) {
    const grades = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0};
    students.forEach(st => {
        const avg = getAverage(st.scores);
        const grade = getGrade(avg);
        grades[grade]++;
    })
    return grades;
}

function getClassDetails(students) {
    let totalSum = 0;
    let highest = -1;
    let highestScorer = null;
    let lowestScorer = null;
    let lowest = 101;
    
    students.forEach(st => {
        st.scores.forEach(sc => {
            totalSum += sc;
            if(sc > highest) { highest = sc; highestScorer = st.name; }
            if(sc < lowest)  { lowest = sc;  lowestScorer = st.name; }
        })
    })
    return { avg: totalSum/(students.length * students[0].scores.length), highestScorer, lowestScorer };
}

function getStudentReport(students) {   // ⚠️ DUPLICATE function name — overwrites the first
    const classDetails = getClassDetails(students);
    const studentsPerGrade = getStudentsPerGrade(students);

    return {
        classAvg: classDetails.avg,
        highestScorer: classDetails.highestScorer,
        lowestScorer: classDetails.lowestScorer,
        studentsPerGrade
    } 
}

function getTopPerformers(students, n = 3) {
    const studentsByRank = [];
    students.forEach(st => {
        const avg = getAverage(st.scores);
        studentsByRank.push({name: st.name, avgScore: avg});
    })
    studentsByRank.sort();             // ⚠️ no comparator — sorts by string conversion
    return studentsByRank.slice(0, n); // ✅ correct use of slice
}
```

**Result: 🟡 Logic correct, 4 bugs**

---

**Bug 1 — Missing `let` on `max` (accidental global):**
```js
// ❌
let min = 101; max = -1;   // `max` becomes a global variable

// ✅
let min = 101, max = -1;
// or
let min = 101;
let max = -1;
```
Without `let`, `max` silently becomes a property of the global object. In larger programs this can cause very hard-to-track bugs. Also — `getMinMaxScore` can be simplified:
```js
const getMinMaxScore = (scores) => ({
    min: Math.min(...scores),
    max: Math.max(...scores)
});
```

**Bug 2 — Hardcoded `"Deepak"` in template string:**
```js
// ❌
return `Deepak | Avg: ${avg} | ...`

// ✅
return `${student.name} | Avg: ${avg} | ...`
```

**Bug 3 — Duplicate function name `getStudentReport`:**
Two functions with the same name. The second (which is actually `getClassReport`) silently overwrites the first. The first one disappears.

**Fix:** Rename the second function to `getClassReport`:
```js
function getClassReport(students) {
    // ... class-level summary
}
```

**Bug 4 — `sort()` without a comparator:**
```js
// ❌
studentsByRank.sort();   // sorts by string conversion of the object — wrong

// ✅ Sort descending by avgScore (highest first)
studentsByRank.sort((a, b) => b.avgScore - a.avgScore);
```

**How the comparator works:**
```
If return value < 0  →  a comes first
If return value > 0  →  b comes first
If return value = 0  →  order unchanged

b.avgScore - a.avgScore → descending (highest first)
a.avgScore - b.avgScore → ascending (lowest first)
```

`sort()` and its comparator will be covered deeply on Day 7 (array methods). For now: always pass a comparator when sorting objects or numbers.

**`slice` vs `splice` — your guess was right:**
`slice(start, end)` returns a new sub-array — does NOT modify the original. `splice` modifies in place (removes or inserts elements). Key distinction.

**On the `switch` for ranges question:**
You correctly used early-return `if` chains for `getGrade`. That is the right approach. `switch` can be forced to handle ranges with `switch (true)` but it reads poorly:
```js
// Works but avoid this
switch (true) {
    case average >= 90: return "A";
    case average >= 80: return "B";
}
```
Use `switch` only for exact value matching. Use `if/else` chains for ranges.

---

## Corrections Summary

| # | Location | Error | Fix |
|---|----------|-------|-----|
| 1 | P1 Q2 | `typeof typeof 42` → `"Number"` | Returns `"string"`. `typeof` always returns lowercase |
| 2 | P1 Q6 | `true + true + "1"` → `"truetrue1"` | `true+true = 2`, then `2+"1" = "21"` |
| 3 | P1 Q8 | Reasoned `null === undefined` fails because `null` is `"object"` type | `typeof null === "object"` is a historic bug. They fail because they're different types: Null ≠ Undefined |
| 4 | P2 Q3 | `hello()` prints `"hey"` | Throws `ReferenceError` — `const` arrow is in TDZ |
| 5 | P2 Q7 | `typeof key` is `Number` | `for...in` keys are always strings — `"0"`, `"1"`, `"2"` |
| 6 | P3 Q4 | `??` doesn't consider `false` as false | `??` skips only `null`/`undefined` — keeps `false`, `0`, `""`, `NaN` |
| 7 | C2 | Typo: `unction`, used `this` / constructor pattern | Closure pattern: `let count = start`, return object with methods closing over `count` |
| 8 | C3 | Variable `isNan` shadowed by global `isNaN` function (always truthy) | Use `Number.isNaN(Number(str))` with consistent naming |
| 9 | C3 | `console.log` inside function | `return` the object; let the caller decide |
| 10 | P5 | Missing `let` on `max` | `let min = 101, max = -1;` |
| 11 | P5 | Hardcoded `"Deepak"` in template | `${student.name}` |
| 12 | P5 | Duplicate `getStudentReport` function name | Rename second to `getClassReport` |
| 13 | P5 | `sort()` without comparator | `sort((a, b) => b.avgScore - a.avgScore)` |

**Recurring habits to watch:**
- Variable naming precision: `isNan` vs `isNaN` — one character caused a real bug
- Always declare with `let`/`const` — no accidental globals
- Functions return values; `console.log` is for debugging
- Closure pattern for encapsulation vs constructor pattern (closures hide state)