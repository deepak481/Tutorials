# React Day 3 — Props: Data Flow, Children, One-Way Data Flow, and Component Reusability

## Part 1: The Problem Props Solve

You already felt this on Day 2. In the User Directory mini project, every `UserCard` rendered identical data — same name, same role, same status. We hardcoded values inside each component.

```jsx
// Day 2's limitation:
function UserCard() {
  const name = 'Deepak';  // hardcoded!
  return <p>{name}</p>;
}

// Three cards, all showing "Deepak"
<UserCard />
<UserCard />
<UserCard />
```

This is like having a rubber stamp that can only print one message. We need a stamp where we can change the message each time we press it.

In regular JavaScript, we solve this with function parameters:

```js
// Hardcoded — useless
function greet() {
  return 'Hello, Deepak';
}

// Parameterized — reusable
function greet(name) {
  return 'Hello, ' + name;
}

greet('Deepak');  // "Hello, Deepak"
greet('Sarah');   // "Hello, Sarah"
```

**Props are function parameters for components.** That's the entire concept. A parent component passes data to a child component through props, and the child uses that data to render.

```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}</h1>;
}

<Greeting name="Deepak" />
<Greeting name="Sarah" />
```

---

## Part 2: How Props Work Under the Hood

When you write this JSX:

```jsx
<Greeting name="Deepak" age={25} />
```

Babel compiles it to:

```js
React.createElement(Greeting, { name: 'Deepak', age: 25 })
```

The second argument — `{ name: 'Deepak', age: 25 }` — is the **props object**. React passes this object as the first argument when it calls your component function.

```
Step by step:

1. JSX:    <Greeting name="Deepak" age={25} />

2. Babel:  React.createElement(Greeting, { name: 'Deepak', age: 25 })

3. React calls:  Greeting({ name: 'Deepak', age: 25 })
                           ↑
                    This object IS props

4. Inside Greeting:
   function Greeting(props) {
     // props = { name: 'Deepak', age: 25 }
     return <h1>Hello, {props.name}</h1>;
   }

5. Returns: { type: 'h1', props: { children: 'Hello, Deepak' } }

6. React renders: <h1>Hello, Deepak</h1>
```

Props are just an object. Nothing magical. The JSX attributes become keys in that object.

---

## Part 3: Destructuring Props

Writing `props.name`, `props.age`, `props.role` everywhere is verbose. JavaScript **destructuring** lets you extract values from an object directly in the function signature:

```jsx
// Without destructuring
function UserCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>{props.role}</p>
      <p>{props.city}</p>
    </div>
  );
}

// With destructuring — cleaner
function UserCard({ name, role, city }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{role}</p>
      <p>{city}</p>
    </div>
  );
}

// Both are called the same way:
<UserCard name="Deepak" role="Developer" city="Bhiwani" />
```

Destructuring is just JavaScript syntax — not a React feature. It works because props is a plain object:

```js
// These are equivalent:
const { name, role, city } = props;
// vs
const name = props.name;
const role = props.role;
const city = props.city;
```

You used this naturally in your Day 2 answers (`function BookCard({title, author, year})`). Now you understand why it works.

### Comprehension Check #1 — What does the props object look like?

```jsx
<ProductCard
  name="iPhone"
  price={999}
  inStock={true}
  tags={['electronics', 'phone']}
  onClick={handleClick}
/>
```

**Answer:**

```js
{
  name: 'iPhone',
  price: 999,
  inStock: true,
  tags: ['electronics', 'phone'],
  onClick: handleClick   // a function reference
}
```

Strings use quotes in JSX (`name="iPhone"`), but everything else — numbers, booleans, arrays, objects, functions — goes inside `{}`. That's because `{}` means "evaluate this JavaScript expression."

---

## Part 4: Props Are Read-Only

This is a fundamental rule. **A component must never modify its own props.**

```jsx
// ❌ NEVER do this
function Greeting({ name }) {
  name = name.toUpperCase();  // mutating the prop!
  return <h1>{name}</h1>;
}

// ✅ Create a new value instead
function Greeting({ name }) {
  const displayName = name.toUpperCase();
  return <h1>{displayName}</h1>;
}
```

