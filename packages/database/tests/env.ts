import Module from 'module';

const originalRequire = Module.prototype.require;

(Module.prototype as any).require = function require(this: Module, path: string) {
  if (path === 'fs') {
    return originalRequire.call(this, 'memfs');
  }
  else {
    return originalRequire.call(this, path);
  }
};

// 测试模式
process.env.NODE_ENV = 'development';
