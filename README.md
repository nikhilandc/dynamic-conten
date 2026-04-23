# 🧱 PageCraft — Dynamic Content Builder

> A production-grade drag-and-drop personal page builder built with **React 18** + **Tailwind CSS 3**. Demonstrates advanced UI/UX implementation, complex interactive state management, and a premium dark-theme interface — built for **Assignment 3: Dynamic Content Builder**.

<br />

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![No Dependencies](https://img.shields.io/badge/Zero_UI_Libraries-✓-22c55e?style=for-the-badge)

---

## 🔗 Live Demo

> 🔴 Live: [https://dynamic-conten.vercel.app/](https://dynamic-conten.vercel.app/)

> 🟢 Source Code: [https://github.com/nikhilandc/dynamic-conten](https://github.com/nikhilandc/dynamic-conten)

> Deploy in under 2 minutes — see [Deployment](#-deployment) below.

---

## ✨ Features

### 🎨 Content Blocks (7 types)
| Block | Description | Config Options |
|-------|-------------|----------------|
| **📝 Header** | H1–H4 headings | Level (H1/H2/H3/H4), text, alignment |
| **✍️ Rich Text** | Body paragraph | Content, alignment (left/center/right) |
| **🖼️ Image** | URL-based image display | URL, alt text, caption, rounded corners |
| **⌨️ Markdown** | Live markdown editor + preview | Full markdown source, write/preview tabs |
| **➖ Divider** | Visual separator | Style: solid / gradient / dots |
| **💬 Quote** | Styled blockquote | Text, author, role/source |
| **📣 Callout** | Highlighted info box | Message, icon emoji, variant (info/warning/success/danger) |

### 🖱️ Drag & Drop
- Drag blocks from the **left palette** onto the canvas
- **Reorder** existing blocks by dragging them up or down
- Visual **drop zone indicators** show where blocks will land
- Works on desktop browsers (native HTML5 Drag and Drop API)

### ⚙️ Block Controls
- **Edit** — click any block or the ✏️ button to open the right-side config panel
- **Move Up / Move Down** — arrow buttons for keyboard-friendly reordering
- **Duplicate** — clone any block with one click
- **Delete** — remove a block (with confirmation on canvas clear)
- **Hover toolbar** — controls appear only when hovering for a clean look

### 💾 Persistence
- All block data and page title **auto-save to `localStorage`** on every change
- Page state **survives browser refresh, tab close, and reopening**
- Storage key: `pagecraft_v1` — includes blocks array, page title, and timestamp

### 👁️ Preview Mode
- Toggle between **Edit mode** and **Preview mode**
- Preview shows a clean, publication-ready layout (max-width article)
- Strips all editor chrome — pure content view

### 🎨 UI/UX Details
- Premium dark glassmorphism aesthetic
- Animated floating blobs in the background
- Smooth panel slide-in for the block editor
- Confirm dialog before clearing all blocks
- Live auto-save indicator in the topbar
- Editable page title (click to edit inline)
- Empty canvas state with drag-to-drop guidance

---

## 🗂️ Project Structure

```
dynamic-content-builder/
├── index.html                         # Entry HTML + Google Fonts
├── package.json
├── vite.config.js
├── tailwind.config.js                 # Custom colors, fonts, animations
├── postcss.config.js
└── src/
    ├── main.jsx                       # React entry point
    ├── App.jsx                        # Root — layout, drag-drop wiring
    ├── index.css                      # Tailwind + glass utilities + markdown CSS
    │
    ├── blocks/
    │   └── blockTypes.js              # Block type enums, metadata, createBlock()
    │
    ├── hooks/
    │   └── useBlocks.js               # useReducer state + localStorage persistence
    │
    ├── utils/
    │   └── markdown.js                # Zero-dependency markdown → HTML renderer
    │
    └── components/
        ├── Topbar.jsx                 # Page title editor, preview toggle, save status
        ├── Palette.jsx                # Left sidebar — block type picker
        ├── CanvasBlock.jsx            # Single block with toolbar + drag handles
        ├── BlockRenderer.jsx          # Renders each block type for display
        ├── BlockEditor.jsx            # Right panel — per-block config forms
        └── PreviewMode.jsx            # Clean publication-style preview
```

---

## ⚙️ Architecture & Key Decisions

### State Management — `useReducer`
All canvas state is managed by a single `useReducer` in `useBlocks.js`. This was chosen over multiple `useState` calls because block operations (add, remove, reorder, duplicate) involve complex multi-field updates that are safer and more predictable with explicit action types.

```js
// Every operation is a pure function — easy to test, debug, and extend
dispatch({ type: 'ADD_BLOCK',    block, afterIndex })
dispatch({ type: 'REMOVE_BLOCK', id })
dispatch({ type: 'UPDATE_BLOCK', id, updates })
dispatch({ type: 'REORDER_BLOCKS', dragIndex, dropIndex })
dispatch({ type: 'MOVE_UP',      id })
dispatch({ type: 'MOVE_DOWN',    id })
dispatch({ type: 'DUPLICATE_BLOCK', id })
dispatch({ type: 'SELECT_BLOCK', id })
dispatch({ type: 'TOGGLE_PREVIEW' })
dispatch({ type: 'CLEAR_CANVAS' })
dispatch({ type: 'SET_PAGE_TITLE', title })
```

### Persistence Strategy
`localStorage` is written on every state change via `useEffect`. The initial state is loaded lazily using `useReducer`'s initializer function — this avoids reading from storage on every render.

```js
// Lazy initializer — runs once at mount
const [state, dispatch] = useReducer(blocksReducer, null, initialState);

// Auto-save on every relevant change
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ blocks, pageTitle, savedAt }));
}, [blocks, pageTitle]);
```

### Drag & Drop — Native HTML5 API
No external DnD library was used. The native HTML5 Drag and Drop API is implemented with module-level mutable refs to track drag state across components without prop drilling:

```js
// Module-level drag state — shared across event handlers
let _dragType      = null; // 'new' | 'reorder'
let _dragIndex     = null; // source index for reorder
let _dragBlockType = null; // type string for new blocks from palette
```

This approach avoids external dependencies while handling both palette → canvas drops and canvas → canvas reorders in a unified way.

### Zero-Dependency Markdown Renderer
Rather than importing `marked` or `remark`, a lightweight custom renderer was written in `utils/markdown.js`. It covers all required markdown features (headings, bold, italic, inline code, code blocks, lists, blockquotes, links, horizontal rules) using regex transformations — keeping the bundle size minimal.

### Component Architecture
| Component | Responsibility |
|-----------|----------------|
| `App.jsx` | Layout shell, drag-drop event wiring, state → props distribution |
| `useBlocks.js` | All business logic — single source of truth |
| `blockTypes.js` | Pure config — types, metadata, default values |
| `BlockRenderer.jsx` | Pure display — no state, just renders |
| `BlockEditor.jsx` | Per-type forms — calls `onUpdate` callback |
| `CanvasBlock.jsx` | Drag handle + hover toolbar wrapper |

---

## 🚀 Setup & Terminal Commands

### Step 1 — Scaffold with Vite
```bash
npm create vite@latest dynamic-content-builder -- --template react
cd dynamic-content-builder
```

### Step 2 — Install base dependencies
```bash
npm install
```

### Step 3 — Install Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 4 — Copy all source files
Replace every auto-generated file with the provided source files, maintaining the exact structure above.

### Step 5 — Start the dev server
```bash
npm run dev
# → Open http://localhost:5173
```

### Step 6 — Build for production
```bash
npm run build
# Output → dist/
```

### Step 7 — Preview production build
```bash
npm run preview
```

---

## 🌐 Deployment

### ▲ Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Auto-detects Vite. Live in ~60 seconds.
```

### Netlify
```bash
npm run build
# Drag the dist/ folder to netlify.com/drop
```
Or connect GitHub repo:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### GitHub Pages
```bash
# 1. Add to vite.config.js:
#    base: '/your-repo-name/'

npm install -D gh-pages

# 2. Add to package.json scripts:
#    "deploy": "gh-pages -d dist"

npm run build
npm run deploy
```

---

## 🛠️ Tech Stack

| Tool | Version | Role |
|------|---------|------|
| **React** | 18.2 | UI library — hooks, useReducer, component model |
| **Vite** | 5.0 | Build tool — instant HMR, optimized output |
| **Tailwind CSS** | 3.4 | Utility-first styling — custom design tokens |
| **HTML5 DnD API** | Native | Drag and drop — no external library |
| **localStorage** | Native | Persistence — no external library |

**Zero external UI component libraries.** Every component, animation, and interaction is hand-crafted.

---

## 🎨 Design System

### Palette
| Token | Value | Usage |
|-------|-------|-------|
| `canvas` | `#0f0f17` | App background |
| `panel`  | `#16161f` | Sidebar / topbar |
| `ink-500`| `#8b5cf6` | Primary accent (violet) |
| `ink-400`| `#a78bfa` | Lighter accent |
| `sage`   | `#10b981` | Success / gradient accent |

### Fonts
| Role | Font | Usage |
|------|------|-------|
| Display | Syne | Logo, headings, block titles |
| Body | Outfit | UI labels, text, descriptions |
| Mono | Fira Code | Code, badges, metadata |
| Serif | Lora | Quote blocks, markdown body |

---

## 🧩 Block Data Schema

Each block is a plain JS object:

```js
// Header block
{ id: 'block_xxx', type: 'header', text: 'Title', level: 'h1', align: 'left' }

// Text block
{ id: 'block_xxx', type: 'text', text: 'Paragraph content', align: 'left' }

// Image block
{ id: 'block_xxx', type: 'image', url: 'https://…', alt: '', caption: '', rounded: true }

// Markdown block
{ id: 'block_xxx', type: 'markdown', source: '## Hello\n\n**Bold** text' }

// Divider block
{ id: 'block_xxx', type: 'divider', style: 'gradient' }

// Quote block
{ id: 'block_xxx', type: 'quote', text: 'Quote…', author: 'Name', role: 'Title' }

// Callout block
{ id: 'block_xxx', type: 'callout', text: 'Message', icon: '💡', variant: 'info' }
```

---

## 📝 Assignment Checklist

| Requirement | Status |
|-------------|--------|
| Palette of predefined content blocks | ✅ 7 block types |
| Canvas area to drop blocks | ✅ Full drag-and-drop canvas |
| Reorder blocks via drag-and-drop | ✅ Native HTML5 DnD |
| Configure each block (edit content/settings) | ✅ Per-block editor panel |
| Persistence via localStorage | ✅ Auto-saves on every change |
| Rich text editor block | ✅ Text block with alignment |
| Image display block | ✅ URL + caption + rounded option |
| Markdown preview block | ✅ Write + live preview tabs |
| Customisable header block | ✅ H1–H4 + alignment |
| Clean, intuitive UI | ✅ Glassmorphism dark theme |
| Component-based architecture | ✅ 6 focused components |
| Robust state management | ✅ useReducer + 10 action types |
| Edge case handling | ✅ Empty canvas, confirm clear, image fallback |

---

## 📝 License

MIT © 2025 — Free to use for portfolio and assignment submission.
