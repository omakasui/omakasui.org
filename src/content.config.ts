import { defineCollection, z } from "astro:content";
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

const sections = defineCollection({
  loader: file("src/content/sections.json"),
  schema: z.object({
    id: z.string(),
    href: z.string(),
    name: z.string(),
    desc: z.string(),
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
    status: z.array(
      z.enum([
        "work-in-progress",
        "archived",
        "experimental",
        "stable",
        "paused",
      ]),
    ),
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
  sections,
  aptPackages,
  projects,
  themes,
  blog,
};
