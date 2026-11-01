// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "url";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://omakasui.org",
  base: "/",
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
         "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          sourcemap: false,
        },
      },
    },
  },

  integrations: [],
});
