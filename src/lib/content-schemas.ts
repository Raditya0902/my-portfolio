import { z } from 'zod';

export const categories = ['Software Engineering', 'Data Science', 'ML Engineering', 'AI Engineering'] as const;
const text = z.string().trim().min(1);
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const webUrl = z.url().refine((url) => ['https:', 'http:'].includes(new URL(url).protocol), 'Expected a web URL');
const link = z.object({ label: text, url: webUrl });
export const projectSchema = z.object({
  repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: text,
  categories: z.array(z.enum(categories)).min(1),
  summary: text,
  technologies: z.array(text).min(1),
  signal: text,
  decision: text,
  kind: text,
  featuredOrder: z.number().int().positive().optional(),
  demoUrl: webUrl.optional(),
  sources: z.array(link).min(1),
  study: z.object({
    problem: text, built: text, architecture: text,
    flow: z.array(text).min(2),
    decisions: z.array(z.object({ title: text, body: text })).min(1),
    results: z.array(z.object({ label: text, value: text, context: text })).min(1),
    limitations: text, lesson: text,
  }).optional(),
}).refine((project) => !project.featuredOrder || Boolean(project.study), 'Featured projects require a case study');
export const catalogSchema = z.array(projectSchema).superRefine((projects, ctx) => {
  for (const field of ['repo', 'slug', 'featuredOrder'] as const) {
    const seen = new Set<string | number>();
    projects.forEach((project, index) => {
      const value = project[field];
      if (value === undefined) return;
      const key = typeof value === 'string' ? value.toLowerCase() : value;
      if (seen.has(key)) ctx.addIssue({ code: 'custom', path: [index, field], message: `Duplicate ${field}` });
      seen.add(key);
    });
  }
});
export const portfolioSchema = z.object({
  basics: z.object({
    name: text, label: text, headline: text, summary: text,
    email: z.email(), url: webUrl, location: text,
    resumeUrl: z.string().refine((value) => /^\/(?!\/)[\w./-]+\.pdf$/.test(value) || /^https:\/\//.test(value), 'Expected a local PDF path or HTTPS URL').optional(),
    profiles: z.array(z.object({ network: text, username: text, url: webUrl })),
  }),
  about: z.array(text),
  education: z.array(z.object({ institution: text, area: text, score: text, startDate: z.iso.date(), endDate: z.iso.date(), courses: z.array(text) })),
  skills: z.array(z.object({ name: text, items: z.array(text).min(1) })),
  work: z.array(z.object({ organization: text, role: text, kind: text, startDate: month, endDate: month.optional(), summary: text, highlights: z.array(text), technologies: z.array(text), links: z.array(link) })),
});
export const repositorySchema = z.object({
  repo: text, url: webUrl, topics: z.array(text).default([]),
  language: z.string().nullable().optional(), stars: z.number().int().nonnegative().default(0),
  updatedAt: z.iso.datetime(),
});
export const commitSchema = z.object({ repo: text, message: text, url: webUrl, timestamp: z.iso.datetime() });
export const statusSchema = z.object({
  lastUpdate: z.iso.datetime().nullable(),
  repositories: z.array(repositorySchema), recentActivity: z.array(commitSchema),
});
export type Project = z.infer<typeof projectSchema>;
export type Portfolio = z.infer<typeof portfolioSchema>;
export type Status = z.infer<typeof statusSchema>;
