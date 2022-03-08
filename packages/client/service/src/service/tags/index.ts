import { TagGroups, Tags } from '../../model';
import {
  TagData,
  TagGroupDataInDb,
  PatchTagData,
  NewTagData,
  NewTagGroupData,
} from '@panda/shared';

export const ready = Promise.resolve();

export function getTagGroups() {
  return TagGroups.orderBy('name').toQuery();
}

export function getTags() {
  return Tags.orderBy('name').toQuery();
}

export function addTagGroupByName(data: NewTagGroupData) {
  return TagGroups.insert({
    name: data.name,
    tags: [],
  })[0].data;
}

export function addTagByName(data: NewTagData) {
  return Tags.insert({
    name: data.name,
    groupId: data.groupId,
  })[0].data;
}

export function patchTag(data: PatchTagData) {
  // ..
}
