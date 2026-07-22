
# Day 1: What is React, Why It Exists, JSX, and Your First Component

## 1. The Problem React Solves

Before React, let's understand what building a web UI looked like.

### The Old Way: Vanilla JavaScript + DOM

When you open a webpage, the browser reads HTML and builds something called the **DOM** (Document Object Model). The DOM is a tree-shaped data structure that represents every element on the page.

```
DOM = Document Object Model

It's a tree the browser builds from your HTML:

        document
           |
         <html>
         /    \
     <head>   <body>
                |
              <div>
              /   \
          <h1>    <button>
          "Hi"    "Click me"
```

**DOM** — think of it as the browser's internal representation of your page. Every tag becomes a "node" in this tree. JavaScript can read and change these nodes.

Here's how you'd build a simple counter without React:

```html
<div id="app">
  <h1 id="count">Count: 0</h1>
  <button id="btn">Add</button>
</div>

<script>
  let count = 0;
  const h1 = document.getElementById('count');
  const btn = document.getElementById('btn');

  btn.addEventListener('click', function () {
    count = count + 1;
    h1.textContent = 'Count: ' + count;
  });
</script>
```

This works. But notice the problems:

**Problem 1: You manually track and update the DOM.**
You have data (`count = 0`), and you have UI (`<h1>Count: 0</h1>`). When data changes, *you* must find the right DOM node and update it yourself. In a small app, that's fine. In an app with 500 interactive elements? You'll lose track.

**Problem 2: Data and UI are out of sync.**
If you forget to update the DOM after changing `count`, the user sees stale data. Bugs from this are incredibly hard to find.

**Problem 3: No structure.**
As the app grows, you get thousands of lines of `document.getElementById` and `addEventListener` — spaghetti code with no clear organization.

### The Core Idea Behind React

React's fundamental insight:

> **UI is a function of state.**

Meaning: given some data (state), React can *automatically* figure out what the screen should look like. When data changes, React re-computes the UI and updates only what changed.

```
UI = f(state)

state = { count: 3 }
    ↓
f(state) → <h1>Count: 3</h1>

state changes to { count: 4 }
    ↓
f(state) → <h1>Count: 4</h1>
    ↓
React compares old UI vs new UI
    ↓
Updates only the text "3" → "4" in the real DOM
```

You *describe* what the UI should look like. React handles the *how* — finding the right DOM nodes, making the minimal changes, keeping everything in sync.

This is called **declarative** programming. You declare the result. React figures out the steps.

The old way (manually calling `h1.textContent = ...`) is **imperative** — you specify every step yourself.

---

**🧠 Comprehension Check #1:**
In one sentence, what's the difference between imperative and declarative UI updates?

*(Think about it before reading on.)*

---

**Answer:** Imperative means you write step-by-step instructions to change the DOM yourself. Declarative means you describe what the UI should look like for a given state, and the framework handles the actual DOM updates.

---

## 2. What is React, Precisely?

React is a **JavaScript library** for building user interfaces. Not a framework — a library. The distinction matters:

- **Library**: gives you tools, you decide how to structure your app. (React)
- **Framework**: dictates the structure, you fill in the blanks. (Angular, Next.js)

React does one thing well: **rendering UI based on state and responding to changes**. For routing, API calls, state management — you add other libraries. That's why React's ecosystem is big.

React was created at Facebook (now Meta) in 2013. The problem: Facebook's notification count would show one number in the tab, another in the header, and yet another in the dropdown. All showing the same data, all out of sync. React solved this by making UI a function of a single source of truth.

### Key Concepts (We'll Unpack Each)

| Term | What it means |
|------|--------------|
| **Component** | A reusable piece of UI. Like a function that returns HTML. |
| **JSX** | A syntax that lets you write HTML-like code inside JavaScript. |
| **Props** | Data passed into a component from its parent. Read-only. |
| **State** | Data that lives inside a component and can change over time. |
| **Virtual DOM** | React's lightweight copy of the real DOM, used for fast comparisons. |

Don't memorize these. We'll build deep understanding of each.

---

## 3. JSX — From First Principles

### What JSX Is

JSX stands for **JavaScript XML**. It lets you write what *looks* like HTML inside JavaScript files.

```jsx
const element = <h1>Hello, Deepak</h1>;
```

