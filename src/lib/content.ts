import { getCollection, getEntry } from 'astro:content';
import { prepareProjects } from './projects';

export async function getPortfolio() {
  const [profile, entries, statusEntry] = await Promise.all([
    getEntry('portfolio', 'main'), getCollection('projects'), getEntry('status', 'github-data'),
  ]);
  if (!profile) throw new Error('Missing portfolio/main.json');
  const status = statusEntry?.data ?? { lastUpdate: null, repositories: [], recentActivity: [] };
  const projects = prepareProjects(entries.map((entry) => entry.data), status);
  return { profile: profile.data, projects, featured: projects.filter((project) => project.featuredOrder), status };
}
export function formatMonth(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value.slice(0, 7)}-01T00:00:00Z`));
}
export function formatDay(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
}
