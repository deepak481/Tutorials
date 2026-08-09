# React Day 4 — State: useState, Re-renders, State vs Props, and Batching

---

## Part 1: The Problem State Solves

Everything you've built so far is **static**. Once a component renders, it never changes on its own. Click a button? Nothing happens visually. Type in an input? Nothing gets remembered. Your components have no memory.

Let's prove this:

```jsx
function Counter() {
  let count = 0;

  function increment() {
    count = count + 1;
    console.log(count); // this WILL increase
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Add</button>
    </div>
  );
}
```

Run this. Click the button. The `console.log` shows the number increasing — 1, 2, 3. But **the screen still shows "Count: 0"**.

Why? Because `count` is a plain local variable. When you click, `increment()` changes `count` in memory. But React has no idea this happened. React doesn't know to re-run `Counter` and re-render the JSX. The variable changed, but nobody told React to update the screen.

This is the exact same problem from Day 1 — the "manually sync data and UI" problem — now happening inside a component.

```
What you WANT:
  data changes → screen updates automatically

What actually happens with a plain variable:
  data changes → screen does NOT update
  (React doesn't know the function needs to re-run)
```

**State** is React's solution. State is special data that, when changed, tells React: "re-run this component and update the screen."

---

## Part 2: Introducing `useState`

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Add</button>
    </div>
  );
}
```

### `useState` is a Hook

`useState` is a **Hook** — a special React function that lets you "hook into" React features from a function component. Hooks always start with `use`. We'll meet many hooks (`useEffect`, `useRef`, `useContext`...) — today is the first and most important one.

### The Syntax

```jsx
const [count, setCount] = useState(0);
```

`useState(0)` does two things:
1. Tells React: "this component needs to remember a piece of state, starting at `0`."
2. Returns an **array with exactly two elements**:
   - `count` — the current value of the state
   - `setCount` — a function to update that state

```
useState(0) returns: [0, function]
                       ↑      ↑
                     value  updater function

const [count, setCount] = useState(0);
       ↑        ↑
  array destructuring — same syntax as:
  const [a, b] = [1, 2];  // a=1, b=2
```

This is **array destructuring**, not object destructuring (which we used for props). Order matters — first item is always the value, second is always the setter.

**Naming convention:** `const [thing, setThing] = useState(...)`. Always name the setter `set` + capitalized state name. Not enforced by React — but a universal convention you should always follow.

### Comprehension Check #1 — Why does `useState` return an array, not an object?

**Answer:** With array destructuring, you can name the variables **anything you want**, because position determines meaning, not the key name:

```jsx
const [count, setCount] = useState(0);
const [age, setAge] = useState(25);
```

If `useState` returned an object like `{ value, setValue }`, you'd need to rename every time to avoid collisions:

```jsx
// Awkward with an object return:
const { value: count, setValue: setCount } = useState(0);
const { value: age, setValue: setAge } = useState(25);
```

Array destructuring by position is more ergonomic. This is a deliberate API design choice.

---

## Part 3: Why You Can't Just Mutate State Directly

```jsx
// ❌ NEVER do this
const [count, setCount] = useState(0);

function increment() {
  count = count + 1;  // doesn't work
}
```

This fails for two reasons.

**Reason 1: `count` is a `const`.** JavaScript won't let you reassign it.

**Reason 2 (the deeper one):** Even if it weren't `const`, React wouldn't know you changed it. React needs to be explicitly *told* "state changed, please re-render." That's what `setCount` does — it's not just updating a variable, it's **signaling to React** that a re-render is needed.

```
setCount(newValue) does two things:

1. Updates the stored state value (for the NEXT render)
2. Tells React: "schedule a re-render of this component"

Just writing `count = newValue` does neither.
```

**Calling the setter is what triggers React to re-render. Nothing else does.**

---

## Part 4: What "Re-render" Actually Means

```
STEP-BY-STEP TRACE for Counter:

Initial render:
  1. React calls Counter() for the first time.
  2. useState(0) initializes state to 0, returns [0, setCount].
  3. count = 0.
  4. Component returns JSX: <div><p>Count: 0</p>...</div>
  5. React renders this to the real DOM. Screen shows "Count: 0".

