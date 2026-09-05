# Workspace: Aditya Rallapalli portfolio

A static Astro 6 and Tailwind 4 portfolio covering software, data science, ML, and AI engineering.

## Structure

- `src/content/portfolio/main.json`: authored profile, education, experience, and skills.
- `src/content/projects/*.json`: curated project catalog and six case studies.
- `src/content/status/github-data.json`: generated metadata and recent GitHub activity.
- `src/content.config.ts`: collections using shared Zod schemas from `src/lib/content-schemas.ts`.
- `src/lib/projects.ts`: identity-based metadata joins and deterministic ordering.
- `src/pages/`: homepage, project directory, case studies, sitemap, robots, and 404.
- `src/components/`: reusable static Astro components.
- `scripts/fetch-github.mjs`: explicit, editorial-preserving refresh.

## Rules

1. Validate authored and generated content with the shared schemas. Do not use `any`.
2. Keep JetBrains Mono, the OKLCH dark palette, natural-height sections, and restrained CSS motion. Respect reduced-motion settings.
3. Prefer static HTML. The project directory’s progressive filter is the only required client script. All content must remain usable without JavaScript.
4. The local curated catalog controls publication. GitHub topics no longer decide which projects appear. Never overwrite authored project content during refresh.
5. Read activity through the validated status collection and show the actual snapshot date. Never label cached data as live.
6. Filter out the internal `portfolio` topic. Use demonstrated technologies and source-backed results with measurement conditions.
7. Keep synthetic studies explicitly labeled. Do not invent background, ownership, metrics, response-time promises, or demo/resume links.
8. Use `npm run dev`, `npm run check`, and `npm test` for validation. Do not run production build/prebuild or deploy unless explicitly requested.
9. Production builds are offline and deterministic from checked-in data. Weekly refresh is a separate workflow using Node 22.12+.

## Commands

- `npm run dev`: local preview.
- `npm run check`: Astro/TypeScript diagnostics.
- `npm test`: offline content and refresh tests.
- `npm run refresh`: explicit GitHub metadata/activity refresh; optional `GITHUB_TOKEN`.
- `npm run build`: static output, only when requested.

See README.md for maintenance and docs/CONTENT_CHECKLIST.md for missing information and evidence notes.
