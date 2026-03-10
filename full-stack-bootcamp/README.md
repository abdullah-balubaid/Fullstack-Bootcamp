# 🌙 Ramadan Community Board — Workshop Guide

> A step-by-step code-along workshop. You will build a beautifully designed Ramadan-themed task board from scratch using **React**, **TypeScript**, **Vite**, and **Tailwind CSS v4**.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Assets & Data](#4-assets--data)
5. [Step 1 — Global Styles & Design Tokens](#5-step-1--global-styles--design-tokens)
6. [Step 2 — App Scaffold](#6-step-2--app-scaffold)
7. [Step 3 — Header Component](#7-step-3--header-component)
8. [Step 4 — Input Component](#8-step-4--input-component)
9. [Step 5 — TaskCard Component](#9-step-5--taskcard-component)
10. [Step 6 — ParticleBackground Component](#10-step-6--particlebackground-component)
11. [Step 7 — TaskModal Component](#11-step-7--taskmodal-component)
12. [Step 8 — Wiring Everything in App.tsx](#12-step-8--wiring-everything-in-apptsx)
13. [Running the Project](#13-running-the-project)

---

## 1. Project Overview

The **Ramadan Community Board** is a single-page app that displays a collection of community Ramadan tasks (Iftar prep, Zakat drives, etc.). Each task is displayed as a card. Clicking a card opens a detailed modal. Tasks can be marked as completed, which visually changes the card's appearance.

**What we are building:**

| Feature | Description |
|---|---|
| Particle Background | Animated canvas with gold crescents, sparkles, stars, and dots floating upward |
| Decorative Layout | Background SVG pattern, lantern images, and a gold-bordered frame |
| Header | Large centred title using the Lexend Google Font |
| Input Bar | A styled search/add bar with icon buttons |
| Task Cards | Glassmorphism cards showing title, description, crescents (priority), and date |
| Task Modal | A full-screen blurred overlay modal with detailed task info and a complete button |
| State Management | React `useState` to track open modal and task completion |

---

## 2. Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Type safety |
| [Vite](https://vitejs.dev/) | 7 | Dev server & bundler |
| [Tailwind CSS v4](https://tailwindcss.com/) | 4 | Utility-first styling |
| [Google Fonts — Lexend](https://fonts.google.com/specimen/Lexend) | — | Display typeface |

---

## 3. Project Structure

```
full-stack-bootcamp/
├── index.html                  ← Vite HTML entry point
├── package.json                ← Dependencies and scripts
├── vite.config.ts              ← Vite config (React + Tailwind plugins)
├── tsconfig.json               ← TypeScript config
│
├── public/                     ← Static files served as-is
│
└── src/
    ├── main.tsx                ← React app entry — mounts <App /> into the DOM
    ├── App.tsx                 ← Root component — layout, state, routing of components
    ├── index.css               ← Global styles, CSS variables (design tokens), fonts
    ├── data.json               ← Static task data (title, description, crescents, etc.)
    │
    ├── assets/                 ← Images, SVGs used throughout the app
    │   ├── Background Vector.svg
    │   ├── Crescent.svg
    │   ├── Lantern.png
    │   ├── Left lanterns.png
    │   ├── Right lanterns.png
    │   ├── Star Icon.png
    │   └── Edit Icon.png
    │
    └── components/
        ├── Header.tsx          ← App title display
        ├── Input.tsx           ← Add-task input bar
        ├── TaskCard.tsx        ← Individual task card (reusable)
        ├── ParticleBackground.tsx ← Animated canvas particle system
        └── TaskModal.tsx       ← Detailed task overlay modal
```

### How the files relate to each other

```
main.tsx
  └── App.tsx
        ├── index.css          (global tokens & fonts)
        ├── ParticleBackground (canvas layer, z-index 1, pointer-events none)
        ├── Header             (title)
        ├── Input              (add task bar)
        ├── TaskCard × N       (reads from data.json via App state)
        └── TaskModal          (portalled to <body>, only renders when a card is clicked)
```

---

## 4. Assets & Data

### `src/data.json`

This file is the source of truth for all task cards. Each entry maps directly onto the `TaskCardProps` type you will define in `TaskCard.tsx`.

```json
[
  {
    "id": 1,
    "title": "Iftar Prep",
    "description": "Prepare 20 meals for the local area",
    "date": "Mar 6th 2026",
    "activeCrescents": 4,
    "variant": "small",
    "summary": [
      "Assemble individual meal kits (dates, snacks, main course).",
      "Logistics setup at distribution point.",
      "Hygiene check of all items."
    ],
    "volunteersNeeded": 10
  }
]
```

> **Workshop note:** The crescent rating is always out of 5 — hardcoded in the components. `activeCrescents` is how many are "lit up". `volunteersNeeded` is a plain number; the components append the label "volunteers required" in the UI. `summary` and `volunteersNeeded` are only shown in the modal.

---

## 5. Step 1 — Global Styles & Design Tokens

**File:** `src/index.css`

This is the **first file** to set up. It defines the colour palette as CSS custom properties (variables) that every component will reference, imports the Google Font, and sets up Tailwind.

### What to write

```css
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap');
@import "tailwindcss";

:root {
  --bg-dark:        #0A1128;  /* deep navy — main background */
  --panel-deep:     #0D1726;  /* slightly lighter navy — card/modal backgrounds */
  --gold-primary:   #D4AF37;  /* main gold */
  --gold-cream:     #FFF1AA;  /* light gold / cream — borders, subtle text */
  --gold-bright:    #E8C84A;  /* bright gold — highlights */
  --cta-1:          #C9A227;  /* CTA button gradient start */
  --cta-2:          #E8C84A;  /* CTA button gradient end */
  --text-cream:     #F8E4AE;  /* body/heading text */
}

/* Crescent icon states — used on both TaskCard and TaskModal */
.crescent-active {
  filter: drop-shadow(0 0 6px rgba(212,175,55,0.4)) saturate(1.2) brightness(1);
}
.crescent-inactive {
  filter: grayscale(1) brightness(0.6) opacity(0.55);
}

/* Lexend font utility class */
.font-lexend {
  font-family: 'Lexend';
}

/* Prevent horizontal scroll */
html, body {
  overflow-x: hidden;
  background-color: var(--bg-dark);
}
```

### Why this matters

- **CSS variables** allow you to change the entire colour scheme from one place. Every component reads from these tokens so there is no magic colour value scattered around.
- **`.crescent-active` / `.crescent-inactive`** — rather than duplicating filter strings in every component, we define them once here and apply them as class names.
- **Tailwind v4** is imported via `@import "tailwindcss"` — no `tailwind.config.js` needed.

---

## 6. Step 2 — App Scaffold

**File:** `src/App.tsx`

`App.tsx` is the **root shell** of the entire application. Your starter file is an empty shell — in this step you will build the background layout from scratch.

### What to write

Open `src/App.tsx` and replace its contents with:

```tsx
import backGroundPattern from "./assets/Background Vector.svg";
import lanternRight from "./assets/Right lanterns.png";
import lanternLeft from "./assets/Left lanterns.png";

function App() {
  return (
    <div
      className="min-h-screen bg-(--bg-dark) text-white relative overflow-hidden font-sans flex flex-col items-center"
      style={{ backgroundImage: `url(${backGroundPattern})`, backgroundSize: "cover" }}
    >
      {/* Lantern decorations */}
      <img src={lanternRight} alt="Right Lanterns"
        className="absolute top-0 right-0 w-32 md:w-70 opacity-80 z-2" />
      <img src={lanternLeft}  alt="Left Lanterns"
        className="absolute top-0 left-0 w-32 md:w-70 opacity-80 z-2" />

      {/* Gold border frame */}
      <div className="relative z-2 mx-auto w-[95vw] h-[90vh] border-[3px] border-(--text-cream)
                      flex flex-col items-center gap-10 py-12 px-10 shadow-2xl my-12">
        {/* Components will go here */}
      </div>
    </div>
  );
}

export default App;
```

### Why this structure?

| Class / Attribute | Purpose |
|---|---|
| `min-h-screen` | Ensures the background always covers the full viewport |
| `bg-(--bg-dark)` | Uses the CSS variable for the background colour (Tailwind v4 syntax) |
| `overflow-hidden` | Clips the particle canvas and lanterns at the screen edge |
| `style={{ backgroundImage }}` | SVG pattern is applied as a CSS background image via inline style |
| `z-2` on the frame | Sits above the particle layer (z-1) but below the modal (z-50) |
| `border-[3px] border-(--text-cream)` | The single decorative gold frame that wraps everything |

---

## 7. Step 3 — Header Component

**File:** `src/components/Header.tsx`
**Used in:** `App.tsx` — inside the gold border frame

### Purpose

A single large centred heading displaying the app name. This is intentionally minimal — its job is purely typographic impact.

### What to write

Create `src/components/Header.tsx`:

```tsx
const Header = () => {
  return (
    <div className="text-6xl text-amber-100 font-lexend text-center">
      Ramadan Community Board
    </div>
  );
};

export default Header;
```

### Add to `App.tsx`

At the top of the file add the import:
```tsx
import Header from "./components/Header";
```

Then inside the gold border frame div:
```tsx
<Header />
```

### Why this matters

- `font-lexend` applies the Google Font we imported in `index.css`
- `text-6xl` gives it commanding presence as the page hero text
- `text-amber-100` is a Tailwind built-in — warm off-white rather than harsh pure white

---

## 8. Step 4 — Input Component

**File:** `src/components/Input.tsx`
**Used in:** `App.tsx` — directly below `<Header />`

### Purpose

A styled text input bar that will eventually allow users to add new tasks. For this workshop it is a **UI-only** component — the interaction logic is left as a future exercise. It introduces the glassmorphism style used on cards throughout the app.

### What to write

Create `src/components/Input.tsx`:

```tsx
import StarIcon from "../assets/Star Icon.png";
import AddIcon  from "../assets/Edit Icon.png";

const Input = () => {
  return (
    <div className="w-full flex items-center justify-center">

      {/* Search / task input */}
      <div className="relative w-full max-w-4xl">
        <input
          aria-label="Add task"
          placeholder="Add your Next Ramadan Task Here......"
          className="
            w-full bg-(--bg-dark) bg-opacity-20 backdrop-blur-[3px]
            border border-(--gold-cream) rounded-full
            py-4 px-6 pl-12
            placeholder:text-amber-200/50 text-amber-100
            outline-none
            focus:border-(--gold-cream) focus:ring-2 focus:ring-(--gold-primary)
          "
        />

        {/* Decorative star icon inside the input */}
        <button className="absolute right-4 top-1/2 -translate-y-1/2
                           w-10 h-10 flex items-center justify-center
                           bg-transparent hover:brightness-105">
          <img src={StarIcon} alt="Star Icon" className="w-8 h-8" />
        </button>
      </div>

      {/* Add button alongside the input */}
      <button className="
        ml-4 px-4 py-4 rounded-full
        bg-(--bg-dark) bg-opacity-20 backdrop-blur-[3px]
        border border-(--gold-cream) text-amber-100
        hover:border-(--gold-cream)
      ">
        <img src={AddIcon} alt="Add Icon" className="w-5 h-5" />
      </button>

    </div>
  );
};

export default Input;
```

### Add to `App.tsx`

```tsx
import Input from "./components/Input";
```
```tsx
<Header />
<Input />   {/* ← add this */}
```

### Key concepts introduced

| Concept | Where |
|---|---|
| `backdrop-blur-[3px]` | Frosted-glass effect — slightly blurs what is behind the element |
| `bg-opacity-20` | Semi-transparent background so the element "floats" |
| `rounded-full` | Pill shape for the input and button |
| `absolute` positioning | Star icon is layered inside the input without taking up layout space |
| `focus:ring-2` | Accessible focus outline styled in gold |

---

## 9. Step 5 — TaskCard Component

**File:** `src/components/TaskCard.tsx`
**Used in:** `App.tsx` — rendered once per task in a CSS Grid

### Purpose

The core reusable card that represents a single task. It accepts all task data as props, renders a compact summary with crescent icons as a priority indicator, and visually changes when the task is completed.

### Step A — Define the type

At the top of `src/components/TaskCard.tsx`, define and **export** the props type. Exporting it is important because `TaskModal` and `App.tsx` will also import it.

```tsx
export type TaskCardProps = {
  title: string;
  description: string;
  date: string;
  activeCrescents?: number;   // how many crescents are "lit"
  variant?: "small" | "wide"; // wide cards span 2 grid columns
  completed?: boolean;
  completedOn?: string;       // e.g. "Mar 12th 2026"
  summary?: string[];         // shown only in the modal
  volunteersNeeded?: number;  // shown only in the modal — label appended in the UI
  onClick?: () => void;       // passed down from App to open the modal
};
```

### Step B — Write the component

```tsx
import Crescent from "../assets/Crescent.svg";
import Lantern  from "../assets/Lantern.png";

const TaskCard = ({
  title,
  description,
  date,
  activeCrescents = 0,
  variant         = "small",
  completed       = false,
  completedOn,
  onClick,
}: TaskCardProps) => {
  const isWide = variant === "wide";

  return (
    <div
      onClick={onClick}
      className={[
        "relative bg-(--bg-dark) bg-opacity-20 backdrop-blur-[3px]",
        "border rounded-2xl flex flex-col items-center",
        "px-6 pt-4 pb-5 overflow-hidden",
        completed
          ? "border-(--gold-cream) shadow-[0_0_20px_3px_rgba(212,175,55,0.18)]"
          : "border-(--gold-cream)",
        isWide ? "md:col-span-2" : "",
        onClick ? "cursor-pointer hover:border-(--gold-cream) transition-colors duration-200" : "",
      ].filter(Boolean).join(" ")}
    >
      {/* Completed dim overlay */}
      {completed && (
        <div className="absolute inset-0 bg-(--bg-dark) bg-opacity-25 rounded-2xl pointer-events-none" />
      )}

      {/* Top row — lantern | title | lantern */}
      <div className="relative w-full flex items-center justify-between gap-2 min-h-12">
        <img src={Lantern} alt="" className={`w-5 h-8 shrink-0 ${completed ? "opacity-50" : "opacity-85"}`} />
        <h3 className={`font-medium text-center text-base leading-tight ${completed ? "text-(--text-cream)/70" : "text-(--text-cream)"}`}>
          {title}
        </h3>
        <img src={Lantern} alt="" className={`w-5 h-8 shrink-0 ${completed ? "opacity-50" : "opacity-85"}`} />
      </div>

      {/* Description */}
      <p className={`relative flex-1 flex items-center text-center leading-snug text-sm mt-2 px-1
                     ${completed ? "text-amber-100/45" : "text-amber-100/80"}`}>
        {description}
      </p>

      {/* Crescent row — priority indicator */}
      <div className="relative flex items-center gap-1 mt-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <img
            key={i}
            src={Crescent}
            alt={i < activeCrescents ? "active" : "inactive"}
            className={"w-6 h-6 " + (i < activeCrescents ? "crescent-active" : "crescent-inactive")}
          />
        ))}
      </div>

      {/* Footer — date or completed stamp */}
      {completed ? (
        <div className="relative w-full mt-3">
          <div className="flex items-center gap-2 w-full">
            <span className="flex-1 border-t-2 border-(--gold-bright)/70" />
            <span className="text-(--gold-bright) text-base font-bold tracking-wide whitespace-nowrap">
              Completed
            </span>
            <span className="flex-1 border-t-2 border-(--gold-bright)/70" />
          </div>
          <p className="text-center text-amber-200/50 text-xs mt-1">
            {completedOn ?? date}
          </p>
        </div>
      ) : (
        <p className="text-amber-200/50 text-xs mt-3">{date}</p>
      )}
    </div>
  );
};

export default TaskCard;
```

### Example usage

```tsx
<TaskCard
  id={1}
  title="Distribute Food"
  description="Help distribute food packages to families in need during Ramadan."
  date="Mar 15th 2026"
  activeCrescents={4}
  variant="wide"
  volunteersNeeded={5}
  onClick={() => console.log("Card clicked")}
/>
```

### Step C — Add cards to `App.tsx`

Add these imports at the top of `App.tsx`:
```tsx
import { useState }          from "react";
import TaskCard               from "./components/TaskCard";
import type { TaskCardProps } from "./components/TaskCard";
import taskData               from "./data.json";

type Task = TaskCardProps & { id: number };
const TASKS = taskData as Task[];
```

Add state inside `App()`:
```tsx
const [tasks, setTasks] = useState(TASKS);
```

Add the card grid inside the gold border frame, below `<Input />`:
```tsx
<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
  {tasks.map((task) => (
    <TaskCard key={task.id} {...task} />
  ))}
</div>
```

### Component anatomy explained

```
┌──────────────────────────────┐
│  🏮  Iftar Prep         🏮   │  ← Top row: lantern | title | lantern
│                              │
│  Prepare 20 meals for the    │  ← Description (fades when completed)
│  local area                  │
│                              │
│  🌙 🌙 🌙 🌙 ○             │  ← Crescents: 4 of 5 active (priority)
│                              │
│  Mar 6th 2026                │  ← Date footer (or "Completed" stamp)
└──────────────────────────────┘
```

### Key patterns to discuss

| Pattern | Explanation |
|---|---|
| Conditional class names | We build an array of class strings and `.filter(Boolean).join(" ")` — clean and readable |
| `Array.from({ length: n })` | Generates n crescent slots without needing a pre-built array in data |
| `pointer-events-none` overlay | The dim overlay on completed cards is purely visual — it doesn't block clicks |
| `...task` spread | In `App.tsx` we spread the task object directly into `<TaskCard />` which maps each key to its corresponding prop |

---

## 10. Step 6 — ParticleBackground Component

**File:** `src/components/ParticleBackground.tsx`
**Used in:** `App.tsx` — first child inside the root div, sits beneath everything

### Purpose

An animated HTML5 Canvas layer that fills the entire screen with softly floating gold particles — dots, sparkles, 4-pointed stars, and crescent moons. It runs an animation loop using `requestAnimationFrame` and is completely decorative (`pointer-events-none`).

### High-level architecture

```
ParticleBackground
  └── <canvas ref={canvasRef} />
        └── useEffect (runs once on mount)
              ├── resize()         — set canvas to window size
              ├── buildParticles() — spawn N random particles
              ├── animate()        — rAF loop: clear → move → draw → repeat
              └── cleanup          — cancel rAF + remove resize listener
```

### Step A — Setup and design tokens

Create `src/components/ParticleBackground.tsx`:

```tsx
import { useEffect, useRef } from "react";

// Gold colour palette — matches index.css design tokens
const GOLD_COLORS = ["#D4AF37", "#E8C84A", "#FFF1AA", "#C9A227", "#F8E4AE"];

type ParticleType = "star" | "crescent" | "sparkle" | "dot";

interface Particle {
  x: number; y: number;        // position
  vx: number; vy: number;      // velocity (vy is negative = moves up)
  size: number;
  baseOpacity: number;
  type: ParticleType;
  rotation: number;
  vRotation: number;           // spin speed
  twinkleSpeed: number;        // sine wave speed for opacity pulse
  twinkleOffset: number;       // phase offset so not all particles sync
  colorIdx: number;            // index into GOLD_COLORS
}
```

### Step B — Helper: pre-render the crescent sprite

```tsx
// Pre-render crescent shapes to an off-screen canvas for performance
function makeCrescentCanvas(radius: number, color: string): HTMLCanvasElement {
  const d = (radius + 4) * 2;
  const oc = document.createElement("canvas");
  oc.width = d;
  oc.height = d;
  const ctx = oc.getContext("2d")!;
  const c = d / 2;

  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = radius;
  ctx.beginPath();
  ctx.arc(c, c, radius, 0, Math.PI * 2);
  ctx.fill();

  // Punch a smaller offset circle to carve the crescent shape
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.beginPath();
  ctx.arc(c + radius * 0.45, c, radius * 0.78, 0, Math.PI * 2);
  ctx.fill();

  return oc;
}
```

> **Workshop note:** Pre-rendering the crescent to an off-screen canvas is a performance trick. Drawing arcs every frame is expensive — instead we render once and then `drawImage` (blit) the cached result each frame.

### Step C — The main component

```tsx
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    let animId: number;
    let particles: Particle[] = [];

    // Cache crescent sprites at 4 sizes × 5 colours
    const crescentSprites = new Map<string, HTMLCanvasElement>();
    const crescentSizes = [5, 7, 10, 13];
    for (const sz of crescentSizes)
      for (const col of GOLD_COLORS)
        crescentSprites.set(`${sz}-${col}`, makeCrescentCanvas(sz, col));

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const buildParticles = () => {
      // Scale particle count to screen area (~1 per 9000px²)
      const count = Math.max(40, Math.floor((canvas.width * canvas.height) / 9000));

      particles = Array.from({ length: count }, () => {
        const roll = Math.random();
        const type: ParticleType =
          roll < 0.55 ? "dot"
          : roll < 0.75 ? "star"
          : roll < 0.9  ? "sparkle"
          : "crescent";

        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -(Math.random() * 0.35 + 0.08), // always moves upward
          size:
            type === "crescent" ? crescentSizes[Math.floor(Math.random() * crescentSizes.length)]
            : type === "sparkle" ? Math.random() * 4 + 3
            : Math.random() * 2.5 + 1,
          baseOpacity: Math.random() * 0.5 + 0.2,
          type,
          rotation:    Math.random() * Math.PI * 2,
          vRotation:   (Math.random() - 0.5) * 0.015,
          twinkleSpeed:   Math.random() * 0.025 + 0.005,
          twinkleOffset:  Math.random() * Math.PI * 2,
          colorIdx: Math.floor(Math.random() * GOLD_COLORS.length),
        };
      });
    };

    let t = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRotation;

        // Wrap: particles that leave the top reappear at the bottom
        if (p.y < -20)               { p.y = canvas.height + 20; p.x = Math.random() * canvas.width; }
        if (p.x < -20)               p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        // Twinkle — sine wave modulates opacity
        const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t * p.twinkleSpeed + p.twinkleOffset));
        const opacity = p.baseOpacity * twinkle;

        // Draw each particle type using your helper functions
        // (drawDot, drawSparkle, crescent blit)
      }

      animId = requestAnimationFrame(animate);
    };

    resize();
    buildParticles();
    animate();

    window.addEventListener("resize", () => { resize(); buildParticles(); });
    return () => { cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-1"
      style={{ mixBlendMode: "screen", opacity: 0.65 }}
    />
  );
};

export default ParticleBackground;
```

### Add to `App.tsx`

```tsx
import ParticleBackground from "./components/ParticleBackground";
```

Place it as the **very first child** inside the root div — before the lanterns and the frame:

```tsx
<div className="min-h-screen ...">
  <ParticleBackground />   {/* ← must be first */}
  <img src={lanternRight} ... />
  ...
</div>
```

### Key concepts to discuss

| Concept | Explanation |
|---|---|
| `useRef<HTMLCanvasElement>` | Gives us a direct reference to the DOM canvas element without causing re-renders |
| `useEffect` with `[]` | Runs once on mount. The cleanup function returned cancels the animation loop |
| `requestAnimationFrame` (rAF) | The standard browser API for smooth 60fps animations — only fires when the tab is visible |
| `pointer-events-none` | The canvas sits on top visually but lets all mouse/touch events pass through to elements below |
| `mixBlendMode: "screen"` | Blends the gold particles with the dark background in a way that makes them glow rather than overlay opaquely |
| Sprite caching | Crescents are pre-rendered to off-screen canvases and blitted each frame — much faster than re-drawing arcs |
| Sine wave twinkle | `0.4 + 0.6 * Math.abs(Math.sin(...))` — opacity oscillates between `0.4 × base` and `1.0 × base`, never fully disappearing |

---

## 11. Step 7 — TaskModal Component *(pre-built)*

**File:** `src/components/TaskModal.tsx`
**Used in:** `App.tsx` — controlled by `openTaskId` state

> **This component is pre-built.** Open `src/components/TaskModal.tsx` to read through it — no edits needed. Your job in this step is to understand how it works and then wire it into `App.tsx`.

### Purpose

A full-screen overlay modal that shows the complete details of a task: extended description, summary bullet points, volunteers needed, and a button to toggle the task's completion state. The background is blurred using `backdrop-filter` so the app content shows through.

### Why we use `createPortal`

The root `<div>` in `App.tsx` has `overflow: hidden` (to clip the particles and lanterns). `overflow: hidden` creates a new CSS stacking context that **breaks** `backdrop-filter` on `fixed` descendants — the blur renders against the raw background colour instead of the real painted pixels.

`createPortal` teleports the modal's DOM node to be a direct child of `<body>`, completely outside that container. The blur then works correctly.

```
Without portal:    With portal:
─────────────      ──────────────
<div App>          <body>
  overflow:hidden    <div App>   ← overflow:hidden is no longer a parent
  (stacking ctx)       ...       of the modal — blur works!
  <TaskModal/>       </div>
  backdrop-filter    <TaskModal/>  ← direct child of body
  BROKEN ✗           backdrop-blur WORKS ✓
                   </body>
```

### Wire it into `App.tsx`

**Step 7a** — Add the import at the top of `App.tsx`:

```tsx
import TaskModal from "./components/TaskModal";
```

**Step 7b** — Inside the `App` function, add `openTask` and `handleToggleCompleted` after the state from Step 5b:

```tsx
const openTask = tasks.find((t) => t.id === openTaskId) ?? null;

const handleToggleCompleted = (id: number) => {
  setTasks((prev) =>
    prev.map((t) =>
      t.id === id
        ? t.completed
          ? { ...t, completed: false, completedOn: undefined }
          : { ...t, completed: true, completedOn: t.date, activeCrescents: 5 }
        : t
    )
  );
};
```

**Step 7c** — Place `<TaskModal />` **outside** the gold border frame, still inside the root div:

```tsx
      {/* Modal — portalled to <body> so backdrop-blur works correctly */}
      {openTask && (
        <TaskModal
          open={openTaskId !== null}
          onClose={() => setOpenTaskId(null)}
          onToggleCompleted={() => handleToggleCompleted(openTask.id)}
          {...openTask}
        />
      )}
    </div> {/* ← closes the root div */}
```

### Complete component (for reference)

```tsx
const TaskModal = ({
  open, onClose, onToggleCompleted,
  title, description, date,
  activeCrescents = 0, totalCrescents = 5,
  summary = [], volunteersNeeded,
  completed = false, completedOn,
}: TaskModalProps) => {

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4
                 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`
          relative w-full max-w-md bg-(--panel-deep) rounded-2xl overflow-hidden
          ${completed
            ? "border border-(--gold-cream) shadow-[0_0_40px_8px_rgba(212,175,55,0.22)]"
            : "border border-(--gold-cream)/50 shadow-[0_0_40px_6px_rgba(212,175,55,0.15)]"
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header bar ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--gold-cream)/20">
          <h2 className="flex-1 text-center font-bold text-(--gold-cream) text-sm tracking-[0.15em] uppercase">
            {title} Task Details
          </h2>
          <button
            onClick={onClose}
            className="ml-4 w-8 h-8 flex items-center justify-center rounded-full
                       border border-[#FFF1AA]/40 text-[#FFF1AA]/80
                       hover:border-[#FFF1AA] hover:text-[#FFF1AA] transition-colors"
            aria-label="Close"
          >✕</button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 pt-5 pb-6 flex flex-col gap-4">

          {/* Title + crescents + date */}
          <div className="flex flex-col items-center gap-3">
            <h1 className="font-bold text-(--gold-primary) text-3xl font-lexend">{title}</h1>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <img key={i} src={Crescent}
                  alt={i < activeCrescents ? "active" : "inactive"}
                  className={"w-7 h-7 " + (i < activeCrescents ? "crescent-active" : "crescent-inactive")}
                />
              ))}
            </div>
            <p className="font-semibold text-(--gold-cream) text-sm">Date: {date}</p>
          </div>

          <div className="border-t border-(--gold-cream)/15" />

          {/* Description */}
          <div>
            <p className="font-bold text-(--gold-primary) text-sm mb-1">Description</p>
            <p className="text-amber-100/80 text-sm leading-relaxed">{description}</p>
          </div>

          {/* Summary bullet list */}
          {summary.length > 0 && (
            <div>
              <p className="font-bold text-(--gold-primary) text-sm mb-2">Summary:</p>
              <ul className="space-y-1 pl-1">
                {summary.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-amber-100/80">
                    <span className="text-amber-200/60 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Volunteers Needed */}
          {volunteersNeeded && (
            <div>
              <p className="font-bold text-(--gold-primary) text-sm mb-1">Volunteers Needed:</p>
              <p className="text-sm text-amber-100/80 flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0 fill-[#D4AF37]" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <span>{volunteersNeeded} volunteers required</span>
              </p>
            </div>
          )}

          {/* Completed banner */}
          {completed && (
            <div className="w-full flex flex-col items-center gap-2 mt-2">
              <div className="flex items-center w-full justify-center gap-4">
                <span className="h-1 rounded bg-(--gold-cream) w-20" />
                <span className="text-(--gold-bright) text-2xl font-bold tracking-wide">Completed</span>
                <span className="h-1 rounded bg-(--gold-cream) w-20" />
              </div>
              <p className="text-amber-200/60 text-sm">{completedOn ?? date}</p>
            </div>
          )}

          {/* CTA Button */}
          {completed ? (
            <button
              onClick={() => onToggleCompleted?.()}
              className="mt-1 w-full py-3 rounded-full border-2
                         border-[#D4AF37]/60 text-[#D4AF37]/80 text-sm font-bold tracking-widest
                         hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all
                         flex items-center justify-center gap-2"
            >
              <span>✓</span>
              <span>COMPLETED{completedOn ? ` · ${completedOn}` : ""}</span>
            </button>
          ) : (
            <button
              onClick={() => onToggleCompleted?.()}
              className="mt-1 w-full py-3 rounded-full
                         bg-linear-to-r from-[#C9A227] to-[#E8C84A]
                         text-[#0A1128] font-bold text-sm tracking-widest
                         hover:brightness-110 transition-all
                         shadow-[0_0_18px_2px_rgba(212,175,55,0.3)]"
            >
              MARK AS COMPLETED
            </button>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
};

export default TaskModal;
```

### Key concepts

| Concept | Explanation |
|---|---|
| `createPortal(jsx, document.body)` | Renders JSX into a different DOM node, bypassing the component tree hierarchy |
| `e.stopPropagation()` | Prevents a click inside the modal panel from bubbling up to the backdrop's `onClick` (which would close it) |
| `useEffect` + Escape key | Best-practice a11y pattern — keyboard users expect modals to be dismissible via Escape |
| `backdrop-blur-sm` | CSS `backdrop-filter: blur(4px)` — blurs only what is visually behind the element |
| `optional chaining` `?.()` | `onToggleCompleted?.()` — safe call in case the prop is undefined |
| Conditional render | The same button area shows two different UI states depending on completion status |

---

## 12. Step 8 — Wiring Everything in App.tsx

**File:** `src/App.tsx`

Here is the **final complete `App.tsx`** with all state and event handlers:

```tsx
import { useState }          from "react";
import backGroundPattern      from "./assets/Background Vector.svg";
import lanternRight           from "./assets/Right lanterns.png";
import lanternLeft            from "./assets/Left lanterns.png";
import Header                 from "./components/Header";
import Input                  from "./components/Input";
import TaskCard               from "./components/TaskCard";
import TaskModal              from "./components/TaskModal";
import ParticleBackground     from "./components/ParticleBackground";
import type { TaskCardProps } from "./components/TaskCard";
import taskData               from "./data.json";

type Task = TaskCardProps & { id: number };
const TASKS = taskData as Task[];

function App() {
  // Track which task's modal is open (null = all closed)
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);
  // Store tasks in state so we can mutate the completed field
  const [tasks, setTasks] = useState(TASKS);

  // Find the full task object for the currently open modal
  const openTask = tasks.find((t) => t.id === openTaskId) ?? null;

  // Toggle a task between completed and not-completed
  const handleToggleCompleted = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? t.completed
            ? { ...t, completed: false, completedOn: undefined }
            : { ...t, completed: true, completedOn: t.date, activeCrescents: t.totalCrescents }
          : t
      )
    );
  };

  return (
    <div
      className="min-h-screen bg-(--bg-dark) text-white relative overflow-hidden font-sans flex flex-col items-center"
      style={{ backgroundImage: `url(${backGroundPattern})`, backgroundSize: "cover" }}
    >
      {/* 1. Particle animation layer (behind everything) */}
      <ParticleBackground />

      {/* 2. Decorative lantern images */}
      <img src={lanternRight} alt="Right Lanterns" className="absolute top-0 right-0 w-32 md:w-70 opacity-80 z-2" />
      <img src={lanternLeft}  alt="Left Lanterns"  className="absolute top-0 left-0 w-32 md:w-70 opacity-80 z-2" />

      {/* 3. Gold border frame — main content area */}
      <div className="relative z-2 mx-auto w-[95vw] h-[90vh] border-[3px] border-(--text-cream)
                      flex flex-col items-center gap-10 py-12 px-10 shadow-2xl my-12">
        <div className="max-w-4xl flex flex-col items-center justify-start gap-6">

          <Header />
          <Input />

          {/* 4. Task card grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                {...task}
                onClick={() => setOpenTaskId(task.id)}
              />
            ))}
          </div>

        </div>
      </div>

      {/* 5. Modal — portalled to <body> so backdrop-blur works correctly */}
      {openTask && (
        <TaskModal
          open={openTaskId !== null}
          onClose={() => setOpenTaskId(null)}
          onToggleCompleted={() => handleToggleCompleted(openTask.id)}
          {...openTask}
        />
      )}
    </div>
  );
}

export default App;
```

### State flow summary

```
User clicks card
  → setOpenTaskId(id)
    → openTask resolves via .find()
      → <TaskModal open={true} {...openTask} />
        → User clicks "MARK AS COMPLETED"
          → handleToggleCompleted(id)
            → setTasks(prev => [...updated])
              → card re-renders with completed styles
              → modal re-renders with completed banner + outline button
```

### Z-index layer reference

| Layer | z-index | Element |
|---|---|---|
| Background | 0 | Root div (background SVG pattern) |
| Particles | 1 | `<canvas>` in `ParticleBackground` |
| App content | 2 | Gold border frame, lanterns |
| Modal | 50 | `<TaskModal>` (portalled to body) |

---

## 13. Running the Project

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

---

## Workshop Build Order — Quick Reference

| Step | File | What you add |
|---|---|---|
| 1 | `src/index.css` | CSS variables, font import, crescent classes |
| 2 | `src/App.tsx` | Root layout, background, lanterns, gold frame |
| 3 | `src/components/Header.tsx` | Title heading |
| 4 | `src/components/Input.tsx` | Styled input bar + icon buttons |
| 5 | `src/components/TaskCard.tsx` | Reusable card with type definition |
| 5b | `src/App.tsx` | Import TaskCard, add state, render card grid |
| 6 | `src/components/ParticleBackground.tsx` | Canvas particle animation |
| 6b | `src/App.tsx` | Add `<ParticleBackground />` as first child |
| 7 | `src/components/TaskModal.tsx` | Portalled modal with blur backdrop |
| 7b | `src/App.tsx` | Wire modal state + `handleToggleCompleted` |

---

*Built with ❤️ for the Fullstack Bootcamp — Ramadan 2026*

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
