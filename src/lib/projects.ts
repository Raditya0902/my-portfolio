import { catalogSchema, type Project, type Status } from './content-schemas.ts';

export function visibleTags(tags: string[]): string[] {
  return [...new Set(tags.filter((tag) => tag.toLowerCase() !== 'portfolio'))];
}

export function prepareProjects(projects: Project[], status: Status) {
  const catalog = catalogSchema.parse(projects);
  const repositories = new Map(status.repositories.map((repo) => [repo.repo.toLowerCase(), repo]));
  return catalog.map((project) => ({
    ...project,
    technologies: visibleTags(project.technologies),
    githubUrl: `https://github.com/${project.repo}`,
    metadata: repositories.get(project.repo.toLowerCase()),
  })).sort((a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity) || a.title.localeCompare(b.title));
}
export type DisplayProject = ReturnType<typeof prepareProjects>[number];
