import InlineVue from "./vite-plugin-inline-vue";
import MinifyVue from "./vite-plugin-vue-minify";
import express from "express";
import { PluginOption, defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { createServer } from "http";
import { join } from "path";
import { spawn } from "child_process";

const folder = "/savact.app";
const file = "index.html";
const port = 8000;

function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const open = process.platform === "win32" ? "start" : "open";

  app.use(express.static(join(__dirname)));

  app.get("/", (req, res) => {
    res.sendFile(join(__dirname, `${folder}/${file}`));
  });

  httpServer.listen(port, () => {
    const url = `http://localhost:${port}/savact.app#_browser_`;
    console.info("Server runs on", url);
    spawn(open, [url], { shell: true });
  });
}

// Plugin to execute a function only after the first successful build
function executeAfterFirstBuildPlugin(callback: () => void): PluginOption {
  let hasExecuted = false;

  return {
    name: 'execute-after-first-build',
    closeBundle() {
      if (!hasExecuted) {
        callback();
        hasExecuted = true;
      }
    }
  };
}

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
  plugins = neededPlugins;
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

  // Add the plugin to start the server after the first build
  plugins.push(executeAfterFirstBuildPlugin(startServer));

  return {
    plugins,
    define
  };
});

if (process.env.NODE_ENV != "production") {
  throw new Error("This config needs the production mode");
}