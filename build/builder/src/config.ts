import path from "path";

import * as ts from "typescript";
import { readFile } from "@panda/fs";
import { BuildOptions } from "esbuild";
import { isFunc } from '@panda/utils';
import { isDevelopment, isProduction, isWatch } from "./env";

export type ConfigFile = BuildOptions | ((arg: ConfigContext) => BuildOptions);
export type ConfigContext = {
  env: {
    isDevelopment: boolean;
    isProduction: boolean;
    isWatch: boolean;
  };
};

async function readConfigFile(dir: string) {
  const configFile = (ext: string) => path.join(dir, `build.config${ext}`);

  let result = await readFile(configFile(".ts"), "utf-8").catch(() => "");

  if (!result) {
    result = await readFile(configFile(".js"), "utf-8").catch(() => "");
  }

  return result;
}

export function mergeConfig(opt: BuildOptions = {}) {
  opt.format = opt.format ?? 'iife';
  opt.target = opt.target ?? 'es6';
  opt.color = opt.color ?? true;
  opt.entryPoints = opt.entryPoints ?? ['src/index.ts'];
  opt.platform = opt.platform ?? 'browser';
  opt.external = (opt.external ?? []).concat(["electron"]);
  opt.mainFields = (opt.mainFields ?? []).concat(["source", "module", "main"]);

  opt.write = false;
  opt.bundle = true;

  if (!opt.outdir && !opt.outfile) {
    opt.outfile = 'dist/index.js';
  }

  if (isWatch) {
    opt.watch = true;
  }

  if (isProduction) {
    opt.minify = opt.minify ?? true;
  }

  if (isDevelopment) {
    opt.define = {
      ...(opt.define ?? {}),
      ["process.env.NODE_ENV"]: '"development"',
    };

    opt.sourcemap = opt.sourcemap ?? true;
  }
  else if (isProduction) {
    opt.define = {
      ...(opt.define ?? {}),
      ["process.env.NODE_ENV"]: '"production"',
    };

    opt.sourcemap = opt.sourcemap ?? false;
  }

  return opt;
}

function runScript(script: string) {
  interface FakeModule {
    exports: {
      default: any;
      [key: string]: any;
    }
  }

  const fake: FakeModule = {
    exports: {},
  } as any;

  try {
    (new Function(`
      return function box(module, exports, require) {
        ${script}
      }
    `))()(fake, fake.exports, require);
  }
  catch (e) {
    return {
      default: {},
    };
  }

  return fake.exports;
}

function getScriptExport(origin: string): BuildOptions {
  const module = runScript(ts.transpile(origin, {
    target: ts.ScriptTarget.ES2015,
    module: ts.ModuleKind.CommonJS,
  }));

  if (!module) {
    return mergeConfig();
  }

  const exports: ConfigFile = module.default ? module.default : module;

  if (isFunc(exports)) {
    const context: ConfigContext = {
      env: {
        isDevelopment,
        isProduction,
        isWatch,
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
