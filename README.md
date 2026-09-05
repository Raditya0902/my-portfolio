# Aditya Rallapalli · Portfolio

A static Astro portfolio for software, data science, ML, and AI engineering work. The homepage features six engineering case studies; `/projects` presents 14 curated projects with progressively enhanced discipline filters.

## Develop and verify

Requires Node **22.12 or newer** and npm.

```sh
npm ci
npm run dev
npm run check
npm test
```

Use the local URL printed by the development server. Review at mobile, tablet, and desktop sizes. The homepage and case studies require no client-side JavaScript. The directory uses one small script for filters; without JavaScript all projects remain visible.

`npm run build` produces a static production site from checked-in content. It does **not** refresh data, contact GitHub, call Gemini, or require credentials. Run a production build or deploy only when requested for the task. Vercel can keep using `npm run build` and the `dist` output directory.

## Content ownership

- `src/content/portfolio/main.json`: profile, introduction, experience, education, and demonstrated skills.
- `src/content/projects/*.json`: the authoritative local publication catalog. Each file owns a repository identity, stable slug, categories, editorial copy, evidence links, and optional case study.
- `src/content/status/github-data.json`: generated metadata and recent commits. Never edit this file to change project copy.
- `src/content.config.ts`: Astro collections validated through shared schemas in `src/lib/content-schemas.ts`. These same schemas run in offline tests and refresh validation.

A `featuredOrder` requires a `study`. Repository identities, slugs, and featured ranks must be unique. The six featured studies are generated at `/projects/[slug]`; additional cards link to their GitHub repositories. Metadata joins by repository identity, never by display title. Missing GitHub metadata does not remove curated projects.

To add a project, add a JSON record matching the shared project schema. Use an existing record as a shape reference. Select only demonstrated technologies; the internal `portfolio` topic is never displayed. The GitHub topic no longer controls publication. Counts are derived from the catalog.

## Evidence and links

Numerical results must include their measurement conditions and a source. Reported results are not presented as independently reproduced. Synthetic projects must say so. Keep limitations and negative results. See `docs/CONTENT_CHECKLIST.md` for outstanding content and source-review details.

To enable the resume CTA, add `basics.resumeUrl` with a real HTTPS URL or local PDF path such as `/resume.pdf`, and place the PDF in `public`. Until then, the link is absent. Only add `demoUrl` after checking that it is a public, working demo.

The production origin comes from `basics.url`, used by Astro configuration, canonical tags, social metadata, sitemap, and robots. Update that single value when confirming a permanent domain. Restart the development server after changing the origin or upgrading dependencies.

## Refresh workflow

```sh
# Optional token increases GitHub API rate limits.
GITHUB_TOKEN=... npm run refresh
```

The explicit refresh reads the local catalog, paginates public repository discovery, and fetches recent commits from up to three recently pushed curated repositories. It validates the full result before atomically replacing the cached snapshot. Network, API, timeout, and validation errors exit nonzero and preserve the previous cache. It never writes the profile or project catalog. A missing public repository simply has no generated metadata.

The weekly GitHub Action uses Node 22.12, `npm ci`, offline tests, refresh, and type checks. It commits only the snapshot. An existing `VERCEL_DEPLOY_HOOK_URL` secret can trigger the existing Vercel deployment after success; no new hosting service is needed. If Vercel already deploys snapshot commits automatically, omit the hook to avoid duplicate builds. `GITHUB_TOKEN` is supplied by GitHub Actions. Gemini and its old competing editorial-rewrite scripts are no longer used.

## Validation coverage

Tests cover schema validation, featured ordering, duplicate identities/slugs/ranks, optional demos and metadata, editorial-preserving metadata joins, internal tag filtering, pagination, commit ordering, malformed responses, and failure-safe snapshot writes. Browser checks cover responsive pages, keyboard focus, directory filters, case-study navigation, and metadata.