Why? Because props come from the parent. If a child could change its props, the parent's data would become inconsistent with what the child shows. You'd have the same sync problem React was built to solve.

Think of props like arguments to a function. In `Math.sqrt(16)`, the function doesn't change `16`. It reads the input and produces output. Components work the same way — they read props and return JSX.

This connects to purity from Day 2. A pure function doesn't modify its inputs. Components receive props (input) and return JSX (output) without changing the props.

---

## Part 5: One-Way Data Flow (Unidirectional)

Data in React flows in one direction: **parent → child**. Never upward.

```
        App
       (owns data)
        |
        | passes via props
        ↓
      UserCard
     (reads data)
        |
        | passes via props
        ↓
     StatusBadge
    (reads data)
```

`App` decides what data `UserCard` gets. `UserCard` decides what data `StatusBadge` gets. A child never reaches up to grab or modify its parent's data.

**Why one-way?** Because it makes data flow **predictable**. If something is wrong on screen, you trace the data upward — which parent passed the wrong prop? You never have to wonder "did some random child component change something?" The debugging path is always a straight line up the tree.

```
One-way flow (React):
  Data flows DOWN through props.
  If the data at the top changes, everything below updates.
  Easy to trace, easy to debug.

  App (source of truth)
   ↓ props
  Page
   ↓ props
  Card
   ↓ props
  Badge

Two-way flow (what React avoids):
  Any component can change any data.
  Hard to trace where a bug came from.

  App ⟷ Page ⟷ Card ⟷ Badge
       chaos
```

Later (Day 4+), we'll see how child components can *communicate* with parents — not by modifying props, but by calling **callback functions** passed down as props. The data still flows down; the child just signals "hey, something happened."

---

## Part 6: Default Props

Sometimes you want a prop to have a fallback value when the parent doesn't provide it.

```jsx
// Default values via destructuring — the standard pattern
function Button({ label, size = 'medium', variant = 'secondary' }) {
  return (
    <button>
      {label} ({size}, {variant})
    </button>
  );
}

<Button label="Save" />
// renders: Save (medium, secondary)

<Button label="Save" size="large" variant="primary" />
// renders: Save (large, primary)
```

This uses JavaScript's default parameter syntax. When the destructured value is `undefined`, the default kicks in.

**Important:** Destructuring defaults only trigger for `undefined` — not for `null`, `0`, `false`, or `""`. These are intentional values. Using `||` inside the component body instead of a destructuring default has a gotcha: `||` triggers for any falsy value (including `0`, `false`, `""`), which may override intentionally passed values.

```jsx
// ✅ Correct — only triggers for undefined
function Badge({ color = 'blue' }) { ... }

// ⚠️ Risky — triggers for any falsy value
function Badge({ color }) {
  return <div style={{ background: color || 'blue' }}> ... </div>
}
// If color="" is intentionally passed, it gets overridden to 'blue'
```

---

## Part 7: The `children` Prop

Every component automatically receives a special prop called `children`. It contains whatever you put **between** the opening and closing tags of a component.

```jsx
function Card({ children }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
    }}>
      {children}
    </div>
  );
}

<Card>
  <h2>Title</h2>
  <p>Some content here</p>
</Card>
```

What happens under the hood:

```
<Card>                        React.createElement(Card, null,
  <h2>Title</h2>      →        React.createElement('h2', null, 'Title'),
  <p>Content</p>               React.createElement('p', null, 'Content')
</Card>                       )

The third+ arguments become props.children:
props = {
  children: [
    { type: 'h2', props: { children: 'Title' } },
    { type: 'p', props: { children: 'Content' } }
  ]
}
```

`children` is just a regular prop. The JSX syntax of putting content between tags is sugar for passing it as `props.children`.

### Comprehension Check #2 — What is `props.children` in each case?

```jsx
// Case 1
<Button>Click me</Button>

// Case 2
<Card>
  <h1>Title</h1>
  <p>Body</p>
</Card>

// Case 3
<Wrapper />
```

