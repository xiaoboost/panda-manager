import { service as ready } from './ready';
import { service as getBuildInfo } from './get-build-info';
import { service as getConfig } from './get-config';
import { service as patchConfig } from './patch-config';
import { service as getAllTags } from './get-all-tags';
import { service as addTag } from './add-tag';
import { service as addTagGroup } from './add-tag-group';
import { service as patchTag } from './patch-tag';
import { service as patchTagGroup } from './patch-tag-group';
import { service as getReadStatus } from './get-read-status';
import { service as getItemsList } from './get-items-list';

import { AsyncService, SyncService } from './types';

import {
  Status,
  FetchData,
  ServiceName,
  AsyncListenerContext,
  SyncListenerContext,
} from '@panda/fetch/client';

const serviceMap: Record<ServiceName, AsyncService<any, any> | SyncService<any, any> | undefined> =
  {
    [ServiceName.Ready]: ready,
    [ServiceName.GetBuildInfo]: getBuildInfo,
    [ServiceName.GetConfig]: getConfig,
    [ServiceName.PatchConfig]: patchConfig,
    [ServiceName.GetItemsList]: getItemsList,
    [ServiceName.GetItemDetail]: undefined,
    [ServiceName.GetAllTags]: getAllTags,
    [ServiceName.AddTag]: addTag,
    [ServiceName.AddTagGroup]: addTagGroup,
    [ServiceName.PatchTag]: patchTag,
    [ServiceName.PatchTagGroup]: patchTagGroup,
    [ServiceName.PatchTagMeta]: undefined,
    [ServiceName.PatchTagGroupMeta]: undefined,
    [ServiceName.MoveTag]: undefined,
    [ServiceName.DeleteTag]: undefined,
    [ServiceName.DeleteTagGroup]: undefined,
    [ServiceName.GetReadStatus]: getReadStatus,
  };

/** 异步服务 */
export async function serviceAsync(context: AsyncListenerContext): Promise<FetchData> {
  const result = { ...context.requestData };
  const func = serviceMap[result.name];

  if (func) {
    result.data = await func(context);
  } else {
    result.data = undefined;
    result.error = `未知服务: ${ServiceName[result.name]}`;
    result.status = Status.NotFound;
  }

  return result;
}

/** 同步服务 */
export function serviceSync(context: SyncListenerContext): FetchData {
  const result = { ...context.requestData };
  const func = serviceMap[result.name];

  if (func) {
    result.data = func({
      ...context,
      sendProgress: () => void 0,
    });

    if (result.data instanceof Promise) {
      result.data = undefined;
      result.error = `同步服务不能访问异步服务：${ServiceName[result.name]}`;
      result.status = Status.NotSupportPromise;
    }
  } else {
    result.data = undefined;
    result.error = `未知服务: ${ServiceName[result.name]}`;
    result.status = Status.NotFound;
  }

  return result;
}

export const service = {
  async: serviceAsync,
  sync: serviceSync,
};
