import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { catalogSchema, portfolioSchema, statusSchema, type Project } from '../src/lib/content-schemas.ts';
import { prepareProjects, visibleTags } from '../src/lib/projects.ts';
import { fetchSnapshot, refresh } from '../scripts/fetch-github.mjs';

const directory = new URL('../src/content/projects/', import.meta.url);
const catalog = catalogSchema.parse(await Promise.all((await readdir(directory)).filter((name) => name.endsWith('.json')).map(async (name) => JSON.parse(await readFile(new URL(name, directory), 'utf8')))));
const empty = { lastUpdate: null, repositories: [], recentActivity: [] };
const first = catalog.find((project) => project.slug === 'lsmdb')!;
const now = '2026-09-05T00:00:00Z';
const repo = { full_name: first.repo, html_url: `https://github.com/${first.repo}`, updated_at: now };

test('all authored content validates and six studies have stable order', async () => {
  portfolioSchema.parse(JSON.parse(await readFile(new URL('../src/content/portfolio/main.json', import.meta.url), 'utf8')));
  statusSchema.parse(JSON.parse(await readFile(new URL('../src/content/status/github-data.json', import.meta.url), 'utf8')));
  assert.equal(catalog.length, 14);
  assert.deepEqual(prepareProjects([...catalog].reverse(), empty).filter((project) => project.featuredOrder).map((project) => project.slug), ['lsmdb','shopsphere','vllm-benchmarking','mini-feature-store','peft-comparison','rag-rbac']);
});
test('duplicate slugs, repositories and ranks are rejected', () => {
  for (const duplicate of [first, { ...catalog[1], slug: first.slug }, { ...catalog[1], repo: first.repo.toUpperCase() }, { ...catalog[1], featuredOrder: first.featuredOrder }]) {
    assert.equal(catalogSchema.safeParse([first, duplicate]).success, false);
  }
});
test('featured projects need studies; missing demos and metadata remain optional', () => {
  assert.equal(catalogSchema.safeParse([{ ...first, study: undefined }]).success, false);
  const result = prepareProjects([first], empty)[0];
  assert.equal(result.demoUrl, undefined);
  assert.equal(result.metadata, undefined);
  assert.equal(result.githubUrl, `https://github.com/${first.repo}`);
});
test('metadata joins by repository identity and never replaces editorial copy', () => {
  const status = { ...empty, repositories: [{ repo: first.repo.toUpperCase(), url: repo.html_url, topics: ['go'], stars: 2, updatedAt: now }] };
  const result = prepareProjects([first], status)[0];
  assert.equal(result.metadata?.stars, 2);
  assert.equal(result.title, first.title);
  assert.equal(result.study?.problem, first.study?.problem);
  assert.deepEqual(visibleTags(['portfolio', 'Go', 'PORTFOLIO', 'Go']), ['Go']);
});
test('refresh paginates discovery, handles optional metadata, and excludes uncurated repos', async () => {
  const calls: string[] = [];
  const fetchImpl = async (url: string) => {
    calls.push(url);
    return Response.json(url.includes('page=2&') ? [repo] : Array.from({ length: 100 }, (_, i) => ({ ...repo, full_name: `Raditya0902/other-${i}` })));
  };
  const result = await fetchSnapshot([first], { fetchImpl, now: () => now });
  assert.equal(calls.length, 2);
  assert.equal(result.repositories.length, 1);
  assert.equal(result.repositories[0].language, null);
  assert.deepEqual(result.repositories[0].topics, []);
  assert.equal(result.repositories[0].stars, 0);
});
test('refresh sorts commits, drops missing authors, and strips discovery tags', async () => {
  const result = await fetchSnapshot([first], { now: () => now, fetchImpl: async (url: string) => Response.json(url.includes('/commits?') ? [
    { html_url: 'https://github.com/example/commit/1', commit: { message: 'First', author: { date: '2026-09-01T00:00:00Z' } } },
    { html_url: 'https://github.com/example/commit/2', commit: { message: 'Latest', author: { date: now } } },
    { html_url: 'https://github.com/example/commit/3', commit: { message: 'Missing date', author: null } },
  ] : [{ ...repo, pushed_at: now, topics: ['portfolio', 'go'] }]) });
  assert.deepEqual(result.repositories[0].topics, ['go']);
  assert.deepEqual(result.recentActivity.map((commit: { message: string }) => commit.message), ['Latest', 'First']);
});
test('network, API, malformed data and commit failures preserve snapshot and authored files', async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), 'portfolio-refresh-'));
  try {
    await mkdir(join(projectRoot, 'src/content/projects'), { recursive: true });
    await mkdir(join(projectRoot, 'src/content/status'), { recursive: true });
    const authorPath = join(projectRoot, 'src/content/projects/lsmdb.json');
    const snapshotPath = join(projectRoot, 'src/content/status/github-data.json');
    const authored = JSON.stringify(first);
    const prior = JSON.stringify(empty);
    await writeFile(authorPath, authored);
    await writeFile(snapshotPath, prior);
    const failures = [
      async () => { throw new Error('offline'); },
      async () => new Response('rate limit', { status: 403 }),
      async () => Response.json({ message: 'bad shape' }),
      async (url: string) => url.includes('/commits?') ? new Response('', { status: 500 }) : Response.json([{ ...repo, pushed_at: now }]),
    ];
    for (const fetchImpl of failures) {
      await assert.rejects(refresh({ projectRoot, fetchImpl }));
      assert.equal(await readFile(snapshotPath, 'utf8'), prior);
      assert.equal(await readFile(authorPath, 'utf8'), authored);
    }
    await refresh({ projectRoot, fetchImpl: async () => Response.json([repo]), now: () => now });
    assert.equal(await readFile(authorPath, 'utf8'), authored);
    assert.equal(JSON.parse(await readFile(snapshotPath, 'utf8')).lastUpdate, now);
    assert.deepEqual(await readdir(join(projectRoot, 'src/content/status')), ['github-data.json']);
  } finally { await rm(projectRoot, { recursive: true, force: true }); }
});
test('invalid public links are rejected', () => {
  const project: Project = { ...first, demoUrl: 'javascript:alert(1)' };
  assert.equal(catalogSchema.safeParse([project]).success, false);
});