**Answer:**

```
Case 1: children = "Click me"                        (a string)
Case 2: children = [<h1>...</h1>, <p>...</p>]        (an array of React elements)
Case 3: children = undefined                          (nothing between tags)
```

When there's one child, `children` is that child directly (not an array). When there are multiple, it's an array. When there are none, it's `undefined`. This inconsistency is a known quirk.

**On `React.Children` utilities:** We won't dedicate a full lesson to them because they're rarely needed in modern React. Just rendering `{children}` directly handles both single-element and array forms automatically — React deals with it. If you ever need to count, map over, or filter children programmatically (like building a Tabs component that inspects its children), `React.Children.map` and `React.Children.count` will be covered right there in context. Day 27 (advanced patterns) is the most likely spot.

### Why `children` is Powerful — Container Components

`children` enables **container components** — components that provide styling, layout, or behavior without knowing what's inside them.

```jsx
function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '24px' }}>
      <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
        {title}
      </h2>
      <div style={{ padding: '12px 0' }}>
        {children}
      </div>
    </section>
  );
}

// Section can wrap ANYTHING:
<Section title="Profile">
  <Avatar />
  <UserInfo />
</Section>

<Section title="Settings">
  <ThemeToggle />
  <LanguageSelector />
</Section>
```

`Section` provides consistent styling without knowing or caring what's inside. This is composition at its best.

---

## Part 8: Passing Different Types as Props

Props can be any JavaScript value:

```jsx
function Demo({
  text,           // string
  count,          // number
  isActive,       // boolean
  items,          // array
  config,         // object
  onClick,        // function
  icon,           // React element (JSX)
}) {
  return (
    <div>
      <p>{text}</p>
      <p>Count: {count}</p>
      <p>{isActive ? 'Active' : 'Inactive'}</p>
      <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
      <p>Theme: {config.theme}</p>
      <button onClick={onClick}>Click</button>
      <div>{icon}</div>
    </div>
  );
}

<Demo
  text="Hello"
  count={42}
  isActive={true}
  items={['a', 'b', 'c']}
  config={{ theme: 'dark', lang: 'en' }}
  onClick={() => alert('Clicked!')}
  icon={<span>⭐</span>}
/>
```

**Boolean shorthand:**

```jsx
// These are equivalent:
<Button isActive={true} />
<Button isActive />

// To pass false, you must be explicit:
<Button isActive={false} />
// or simply don't include the prop (it'll be undefined, which is falsy)
```

You used this in Day 2: `<WarningBanner showWarning />` passes `true`.

---

## Part 9: Props and Component Trees — Data Flowing Down

```jsx
function App() {
  const user = {
    name: 'Deepak',
    role: 'Frontend Developer',
    isOnline: true,
  };
  return <ProfileCard user={user} />;
}

function ProfileCard({ user }) {
  return (
    <div>
      <UserName name={user.name} />
      <UserRole role={user.role} />
      <OnlineStatus isOnline={user.isOnline} />
    </div>
  );
}

function UserName({ name }) { return <h2>{name}</h2>; }
function UserRole({ role }) { return <p style={{ color: '#666' }}>{role}</p>; }
function OnlineStatus({ isOnline }) {
  return <span>{isOnline ? '🟢 Online' : '🔴 Offline'}</span>;
}
```

```
Data flow:

App
│ owns: { name: 'Deepak', role: 'Frontend Developer', isOnline: true }
│
│ passes user={...} ↓
│
ProfileCard
│ receives: { user: { name, role, isOnline } }
│ unpacks and passes individual pieces down
│
├── passes name="Deepak" ↓
│   UserName → renders <h2>Deepak</h2>
│
├── passes role="Frontend Developer" ↓
│   UserRole → renders <p>Frontend Developer</p>
│
└── passes isOnline={true} ↓
    OnlineStatus → renders <span>🟢 Online</span>
```

Notice how `ProfileCard` receives the whole `user` object but passes only the relevant piece to each child. Each component receives only the data it needs.

---

## Part 10: Prop Drilling — A Problem You'll Feel Soon