This is **not** HTML. This is **not** a string. It's JSX — a syntax extension to JavaScript.

### Why JSX Exists

Without JSX, you'd create React elements like this:

```js
const element = React.createElement('h1', null, 'Hello, Deepak');
```

`React.createElement` is the real function. It takes three arguments:
1. **Type** — what tag/component (`'h1'`, `'div'`, `MyComponent`)
2. **Props** — an object of attributes (`{ className: 'title' }`) or `null`
3. **Children** — what goes inside (`'Hello, Deepak'`, or more elements)

JSX is just **syntactic sugar** — a nicer way to write `React.createElement` calls. A tool called **Babel** (a JavaScript compiler) converts JSX into `createElement` calls before the browser sees it.

```
What you write (JSX):
  <h1 className="title">Hello</h1>

What Babel converts it to:
  React.createElement('h1', { className: 'title' }, 'Hello')

What React.createElement returns:
  {
    type: 'h1',
    props: {
      className: 'title',
      children: 'Hello'
    }
  }
```

That returned object is called a **React Element**. It's a plain JavaScript object — a lightweight description of what should appear on screen. It's NOT a DOM node. It's a blueprint.

```
JSX  →  Babel  →  React.createElement()  →  React Element (JS object)  →  React renders to Real DOM
```

### JSX Rules

**Rule 1: A React component must return a single root React element.**

You can absolutely write JSX expressions with multiple elements in other contexts (like storing an array of elements in a variable). The actual constraint is on the return value of a component — it must be a single root element. That's because return in JavaScript yields one value, and React.createElement produces one object.

```jsx
// ❌ Error — two siblings, no parent
return (
  <h1>Hello</h1>
  <p>World</p>
);

// ✅ Wrap in a div
return (
  <div>
    <h1>Hello</h1>
    <p>World</p>
  </div>
);

// ✅ Or use a Fragment (adds no extra DOM node)
return (
  <>
    <h1>Hello</h1>
    <p>World</p>
  </>
);
```

**Why?** A function can only return one value. `React.createElement` produces one object. Two siblings = two objects = two return values = error.

**Fragment** (`<>...</>`) is React's solution — it groups children without adding an extra `<div>` to the DOM.

**Rule 2: Use `className` instead of `class`.**

```jsx
<div className="container">...</div>
```

Because `class` is a reserved keyword in JavaScript (used for ES6 classes).

**Rule 3: All tags must be closed.**

```jsx
<img src="photo.jpg" />   // self-closing
<br />                      // self-closing
<div></div>                 // explicit close
```

**Rule 4: JavaScript expressions go inside `{}`.**

```jsx
const name = 'Deepak';
const age = 26;

return <p>My name is {name} and I am {age} years old.</p>;
```

Inside `{}`, you can put any JavaScript **expression** — something that produces a value. Variables, math, function calls, ternaries. NOT statements like `if/else` or `for` loops.

```jsx
// ✅ Expressions
{2 + 2}
{name.toUpperCase()}
{isLoggedIn ? 'Welcome' : 'Login'}

// ❌ Statements (won't work inside JSX)
{if (true) { return 'yes' }}
{for (let i=0; i<5; i++) {}}
```

This is one of the most misunderstood JSX concepts. The key is to understand the difference between an **expression** and a **statement**.

#### Step 1: What is `{}` in JSX?

Many beginners think `{}` means:

> "I can write any JavaScript here."

❌ That's not true.

It actually means:

> **"Evaluate this JavaScript expression and insert its value here."**

For example:

```jsx
const name = "Deepak";

return <h1>Hello {name}</h1>;
```

React asks:

> "What value does `name` produce?"

Answer:

```text
"Deepak"
```

So React renders:

```html
<h1>Hello Deepak</h1>
```

---

#### Step 2: What is an expression?

An **expression** is something that **produces a value**.

Examples:

```js
2 + 2          // 4

"Hi"

true

name

name.toUpperCase()

x > 5

x ? "Yes" : "No"

arr.length

items.map(...)
```

Each one evaluates to a value.

Think of expressions as:

> "Questions that have an answer."

Example:

```js
2 + 2
```

Answer:

```
4
```

---

#### Step 3: What is a statement?

A **statement** tells JavaScript to **do something**.

Examples:

