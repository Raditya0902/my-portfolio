import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { portfolioSchema, projectSchema, statusSchema } from './lib/content-schemas';

// Shared schemas also validate editorial data and refresh output in offline tests.
export const collections = {
  portfolio: defineCollection({ loader: glob({ pattern: '*.json', base: './src/content/portfolio' }), schema: portfolioSchema }),
  projects: defineCollection({ loader: glob({ pattern: '*.json', base: './src/content/projects' }), schema: projectSchema }),
  status: defineCollection({ loader: glob({ pattern: 'github-data.json', base: './src/content/status' }), schema: statusSchema }),
};