What happens when a deeply nested component needs data from the top?

```
App (has user data)
  └── Layout
        └── Sidebar
              └── UserSection
                    └── Avatar (needs user.name)
```

You'd have to pass `user` through every intermediate component, even though `Layout`, `Sidebar`, and `UserSection` don't use it themselves:

```jsx
function App() {
  const user = { name: 'Deepak' };
  return <Layout user={user} />;
}

function Layout({ user }) {
  // doesn't use user, just passes it through
  return <Sidebar user={user} />;
}

function Sidebar({ user }) {
  // doesn't use user either
  return <UserSection user={user} />;
}

function UserSection({ user }) {
  return <Avatar name={user.name} />;
}

function Avatar({ name }) {
  return <span>{name[0]}</span>;
}
```

This is called **prop drilling** — drilling props through layers that don't need them.

### Comprehension Check #3 — Why is prop drilling a problem if it works?

**Answer:** Three reasons. First, every intermediate component has to accept and forward props it doesn't care about — more code, more noise. Second, if `Avatar` needs a new prop, you have to update every component in the chain. Third, it couples unrelated components — `Sidebar` now "knows" about user data even though it's just a layout component. This makes components less reusable and harder to refactor.

We won't solve it today. Feel the pain. On Day 12 (Context API), we'll solve it properly. Knowing the problem deeply makes the solution click instantly.

---

## Part 11: React Internals — Props in the Element Tree

When React builds the element tree, props are embedded at every level. React walks this tree, calling each component function with its props, until every branch ends in host elements (`div`, `h2`, `p`, `span`). The final tree of host elements is the Virtual DOM that gets committed to the real DOM.

```js
// Simplified element tree for the ProfileCard example:
{
  type: ProfileCard,
  props: {
    user: { name: 'Deepak', role: 'Dev', isOnline: true }
  },
  // React calls ProfileCard({ user: ... }) → returns:
  {
    type: 'div',
    props: {
      children: [
        { type: UserName, props: { name: 'Deepak' } },
        { type: UserRole, props: { role: 'Dev' } },
        { type: OnlineStatus, props: { isOnline: true } },
      ]
    }
  }
}
```

**When props change** (after a state update in the parent — Day 4), React re-calls the component with the new props, gets a new element tree, diffs it with the old one, and updates only the changed DOM nodes. The component itself doesn't "detect" the change — React just calls it again with fresh data.

---

## Part 12: Machine Coding — Rebuild User Directory with Props

### Folder Structure

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
├── data/
│   └── users.js
├── App.jsx
└── main.jsx
```

### The Data (Single Source of Truth)

```jsx
// src/data/users.js
const users = [
  { id: 1, name: 'Deepak', role: 'Frontend Developer', city: 'Bhiwani', isActive: true, avatarEmoji: '👨‍💻' },
  { id: 2, name: 'Sarah', role: 'Backend Developer', city: 'London', isActive: false, avatarEmoji: '👩‍💻' },
  { id: 3, name: 'Raj', role: 'Designer', city: 'Mumbai', isActive: true, avatarEmoji: '🎨' },
];

export default users;
```

### Components — Bottom Up

```jsx
// StatusBadge.jsx — isActive was hardcoded in Day 2, now a prop
function StatusBadge({ isActive }) {
  return (
    <span style={{ color: isActive ? 'green' : 'red', fontSize: '14px' }}>
      {isActive ? '🟢 Active' : '🔴 Away'}
    </span>
  );
}
export default StatusBadge;
```

```jsx
// UserAvatar.jsx — emoji = '🧑' is a default prop
function UserAvatar({ emoji = '🧑', name }) {
  return (
    <div style={{
      width: '50px', height: '50px', borderRadius: '50%',
      backgroundColor: '#f0f0f0', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: '24px',
    }} title={name}>
      {emoji}
    </div>
  );
}
export default UserAvatar;
```

```jsx
// UserInfo.jsx — name, role, city were hardcoded in Day 2, now props
function UserInfo({ name, role, city }) {
  return (
    <div>
      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{name}</p>
      <p style={{ margin: '2px 0', color: '#666' }}>{role}</p>
      <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>{city}</p>
    </div>
  );
}
export default UserInfo;
```

```jsx
// UserCard.jsx — receives all data, distributes relevant pieces to children
import UserAvatar from './UserAvatar';
import UserInfo from './UserInfo';
import StatusBadge from './StatusBadge';

