import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { file, glob } from "astro/loaders";

const navLinks = defineCollection({
  loader: file("src/content/nav-links.json"),
  schema: z.object({
    id: z.string(),
    href: z.string(),
    label: z.string(),
    exact: z.boolean().default(false),
    order: z.number(),
  }),
});

const aptPackages = defineCollection({
  loader: file("src/content/apt-packages.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    version: z.string(),
    description: z.string(),
    section: z.string(),
    architecture: z.string(),
  }),
});

const projects = defineCollection({
  loader: file("src/content/projects.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    installCommand: z.string(),
    siteUrl: z.string().optional(),
    sourceUrl: z.string().optional(),
    manualUrl: z.string().optional(),
    hidden: z.boolean(),
  }),
});

const themes = defineCollection({
  loader: file("src/content/themes.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    image: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  navLinks,
  aptPackages,
  projects,
  themes,
  blog,
};
