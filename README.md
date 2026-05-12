# The Systems Architect Portfolio

A high-density, bento-style portfolio built with Astro 6, Tailwind CSS 4, and Framer Motion. Featuring live GitHub telemetry and AI-summarized activity.

## 🚀 Features
- **Live Telemetry:** Real-time commit feed and current focus tracking.
- **Dynamic Projects:** Auto-synchronized with GitHub via strict discovery (tagged with `portfolio`).
- **Systems Aesthetic:** Dark mode, monospace precision, and responsive bento grid.
- **Agentic AI:** Automated commit summarization and status updates.

## 🛠 Tech Stack
- **Framework:** Astro 6 (Content Layer API)
- **Styling:** Tailwind CSS 4 + Shadcn/UI
- **Components:** React (TypeScript)
- **Animation:** Framer Motion
- **Automation:** GitHub Actions + Gemini AI

## 📦 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build & Data Sync
```bash
# Refresh GitHub cache
npm run prebuild

# Full production build
npm run build
```

## ⚙️ Configuration
- **GitHub Sync:** Repositories must have the `portfolio` topic to appear.
- **AI Summaries:** Set `GEMINI_API_KEY` to enable commit summarization via `scripts/summarize-commits.mjs`.

## 📄 License
MIT
