import Module from 'module';

export function install() {
  const originalRequire = Module.prototype.require;

  (Module.prototype as any).require = function require(this: Module, path: string) {
    if (path === 'fs') {
      return originalRequire.call(this, 'memfs');
    }
    else {
      return originalRequire.call(this, path);
    }
  };

  (process.env as any).NODE_ENV = 'test';
}
