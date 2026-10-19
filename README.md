# Creativa

> Free, open-source web graphic design studio & vector canvas editor.

<p align="center">
  <img src="public/creativa-logo.png" alt="Creativa" width="320" />
</p>

<p align="center">
  <a href="https://creativa.toonplayer.in"><strong>🌐 Live Demo: creativa.toonplayer.in</strong></a>
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/iamTechieAman/creativa"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Fabric.js-7-E34F26" alt="Fabric.js 7" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
</p>

---

## Why Creativa?

Most modern online graphic editors lock basic tools behind paywalls, enforce recurring subscriptions, and upload your private uploads to remote servers.

I built **Creativa** to give creators, developers, and students a capable, completely free design editor in the browser:

- **Zero Subscriptions & Zero Paywalls**: Everything is unlocked from day one.
- **Client-Side Privacy Sandbox**: Your uploaded images, logos, and saved projects stay strictly inside your browser's local storage (IndexedDB / LocalStorage). No remote tracking or cross-user data exposure.
- **Instant Performance**: Built with React 19, Fabric.js v7, and Tailwind CSS v4. Bundled with Vite for sub-second builds and smooth 60fps canvas manipulation.
- **Fully Responsive**: Optimized for desktop monitors, laptops, tablets, and mobile screens.

---

## Key Features

### 🎨 Vector Canvas Engine
- Sub-target group selection and double-click inline text editing.
- Freehand drawing brushes with adjustable stroke weight and hex color picker.
- Multi-layer management: arrange layers (bring to front, send backward), lock/unlock, and duplicate.
- Alignment guides, snap-to-center helpers, and canvas bounding boxes.
- Multi-page document support with page reordering, duplication, and individual page notes.

### 📐 900+ Searchable Templates
- Categorized across **Presentations**, **Social Media Posts & Stories**, **Marketing Flyers**, **Brand Logos**, **Posters**, and **Professional Resumes**.
- Dynamic search and tag filtering.
- One-click template synthesis and live customization.

### 👥 700+ Verified Creators Hub
- Directory of creator portfolios.
- One-click creator profile inspection and direct template duplication into your canvas.

### 🪄 AI Design Suite
- **Prompt to Layout**: Generates multi-element vector layouts directly on the artboard from text descriptions.
- **AI Image Generation**: Client-side FLUX text-to-image integration.
- **Smart Copywriter**: Tone shifting, headlines, captions, and body copy generation.
- **Format Switcher**: Instant one-click resizing for Instagram Posts (1:1), Stories (9:16), YouTube Thumbnails (16:9), Posters, and A4 documents.

### 🔤 Typography & Elements
- 75+ Google Fonts with curated font pairings (Editorial, Tech Startup, Elegant, Bold).
- Letter spacing, line height, text shadows, and curvature controls.
- Vector shape library: geometric shapes, speech bubbles, badges, and device mockup frames (Phone, Laptop, Polaroid).
- Dynamic vector chart generator (Bar, Line, Pie, Doughnut).
- Integrated QR code generator with live preview.

### 📦 Production Export
- **PNG**: High-DPI raster export with optional transparent backgrounds.
- **JPEG**: Compressed web-ready imagery.
- **SVG**: Scalable vector paths.
- **PDF**: Multi-page document generation via jsPDF.
- **JSON**: Full canvas state serialization for local project backup and reload.

---

## Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher.
- `npm` (v9+) or `pnpm` / `yarn`.

### 2. Clone & Install

```bash
git clone https://github.com/iamTechieAman/creativa.git
cd creativa
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 4. Build for Production

```bash
npm run build
```

Production output will be generated in `dist/`.

---

## Deployment (Vercel)

Creativa includes a ready-to-use [`vercel.json`](vercel.json) pre-configured with SPA route rewrites, immutable caching headers, and HTTP security policies.

### One-Click Deploy:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iamTechieAman/creativa)

### Custom Domain / Subdomain:
1. Go to your project on **Vercel** -> **Settings** -> **Domains**.
2. Add your domain or subdomain (e.g., `creativa.toonplayer.in`).
3. In your DNS provider (e.g. GoDaddy), add a `CNAME` record:
   - **Type**: `CNAME`
   - **Name**: `creativa`
   - **Value**: `cname.vercel-dns.com`

---

## Project Structure

```
creativa/
├── public/                     # Static assets, logos, robots.txt, sitemap.xml
├── src/
│   ├── components/             # React UI components
│   │   ├── CreativaHomeModal.jsx   # Discover templates, search & creator hub
│   │   ├── CanvasStage.jsx         # Center Fabric.js drafting viewport
│   │   ├── Header.jsx              # Top bar, file operations, export & share
│   │   ├── Sidebar.jsx             # Left tool drawer navigation
│   │   ├── ContextToolbar.jsx      # Context-sensitive element controls
│   │   ├── MagicStudioView.jsx     # AI tools and layout generator
│   │   ├── TemplatesHubView.jsx    # Template explorer
│   │   └── CreatorsDirectoryView.jsx # Creators directory
│   ├── data/                   # Template definitions, fonts, shapes, palettes
│   ├── utils/                  # Canvas export, storage, and AI synthesis helpers
│   ├── App.jsx                 # Main state coordinator
│   └── main.jsx                # Application mount point
├── vercel.json                 # Vercel SPA routing & security headers
├── package.json
└── vite.config.js
```

---

## Keyboard Shortcuts

| Shortcut | Description |
|---|---|
| `Ctrl / Cmd + Z` | Undo |
| `Ctrl / Cmd + Shift + Z` | Redo |
| `Ctrl / Cmd + S` | Save project locally |
| `Ctrl / Cmd + D` | Duplicate selection |
| `Delete` / `Backspace` | Delete selected element |
| `T` | Add Textbox |
| `R` | Add Rectangle |
| `C` | Add Circle |
| `L` | Add Line |
| `Escape` | Deselect element / close active modal |

---

## Contributing

Contributions, bug reports, and suggestions are welcome!

1. Fork the repository.
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to your branch: `git push origin feature/my-feature`
5. Open a Pull Request.

Please see [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details.

---

## License

This project is licensed under the [MIT License](LICENSE).

Created and maintained by [Aman Kumar](https://github.com/iamTechieAman).
