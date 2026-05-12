import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/portfolio" }),
  schema: z.object({
    grid_config: z.object({
      layout_weights: z.record(z.string()),
      project_spans: z.record(z.string()),
    }).optional(),
    basics: z.object({
      name: z.string(),
      label: z.string(),
      email: z.string().email(),
      phone: z.string(),
      url: z.string().url(),
      summary: z.string(),
      location: z.string(),
      profiles: z.array(z.object({
        network: z.string(),
        username: z.string(),
        url: z.string().url(),
      })),
    }),
    education: z.array(z.object({
      institution: z.string(),
      area: z.string(),
      score: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      courses: z.array(z.string()),
    })),
    skills: z.object({
      languages: z.array(z.string()),
      ai_ml: z.array(z.string()),
      infrastructure: z.array(z.string()),
      security: z.array(z.string()),
      databases: z.array(z.string()),
    }),
    work: z.array(z.object({
      company: z.string(),
      position: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      summary: z.string().optional(),
      highlights: z.array(z.string()).optional(),
    })),
    projects: z.array(z.object({
      name: z.string(),
      description: z.string(),
      url: z.string().url().optional(),
      tech: z.array(z.string()),
      metrics: z.string().optional(),
    })),
    achievements: z.array(z.object({
      title: z.string(),
      value: z.string().optional(),
      date: z.string().optional(),
      summary: z.string().optional(),
      url: z.string().url().optional(),
    })),
  }),
});

export const collections = {
  'portfolio': portfolio,
};