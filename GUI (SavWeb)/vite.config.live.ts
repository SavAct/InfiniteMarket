import InlineVue from "./vite-plugin-inline-vue";
import MinifyVue from "./vite-plugin-vue-minify";
import { PluginOption, defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig(() => {
  let plugins: PluginOption = [];
  let neededPlugins: PluginOption = [
    InlineVue(),
    viteSingleFile({ removeViteModuleLoader: true }),
  ];

  // Minify only in production
  if (process.argv.includes("--dev") || process.argv.includes("-d")) {
    plugins = neededPlugins;
  } else {
    let devPlugins: PluginOption = [
      ViteMinifyPlugin({ collapseWhitespace: true }),
      MinifyVue({
        collapseWhitespace: true,
        removeAttributeQuotes: false,
        keepClosingSlash: true,
      }),
    ];
    plugins = [...devPlugins, ...neededPlugins];
  }

  return {
    plugins,
  };
});
