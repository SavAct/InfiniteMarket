import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import InlineVue from "./vite-plugin-inline-vue";
import MinifyVue from "./vite-plugin-vue-minify";
import { ViteMinifyPlugin } from "vite-plugin-minify";

// https://vitejs.dev/config/
export default defineConfig({
  server: { open: true },
  plugins: [
    ViteMinifyPlugin({ collapseWhitespace: true }), // Config from https://www.npmjs.com/package/html-minifier-terser
    MinifyVue({
      collapseWhitespace: true,
      removeAttributeQuotes: false,
      keepClosingSlash: true,
      removeComments: true,
    }),
    InlineVue(),
    viteSingleFile({ removeViteModuleLoader: true }),
  ],
  define: {
    'import.meta.env.DEV': process.argv.includes("--dev") || process.argv.includes("-d")
  }
});