User clicks button:
  6. increment() runs. setCount(count + 1) → setCount(1).
  7. React receives this call. Does NOT immediately change the screen.
     Schedules a re-render and stores 1 as the new state value.

React re-renders:
  8. React calls Counter() AGAIN — entire function runs from the top.
  9. useState(0) is called again — BUT React remembers this component
     already has state and returns the CURRENT value: 1.
     (The "0" initial value argument is ignored on subsequent renders.)
  10. count = 1 (in this new function call).
  11. Component returns NEW JSX: <div><p>Count: 1</p>...</div>
  12. React diffs new tree against old tree.
  13. Only the text "0" → "1" differs.
  14. React updates JUST that text node in the real DOM.
  15. Screen shows "Count: 1".
```

**The entire `Counter` function re-runs from top to bottom on every state change.** Every line executes again. But React is smart about the REAL DOM — it only touches the specific DOM nodes that actually changed.

```
Render Phase (JS objects, cheap, runs every time):
  Counter() called → builds new Virtual DOM tree

Commit Phase (real DOM, expensive, only touches what changed):
  React diffs old vs new tree → updates only <p> text content
```

---

## Part 5: How Does `useState(0)` Know Which "0" to Use on Re-render?

If `Counter()` runs again from scratch, and `useState(0)` is called again with `0`... why doesn't the count reset to 0 every time?

**The initial value argument to `useState` is only used on the very first render.** After that, React maintains the current state value internally — in React's own memory, tied to this specific component instance, outside the function entirely. On every subsequent render, `useState(0)` ignores the `0` and returns the current stored value.

```
Mental model:

Render 1: Counter() runs
          useState(0) → "no stored value yet, use 0" → count = 0
          React stores: [Counter instance] → state = 0

Render 2: Counter() runs (after setCount(1))
          useState(0) → "stored value is already 1, ignore the 0" → count = 1
          React stores: [Counter instance] → state = 1

Render 3: Counter() runs (after setCount(2))
          useState(0) → "stored value is 2" → count = 2
```

```
     Function scope                React's internal memory
     (recreated every render)      (persists across renders)

