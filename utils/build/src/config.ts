import path from "path";

import * as ts from "typescript";
import { promises as fs } from "fs";
import { BuildOptions } from "esbuild";
import { isFunc } from '@panda/utils';

import { isDevelopment, isProduction } from "./env";

export type ConfigFile = BuildOptions | ((arg: ConfigContext) => BuildOptions);
export type ConfigContext = {
  env: {
    isDevelopment: boolean;
    isProduction: boolean;
  };
};

async function readConfigFile(dir: string) {
  const configFile = (ext: string) => path.join(dir, `build.config${ext}`);

  let result = await fs.readFile(configFile(".ts"), "utf-8").catch(() => "");

  if (!result) {
    result = await fs.readFile(configFile(".js"), "utf-8").catch(() => "");
  }

  return result;
}

export function mergeConfig(opt: BuildOptions = {}) {
  opt.bundle = opt.bundle ?? true;
  opt.format = opt.format ?? 'iife';
  opt.target = opt.target ?? 'es6';
  opt.outfile = opt.outfile ?? 'dist/index.js';
  opt.entryPoints = opt.entryPoints ?? ['src/index.ts'];
  opt.platform = opt.platform ?? 'browser';

  if (isProduction) {
    opt.minify = opt.minify ?? true;
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
  const code = (
    'const module = {' +
      'exports: {},' +
    '};' +
    '((module, exports) => {' +
      jsScript +
      'return module;' +
    '})(module, module.exports);'
  );

  const output = globalThis.eval(code);
  const module = output.exports;

  if (!module) {
    return mergeConfig();
  }

  const exports: ConfigFile = module.default ? module.default : module;

  if (isFunc(exports)) {
    const context: ConfigContext = {
      env: {
        isDevelopment,
        isProduction,
      },
    };

    return mergeConfig(exports(context));
  }
  else {
    return mergeConfig(exports);
  }
}

export async function readConfig(dir: string): Promise<BuildOptions> {
  return getScriptExport(await readConfigFile(dir));
}
