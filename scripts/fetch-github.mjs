import { readFile, readdir, writeFile, rename, unlink } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { z } from 'zod';
import { catalogSchema, statusSchema } from '../src/lib/content-schemas.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const apiRepo = z.object({
  full_name: z.string(), html_url: z.url(), topics: z.array(z.string()).nullish(),
  language: z.string().nullish(), stargazers_count: z.number().int().nonnegative().optional(),
  updated_at: z.iso.datetime(), pushed_at: z.iso.datetime().nullable().optional(),
});
const apiCommit = z.object({
  html_url: z.url(),
  commit: z.object({ message: z.string(), author: z.object({ date: z.iso.datetime() }).nullable() }),
});

/**
 * All network reads finish before a snapshot is eligible for publication.
 * @param {unknown} catalogInput
 * @param {{fetchImpl?: (url: string, init?: RequestInit) => Promise<Response>, token?: string, now?: () => string}} options
 */
export async function fetchSnapshot(catalogInput, { fetchImpl = fetch, token = process.env.GITHUB_TOKEN, now = () => new Date().toISOString() } = {}) {
  const catalog = catalogSchema.parse(catalogInput);
  const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  async function request(path) {
    const response = await fetchImpl(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`GitHub request failed (${response.status}): ${path}`);
    return response.json();
  }
  const owners = [...new Set(catalog.map((project) => project.repo.split('/')[0]))];
  const allRepos = [];
  for (const owner of owners) {
    for (let page = 1; ; page += 1) {
      const batch = z.array(apiRepo).parse(await request(`/users/${owner}/repos?per_page=100&page=${page}&sort=updated`));
      allRepos.push(...batch);
      if (batch.length < 100) break;
      if (page >= 100) throw new Error('Repository pagination limit exceeded; preserving the previous snapshot');
    }
  }
  const requested = new Set(catalog.map((project) => project.repo.toLowerCase()));
  const selected = allRepos.filter((repo) => requested.has(repo.full_name.toLowerCase()));
  const repositories = selected.map((repo) => ({
    repo: repo.full_name, url: repo.html_url,
    topics: (repo.topics ?? []).filter((topic) => topic.toLowerCase() !== 'portfolio'),
    language: repo.language ?? null, stars: repo.stargazers_count ?? 0, updatedAt: repo.updated_at,
  }));
  const active = [...selected].filter((repo) => repo.pushed_at).sort((a, b) => b.pushed_at.localeCompare(a.pushed_at)).slice(0, 3);
  const recentActivity = (await Promise.all(active.map(async (repo) => {
    const commits = z.array(apiCommit).parse(await request(`/repos/${repo.full_name}/commits?per_page=3`));
    return commits.filter((item) => item.commit.author).map((item) => ({ repo: repo.full_name, url: item.html_url, message: item.commit.message, timestamp: item.commit.author.date }));
  }))).flat().sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 9);
  return statusSchema.parse({ lastUpdate: now(), repositories, recentActivity });
}

/** @param {{projectRoot?: string, fetchImpl?: (url: string, init?: RequestInit) => Promise<Response>, token?: string, now?: () => string}} options */
export async function refresh({ projectRoot = root, fetchImpl = fetch, token = process.env.GITHUB_TOKEN, now } = {}) {
  const directory = join(projectRoot, 'src/content/projects');
  const names = (await readdir(directory)).filter((name) => name.endsWith('.json')).sort();
  const catalog = await Promise.all(names.map(async (name) => JSON.parse(await readFile(join(directory, name), 'utf8'))));
  const snapshot = await fetchSnapshot(catalog, { fetchImpl, token, now });
  const destination = join(projectRoot, 'src/content/status/github-data.json');
  const temporary = `${destination}.${process.pid}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`);
    await rename(temporary, destination);
  } finally {
    await unlink(temporary).catch((error) => { if (error.code !== 'ENOENT') throw error; });
  }
  return snapshot;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  refresh().then((snapshot) => {
    console.log(`Refreshed ${snapshot.repositories.length} curated repositories and ${snapshot.recentActivity.length} commits. Editorial content was preserved.`);
  }).catch((error) => {
    console.error(`Refresh failed; previous snapshot retained. ${error.message}`);
    process.exitCode = 1;
  });
}