Render 1:
  Counter() {                       [Counter #1]: state = 0
    count = 0    ←──────────────────
  }

Render 2:
  Counter() {                       [Counter #1]: state = 1
    count = 1    ←──────────────────
  }
```

State lives in React, not in the function's local scope. The function is recreated; the state persists.

**How does React know which memory cell belongs to which `useState` call?** It tracks them by **call order** — the first `useState` call maps to the first slot, the second to the second, etc. This is exactly why the Rules of Hooks exist.

---

## Part 6: Rules of Hooks

Two non-negotiable rules:

**Rule 1: Only call hooks at the top level.** Never inside loops, conditions, or nested functions.

```jsx
// ❌ NEVER
function Counter() {
  if (someCondition) {
    const [count, setCount] = useState(0);  // conditional hook call!
  }
}

// ✅ Always at the top level
function Counter() {
  const [count, setCount] = useState(0);
  if (someCondition) {
    // use count here
  }
}
```

**Why?** React tracks hooks by call order. If a hook call is sometimes skipped, the order shifts between renders and React assigns the wrong stored value to the wrong hook.

```
Render A (condition true):          Render B (condition false):
  useState(0) → slot 1                useState(0) → SKIPPED
  useState('') → slot 2               useState('') → becomes slot 1!
                                       React gives it slot 1's stored value
                                       meant for a completely different state.
                                       💥 Bug.
```

**Rule 2: Only call hooks from React function components (or custom hooks).** Never from regular JavaScript functions. React needs to know "which component is currently rendering" to correctly associate hook calls with that component's memory.

### Comprehension Check #2 — Why does hook ORDER matter more than hook names?

**Answer:** Because at the point `useState()` executes, React has no idea what you're going to name the returned variables — the function call happens *before* the destructuring assignment. `const [count, setCount] = useState(0)` — React only sees the `useState(0)` call; the names `count`/`setCount` are just local JavaScript variables assigned afterward. React cannot "see" your variable names from inside its own code. Position (call order) is the only reliable signal available at the time the hook executes.

---

## Part 7: Multiple State Variables

```jsx
function ProfileForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
      <p>Subscribed: {isSubscribed ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

Each `useState` call manages one independent piece of state. React tracks each in its own slot, in order.

```
React's memory for this component instance:

Slot 1: name          → ''
Slot 2: age            → 0
Slot 3: isSubscribed   → false
```

**Multiple `useState` vs one state object?**

```jsx
// Option A: separate states — simpler when values are independent
const [name, setName] = useState('');
const [age, setAge] = useState(0);

// Option B: one object — better when values are logically grouped
const [profile, setProfile] = useState({ name: '', age: 0 });
```

Prefer separate `useState` calls unless there's a clear reason to group — it's simpler to reason about. We'll revisit this tradeoff properly at `useReducer` (Day 13).

---

## Part 8: State Updates Are Asynchronous — Batching

Look at this:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count); // what does this log?
  }

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

If `count` is currently `0` and you click, what does `console.log(count)` print?

It prints **`0`** — not `1`.

Why? Because `setCount` doesn't update `count` immediately. It schedules a re-render. The `count` variable inside THIS specific function call remains whatever it was when the function started running — it's a `const`, local to that specific call of `Counter()`, frozen for the duration of this render. The update becomes visible only in the NEXT render.

More precisely: `count` is a local `const` belonging to one specific call of `Counter()`. `handleClick` is a **closure** — it still sees that `count` when you click, because `handleClick` was defined inside `Counter()` and captures variables from the scope in which it was created. By the time you click the button, that particular call of `Counter()` has already finished running — but `handleClick` still holds a reference to that render's `count`. That's what a closure is: a function remembering variables from the scope it was created in, even after that outer scope has finished running.

```
Timeline:

handleClick() starts. count = 0 (from this render's closure)
  │
  ├── setCount(1) → React schedules update, does NOT change `count` now
  │
  ├── console.log(count) → still 0 (local const, local to this Counter() call)
  │
handleClick() ends.
  │
  ▼
React re-renders Counter()
  │
  ├── useState returns the NEW value: 1
  ├── count = 1 (fresh variable, this new render)
  ├── JSX shows "Count: 1"
```

### Batching: Multiple setState Calls

```jsx
function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}
```

If `count` starts at `0`, the final value after clicking once is **`1`**, not `3`.

Why? All three calls use the SAME `count` from this render's closure — which is `0`. Each effectively says "set count to `0 + 1`." React **batches** these into one re-render, and the final result is `1`.

```
count (from closure) = 0

setCount(0 + 1) → "set state to 1"
setCount(0 + 1) → "set state to 1"   (same closure value, same result)
setCount(0 + 1) → "set state to 1"

React batches all three into one update: final state = 1
Component re-renders ONCE, not three times.
```

### The Fix: Functional Updates

When your new state depends on the previous state, pass a **function** to the setter:

```jsx
function handleClick() {
  setCount(prevCount => prevCount + 1);
  setCount(prevCount => prevCount + 1);
  setCount(prevCount => prevCount + 1);
}
```

Now the result IS `3`. React queues these functions and runs them in order, each receiving the result of the previous one:

```
prev = 0 → returns 1
prev = 1 → returns 2
prev = 2 → returns 3

Final state = 3. Component re-renders ONCE with count = 3.
```

**Rule of thumb:** If your new state depends on the previous state, always use `setState(prev => ...)`. It's always safe, so many experienced React developers use it as a default habit.

```jsx
// ✅ Safe always
setCount(prev => prev + 1);

// ⚠️ Only safe when not calling it multiple times per event
setCount(count + 1);
```

### Comprehension Check #3 — What is `count` after ONE click?

```jsx
function Counter() {
  const [count, setCount] = useState(5);

  function handleClick() {
    setCount(count + 10);
    setCount(prev => prev + 1);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

**Answer: `count` becomes `16`.**

Trace: `count` starts at `5` for this render.
- `setCount(count + 10)` → `setCount(5 + 10)` → queues fixed value `15`
- `setCount(prev => prev + 1)` → queues a function; when this runs, `prev` is `15` (from the previous queued update) → returns `16`

React processes in order: first `15` is applied, then the function receives `15` as `prev` and returns `16`. Final state: `16`. Mixing styles is a real interview trap — always be consistent, prefer functional updates when in doubt.

---

## Part 9: State vs Props — The Critical Distinction

| | Props | State |
|---|---|---|
| **Owned by** | Parent component | The component itself |
| **Mutability** | Read-only | Can be changed (via setter) |
| **Who changes it** | Only the parent | Only the component itself (via its setter) |
| **Purpose** | Configure/customize from outside | Remember and manage own data over time |
| **Analogy** | Function arguments | Local variables that persist and trigger re-renders |

```jsx
function Counter({ label }) {         // "label" is a PROP — comes from parent
  const [count, setCount] = useState(0);  // "count" is STATE — owned here

  return (
    <div>
      <p>{label}: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add</button>
    </div>
  );
}

<Counter label="My Counter" />
```

`label` — the parent controls it. `Counter` cannot change `label` itself.

`count` — `Counter` fully owns it. The parent has no idea `count` exists.

### Each Component Instance Has Its Own State

```jsx
function App() {
  return (
    <div>
      <Counter label="First" />
      <Counter label="Second" />
    </div>
  );
}
```

```
Two SEPARATE instances, each with INDEPENDENT state:

  Counter instance #1        Counter instance #2
  label: "First"             label: "Second"
  count: 0 (its own)         count: 0 (its own)

Clicking "First"'s button:

  Counter instance #1        Counter instance #2
  count: 1  ← changed        count: 0  ← unaffected
```

Each `<Counter />` render creates a distinct instance with isolated memory. Clicking one never affects another.

---

## Part 10: React Internals — Fiber and State

React maintains an internal data structure (a **Fiber tree**, mirroring your component tree) where each component instance has a corresponding "fiber" node. That fiber node stores a linked list of hooks in the exact order they were called. This is the actual mechanism behind "React remembers state between renders" and "hooks must be called in the same order every time."

```
Component Tree:              Fiber Tree (React's internal bookkeeping):

    App                         Fiber(App)
     |                              |
  Counter (label="First")      Fiber(Counter#1) → hooks: [state: 0]
  Counter (label="Second")     Fiber(Counter#2) → hooks: [state: 0]
```

Each `Fiber(Counter#N)` is a separate memory location. That's the real answer to "how does React know which count belongs to which counter" — it's a data structure mapped 1:1 with your rendered component instances.

---

## Part 11: Machine Coding — Interactive Counter Widget

### Architecture

```
Counter (SMART — owns state, contains logic)
  │
  ├── CounterDisplay (DUMB — just displays count prop)
  ├── CounterControls (DUMB — just calls callback props)
  └── StepSelector (DUMB — renders step options, calls callback)
```

### Components

```jsx
// CounterDisplay.jsx — presentational, no state
function CounterDisplay({ count }) {
  return (
    <h1 style={{ fontSize: '48px', textAlign: 'center', margin: '20px 0' }}>
      {count}
    </h1>
  );
}
export default CounterDisplay;
```

```jsx
// CounterControls.jsx — receives callbacks as props, calls them
function CounterControls({ onIncrement, onDecrement, onReset }) {
  return (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
      <button onClick={onDecrement} style={buttonStyle}>−</button>
      <button onClick={onReset} style={buttonStyle}>Reset</button>
      <button onClick={onIncrement} style={buttonStyle}>+</button>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px', fontSize: '18px', cursor: 'pointer',
  border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#f9f9f9',
};
export default CounterControls;
```

`CounterControls` doesn't own state. It receives functions (`onIncrement`, etc.) as props and calls them when buttons are clicked. This is the callback pattern from Day 3 — the child signals up without touching the parent's state directly.

```jsx
// StepSelector.jsx
function StepSelector({ currentStep, onStepChange }) {
  const stepOptions = [1, 5, 10];

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
      <span style={{ marginRight: '8px' }}>Step size:</span>
      {stepOptions.map((step) => (
        <button
          key={step}
          onClick={() => onStepChange(step)}
          style={{
            padding: '4px 12px',
            border: currentStep === step ? '2px solid #0066cc' : '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: currentStep === step ? '#e6f0ff' : 'white',
            cursor: 'pointer',
          }}
        >
          {step}
        </button>
      ))}
    </div>
  );
}
export default StepSelector;
```

`currentStep === step` — derive visual state from data, don't store "which button is highlighted" as separate state.

```jsx
// Counter.jsx — the container, owns all state
import { useState } from 'react';
import CounterDisplay from './CounterDisplay';
import CounterControls from './CounterControls';
import StepSelector from './StepSelector';

function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  function handleIncrement() {
    setCount(prev => prev + step);
  }

  function handleDecrement() {
    setCount(prev => prev - step);
  }

  function handleReset() {
    setCount(0);
  }

  function handleStepChange(newStep) {
    setStep(newStep);
  }

  return (
    <div style={{
      maxWidth: '320px', margin: '40px auto', padding: '24px',
      border: '1px solid #ddd', borderRadius: '12px', fontFamily: 'sans-serif',
    }}>
      <CounterDisplay count={count} />
      <CounterControls
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onReset={handleReset}
      />
      <StepSelector currentStep={step} onStepChange={handleStepChange} />
    </div>
  );
}
export default Counter;
```

### Why `handleIncrement` Is a Closure

`handleIncrement` uses `step` from its enclosing scope. You might think "Counter is always running when handleIncrement runs" — but that's not true. `Counter()` runs once per render, top to bottom, and then it **exits**. By the time you click the button (maybe seconds later), that `Counter()` call has already finished. Yet `handleIncrement` still has access to `step`. That's a closure.

**A closure is a function that remembers variables from the scope it was created in, even after that outer scope has finished running:**

```js
function outer() {
  let x = 10;

  function inner() {
    console.log(x);  // inner "closes over" x
  }

  return inner;
}

const myFunc = outer();  // outer() runs and FINISHES
myFunc();  // logs 10 — even though outer() is long done
```

`outer()` exits before `myFunc()` is ever called, but `inner` still has `x`. Map this onto Counter:

```
Render happens (Counter() runs, then exits):
  step = 1 (this render's value)
  handleIncrement created — closes over this exact step (=1)
  Counter() exits, returns JSX

... user changes step to 5, Counter RE-RENDERS ...

New render (Counter() runs again, then exits):
  step = 5 (new render's value)
  a BRAND NEW handleIncrement created — closes over new step (=5)
  OLD handleIncrement (with step=1) is discarded

... user clicks "+" ...
  CURRENT handleIncrement runs (the one closing over step=5)
  uses step=5 ✓
```

Every render creates a **brand-new** `handleIncrement`, not the same one reused. Each is a separate closure, permanently locked to the `step` from that specific render. When you click, you're calling whichever `handleIncrement` was most recently created — it has its own private snapshot of `step` frozen inside it, regardless of whether `Counter` is currently executing.

This is why "stale closures" are one of the most common `useEffect` bugs in React (Day 7).

### Data Flow Diagram

```
              Counter
           (count, step)
          /      |       \
   count↓    callbacks↓     step↓ + onStepChange↓
    CounterDisplay  CounterControls  StepSelector
     (renders)        (calls back)    (renders + calls back)
```

---

## Part 12: Performance Note

When a parent re-renders, **all its children re-render too** by default, regardless of whether their specific props changed. This seems wasteful but is often fine — re-rendering a "dumb" component is cheap. For expensive components or large lists, it becomes a real performance concern.

The fix is `React.memo` — Day 22. Don't optimize prematurely. Understand the default behavior first.

---

## Part 13: Common Mistakes & Interview Traps

**Trap 1:** "Does setState immediately update the variable?"
No. It schedules a re-render. The current render's variable remains unchanged.

**Trap 2:** "Why does console.log show old state after calling setState?"
State updates apply on the NEXT render. Current render's `count` is frozen in that render's closure.

**Trap 3:** "I called setCount three times, why did it only increase by 1?"
Batching + using raw value (`count + 1`) instead of functional form (`prev => prev + 1`). All three read the same stale `count` from the closure.

**Trap 4:** "Can I mutate state directly, like `state.push(item)` for an array?"
No. React detects changes by reference comparison. Mutating in place doesn't change the reference — React won't notice. Always create a new array/object (Day 9).

**Trap 5:** "Is state shared between different instances of the same component?"
No. Each instance has completely separate, isolated state.

**Trap 6:** "What's the difference between `setCount(5)` and `setCount(prev => 5)`?"
Functionally identical when setting a fixed value. Functional form is safer when the new value depends on the old one.

---

## Day 4 Recap

1. **Plain variables don't trigger re-renders** — React has no way to know they changed
2. **useState** — a Hook that gives components memory; returns `[value, setter]`
3. **Calling the setter triggers re-render** — nothing else does
4. **Re-render = entire function re-runs**; React diffs and updates only what changed in real DOM
5. **Initial value used only on first render** — state persists in React's memory (Fiber), not the function's local scope
6. **Rules of Hooks** — top level only, components/hooks only — because React tracks hooks by call order
7. **Batching** — multiple setState calls in one event combine into one re-render
8. **Functional updates** — `setCount(prev => ...)` for safe sequential updates; always use when new state depends on old
9. **Closures** — handler functions capture state from the render they were created in; every re-render creates fresh handlers with fresh state values
10. **State vs Props** — props come from parent (read-only), state is owned by the component (changeable)
11. **Each instance has isolated state**
12. **Container/Presentational pattern** — smart parent owns state and logic; dumb children receive props and callbacks

---

---

# Practice Problems & Answers

## Beginner

### Q1: `ToggleLight`

```jsx
function App() {
  const [light, setLight] = useState(0);

  return (
    <div style={{ padding: '20px' }}>
      <p>{light ? "💡 ON" : "🌙 OFF"}</p>
      <button onClick={() => setLight(prev => !prev)}>Toggle Light</button>
    </div>
  );
}
```

**Result: ✅ Correct.** Good use of functional update `setLight(prev => !prev)` even though it wasn't strictly necessary here (no batching risk with a single toggle). Not wrong — you're already building the right habit.

---

### Q2: `LikeButton`

```jsx
function App() {
  const [likes, setLikes] = useState(0);

  return (
    <div style={{ padding: '20px' }}>
      <p>{`❤️ ${likes} likes`}</p>
      <button onClick={() => setLikes(prev => prev + 1)}>Like</button>
    </div>
  );
}
```

**Result: ✅ Perfect.**

---

## Intermediate

### Q3: `TextInput` with live character count

```jsx
function App() {
  const [value, setValue] = useState("");

  return (
    <div style={{ padding: '20px' }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Please type some text..."
      />
      <p>{value.length || 0}</p>
    </div>
  );
}
```

**Result: ✅ Correct.** Minor note: `value.length || 0` is redundant — `"".length` is already `0`, and `0 || 0` still gives `0`. `{value.length}` alone suffices. Not a bug, just unnecessary.

---

### Q4: `ColorPicker`

```jsx
const colors = ["red", "blue", "green", "yellow"];

function ColorTile({ color = 'grey', width = "20px", height = "20px", onClickCb }) {
  return (<div style={{ backgroundColor: color, height, width }} onClick={onClickCb} />);
}

function App() {
  const [selectedColor, setSelectedColor] = useState("red");

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '5px' }}>
        {colors.map(color => (
          <ColorTile key={color} color={color} onClickCb={() => setSelectedColor(color)} />
        ))}
      </div>
      <p>Preview:</p>
      <ColorTile color={selectedColor} height="50px" width="50px" />
    </div>
  );
}
```

**Result: ✅ Excellent.** Reusable `ColorTile` component, clean prop defaults, good composition. Genuinely well-structured.

---

## Advanced

### Q5: `ShoppingCartCounter` — container/presentational pattern

```jsx
function ShoppingCartCounter({ count }) {
  return <p>Items: {count || 0}</p>;
}

function CartControls({ onAddItem, onRemoveItem, onClearCart }) {
  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <button onClick={onAddItem}>Add item</button>
      <button onClick={onRemoveItem}>Remove item</button>
      <button onClick={onClearCart}>Clear Cart</button>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  function onAddItem() {
    setCount(prev => prev + 1);
  }

  function onRemoveItem() {
    if (count === 0) return;         // ⚠️ reads stale closure value
    setCount(prev => prev - 1);
  }

  function onClearCart() {
    setCount(0);
  }

  return (
    <div style={{ padding: '20px' }}>
      <ShoppingCartCounter count={count} />
      <CartControls onAddItem={onAddItem} onRemoveItem={onRemoveItem} onClearCart={onClearCart} />
    </div>
  );
}
```

**Result: 🟡 Works — but there's a real stale closure bug in `onRemoveItem`.**

`if (count === 0) return` reads `count` directly from the closure — the render's frozen snapshot. Normally fine, because every state change triggers a re-render and a fresh `onRemoveItem`. But if this ever gets called multiple times rapidly before a re-render (batched or async), `count` could be stale while your functional update is safe. The instructions said "use the functional update form throughout" specifically to avoid reading `count` directly.

**Where it actually breaks — a concrete example:**

```jsx
function onRemoveThree() {
  // simulating "remove 3 at once"
  onRemoveItem();
  onRemoveItem();
  onRemoveItem();
}
```

With `count = 2`:

```
onRemoveItem() call #1:
  if (count === 0) → 2 === 0? false → continue
  setCount(prev => prev - 1) → queued: 2 → 1

onRemoveItem() call #2:
  if (count === 0) → STILL 2 === 0? false (count frozen at 2 in this closure)
  setCount(prev => prev - 1) → queued: 1 → 0

onRemoveItem() call #3:
  if (count === 0) → STILL 2 === 0? false
  setCount(prev => prev - 1) → queued: 0 → -1  ⚠️ BUG! Goes negative!
```

The guard never fires because `count` is frozen at `2` across all three calls — even though the actual queued state is already at `0`.

**Correct version — guard and update both use guaranteed-latest value:**

```jsx
function onRemoveItem() {
  setCount(prev => (prev === 0 ? 0 : prev - 1));
}
```

```
prev=2 → not 0 → returns 1
prev=1 → not 0 → returns 0
prev=0 → IS 0 → returns 0  ✅ correctly clamped, no matter how many times called
```

Each call in the queue checks the actual accumulated value at that point — never a stale snapshot.

---

### Q6: Bug explanation

```jsx
function handleTripleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}
```

**My answer:**
> We are not using functional form update for state here. Due to batching, `count` always refers to the current count number of this render (0 for all three setStates, because `count` is `const` and only gets created as a new instance in the next render). React does batching so all three are doing the same thing: `0 + 1`. So `count` becomes `1`.

**Result: ✅ Spot on.** Correctly identified batching + the "const from this render's closure" mechanic.

---

## MAANG-level

### Q7: Why does React require `setState` instead of allowing direct mutation?

**My answer:**
> We need to manually recall the component function after updating a variable. This is done by setState — it schedules an update and re-render.

**Result: 🟡 Right idea — imprecise wording.**

You've captured the mechanism (setState schedules a re-render), but the question asked about the cost/impossibility of the alternative — polling every variable for changes.

**Full answer:**

Plain variable mutation gives React no signal that anything changed. For React to detect changes without an explicit signal, it would have to constantly re-run every component and deep-compare every variable — every frame, across every component in the tree. That's computationally expensive and unreliable (deep equality comparison on complex objects is O(n) per object, per render cycle, for every component in the app).

`setState` solves this by making the "something changed" signal **explicit** — you tell React exactly when and what changed. React only needs to re-render components that actually called a setter. Explicit signals are cheap and precise; implicit detection (watching all variables) would be expensive and imprecise.

**The interview-level insight:** React trades "magic mutation detection" for "explicit change notification" — you pay a small API cost (`setCount` instead of `count++`) and get a system that is fast, predictable, and scales to large apps.

---

## Corrections Summary

1. **`onRemoveItem` — read-then-conditionally-write is dangerous** — `if (count === 0)` reads a stale closure value. Use `setCount(prev => prev === 0 ? 0 : prev - 1)` so both the guard and the update use the guaranteed-latest value in the queue.
2. **`value.length || 0` is redundant** — `"".length` is already `0`. `{value.length}` alone works.
3. **Q7 — mention the cost of the alternative** — it's not just "setState schedules a re-render"; it's "explicit signals are cheap and precise, while implicit detection via polling would be expensive and imprecise."
4. **Closures in handlers** — every render creates fresh handler functions, each permanently locked to that render's state values. Clicking a button calls the most recently created handler, not "Counter while it's running" — Counter has already finished by the time you click.