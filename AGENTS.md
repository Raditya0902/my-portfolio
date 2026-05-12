# Workspace Index: The Systems Architect Portfolio

Role: Full-Stack & ML Platform Engineer (Agentic AI Specialist)
Core Identity: "The Systems Architect"—Dark mode, high-density Bento layouts, monospace precision.

## 🛠 Tech Stack
- **Framework:** Astro 6 (Content Layer API)
- **Styling:** Tailwind CSS 4 + Shadcn/UI
- **Fonts:** JetBrains Mono (Primary/Sans/Mono)
- **Animation:** Framer Motion
- **Automation:** GitHub API + Gemini AI (Commit Summarization)
- **Infrastructure:** Vercel (Edge Functions + Edge Caching)

## 📁 Project Structure
- `src/content.config.ts`: Central Zod schemas for all portfolio data.
- `src/content/portfolio/`: Primary resume data (`main.json`).
- `src/content/status/`: Auto-generated GitHub telemetry and AI summaries.
- `src/components/ProfileCard.tsx`: Bio card with editable `skill_tags` and `STATUS_BLOCK` content from `main.json`.
- `src/components/ProjectCard.tsx`: Native scroll-snap project cards that render GitHub topics while hiding the internal `portfolio` discovery tag.
- `src/components/Handshake.tsx`: Interactive terminal component for contact/connection.
- `scripts/fetch-github.mjs`: Strict-discovery script filtering by 'portfolio' topic.
- `scripts/summarize-commits.mjs`: Gemini AI script for activity summarization.
- `.github/workflows/`: Weekly cron jobs for status updates.

## 📐 Architectural Rules
1. **Type Safety:** All data must be validated via Zod in `src/content.config.ts`. Do not use `any`.
2. **Aesthetic Consistency:** Maintain the "Systems" vibe. Use `font-mono` exclusively. Stick to the `oklch` dark theme defined in `global.css`.
3. **Performance:** Prefer Astro's static generation. Use `client:load` only for interactive components (Handshake, Status, Tooltips).
4. **Strict Discovery:** The `projects` array in `main.json` is ephemeral. It is completely overwritten during every build by `fetch-github.mjs` based on GitHub repositories tagged with the `portfolio` topic.
5. **Automation Flow:** Core content is in `main.json`, but "Live Telemetry" must always pull from the dynamic `status` collection.
6. **Project Tags:** GitHub topics are display metadata, but the internal `portfolio` topic must be filtered out before rendering.

## 🚀 Common Commands
- `npm run dev`: Start local dev server (http://localhost:4321).
- `npm run prebuild`: Refresh GitHub data cache manually.
- `node scripts/summarize-commits.mjs`: Update AI summary (Requires `GEMINI_API_KEY`).
- `npm run build`: Full production build with data sync.

## 🔐 Credentials Required (CI/CD)
- `GEMINI_API_KEY`: For commit summarization.
- `GITHUB_TOKEN`: To avoid rate limits during data fetching.
- `VERCEL_DEPLOY_HOOK_URL`: For triggering redeploys after weekly updates.

## 📝 Session History

### v4.3 (May 12, 2026) - UI Polish & Telemetry Fixes
- **Truncation Fix:** Removed text truncation from Professional History and Live Telemetry commit messages to ensure full readability.
- **Telemetry Branding:** Implemented a display name override for 'Raditya0902' repositories, branding them as 'GitHub Profile' in both bio and commit feeds.
- **Maintenance:** Updated documentation and synchronized workspace state.

### v4.2 (May 12, 2026) - Project Carousel & GitHub Topics
- **Project Metadata:** Updated GitHub fetching to persist repo `topics`, `language`, and star counts in `main.json`; project cards prefer topics over language tags.
- **Carousel Layout:** Replaced static project-grid cards with a native CSS scroll-snap carousel showing 3 cards on desktop and 1 on mobile.
- **Display Hygiene:** Hide the internal `portfolio` topic and zero-star metric rows; keep project card spacing natural with tags directly below descriptions.
- **Validation:** Use `npm run dev` for UI checks; avoid `npm run build` unless explicitly requested.

### v4.1 (May 12, 2026) - Bio & Tech Stack Spacing
- **Profile Card:** Add editable `STATUS_BLOCK` content to fill the gap between skill tags and contact fields.
- **Tech Stack:** Ensure the Tech Stack card stretches to its allocated grid row height while keeping content top-aligned.
- **Validation:** Use `npm run dev`; do not run build or prebuild for this spacing pass.

### v4.0 (May 12, 2026) - Portfolio Finalization & Handshake
- **Data Scrub:** Refactored `fetch-github.mjs` to implement strict discovery (topic: `portfolio`) and scrub manual project data from `main.json`.
- **Interactivity:** Developed `Handshake.tsx` using `framer-motion` to provide an interactive, terminal-style contact experience.
- **Grid Stabilization:** Cleared manual `project_spans` to enforce a clean, dynamic grid layout that prevents footer overlaps.
- **Validation:** Successfully verified Astro 6 and Tailwind 4 compliance via a clean production build.

### v3.0 (May 12, 2026) - System Automation & Deployment
- **Automation:** Set up `fetch-github.mjs` and `summarize-commits.mjs` for build-time telemetry updates.
- **CI/CD:** Configured GitHub Actions (`update-status.yml`) to run weekly and trigger Vercel builds via deploy hooks.
- **Security:** Verified `.gitignore` safety for `.env` and sensitive credentials.
- **Deployment:** Initialized Vercel deployment with environment variables and build hook integration.
- **Branding:** Updated professional focus to "Aspiring AI/ML Engineer & Systems Architect" and primary contact to personal Gmail.
- **Infrastructure:** Verified Zod schemas in `content.config.ts` for strict data validation across the portfolio.
