# Creativa

> **Modern Open-Source Graphic Design Suite & Generative AI Canvas Engine**

<p align="center">
  <img src="public/creativa-logo.png" alt="Creativa Graphic Design Suite" width="340" />
</p>

<p align="center">
  <a href="https://creativa.toonplayer.in"><strong>🌐 Launch Live Web App: creativa.toonplayer.in</strong></a>
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/iamTechieAman/creativa"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Fabric.js-7.0-E34F26" alt="Fabric.js 7" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
</p>

---

## Overview

**Creativa** is a high-performance, client-side web graphic design suite built with modern web technologies (**React 19**, **Fabric.js v7**, and **Tailwind CSS v4**). Designed for creators, developers, educators, and startups, Creativa delivers desktop-grade vector drawing, multi-page artboards, and next-generation generative AI tools directly inside the browser — completely free, privacy-first, and without subscription barriers.

---

## 🌟 Key Capabilities

### 🪄 Magic Studio™ Generative AI Suite
- **Magic Design™**: Synthesizes complete multi-layer canvas compositions from natural text prompts. Generates 4 distinct design aesthetics (*Modern Glass*, *Bold Editorial*, *Minimalist*, and *Vibrant Promo*) with editable typography, background photography, and call-to-action badges.
- **Magic Media™ (FLUX & Turbo AI)**: Ultra-fast text-to-image neural generation with instant aspect ratio adaptation (`1:1` Square, `16:9` Landscape, `9:16` Story) and visual style presets (*DSLR Photo*, *3D Render*, *Anime*, *Watercolor*, *Cyberpunk*, *Filmic 35mm*).
- **Magic Write™**: AI copywriting and brainstorming assistant. Includes 6 transformation modes (*Rewrite*, *Summarize*, *Expand*, *Shorten*, *Fix Grammar*, *Sprinkle Fairy Dust*) across 7 brand tones (*Professional*, *Friendly*, *Enthusiastic*, *Formal*, *Casual*, *Persuasive*, *Humorous*).
- **Magic Morph™**: Transforms words and logos into high-resolution 3D materials (*Inflatable Balloon*, *Chrome Liquid*, *Melted Gold*, *Neon Glass*, *Candy Gloss*, *Carved Wood*).
- **Photo AI Suite**:
  - **Magic Edit™**: Interactive brush-based inpainting to add, modify, or swap elements.
  - **Magic Eraser™**: Clean removal of watermarks, artifacts, or unwanted subjects.
  - **1-Click Background Remover**: Smart alpha-channel portrait and product cutout.
  - **Magic Grab™**: Automatically splits images into independent subject and backdrop layers.
  - **Grab Text (OCR)**: Detects baked image text and converts it into editable vector textboxes.
- **Magic Switch™**: 1-click cross-format resizing that intelligently repositions canvas layers for Instagram Posts, YouTube Thumbnails, Flyers, Posters, and Resumes.

### 🎨 Vector Canvas Engine (Fabric.js & React 19)
- **Sub-Target Object Manipulation**: 8-point bounding box handles, rotation controls, snapping guides, and center-axis alignment helpers.
- **Rich Typography Engine**: 75+ Google Fonts with letter-spacing, line-height, drop shadows, neon glow, curved text, and curated typographic pairings.
- **Freehand Vector Brush**: Smooth drawing with adjustable stroke width, opacity, and color palette.
- **Multi-Layer Hierarchy**: Bring forward, send backward, lock/unlock, toggle visibility, and duplicate objects.
- **Multi-Page Artboards**: Create, reorder, duplicate, and present multi-page slideshows in full-screen presentation mode.

### 📐 Design Inspirations & Creator Community
- **900+ Curated Layout Inspirations**: Categorized across Social Media, Marketing Flyers, Brand Identity, Resumes, and Presentation decks.
- **700+ Creator Profiles Hub**: Discover layout structures and color schemes curated for community inspiration.
- **Brand Kit Generator**: Extract cohesive color palettes and font pairings from website URLs and brand guidelines.
- **Data Visualizations & Tools**: Dynamic vector chart generator (Bar, Line, Donut) and customizable QR Code generator.

### 📱 100% Mobile & Tablet Responsive
- **Touch-Optimized Drafting**: Native gestures for pan, pinch-to-zoom, and object dragging without viewport collisions.
- **Adaptive Toolbars & Popovers**: Context-aware floating panels centered within mobile viewports for narrow screens (360px–430px).