```js
if (...) {}

for (...) {}

while (...) {}

switch (...) {}

try {} catch {}

return
```

These do **not** produce a value.

Example:

```js
if (age > 18) {
   console.log("Adult");
}
```

Question:

"What is the value of this `if`?"

There isn't one.

It simply performs an action.

---

#### Step 4: Imagine a function call

Suppose you write:

```js
console.log(2 + 2);
```

JavaScript sees:

```text
console.log( ??? )
```

It expects something that becomes a value.

```
2 + 2

↓

4
```

So this works.

---

Now imagine:

```js
console.log(if (true) {});
```

JavaScript asks:

> "What value should I pass into `console.log()`?"

But

```js
if (...) {}
```

doesn't produce a value.

So JavaScript throws a syntax error.

---

#### JSX works exactly the same way

When you write

```jsx
<p>{2 + 2}</p>
```

React is effectively doing:

```js
React.createElement(
  "p",
  null,
  2 + 2
);
```

The child of `<p>` must be a value.

```
2 + 2

↓

4
```

React renders:

```html
<p>4</p>
```

---

#### Why doesn't `if` work?

Suppose you write

```jsx
<p>
  {if (true) {
      "Hello"
  }}
</p>
```

React would have to translate it into something like:

```js
React.createElement(
    "p",
    null,
    if (true) {}
);
```

But JavaScript itself says

> ❌ You cannot put an `if` statement where a value is expected.

So React never even gets a chance to execute it.

The JavaScript parser rejects it first.

---

#### Then how do we write conditions?

Use an **expression**.

##### Ternary operator

```jsx
const isLoggedIn = true;

<p>
  {isLoggedIn ? "Welcome" : "Login"}
</p>
```

The ternary **returns a value**.

```
true

↓

"Welcome"
```

---

##### Logical AND

```jsx
<p>
  {isAdmin && "Admin Panel"}
</p>
```

If

```js
isAdmin = true
```

Result:

```
"Admin Panel"
```

If

```js
isAdmin = false
```

Result:

```
false
```

React ignores `false`.

---

#### But what if I really need `if`?

Move it **outside** the JSX.

```jsx
function App() {

    if (isLoggedIn) {
        return <h1>Welcome</h1>;
    }

    return <h1>Please Login</h1>;
}
```

Here

`if` is **not inside `{}`**.

It is normal JavaScript.

---

**Rule to remember:**

> **Inside JSX `{}`, React expects a value. Expressions produce values; statements don't. That's why only expressions are allowed.**


---

**🧠 Comprehension Check #2:**
What does this JSX compile to?

```jsx
<button onClick={handleClick}>Submit</button>
```

*(Write out the `React.createElement` call mentally.)*

---

**Answer:**
```js
React.createElement('button', { onClick: handleClick }, 'Submit')
```

The `onClick` attribute becomes a property in the props object. The text `'Submit'` becomes the children.

---

## 4. Components — Functions That Return UI

A **component** is a JavaScript function that returns JSX (which becomes React elements).

```jsx
function Greeting() {
  return <h1>Hello, World!</h1>;
}
```

That's it. A component is a function. It returns a description of UI. React calls this function and renders the result to the DOM.

### Rules for Components

1. **Name must start with a capital letter.** `Greeting`, not `greeting`. Lowercase names are treated as HTML tags (`<div>`, `<span>`). Uppercase = your custom component.

2. **Must return JSX** (or `null` to render nothing).

