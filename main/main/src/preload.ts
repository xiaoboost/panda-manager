import electron from 'electron';
import path from 'path';

electron.contextBridge.exposeInMainWorld('require', (name: string) => {
  const moduleMap = {
    electron,
    path,
  };

  if (!moduleMap[name]) {
    throw new Error(`Module ${name} is not exist.`);
  }

  return moduleMap[name];
});
