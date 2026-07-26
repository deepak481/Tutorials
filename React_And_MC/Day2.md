# React Day 2 — Components Deep Dive: Composition, Component Trees, and Thinking in Components

## Part 1: What Is a Component, Really?

On Day 1 we said: a component is a function that returns JSX. That's mechanically true. But let's go deeper.

A component is a **self-contained unit of UI and behavior**. It answers one question: *"What should this piece of the screen look like right now?"*

Think of components like LEGO bricks. Each brick has a specific shape and purpose. You combine small bricks to build larger structures. You can reuse the same brick in multiple places. You can swap one brick for another without breaking the whole structure.

**Real-world analogy:**

```
A car dashboard is NOT one giant piece of plastic.
It's composed of smaller units:

    Dashboard
    ├── Speedometer
    ├── FuelGauge
    ├── TemperatureGauge
    ├── TurnSignalIndicator
    └── InfoDisplay
        ├── Clock
        └── TripMeter

Each unit:
  - Has its own job
  - Can be designed independently
  - Can be replaced without rebuilding the dashboard
  - Receives data (speed, fuel level) and displays it
```

Components work the same way.

---

## Part 2: Two Mental Models for Components

### Mental Model 1: Components as Functions

This is the literal truth. A component IS a JavaScript function.

```jsx
function Greeting() {
  return <h1>Hello</h1>;
}
```

When React encounters `<Greeting />` in JSX, it literally calls `Greeting()`. The return value (a React Element) tells React what to render.

```
<Greeting />
     ↓
React calls Greeting()
     ↓
Returns { type: 'h1', props: { children: 'Hello' } }
     ↓
React creates <h1>Hello</h1> in the DOM
```

### Mental Model 2: Components as Stamps

Imagine a rubber stamp. The stamp itself is the component definition. Each time you press it on paper, you create an instance.

```jsx
function Badge() {
  return <span>★</span>;
}

function App() {
  return (
    <div>
      <Badge />    {/* instance 1 */}
      <Badge />    {/* instance 2 */}
      <Badge />    {/* instance 3 */}
    </div>
  );
}
```

Each instance is independent. Later when we add state, each `<Badge />` will hold its own state — changing one won't affect the others.

### What does `<Badge />` actually compile to?

```js
// <Badge /> compiles to:
React.createElement(Badge, null)

// Notice: Badge is passed as a FUNCTION REFERENCE, not a string.
// Compare with HTML elements:
// <div>    → React.createElement('div', null)   ← string
// <Badge /> → React.createElement(Badge, null)  ← function
```

This is how React knows the difference. **String = DOM element. Function = your component.** That's why capital letters matter — `<badge />` would compile to `React.createElement('badge', null)`, and the browser would try to render an unknown HTML tag.

---

## Part 3: Composition — The Core Pattern of React

Composition means building complex components by combining simpler ones. This is React's primary architectural pattern.

### Simple Composition

```jsx
function Avatar() {
  return <img src="avatar.png" alt="User avatar" />;
}

function Username() {
  return <span>Deepak</span>;
}

function UserProfile() {
  return (
    <div>
      <Avatar />
      <Username />
    </div>
  );
}
```

**Component Tree:**
```
    <UserProfile />
       /        \
  <Avatar />   <Username />
      |             |
    <img>         <span>
                  "Deepak"
```

`UserProfile` doesn't need to know HOW `Avatar` renders an image. It just uses it. This is **encapsulation** — each component hides its internal details.

### Nested Composition

```jsx
function App() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header>
      <Logo />
      <Navigation />
    </header>
  );
}

function Navigation() {
  return (
    <nav>
      <NavLink />
      <NavLink />
      <NavLink />
    </nav>
  );
}
```

**Full Component Tree:**
```
                    <App />
                   /   |    \
            <Header /> <Main /> <Footer />
            /      \       |         |
        <Logo /> <Navigation />    <p>
          |       /    |     \
        <img>  <NavLink> <NavLink> <NavLink>
                 |         |         |
                <a>       <a>       <a>
```

This tree structure is fundamental. React always works with trees — rendering them, diffing them, updating them.

---

## Part 4: Thinking in Components — Breaking Down a UI

This is the most important skill in React. Given any UI, you need to identify the component boundaries.

### The Process

Given a product listing page:

