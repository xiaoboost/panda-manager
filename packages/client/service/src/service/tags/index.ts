import { TagGroups, Tags } from '../../model';
import { TagData, TagGroupDataInDb, PatchTagData, NewTagData, TagKind } from '@panda/shared';

export const ready = Promise.resolve();

export function getTagGroups() {
  return TagGroups.orderBy('name').toQuery();
}

export function getTags() {
  return Tags.orderBy('name').toQuery();
}

export function addTagByName(data: NewTagData) {
  if (data.kind === TagKind.Tag) {
    return Tags.insert({
      name: data.name,
      comment: '',
      alias: [],
    })[0];
  } else {
    return TagGroups.insert({
      name: data.name,
      comment: '',
      alias: [],
      tags: [],
    })[0];
  }
}

export function patchTag(data: PatchTagData) {
  // ..
}
