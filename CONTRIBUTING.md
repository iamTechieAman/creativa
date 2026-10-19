# Contributing to Creativa

First off, thank you for considering contributing to **Creativa**! 🎉 We welcome contributions from developers, designers, writers, and enthusiasts worldwide to help build the most powerful, free, open-source creative design platform.

---

## 📜 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting Pull Requests](#submitting-pull-requests)
  - [Adding Design Templates & Elements](#adding-design-templates--elements)
- [Local Development Setup](#local-development-setup)
- [Coding Conventions & Styleguide](#coding-conventions--styleguide)
- [Commit Message Format](#commit-message-format)
- [Originality & Intellectual Property](#originality--intellectual-property)

---

## 🤝 Code of Conduct

This project and everyone participating in it is governed by the [Creativa Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

## 🛠️ How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the [Issues list](https://github.com/iamTechieAman/creativa/issues) as you might find out that you don't need to create one. When creating a bug report, please include as many details as possible:

1. **Use a clear and descriptive title**.
2. **Describe the exact steps to reproduce the problem**.
3. **Provide specific examples and screenshots/recordings**.
4. **Include system info**: Operating System, Browser name and version, Screen resolution.
5. **Expected vs. actual behavior**.

### Suggesting Features

Feature suggestions are tracked as GitHub Issues. When submitting a proposal:

- Explain **why** this feature is useful to most users.
- Provide mockups, sketches, or reference links.
- Detail the expected user workflow.

### Submitting Pull Requests

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/iamTechieAman/creativa.git
   cd creativa
   ```
3. **Create a topic branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies & start dev server**:
   ```bash
   npm install
   npm run dev
   ```
5. **Make your changes**. Verify that production build compiles without errors:
   ```bash
   npm run build
   ```
6. **Commit with descriptive messages** following [Conventional Commits](https://www.conventionalcommits.org/).
7. **Push to your fork** and submit a Pull Request to `main`.

---

## 💻 Local Development Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher (or pnpm / yarn)

### Commands

```bash
# Install dependencies
npm install

# Start Vite local development server on port 3000
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🎨 Adding Design Templates & Elements

Creativa's library thrives on community templates. You can contribute presets by modifying:

- `src/data/templates.js`: Categorized canvas templates (Presentation, Social Media, Posters, Flyers, Logos).
- `src/data/elements.js`: Vector shapes, sticker graphics, frames, and illustration assets.
- `src/data/fonts.js`: Google Fonts presets and curated typography pairings.
- `src/data/backgrounds.js`: Gradients and background color palettes.

> **Note**: When adding royalty-free stock imagery, please only reference Unsplash, Pexels, or Wikimedia Commons with permissive CC0 or Unsplash licenses.

---

## 📝 Commit Message Format

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new user-facing feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect code logic (formatting, spacing)
- `refactor:` Code refactoring with no behavioral change
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Build process, dependency updates, tooling

Example:
```bash
feat(canvas): add multi-page duplication and reordering support
fix(header): resolve share button clipping on small mobile viewports
docs(readme): add Vercel one-click deploy badge
```

---

## ⚖️ Originality & Intellectual Property

- All submitted code must be your own original work or licensed under permissive open-source licenses compatible with the MIT License.
- **Fair Use Notice**: Creativa is an independent, community-driven visual design platform. Do not submit proprietary copyrighted artwork, private brand trademarks, or restricted assets.

Thank you for building Creativa with us! 🚀
