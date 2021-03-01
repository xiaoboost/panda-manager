import path from "path";

import * as ts from "typescript";
import { promises as fs } from "fs";
import { BuildOptions } from "esbuild";

import { isDevelopment, isProduction } from "./env";

async function readConfigFile(dir: string) {
  const configFile = (ext: string) => path.join(dir, `build.config${ext}`);

  let result = await fs.readFile(configFile(".ts"), "utf-8").catch(() => "");

  if (!result) {
    result = await fs.readFile(configFile(".js"), "utf-8").catch(() => "");
  }

  return result;
}

function mergeConfig(opt: BuildOptions = {}) {
  if (!("bundle" in opt)) {
    opt.bundle = true;
  }

  if (!("format" in opt)) {
    opt.format = "iife";
  }

  if (!("target" in opt)) {
    opt.target = "es6";
  }

  if (!('entryPoints' in opt)) {
    opt.entryPoints = ['src/index.ts'];
  }

  if (!('outfile' in opt)) {
    opt.outfile = 'dist/index.js';
  }

  if (!('platform' in opt)) {
    opt.platform = 'browser';
  }

  if (isProduction && !("minify" in opt)) {
    opt.minify = true;
  }

  if (!opt.define) {
    opt.define = {};
  }

  if (isDevelopment) {
    opt.define["process.env.NODE_ENV"] = '"development"';
  }
  else if (isProduction) {
    opt.define["process.env.NODE_ENV"] = '"production"';
  }

  opt.mainFields = (opt.mainFields ?? []).concat(["module", "main"]);
  opt.external = (opt.external ?? []).concat(["electron"]);
  opt.write = false;

  return opt;
}

function getScriptExport(origin: string): BuildOptions {
  const jsScript = ts.transpile(origin, {
    target: ts.ScriptTarget.ES2015,
    module: ts.ModuleKind.CommonJS,
  });
  const code = `
      const module = {
        exports: {},
      };
  
      ((module, exports) => {
        ${jsScript}
        return module;
      })(module, module.exports);
    `;

  const output = globalThis.eval(code);
  const module = output.exports;

  if (!module) {
    return mergeConfig();
  }

  const exports = module.default ? module.default : module;

  return mergeConfig(
    exports({
      isDevelopment,
      isProduction,
    })
  );
}

export async function readConfig(dir: string): Promise<BuildOptions> {
  return getScriptExport(await readConfigFile(dir));
}
