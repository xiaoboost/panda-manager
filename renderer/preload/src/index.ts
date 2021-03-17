import electron from 'electron';
import path from 'path';

electron.contextBridge.exposeInMainWorld('require', (name: string) => {
  const moduleMap = {
    path,
    electron,
    'electron/common': electron,
    'electron/renderer': electron,
  };

  if (!moduleMap[name]) {
    throw new Error(`Module ${name} is not exist.`);
  }

  return moduleMap[name];
});