```
┌─────────────────────────────────────────┐
│  🔍 Search...                    [Cart] │   ← Header
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐             │
│  │  📷      │  │  📷      │             │
│  │ iPhone   │  │ MacBook  │             │
│  │ $999     │  │ $1299    │             │
│  │ ⭐⭐⭐⭐  │  │ ⭐⭐⭐⭐⭐ │             │   ← Product Grid
│  │ [Add]    │  │ [Add]    │             │
│  └──────────┘  └──────────┘             │
├─────────────────────────────────────────┤
│  © 2026 Store                           │   ← Footer
└─────────────────────────────────────────┘
```

**Step 1:** Draw boxes around distinct UI sections. Ask: "Does this piece have a single responsibility? Could it be reused?"

**Step 2:** Name them:
```
App
├── Header
│   ├── SearchBar
│   └── CartIcon
├── ProductGrid
│   ├── ProductCard        (repeated)
│   │   ├── ProductImage
│   │   ├── ProductInfo
│   │   ├── StarRating
│   │   └── AddToCartButton
│   └── ProductCard ...
└── Footer
```

**Step 3:** Identify which are reusable. `ProductCard` appears 4 times — same structure, different data. That's a component that will receive data through props (Day 3). `StarRating` could be used anywhere — product reviews, restaurant ratings, movie ratings. Highly reusable.

### Rules of Thumb

**Single Responsibility:** Each component does one thing. If you're describing a component with "and" — "it shows the product image AND handles the cart AND displays ratings" — it's probably too big. Split it.

**Reusability:** If the same UI pattern appears more than once (even with different data), extract it into a component.

**Appropriate Size:** Not too big (hard to understand), not too small (too many tiny files). A component should fit on one screen — roughly 30–80 lines including JSX.

### Chat UI Example — Component Tree

```
┌──────────────────────────┐
│ ┌──┐ John         2:30pm │
│ │🧑│ Hey, how are you?   │
│ └──┘                     │
│          ┌──┐            │
│   Fine!  │🧑│            │
│          └──┘   You 2:31 │
│ [Type a message...]  [➤] │
└──────────────────────────┘
```

```
ChatWindow
├── MessageList
│   ├── Message  (sender message)
│   │   ├── Avatar
│   │   └── MessageBubble
│   ├── Message  (own message)
│   │   ├── MessageBubble
│   │   └── Avatar
│   └── Message  (sender message)
│       ├── Avatar
│       └── MessageBubble
└── MessageInput
    ├── TextInput
    └── SendButton
```

`Message` is reused 3 times with different data. The layout (left-aligned vs right-aligned) would be controlled by props later.

---

## Part 5: Component Files and Organization

As your app grows, use a feature-based structure:

```
src/
├── components/           ← shared/reusable components
│   ├── Avatar.jsx
│   ├── Button.jsx
│   └── StarRating.jsx
├── features/             ← feature-specific components
│   ├── chat/
│   │   ├── ChatWindow.jsx
│   │   ├── MessageList.jsx
│   │   ├── Message.jsx
│   │   └── MessageInput.jsx
│   └── products/
│       ├── ProductGrid.jsx
│       └── ProductCard.jsx
├── App.jsx
└── main.jsx
```

**Convention:** One component per file. Filename matches component name. This isn't a React rule — it's a widely-followed practice that makes codebases navigable.

---

## Part 6: Composition vs Inheritance

In object-oriented programming, you build complex objects by inheriting from simpler ones — a `Car extends Vehicle`. React explicitly recommends **composition over inheritance**. You never write:

```jsx
// ❌ DON'T — React doesn't use class inheritance for UI
class SpecialButton extends Button { ... }
```

Instead, you compose:

```jsx
// ✅ Composition
function DangerButton() {
  return <Button color="red" label="Delete" />;
}
```

**Why?** Inheritance creates rigid hierarchies. What if you need a button that's both "danger" AND "large" AND "outlined"? You'd need `LargeDangerOutlinedButton extends DangerOutlinedButton extends DangerButton extends Button` — a mess.

With composition, you combine behaviors freely:

```jsx
<Button color="red" size="large" variant="outlined">Delete</Button>
```

In React, you **combine** small components to build bigger ones. You never extend them.

---

## Part 7: React Internals — How React Processes a Component Tree

When React renders `<App />`, it walks the entire tree top-down:

```
Step 1: Call App()
        App returns JSX containing <Header />, <ProductGrid />, <Footer />

Step 2: Call Header()
        Header returns JSX containing <SearchBar />, <CartIcon />

Step 3: Call SearchBar()
        SearchBar returns <input /> — a plain HTML element. STOP.

Step 4: Call CartIcon()
        CartIcon returns <button>🛒</button> — plain HTML. STOP.

Step 5: Call ProductGrid()
        Returns JSX containing multiple <ProductCard />

Step 6: Call ProductCard() — for EACH instance
        Each returns JSX with <ProductImage />, etc.

... continues until every branch ends in HTML elements
```

React walks **TOP → DOWN, LEFT → RIGHT**:

```
        App          ← called 1st
       / | \
  Header Grid Footer ← called 2nd, 5th, last
  /  \    |
Search Cart ProductCard×4
```

React stops recursing when it hits a **host component** — a plain HTML element like `div`, `p`, `img`. Those aren't functions to call; they're instructions to create real DOM nodes.

This entire walk produces the **React Element tree (Virtual DOM)**. On first render, React converts this tree into real DOM nodes. On subsequent renders, React builds a new tree and diffs it against the old one.

---

## Part 8: Pure Components — A Critical Concept

React components should be **pure** during rendering.

A pure function has two properties:
- **Same inputs → same output.** Given the same data, it always returns the same JSX.
- **No side effects.** It doesn't change anything outside itself during rendering — no modifying global variables, no API calls, no DOM manipulation.

```jsx
// ✅ Pure — same input always gives same output
function Greeting() {
  const name = 'Deepak';
  return <h1>Hello, {name}</h1>;
}

// ❌ Impure — modifies external variable during render
let callCount = 0;

function Counter() {
  callCount = callCount + 1;  // side effect!
  return <p>Rendered {callCount} times</p>;
}
```

**Why purity matters (simplified):** React may call your component function more than once before showing the result on screen. If your function changes something external each time it's called, you get bugs. That's the core rule — don't change anything outside the component while returning JSX.

```
Pure component called 3 times:
  Greeting() → <h1>Hello, Deepak</h1>
  Greeting() → <h1>Hello, Deepak</h1>
  Greeting() → <h1>Hello, Deepak</h1>
  ✅ All identical. Safe to call as many times as needed.

Impure component called 3 times:
  Counter() → <p>Rendered 1 times</p>
  Counter() → <p>Rendered 2 times</p>
  Counter() → <p>Rendered 3 times</p>
  ❌ Different results! React can't trust this component.
```

### Why side effects are allowed in `useEffect`

Think of it this way — your component function runs during the "planning" phase (React figuring out what the UI should look like). `useEffect` runs **after** that plan is applied to the screen. It's like: "after you've painted the wall, then go buy more paint." The painting (rendering) stays pure. The shopping (side effect) happens separately, at a safe time. We'll build this properly on Day 7.

For now, one rule: **don't change anything outside the component while returning JSX.** That's sufficient.

---

## Part 9: Expressions Inside JSX — Going Deeper

### Conditional Rendering

Since you can't use `if/else` statements inside JSX (only expressions allowed), you use:

```jsx
function StatusBadge() {
  const isOnline = true;

  return (
    <div>
      {/* Pattern 1: Ternary — when you have both cases */}
      <span>{isOnline ? 'Online 🟢' : 'Offline 🔴'}</span>

      {/* Pattern 2: Logical AND — when you only have the "true" case */}
      {isOnline && <span>User is available</span>}
    </div>
  );
}
```

### The `&&` Gotcha with `0` — Common Bug and Interview Question

```jsx
const count = 0;

// ❌ This renders "0" on screen, not nothing!
{count && <span>Items: {count}</span>}

// Why? 0 is falsy. 0 && anything returns 0. React renders 0 as text.

// ✅ Fix: check explicitly
{count > 0 && <span>Items: {count}</span>}
```

**What renders for `{false}`, `{null}`, `{undefined}`, `{true}`?** React renders **nothing** for all of these. But `{0}` and `{''}` DO render — `0` appears as text, empty string renders as an empty text node. This is why the `&&` gotcha exists.

**Practical example:**

```jsx
function App() {
  const items = [];

  return (
    <div>
      <h1>My List</h1>
      {items.length && <p>You have {items.length} items</p>}
    </div>
  );
}
```

This renders `<h1>My List</h1>` and the number `0` on screen. Fix: `{items.length > 0 && <p>...</p>}`.

### Rendering Lists

```jsx
function FruitList() {
  const fruits = ['Apple', 'Banana', 'Cherry'];

  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}
```

**What's `key`?** A special attribute React uses to track which items in a list have changed, been added, or removed. Every item in a `.map()` needs a unique `key`. We'll go deep on keys in Day 9 (Reconciliation).