function UserCard({ name, role, city, isActive, avatarEmoji }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '16px', border: '1px solid #e0e0e0',
      borderRadius: '8px', marginBottom: '12px',
    }}>
      <UserAvatar emoji={avatarEmoji} name={name} />
      <div style={{ flex: 1 }}>
        <UserInfo name={name} role={role} city={city} />
      </div>
      <StatusBadge isActive={isActive} />
    </div>
  );
}
export default UserCard;
```

```
Data flow through UserCard:

UserCard receives: { name, role, city, isActive, avatarEmoji }
    │
    ├── passes emoji, name → UserAvatar
    ├── passes name, role, city → UserInfo
    └── passes isActive → StatusBadge
```

```jsx
// UserList.jsx
import UserCard from './UserCard';

function UserList({ users }) {
  return (
    <div>
      {users.map((user) => (
        <UserCard
          key={user.id}
          name={user.name}
          role={user.role}
          city={user.city}
          isActive={user.isActive}
          avatarEmoji={user.avatarEmoji}
        />
      ))}
    </div>
  );
}
export default UserList;
```

**`key={user.id}`** — every item in `.map()` needs a unique, stable key. Use `user.id` because it's unique and doesn't change. Never use array index as key if the list can be reordered or filtered (Day 9 explains why deeply).

**Spread operator alternative:**

```jsx
// Instead of listing every prop:
<UserCard key={user.id} name={user.name} role={user.role} ... />

// You could write:
<UserCard key={user.id} {...user} />
```

The spread operator takes every key-value pair in `user` and passes them as individual props. Concise, but passes everything including props the child might not expect. Explicit props are more readable and safer.

```jsx
// MemberCount.jsx — uses count > 0 instead of count && to avoid the 0 gotcha
function MemberCount({ count }) {
  return (
    <p style={{ color: '#888', fontSize: '14px', textAlign: 'center' }}>
      {count > 0 ? `Showing ${count} members` : 'No members found'}
    </p>
  );
}
export default MemberCount;
```

```jsx
// Header.jsx
function Header({ title = 'Team Directory' }) {
  return (
    <h1 style={{ textAlign: 'center', borderBottom: '2px solid #eee', paddingBottom: '16px' }}>
      {title}
    </h1>
  );
}
export default Header;
```

```jsx
// Footer.jsx
function Footer({ year = 2026, appName = 'Team App' }) {
  return (
    <footer style={{ textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '12px', color: '#aaa', fontSize: '12px' }}>
      © {year} {appName}
    </footer>
  );
}
export default Footer;
```

```jsx
// App.jsx — single source of truth, data flows down
import Header from './components/Header';
import UserList from './components/UserList';
import MemberCount from './components/MemberCount';
import Footer from './components/Footer';
import users from './data/users';

function App() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <Header />
      <UserList users={users} />
      <MemberCount count={users.length} />
      <Footer />
    </div>
  );
}
export default App;
```

### Complete Data Flow

```
App
│ imports users array from data/users.js
│
├── <Header />  (uses default title)
│
├── <UserList users={users} />
│   └── .map() over users array
│       ├── <UserCard key=1 name="Deepak" role="..." ... />
│       │   ├── <UserAvatar emoji="👨‍💻" name="Deepak" />
│       │   ├── <UserInfo name="Deepak" role="..." city="Bhiwani" />
│       │   └── <StatusBadge isActive={true} />
│       ├── <UserCard key=2 name="Sarah" ... />
│       └── <UserCard key=3 name="Raj" ... />
│
├── <MemberCount count={3} />
└── <Footer />  (uses defaults)
```

Every piece of data originates in `App`. It flows down through props. No component reaches up or sideways. This is one-way data flow in action.

---

## Part 13: Common Mistakes & Interview Traps

**Trap 1:** "Can a child modify its props?"
No. Props are read-only. If a child needs to change something, the parent passes down a callback function (Day 4).

**Trap 2:** "What's the difference between props and state?"
Props are external — passed in by the parent, read-only. State is internal — owned by the component, changeable. (Day 4 covers state.) Props are like arguments to a function. State is like local variables declared inside the function.

**Trap 3:** "What happens if you pass a prop the component doesn't use?"
Nothing bad. It's ignored. But it's messy — makes the API unclear.

**Trap 4:** "Should you pass entire objects or individual values?"

```jsx
// Option A: pass the whole object
<UserCard user={user} />

