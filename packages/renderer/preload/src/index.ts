import { contextBridge, ipcRenderer } from 'electron';

import path from 'path';

contextBridge.exposeInMainWorld('require', (name: string) => {
  const moduleMap = {
    path,
    electron: {
      ipcRenderer: {
        ...ipcRenderer,
        on: ipcRenderer.on.bind(ipcRenderer),
        once: ipcRenderer.once.bind(ipcRenderer),
        addListener: ipcRenderer.addListener.bind(ipcRenderer),
        removeListener: ipcRenderer.removeListener.bind(ipcRenderer),
        removeAllListeners: ipcRenderer.removeAllListeners.bind(ipcRenderer),
      },
    },
  };

  if (!moduleMap[name]) {
    throw new Error(`Module ${name} is not exist.`);
  }

  return moduleMap[name];
});
