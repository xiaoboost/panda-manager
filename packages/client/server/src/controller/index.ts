import type { BrowserWindow } from 'electron';
import { RPC } from '@panda/shared';

import { service as ready } from './ready';
import { service as getConfig } from './get-config';
import { service as patchConfig } from './patch-config';
import { service as isFocused } from './is-focused';
import { service as isMaximized } from './is-maximized';
import { service as isMinimized } from './is-minimized';
import { service as getWindowId } from './get-window-id';

import { ServiceData } from './types';

const serviceMap: Record<RPC.FetchName, ServiceData | undefined> = {
  [RPC.FetchName.IsFocused]: isFocused,
  [RPC.FetchName.IsMaximized]: isMaximized,
  [RPC.FetchName.IsMinimized]: isMinimized,
  [RPC.FetchName.GetWindowId]: getWindowId,

  [RPC.FetchName.Ready]: ready,
  [RPC.FetchName.GetConfig]: getConfig,
  [RPC.FetchName.PatchConfig]: patchConfig,
  [RPC.FetchName.GetFilesList]: undefined,
  [RPC.FetchName.GetFileDetail]: undefined,
  [RPC.FetchName.OpenFileInShell]: undefined,
};

export async function route(win: BrowserWindow, request: RPC.FetchData): Promise<RPC.FetchData> {
  const result: RPC.FetchData = {
    ...request,
    status: RPC.Status.Ok,
  };

  try {
    const service = serviceMap[request.name];

    if (service) {
      result.data = await service.service(win, request);
    }
    else {
      result.error = `Unknown Method: ${request.name}`;
      result.status = RPC.Status.NotFound;
    }
  }
  catch (e: any) {
    result.error = e.message;
    result.status = RPC.Status.ServerError;
  }

  return result;
}
