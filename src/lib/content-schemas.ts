import { z } from 'zod';

export const categories = ['Software Engineering', 'Data Science', 'ML Engineering', 'AI Engineering'] as const;
const text = z.string().trim().min(1);
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const webUrl = z.url().refine((url) => ['https:', 'http:'].includes(new URL(url).protocol), 'Expected a web URL');
const link = z.object({ label: text, url: webUrl });
export const chartTones = ['green', 'blue', 'magenta', 'neutral', 'seq-1', 'seq-2', 'seq-3'] as const;
const tone = z.enum(chartTones);
const chartBase = { title: text, caption: text, unit: z.string(), decimals: z.number().int().min(0).max(4) };
const barChartSchema = z.object({
  ...chartBase, type: z.literal('bar'), max: z.number().positive().optional(),
  series: z.array(z.object({ name: text, tone })).min(1).max(4),
  rows: z.array(z.object({
    label: text, tone: tone.optional(),
    values: z.array(z.number().nonnegative()),
    intervals: z.array(z.tuple([z.number().nonnegative(), z.number().nonnegative()])).optional(),
  })).min(1),
}).superRefine((chart, ctx) => {
  chart.rows.forEach((row, index) => {
    if (row.values.length !== chart.series.length) ctx.addIssue({ code: 'custom', path: ['rows', index, 'values'], message: 'Each row needs one value per series' });
    if (row.intervals && row.intervals.length !== row.values.length) ctx.addIssue({ code: 'custom', path: ['rows', index, 'intervals'], message: 'Each value needs one interval' });
    if (row.intervals?.some(([low, high], i) => low > row.values[i] || high < row.values[i])) ctx.addIssue({ code: 'custom', path: ['rows', index, 'intervals'], message: 'Intervals must contain their value' });
    if (row.tone && chart.series.length > 1) ctx.addIssue({ code: 'custom', path: ['rows', index, 'tone'], message: 'Row tones are only for single-series charts' });
  });
  const largest = Math.max(...chart.rows.flatMap((row) => [...row.values, ...(row.intervals?.map(([, high]) => high) ?? [])]));
  if (chart.max !== undefined && chart.max < largest) ctx.addIssue({ code: 'custom', path: ['max'], message: 'Axis max is below the data' });
});
const lineChartSchema = z.object({
  ...chartBase, type: z.literal('line'), xLabel: text,
  x: z.array(z.number().positive()).min(2),
  series: z.array(z.object({ name: text, tone, dashed: z.boolean().default(false), values: z.array(z.number().nonnegative()) })).min(1).max(4),
}).superRefine((chart, ctx) => {
  chart.series.forEach((series, index) => {
    if (series.values.length !== chart.x.length) ctx.addIssue({ code: 'custom', path: ['series', index, 'values'], message: 'Each series needs one value per x position' });
  });
});
export const chartSchema = z.discriminatedUnion('type', [barChartSchema, lineChartSchema]);
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
    chart: chartSchema.optional(),
    figure: z.enum(['point-in-time']).optional(),
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
  work: z.array(z.object({ organization: text, role: text, kind: text, startDate: month, endDate: month.optional(), summary: text, contributions: z.array(z.object({ project: text, summary: text, url: webUrl })).optional(), highlights: z.array(text), technologies: z.array(text), links: z.array(link) })),
});
export const repositorySchema = z.object({
  repo: text, url: webUrl, topics: z.array(text).default([]),
  language: z.string().nullable().optional(), stars: z.number().int().nonnegative().default(0),
  updatedAt: z.iso.datetime(),
});
export const commitSchema = z.object({ kind: z.enum(['commit', 'pull_request']).default('commit'), repo: text, message: text, url: webUrl, timestamp: z.iso.datetime() });
export const statusSchema = z.object({
  lastUpdate: z.iso.datetime().nullable(),
  repositories: z.array(repositorySchema), recentActivity: z.array(commitSchema),
});
export type Project = z.infer<typeof projectSchema>;
export type Portfolio = z.infer<typeof portfolioSchema>;
export type Status = z.infer<typeof statusSchema>;
export type Chart = z.infer<typeof chartSchema>;
export type BarChart = Extract<Chart, { type: 'bar' }>;
export type LineChart = Extract<Chart, { type: 'line' }>;
export type ChartTone = (typeof chartTones)[number];