3. **Pure with respect to rendering** — given the same inputs, a component should return the same output. (We'll explore this deeply later.)

### Rendering a Component

```jsx
import { createRoot } from 'react-dom/client';

function Greeting() {
  return <h1>Hello, World!</h1>;
}

const root = createRoot(document.getElementById('root'));
root.render(<Greeting />);
```

What happens here, step by step:

```
1. Browser loads index.html which has <div id="root"></div>

2. createRoot() tells React: "This div is where you manage the DOM"

3. root.render(<Greeting />) tells React: "Render this component tree inside that div"

4. React calls Greeting() → gets back the React Element { type: 'h1', props: { children: 'Hello, World!' } }

5. React creates a real DOM node: document.createElement('h1')
   Sets its text: h1.textContent = 'Hello, World!'
   Appends it inside <div id="root">

6. User sees: Hello, World!
```

```
Component Tree (what React sees):

    <Greeting />
        |
      <h1>
    "Hello, World!"


Real DOM (what the browser shows):

    <div id="root">
      <h1>Hello, World!</h1>
    </div>
```

### Composing Components

Components can use other components. This is **composition** — the most powerful pattern in React.

```jsx
function Header() {
  return <h1>My App</h1>;
}

function Content() {
  return <p>Welcome to my application.</p>;
}

function App() {
  return (
    <div>
      <Header />
      <Content />
    </div>
  );
}
```

```
Component Tree:

        <App />
       /      \
  <Header />  <Content />
      |            |
    <h1>          <p>
  "My App"   "Welcome..."
```

Each component is a self-contained, reusable unit. `Header` doesn't know or care about `Content`. `App` composes them together. This is how you build complex UIs from simple pieces.

---

## 5. React Internals: What Happens When You Render

Let's trace what React does under the hood when you call `root.render(<App />)`:

```
Phase 1: RENDER PHASE (Pure, no side effects)
─────────────────────────────────────────────
React calls App()
  → App returns JSX with <Header /> and <Content />
  → React calls Header() → returns <h1>My App</h1>
  → React calls Content() → returns <p>Welcome...</p>
  → React now has a complete tree of React Elements
  → This tree is the "Virtual DOM"

Phase 2: COMMIT PHASE (Touches real DOM)
─────────────────────────────────────────
React compares Virtual DOM to real DOM (first render = nothing to compare)
  → Creates real DOM nodes: div, h1, p
  → Sets text content
  → Appends them to <div id="root">
  → Browser paints pixels on screen
```

**Virtual DOM** — it's not magic. It's a plain JavaScript object tree. React keeps it in memory. When state changes later, React builds a *new* Virtual DOM tree, compares it with the old one (this comparison is called **reconciliation** or **diffing**), and updates only the parts of the real DOM that changed.

Why not just update the real DOM directly? Because real DOM operations are slow — they trigger layout recalculations, painting, etc. By comparing lightweight JS objects first, React minimizes expensive DOM operations.

```
Virtual DOM (JS objects):          Real DOM (browser):
                                   
{ type: 'div', props: {            <div>
  children: [                        <h1>My App</h1>
    { type: 'h1', children: '..'},   <p>Welcome...</p>
    { type: 'p', children: '..'}   </div>
  ]                                
}}                                 
                                   
↑ Cheap to create & compare       ↑ Expensive to modify
```

---

## 6. Machine Coding: Build a Greeting Card

Let's build something real. A greeting card component that displays a name and message.

### Folder Structure

```
src/
├── App.jsx
├── main.jsx
└── components/
    └── GreetingCard.jsx
```

### Step 1: The GreetingCard Component

```jsx
// src/components/GreetingCard.jsx

function GreetingCard() {
  const name = 'Deepak';
  const message = 'Welcome to your React journey!';
  const currentDate = new Date().toLocaleDateString();

  return (
    <div style={cardStyle}>
      <h2>Hello, {name}!</h2>
      <p>{message}</p>
      <small>Date: {currentDate}</small>
    </div>
  );
}

const cardStyle = {
  border: '2px solid #333',
  borderRadius: '8px',
  padding: '20px',
  maxWidth: '400px',
  margin: '40px auto',
  textAlign: 'center',
  fontFamily: 'sans-serif',
};

export default GreetingCard;
```

**Line-by-line:**

- `function GreetingCard()` — a component. Capital G.
- `const name = 'Deepak'` — local variable. Available inside `{}` in JSX.
- `new Date().toLocaleDateString()` — JavaScript expression. Computed when the component renders.
- `style={cardStyle}` — in JSX, the `style` attribute takes a **JavaScript object**, not a CSS string. Properties are camelCase (`borderRadius`, not `border-radius`). Values are strings (or numbers for pixel values).
- `export default GreetingCard` — makes this component importable from other files.

### Step 2: App Component

```jsx
// src/App.jsx

import GreetingCard from './components/GreetingCard';

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>My First React App</h1>
      <GreetingCard />
      <GreetingCard />
    </div>
  );
}

export default App;
```

Notice `<GreetingCard />` used twice — same component, rendered twice. That's reusability. (Right now both show "Deepak" — we'll fix that with Props on Day 3.)

