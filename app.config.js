import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import { options } from "prettier-plugin-tailwindcss";

// Define a minimal config for the application. All we need
// is the tailwind vite plugin and the mdx plugin. The
// default configuration is sufficient for everything else.
export default defineConfig({
  server: {
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      mdx({
        jsxImportSource: "solid-js/h",
      }),
    ],
  },
});
