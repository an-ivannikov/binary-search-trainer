# Binary Search Trainer

Interactive binary search trainer for numbers within a chosen range. The main feature — before the round starts, the app **selects a number so that a classic binary search will take the maximum possible number of steps** (avoiding midpoints).

> This project is a static site built with React + Vite + TypeScript and deployed on GitHub Pages.

---


## ✨ Features

- Preset ranges by digit length: **2/3/4/5 digits**.
- Custom ranges **from/to**, or generation by **range length** with offset strategy.
- Offset options: **start from 0** or **random offset**.
- **Start** button picks the worst‑case target (max depth for binary search).
- Calculation of the **theoretical maximum steps**: ⌈log₂(n)⌉.
- Detailed logs for each step: step number, pre‑guess range, your guess, result, and commentary.
- Zero external UI dependencies: pure **Tailwind CSS**.

---


## 🧱 Tech Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS**
- (Optional) **Vitest** + **@testing-library/react** for testing

---


## 🚀 Quick Start

```bash
# 1) create project
npm create vite@latest binary-search-trainer -- --template react-ts
cd binary-search-trainer

# 2) install dependencies
npm i
npm i -D tailwindcss postcss autoprefixer gh-pages
npx tailwindcss init -p
```

**Tailwind setup**
- In `tailwind.config.js`: set `content: ["./index.html", "./src/**/*.{ts,tsx}"]`
- In `src/index.css` add:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Add component**
- Create `src/BinarySearchTrainer.tsx` and copy the trainer component code.
- In `src/App.tsx`:
```tsx
import BinarySearchTrainer from "./BinarySearchTrainer";
export default function App() { return <BinarySearchTrainer />; }
```

**Run locally**
```bash
npm run dev
```

**Configure for GitHub Pages**
- In `vite.config.ts` set `base: "/<repo-name>/"` (e.g. `"/binary-search-trainer/"`).

**Add deploy scripts (`package.json`)**
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist -b gh-pages"
  }
}
```

**Deploy**
```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/<you>/<repo-name>.git
git push -u origin main
npm run deploy
```

Enable **GitHub Pages** in repository settings → Branch: `gh-pages` → `/ (root)`.

---


## 📖 Notes

The algorithm chooses a target number to maximize the depth of binary search (anti‑midpoint strategy). For very large ranges, a heuristic is used: always move into the larger half.