// Option B: pass individual props
<UserCard name={user.name} role={user.role} city={user.city} />
```

Both work. Option B is more explicit — `UserCard`'s interface is clear from the JSX. Option A is more concise but hides what `UserCard` actually needs. Individual props are preferred for components used in many places; whole objects are fine for tightly coupled parent-child pairs.

**Trap 5:** "Is `key` a prop?"
No. `key` is consumed by React internally and is **not** accessible via `props.key` inside the component. If you need the id inside the component, pass it separately:

```jsx
<UserCard key={user.id} id={user.id} />
```

---

## Day 3 Recap

```
Day 2 connection → Day 3 additions:

Day 2: Components are reusable but rendered identical data
Day 3: Props make components TRULY reusable — same structure, different data

New concepts today:
1. Props = function parameters for components
2. Under the hood: JSX attributes become the props object
3. Destructuring — clean syntax for extracting props
4. Props are READ-ONLY — never mutate them
5. One-way data flow — parent → child, never upward
6. Default props — fallback values via destructuring defaults (not ||)
7. children — special prop for content between tags
8. Container components — wrapping content with children
9. Prop drilling — the pain of passing through intermediate layers
10. key is NOT a prop — it's consumed by React internally
11. Spread operator for props — concise but use carefully
```

---

---

# Practice Problems & Answers

## Beginner

### Q1: `Badge` component with `label` and `color` props

```jsx
function Badge({ color, label }) {
  return (
    <div style={{ background: color || 'blue', width: "100px", height: '20px', margin: '10px', padding: '2px' }}>
      {label || ""}
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <Badge color="red" label="Red" />
      <Badge color="yellow" label="Yellow" />
      <Badge />
    </div>
  );
}
```

**Result: ✅ Correct — but one style note.**

You used `color || 'blue'` inside the component body instead of a destructuring default. Both work for these values, but `||` triggers on ANY falsy value (`0`, `false`, `""`) — so if `color=""` were intentionally passed, it would be overridden to `'blue'`. More idiomatic and safer:

```jsx
// ✅ Preferred
function Badge({ color = 'blue', label = '' }) {
  return <div style={{ background: color, ... }}>{label}</div>;
}
```

Destructuring defaults trigger only for `undefined`, which is always the correct behavior.

---

### Q2: `Greeting` with default `name` prop

```jsx
function Greeting({ name = "Guest" }) {
  return (
    <div style={{ background: 'skyblue', width: "100px", height: '20px', margin: '10px', padding: '2px' }}>
      Hello {name}!
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <Greeting />
      <Greeting name="Deepak" />
    </div>
  );
}
```

**Result: ✅ Perfect.** Exactly the intended pattern.

---

## Intermediate

### Q3: `Card` container component with `children`

```jsx
function Card({ children }) {
  return (
    <div style={{ border: '1px solid black' }}>
      {children}
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <Card>Hello</Card>
      <Card>
        <div>Card</div>
      </Card>
      <Card>
        {[1, 3].map(el => <p>{el}</p>)}
      </Card>
    </div>
  );
}
```

**Result: ✅ Correct rendering — but check your console.**

React will warn about a missing `key` prop on the `<p>` elements inside `.map()` in the third `Card`. You've done this correctly elsewhere — just a slip here:

```jsx
{[1, 3].map(el => <p key={el}>{el}</p>)}
```

---

### Q4: `SkillBadge` with level-to-color mapping

```jsx
const levelColorMap = {
  beginner: "yellow",
  intermediate: "blue",
  advanced: "green",
  default: "yellow"
};

