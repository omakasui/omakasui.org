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

const APT_PACKAGES_TSV_URL =
  "https://raw.githubusercontent.com/omakasui/apt-packages/main/index/packages.tsv";

const aptPackages = defineCollection({
  loader: {
    name: "apt-packages-tsv",
    load: async ({ store, logger }) => {
      const response = await fetch(APT_PACKAGES_TSV_URL);
      if (!response.ok) {
        logger.warn(
          `Failed to fetch apt packages TSV: ${response.status} ${response.statusText}`,
        );
        return;
      }

      const text = await response.text();
      const lines = text.trim().split("\n");

      // Group rows by package name; only stable suites (no "-dev" suffix)
      const pkgMap = new Map<
        string,
        {
          suites: Set<string>;
          architectures: Set<string>;
          version: string;
          controlB64: string;
        }
      >();

      for (const line of lines) {
        if (!line.trim()) continue;
        const fields = line.split("\t");
        const suite = fields[0];
        const arch = fields[1];
        const name = fields[2];
        const version = fields[3];
        const controlB64 = fields[9] ?? "";

        // Skip dev suite rows
        if (suite.endsWith("-dev")) continue;

        if (!pkgMap.has(name)) {
          pkgMap.set(name, {
            suites: new Set(),
            architectures: new Set(),
            version,
            controlB64,
          });
        }

        const pkg = pkgMap.get(name)!;
        pkg.suites.add(suite);
        pkg.architectures.add(arch);
      }

      store.clear();

      for (const [name, pkg] of pkgMap) {
        // Decode control_b64 to extract Homepage URL
        let url: string | undefined;
        try {
          const control = Buffer.from(pkg.controlB64, "base64").toString(
            "utf8",
          );
          const match = control.match(/^Homepage:\s*(.+)$/m);
          if (match) url = match[1].trim();
        } catch {
          // ignore decode errors
        }

        store.set({
          id: name,
          data: {
            id: name,
            name,
            version: pkg.version,
            suites: Array.from(pkg.suites),
            architecture: Array.from(pkg.architectures),
            url,
          },
        });
      }
    },
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    version: z.string(),
    suites: z.array(z.string()),
    architecture: z.array(z.string()),
    url: z.string().optional(),
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
