# UGV-DTU Website

Official website of the **Unmanned Ground Vehicle Tech Team at Delhi Technological University** — designing, building, and deploying autonomous ground vehicles for real-world applications and international competitions.

🌐 **Live at:** [https://ugvdtu.in//](https://ugvdtu.in/)

---

## Tech Stack

- React 18 (Create React App)
- React Router v6
- Framer Motion, GSAP, Lenis (smooth scrolling)
- Three.js (3D model viewer)
- React Markdown (blog rendering)

---

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

The site is deployed to GitHub Pages via the `gh-pages` branch.

```bash
npm run deploy
```

This automatically runs `npm run build` first (via `predeploy`), then pushes the build to the `gh-pages` branch.

> **Note:** Requires write access to the repository.

---

## Project Structure

```
website/
├── public/
│   ├── index.html
│   ├── 404.html          # Client-side routing fallback for GitHub Pages
│   ├── blogs/            # Markdown blog files
│   └── *.glb             # 3D model assets
└── src/
    ├── components/       # Reusable UI components
    ├── pages/            # Route-level page components
    └── utils/            # Blog index, scroll utils, team data
```

---

## Adding a Blog Post

1. Add a `.md` file to `public/blogs/`
2. Register it in `src/utils/blogIndex.js` with a `slug`, `title`, `excerpt`, `category`, `author`, `date`, and `file` path
3. It will automatically appear on the `/blogs` page