function SkillBadge({ name, level }) {
  return (
    <div style={{ background: levelColorMap[level || "default"] }}>
      {name}
    </div>
  );
}

function App() {
  const skills = [
    { id: 1, name: 'HTML', level: 'advanced' },
    { id: 2, name: 'React', level: 'intermediate' },
    { id: 3, name: 'Node.js', level: 'beginner' },
    { id: 4, name: 'CSS', level: 'advanced' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {skills.map(skill => <SkillBadge key={skill.id} name={skill.name} level={skill.level} />)}
    </div>
  );
}
```

**Result: ✅ Excellent.** Clean lookup pattern, sensible fallback. Production-quality code.

---

## Advanced

### Q5: Spread operator refactor + tradeoffs

```jsx
function UserCard({ name, role, city }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{role}</p>
      <p>{city}</p>
    </div>
  );
}

const userData = { name: 'Deepak', role: "software", city: 'Bhiwani' };

<UserCard {...userData} />
```

**My analysis:**
> Advantage: concise, just have to pass one object.
> Disadvantage: unwanted props will also get passed if present in the object.

**Result: ✅ Correct.** One addition to the disadvantage: it's not just unwanted props — `UserCard`'s required interface also becomes **invisible at the call site**. If you only see `<UserCard {...userData} />`, you can't tell what props `UserCard` actually needs without opening its file. With explicit props, the JSX itself documents the API.

---

## MAANG-level

### Q6: `Button` component prop interface design

```jsx
function Button({ icon, iconPosition = "left", loading = false, tooltip = "", children }) {
  return (
    <button tooltip={tooltip}>
      {(icon && iconPosition === "left") && "render icon here"}
      {loading ? "some spinner icon" : children}
      {(icon && iconPosition === "right") && "render icon here"}
    </button>
  );
}
```

**Result: 🟡 Good instinct — missing a few core props.**

Issues:

1. **Missing `onClick`** — A button that can't be clicked isn't very useful. Every interactive component's prop signature needs its core behavior prop.
2. **Missing `disabled`** — Loading buttons are almost always disabled too (prevent double-submits while loading).
3. **`tooltip` on `<button>` isn't a real HTML attribute** — browsers don't natively show tooltips from a `tooltip` prop. Use the `title` attribute for native tooltips, or a separate `Tooltip` wrapper for styled ones.
4. **Icon-only buttons** — What if there's no `children`, just an icon (like a close `✕` button)? Current logic assumes `children` always exists.

**Refined version:**

```jsx
function Button({
  children,
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  variant = 'primary',   // 'primary' | 'secondary' | 'danger'
  size = 'medium',       // 'small' | 'medium' | 'large'
}) {
  const isDisabled = disabled || loading;

  return (
    <button onClick={onClick} disabled={isDisabled}>
      {loading && 'spinner'}
      {!loading && icon && iconPosition === 'left' && icon}
      {!loading && children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
}
```

**The MAANG-level thinking:** `onClick` and `disabled` are core to what a button IS — they should never be an afterthought. `variant`/`size` control appearance and are almost always needed in a real design system. The `tooltip` idea was a nice touch for extensibility — just needs `title` attribute or a separate component wrapper.

---

## Corrections Summary

1. **`||` vs destructuring defaults** — `||` triggers on any falsy value; destructuring defaults trigger only on `undefined`. Prefer destructuring defaults for props.
2. **Missing `key` in `.map()`** — `{[1, 3].map(el => <p>{el}</p>)}` needs `key={el}`. Applies everywhere map renders elements.
3. **Spread operator hides the interface** — `<UserCard {...user} />` makes `UserCard`'s required props invisible at the call site, not just passes extra props.
4. **`onClick` and `disabled` are core to Button** — never design an interactive component's prop interface without its primary behavior prop.
5. **`tooltip` is not a native HTML attribute** — use `title` for native browser tooltips, or a dedicated wrapper component for styled ones.