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

  let define: undefined | Record<string, any> = undefined;
  if (process.argv.includes("--dev") || process.argv.includes("-d")) {
    console.log("Development mode");
    define = {
      'import.meta.env.DEV': true,
    }
  }
  let devPlugins: PluginOption = [
    ViteMinifyPlugin({ collapseWhitespace: true }),
    MinifyVue({
      collapseWhitespace: true,
      removeAttributeQuotes: false,
      keepClosingSlash: true,
      removeComments: true,
    }),
  ];
  plugins = [...devPlugins, ...neededPlugins];

  return {
    plugins,
    define
  };
});
