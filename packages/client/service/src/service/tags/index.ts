import { TagGroups, Tags } from '../../model';
import { TagData, TagGroupDataInDb, PatchTagData, NewTagData, TagKind } from '@panda/shared';

export const ready = Promise.resolve();

export function getTagGroups() {
  return TagGroups.orderBy('name').toQuery();
}

export function getTags() {
  return Tags.orderBy('name').toQuery();
}

export function addTag(data: NewTagData) {
  // 保证数据没有带 id 字段
  delete (data as any).id;

  if (data.kind === TagKind.Tag) {
    return Tags.insert(data)[0];
  } else {
    return TagGroups.insert({
      ...data,
      tags: data.tags ?? [],
    })[0];
  }
}

export function patchTag(data: PatchTagData) {
  // ..
}