**Why `.map()` works:** It's an expression that returns a new array. Each element is a React Element. React knows how to render arrays of elements.

```
fruits.map(fruit => <li>{fruit}</li>)

returns:
[
  { type: 'li', props: { children: 'Apple' } },
  { type: 'li', props: { children: 'Banana' } },
  { type: 'li', props: { children: 'Cherry' } }
]
```

---

## Part 10: Component vs Element Distinction

**Component** — a function definition: `function Button() { ... }`

**Element** — what the function returns: a plain JS object describing a DOM node: `{ type: 'button', props: { ... } }`

`<Button />` creates an element that **references** the Button component. React then calls that component to get back more elements, recursively, until everything bottoms out at host elements.

---

## Part 11: Machine Coding — User Directory

### Component Tree

```
App
├── Header
├── UserList
│   ├── UserCard
│   │   ├── UserAvatar
│   │   ├── UserInfo
│   │   └── StatusBadge
│   ├── UserCard
│   └── UserCard
├── MemberCount
└── Footer
```

### File Structure

```
src/
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── MemberCount.jsx
│   ├── StatusBadge.jsx
│   ├── UserAvatar.jsx
│   ├── UserInfo.jsx
│   ├── UserCard.jsx
│   └── UserList.jsx
├── App.jsx
└── main.jsx
```

### Code

```jsx
// src/components/StatusBadge.jsx
function StatusBadge() {
  const isActive = true;
  return (
    <span style={{ color: isActive ? 'green' : 'red' }}>
      {isActive ? '🟢 Active' : '🔴 Away'}
    </span>
  );
}
export default StatusBadge;
```

```jsx
// src/components/UserAvatar.jsx
function UserAvatar() {
  return (
    <div style={{
      width: '50px', height: '50px', borderRadius: '50%',
      backgroundColor: '#ddd', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: '24px',
    }}>
      🧑
    </div>
  );
}
export default UserAvatar;
```

```jsx
// src/components/UserInfo.jsx
function UserInfo() {
  const name = 'Deepak';
  const role = 'Frontend Developer';
  const city = 'Bhiwani';
  return (
    <div>
      <p style={{ margin: 0, fontWeight: 'bold' }}>{name}</p>
      <p style={{ margin: 0, color: '#666' }}>{role}</p>
      <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>{city}</p>
    </div>
  );
}
export default UserInfo;
```

```jsx
// src/components/UserCard.jsx
import UserAvatar from './UserAvatar';
import UserInfo from './UserInfo';
import StatusBadge from './StatusBadge';

function UserCard() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '16px', border: '1px solid #e0e0e0',
      borderRadius: '8px', marginBottom: '12px',
    }}>
      <UserAvatar />
      <div style={{ flex: 1 }}><UserInfo /></div>
      <StatusBadge />
    </div>
  );
}
export default UserCard;
```

```jsx
// src/components/UserList.jsx
import UserCard from './UserCard';

function UserList() {
  return (
    <div>
      <UserCard />
      <UserCard />
      <UserCard />
    </div>
  );
}
export default UserList;
```

```jsx
// src/App.jsx
import Header from './components/Header';
import UserList from './components/UserList';
import MemberCount from './components/MemberCount';
import Footer from './components/Footer';

function App() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <Header />
      <UserList />
      <MemberCount />
      <Footer />
    </div>
  );
}
export default App;
```

### The Limitation You Should Notice

Every `UserCard` renders the same data — "Deepak", "Frontend Developer", "Active". To make each card show different data, we need **props** — tomorrow's lesson. Feel this limitation. Tomorrow you'll understand exactly what problem props solve.

---

## Day 2 Recap

1. **Composition > Inheritance** — combine components, never extend them
2. **Component trees** — React always works with tree structures, top-down, left-right
3. **Thinking in components** — draw boxes, name them, identify reuse
4. **File organization** — one component per file, feature-based folders
5. **Purity** — don't change anything outside the component while returning JSX
6. **Conditional rendering** — ternary for both cases, `&&` for true-only case
7. **The `&&` gotcha with `0`** — use `count > 0 &&` not `count &&`
8. **List rendering** — `.map()` with `key` on every item
9. **Component vs Element** — function definition vs plain JS object

---

---

# Practice Problems & Answers

## Q1: BookCard + BookShelf