### 📤 Production-Grade Export Pipeline
- **PNG**: High-DPI rasterization with transparent alpha support.
- **JPG / JPEG**: Web-optimized compressed imagery.
- **Vector SVG**: Clean, infinitely scalable vector curves.
- **PDF**: Multi-page high-resolution vector documents via jsPDF.
- **JSON**: Full state serialization for offline backup and instant restoration.

---

## ⚖️ Legal & Inspiration Disclaimer

**Creativa** is an independent, community-driven open-source software project developed for educational, research, and design prototyping purposes.

- **Design Inspiration**: All design templates, layout structures, and creator portfolios available within Creativa are curated as visual inspirations for open-source community exploration under Fair Use principles.
- **Non-Affiliation**: Creativa is an independent platform. It is **not affiliated, associated, authorized, endorsed by, or in any way officially connected** with Canva Pty Ltd, or any of its subsidiaries or affiliates.
- **Trademarks**: All brand names, product trademarks, and registered marks referenced or depicted belong exclusively to their respective owners.

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- `npm` (v9+) or `pnpm` / `yarn`

### 2. Clone Repository
```bash
git clone https://github.com/iamTechieAman/creativa.git
cd creativa
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
```
Production assets are generated in the `dist/` directory.

---

## 🌐 Deployment to Vercel

Creativa is fully pre-configured for **Vercel** with SPA rewrites and caching headers in [`vercel.json`](vercel.json).

### One-Click Deploy:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iamTechieAman/creativa)

### Connecting a Custom Subdomain (e.g. `creativa.toonplayer.in`):
1. In your **Vercel Project Dashboard**, navigate to **Settings** -> **Domains**.
2. Add your custom subdomain: `creativa.toonplayer.in`.
3. In your DNS provider (e.g. GoDaddy):
   - **Type**: `CNAME`
   - **Name / Host**: `creativa`
   - **Value / Target**: `cname.vercel-dns.com`
   - **TTL**: `1/2 Hour` or `Automatic`

---

## 📁 Project Architecture

```
creativa/
├── public/                     # Static assets, logos, robots.txt, sitemap.xml
├── src/
│   ├── components/             # React UI Components
│   │   ├── CreativaHomeModal.jsx   # Discover templates, creators & inspiration
│   │   ├── CanvasStage.jsx         # Center Fabric.js drafting viewport
│   │   ├── Header.jsx              # Top app bar, export, project title & share
│   │   ├── Sidebar.jsx             # Left navigation (Design, Magic Studio, Elements, etc.)
│   │   ├── Drawer.jsx              # Slide-out tool drawer
│   │   ├── MagicStudioPanel.jsx    # Magic Studio AI interactive drawer suite
│   │   ├── MagicStudioView.jsx     # Fullscreen Magic Studio AI hub
│   │   ├── MagicDesignModal.jsx    # Multi-variant layout generator
│   │   ├── MagicWriteModal.jsx     # AI copywriting assistant
│   │   ├── EditImageModal.jsx      # Inpainting, Magic Eraser & Background Removal
│   │   ├── ContextToolbar.jsx      # Context-sensitive active object toolbar
│   │   └── CreatorProfileModal.jsx # Creator portfolio showcase
│   ├── data/                   # Templates, creators, fonts, shapes, brand presets
│   ├── utils/                  # Canvas export, AI engines, color extraction, QR
│   ├── App.jsx                 # Main state coordinator & keyboard shortcuts
│   └── main.jsx                # Application entrypoint
├── vercel.json                 # Vercel SPA routing & security headers
├── package.json
└── vite.config.js
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl / Cmd + Z` | Undo last action |
| `Ctrl / Cmd + Shift + Z` | Redo action |
| `Ctrl / Cmd + S` | Save project locally |
| `Ctrl / Cmd + D` | Duplicate selection |
| `Delete` / `Backspace` | Delete active selection |
| `T` | Insert new Textbox |
| `R` | Insert Rectangle |
| `C` | Insert Circle |
| `L` | Insert Line |
| `Escape` | Deselect active object / Close modal |

---

## 🤝 Contributing

We welcome community contributions, bug reports, and element design ideas!

1. Fork the project.
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request.

Please review [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community standards.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

Authored and maintained by **[Aman Kumar](https://github.com/iamTechieAman)**.
