import electron from 'electron';
import electronCommon from 'electron/common';
import electronRenderer from 'electron/renderer';
import path from 'path';

electron.contextBridge.exposeInMainWorld('require', (name: string) => {
  const moduleMap = {
    path,
    electron,
    'electron/common': electronCommon,
    'electron/renderer': electronRenderer,
  };

  if (!moduleMap[name]) {
    throw new Error(`Module ${name} is not exist.`);
  }

  return moduleMap[name];
});