```jsx
function BookCard({ title, author, year }) {
  return (
    <div style={{ border: '1px solid grey', margin: "10px auto", padding: "10px" }}>
      <p>Title: {title}</p>
      <p>Author: {author}</p>
      <p>Published year: {year}</p>
    </div>
  );
}

function BookShelf({ books }) {
  return (
    <div style={{ border: "1px solid black", padding: "10px", width: "200px", margin: "0 auto" }}>
      {books.map((book) =>
        <BookCard key={book.title} title={book.title} author={book.author} year={book.year} />
      )}
    </div>
  );
}

function App() {
  const books = [
    { title: "T1", author: "A1", year: "Y1" },
    { title: "T2", author: "A2", year: "Y2" },
    { title: "T3", author: "A3", year: "Y3" },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <BookShelf books={books} />
    </div>
  );
}
```

**Result: ✅** Props and `.map()` used naturally before being formally taught — good instinct.

**One fix:** Missing `key` on `.map()`. Always add `key` to the outermost element inside a map. Without it, React warns in console and can't efficiently track list changes.

---

## Q2: WarningBanner

```jsx
function WarningBanner({ showWarning }) {
  return (showWarning && "⚠️ Warning: System maintenance at midnight");
}

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <WarningBanner showWarning />
    </div>
  );
}
```

**Result: ✅** Correct logic. `showWarning` as a bare attribute passes `true` — correctly understood.

**One fix:** Remove the unused `useState` — leftover from experimenting. Dead code is a bad habit; clean it up before submitting or reviewing.

---

## Q3: SkillItem list with `.map()`

```jsx
function App() {
  const skills = ['HTML', 'CSS', 'JavaScript', 'React'];

  return (
    <div style={{ padding: '20px' }}>
      {skills.map(skill => <div className="skill_name">{skill}</div>)}
    </div>
  );
}
```

**Result: 🟡 Works but two issues:**

1. **Missing `key`** — same issue as Q1. Add `key={skill}` to each item.
2. **No `SkillItem` component** — the question asked for a separate component. Practice the extraction habit:

```jsx
function SkillItem({ skill }) {
  return <div className="skill_name">{skill}</div>;
}

function App() {
  const skills = ['HTML', 'CSS', 'JavaScript', 'React'];
  return (
    <div style={{ padding: '20px' }}>
      {skills.map(skill => <SkillItem key={skill} skill={skill} />)}
    </div>
  );
}
```

---

## Q4: WeatherDisplay

```jsx
const weatherIcons = {
  sunny: "☀️",
  rainy: "🌧️",
  cloudy: "☁️",
  default: "❓"
};

function WeatherDisplay({ weather }) {
  return weatherIcons[weather] || weatherIcons["default"];
}

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <WeatherDisplay weather="rainy" />
    </div>
  );
}
```

**Result: ✅ Perfect.** The lookup object pattern with `||` fallback is clean and scales better than nested ternaries. Exactly the approach hinted at.

---

## Q5: Email Inbox — Component Tree

**My answer:**
```
components: pagination, inbox, compose button
features: header > inbox & compose, footer > pagination, mailList > list of mail
```

**Result: 🟡 Right direction but incomplete.** More thorough breakdown:

```
EmailApp
├── Header
│   ├── InboxTitle (with unread count badge)
│   └── ComposeButton
├── EmailList
│   ├── EmailRow (repeated)
│   │   ├── Checkbox
│   │   ├── StarToggle
│   │   ├── SenderName
│   │   ├── Subject
│   │   └── Timestamp
│   └── EmailRow ...
└── Pagination
```

The key insight: each row has repeated sub-elements (checkbox, star, sender, subject, time) — those are the components worth identifying inside `EmailRow`.

---

## Q6: MAANG — What mechanism makes components truly dynamic?

**My answer:** We should take values from the parent component, which we call props. In the component we name those values as variables and use them in our code.

**Result: ✅ Exactly right.** Props are function parameters for components. `function Greeting(props)` is the React equivalent of `function greet(name)`. This was already demonstrated naturally in Q1–Q4 by using them before they were formally taught.

---

## Corrections Summary — 3 habits to fix

1. **Always add `key` in `.map()`** — every item rendered from a list needs a unique `key` on the outermost element. Missing `key` causes React warnings and inefficient re-renders.
2. **Remove dead code** — unused imports, unused state, leftover experiments. Clean up before finishing. Interviewers and reviewers notice.
3. **Extract components when the question asks for it** — even if inlining works, practice the extraction habit. It's the skill being tested.