The `{{ textAlign: 'center' }}` — outer `{}` = JavaScript expression in JSX, inner `{}` = JavaScript object literal.

### Step 3: Entry Point

```jsx
// src/main.jsx

import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```
Resulting Component Tree:

            <App />
           /      \
    <GreetingCard />  <GreetingCard />
```

---

## 7. Common Mistakes & Interview Traps

**Trap 1:** "Is JSX HTML?"
No. JSX compiles to `React.createElement()` calls. It looks like HTML but follows JavaScript rules (`className`, `htmlFor`, camelCase events).

**Trap 2:** "What does React.createElement return?"
A plain JavaScript object (React Element) — NOT a DOM node.

**Trap 3:** "Why capital letter for components?"
React uses the casing to distinguish HTML tags (`<div>`) from custom components (`<MyComponent>`). Lowercase = DOM element. Uppercase = component.

**Trap 4:** "Can a component return multiple elements?"
Not directly — must wrap in a single parent or a Fragment (`<>...</>`).

**Trap 5:** "What's the Virtual DOM?"
An in-memory JavaScript object tree representing your UI. React diffs old vs new virtual trees and applies minimal changes to the real DOM.

---

## 8. Day 1 Recap

```
What we covered:

1. The PROBLEM → manual DOM updates don't scale
2. React's INSIGHT → UI = f(state), declarative over imperative
3. JSX → syntactic sugar for React.createElement()
4. Components → functions that return React Elements
5. Composition → building complex UIs from small components
6. Virtual DOM → JS object tree for efficient DOM updates
7. Render flow → Render Phase (build tree) → Commit Phase (update DOM)
```

---

## 9. Practice Questions

**Beginner:**
1. Create a `Footer` component that shows "© 2026 Deepak's App" and use it in your App.
2. Create a `UserInfo` component that displays a name, email, and city using variables inside the component.

**Intermediate:**
3. Create a component that shows the current time (just a static snapshot when the page loads). Display hours, minutes, seconds separately.
4. Build a `ProductCard` component with a name, price, and "in stock" / "out of stock" text using a ternary inside JSX.

**Advanced:**
5. Without running any code, write out exactly what `React.createElement` calls this JSX would produce:
```jsx
<div className="wrapper">
  <h1>Title</h1>
  <p>Paragraph <strong>bold</strong></p>
</div>
```

**MAANG-level:**
6. Explain why React uses a Virtual DOM instead of directly updating the real DOM. What's the actual performance benefit — is the Virtual DOM "faster" than the real DOM? (This is a nuanced question — think carefully.)

---

*Hints for #5:* The nested `<strong>` inside `<p>` means `<p>` has two children — a string and another element. Each element is a separate `createElement` call.

*Hint for #6:* The Virtual DOM itself is NOT faster than direct DOM manipulation. The benefit is elsewhere — think about what it enables in terms of developer experience and batching.

---

Try these out, Deepak. Share your answers (even rough ones) and I'll give detailed feedback before we move to Day 2 (Components Deep Dive).

## My Answers

1.  

```javascript
import React from 'react';

function Footer() {
  return <p>© 2026 Deepak's App</p>;
}

function App() {
  const styles = {
    main: {
      padding: '20px',
    }
  };

  return (
    <div style={styles.main}>
      <Footer />
    </div>
  )
}

export default App

```

   2.  

```javascript
import React from 'react';

function UserInfo() {
  const name = "Deepak";
  const city = "Bhiwani";
  const email= "mail@gmail.com";

  return (
    <>
      <p>{name}</p>
      <p>{city}</p>
      <p>{email}</p>
    </>
  )
}

function App() {
  const styles = {
    main: {
      padding: '20px',
    }
  };

  return (
    <div style={styles.main}>
      <UserInfo />
    </div>
  )
}

export default App

```

3.  

```javascript
import React from 'react';

function StaticSnap() {
  const currentTime = new Date();
  console.log(currentTime)

  return (
    <>
      <p>Hours: {currentTime.getHours()}</p>
      <p>Minutes: {currentTime.getMinutes()}</p>
      <p>Seconds: {currentTime.getSeconds()}</p>
    </>
  )
}

function App() {
  const styles = {
    main: {
      padding: '20px',
    }
  };

  return (
    <div style={styles.main}>
      <StaticSnap />
    </div>
  )
}

