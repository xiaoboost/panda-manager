import { TagGroups, Tags } from '../../model';
import {
  TagData,
  TagGroupData,
  PatchTagData,
  PatchTagGroupData,
  DeleteTagData,
  DeleteTagGroupData,
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
  TagGroups.insert({
    name: data.name,
  });
}

export function addTagByName(data: NewTagData) {
  Tags.insert({
    name: data.name,
    groupId: data.groupId,
  });
}

export function patchTag(data: PatchTagData) {
  Tags.update(data.id, data);
}

export function patchTagGroup(data: PatchTagGroupData) {
  TagGroups.update(data.id, data);
}

export function deleteTag({ id }: DeleteTagData) {
  Tags.where((item) => item.id === id).remove();
}

export function deleteTagGroup({ id }: DeleteTagData) {
  TagGroups.where((item) => item.id === id).remove();
  Tags.where((data) => data.groupId === id).remove();

  // TODO: 删除项目中的标签
}