export default App

```

Somehow i did it, but i'm not able to use date function of js properly, i don't understand if i console new Date() and why we have Date.now() also. i'm confused with date.

4.  

```javascript
import React from 'react';

function ProductCard() {
  const name = "Bottle";
  const price = 500;
  const isInStock = true;

  return (
    <>
      <p>Name: {name}</p>
      <p>Price: {price} Rs</p>
      <p>{isInStock ? "in stock" : "out of stock"}</p>
    </>
  )
}

function App() {
  const styles = {
    main: {
      padding: '20px',
    }
  };

  return (
    <div style={styles.main}>
      <ProductCard />
    </div>
  )
}

export default App

```

5.  

```javascript
{
  type: 'div',
  props: {
    className: "wrapper"
  },
  children: [
    {
      type: 'h1',
      children: "Title"
    },
    {
      type: 'p',
      children: [
        "Paragraph",
        {
          type: 'strong',
          children: "bold"
        }
      ]
    }
  ]
}
```

6.  Virtual DOM is js objects tree which represents our entire UI. It used to find out what exactly needed to be updated in DOM by comparing old virtual DOM with new/lates DOM. Because real DOM change is very costly because it recalculates layout, painting etc. while rendering, so it will be very efficient that we only change those elements which actually changed instead of re-rendering whole page again.

Great work across the board, Deepak. Let me address your corrections first, then grade each answer.

## Answer Grades

**Q1 (Footer): ✅ Perfect.** Clean, correct, good use of inline styles object.

**Q2 (UserInfo): ✅ Perfect.** Good use of Fragment. You instinctively avoided an unnecessary wrapper div.

**Q3 (StaticSnap): ✅ Correct.** Works exactly as intended.

**Your Date confusion — let me clear it up fast:**

```
new Date()    → returns a Date OBJECT with methods
                e.g. .getHours(), .getMinutes(), .toLocaleDateString()
                Think of it as a rich box containing a moment in time.

Date.now()    → returns a NUMBER (milliseconds since Jan 1, 1970)
                e.g. 1784726400000
                Just a raw timestamp. No methods. Used for math
                (measuring elapsed time, comparing timestamps).

// When to use which:
new Date()    → when you need to DISPLAY or FORMAT a date
Date.now()    → when you need to MEASURE or COMPARE time

const start = Date.now();
// ...some work...
const elapsed = Date.now() - start; // milliseconds elapsed

const now = new Date();
now.getHours();  // 14
now.toLocaleDateString(); // "7/20/2026"
```

**Q4 (ProductCard): ✅ Perfect.** Ternary used correctly inside JSX.

**Q5 (createElement): 🟡 ~80% — one structural issue.**

Your mental model is right, but the actual object structure has `children` *inside* `props`, not as a sibling:

```js
// What React.createElement actually returns:
{
  type: 'div',
  props: {
    className: 'wrapper',
    children: [
      {
        type: 'h1',
        props: { children: 'Title' }
      },
      {
        type: 'p',
        props: {
          children: [
            'Paragraph ',
            { type: 'strong', props: { children: 'bold' } }
          ]
        }
      }
    ]
  }
}
```

Key insight: **children is always a property of props**. There's no separate `children` key at the top level. Everything a component receives — attributes AND children — lives inside `props`. This will matter a lot on Day 3.

**Q6 (Virtual DOM): 🟡 Correct but missing the nuance.**

Everything you said is right. But here's the interview-level insight most candidates miss:

> The Virtual DOM is **not faster** than direct DOM manipulation.

If you knew exactly which DOM node to update, doing it directly (`element.textContent = 'new'`) would always be faster than building a virtual tree, diffing it, then doing the same update. The Virtual DOM adds overhead.

The real benefit is **developer experience + correctness at scale**. You write declarative code (`return <h1>{count}</h1>`) without tracking which DOM nodes need updating. React figures that out via diffing. The tradeoff: slightly slower than optimal manual updates, but **you never have stale UI or missed updates**. In complex apps, the Virtual DOM isn't about being fast — it's about being *fast enough* while keeping your code maintainable and bug-free.

---

## Score: 5/6 fully correct, strong Day 1 showing.

Ready for Day 2: Components Deep Dive — composition patterns, component trees, thinking in components, and breaking a UI into a component hierarchy?