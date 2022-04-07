import React from 'react';

import { styles } from './style';
import { clipboard } from 'electron';
import { Float } from '@panda/components';
import { MenuItem, MenuSplit } from 'src/components/context-menu';
import { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import { EmptyObject } from '@xiao-ai/utils';
import { useWatcher } from '@xiao-ai/utils/use';
import { tagData, fetchTagData } from 'src/store/tags';
import { fetch, ServiceName } from '@panda/fetch/renderer';
import { Tag, TagRef, TagItemData } from './tag';
import { delateTag } from './dialog';
import { MetaModal, ModalFormData, ModalFormOption } from './meta-modal';
import {
  log,
  NewTagGroupData,
  NewTagData,
  PatchTagGroupData,
  PatchTagData,
  TagGroupData,
} from '@panda/shared';

export interface TagListRef {
  /** 创建新标签集 */
  createTagGroup(): void;
  /** 折叠子项 */
  collapseAll(): void;
}

function getKey(data: TagItemData) {
  if (data.isGroup) {
    return data.isNew ? 'group-new' : `group-${data.groupId}`;
  }

  return data.isNew ? `group-${data.groupId}-tag-new` : `group-${data.groupId}-tag-${data.id}`;
}

export const TagList = forwardRef<TagListRef, EmptyObject>(function TagList(_, ref) {
  const { classes: cln } = styles;
  const [data] = useWatcher(tagData);
  const { current: tagMap } = useRef<Record<string, TagRef | null>>({});
  const [list, setList] = useState<TagItemData[]>([]);
  const [menuContext, setMenuContext] = useState<TagItemData>();
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelPosition, setPanelPosition] = useState([0, 0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState<ModalFormData>();
  const [modalOption, setModalOption] = useState<ModalFormOption>();

  // 内部方法
  const insertTags = (list: TagItemData[], groupId: number) => {
    const newList = list.slice();
    const listIndex = list.findIndex((v) => v.isGroup && v.id === groupId);
    const originGroup = data.find((v) => v.id === groupId);

    if (!originGroup) {
      throw new Error(`标签集编号错误：${groupId}`);
    }

    const tags = originGroup.tags.map((tag) => ({
      id: tag.id,
      title: tag.name,
      groupId,
      isGroup: false,
      isNew: false,
    }));

    newList.splice(listIndex + 1, 0, ...tags);

    return newList;
  };
  const removeTags = (list: TagItemData[], groupId: number) => {
    return list.filter((v) => {
      return v.isGroup || v.groupId !== groupId;
    });
  };
  const findGroup = (groupId?: number) => {
    const group = data.find((v) => v.id === groupId);

    if (!group) {
      throw new Error(`未找到编号为${groupId}原始标签集数据`);
    }

    return group;
  };
  const findTag = (groupId?: number, tagId?: number) => {
    const group = data.find((v) => v.id === groupId);
    const tag = group?.tags.find((v) => v.id === tagId);

    if (!group || !tag) {
      throw new Error(`未找到编号为${tagId}原始标签数据`);
    }

    return tag;
  };

  // 标签事件
  const createTagGroupHandler = () => {
    const newList = list.slice();
    newList.unshift({
      id: -1,
      title: '',
      isGroup: true,
      isNew: true,
      isCollapse: false,
    });
    setList(newList);
  };
  const tagClickHandler = (data: TagItemData) => {
    if (data.isGroup) {
      data.isCollapse = !data.isCollapse;

      if (data.isCollapse) {
        setList(removeTags(list, data.id!));
      } else {
        setList(insertTags(list, data.id!));
      }
    }
  };
  const tagRightClickHandler = (ev: React.MouseEvent, data: TagItemData) => {
    const tagRef = tagMap[getKey(data)];

    if (!tagRef) {
      if (process.env.NODE_ENV === 'development') {
        log(`编号为${data.id}未发现标签${data.isGroup ? '集' : ''}实例`);
      }

      return;
    }

    // 若是标签在编辑状态，则取消编辑状态
    if (tagRef.isEdit) {
      tagRef.blur();
    }

    setMenuContext(data);
    setPanelVisible(true);
    setPanelPosition([ev.pageX, ev.pageY]);
  };
  const tagNameValidate = (val: string, item?: TagItemData) => {
    if (!item) {
      return;
    }

    if (val.length === 0) {
      return '名称不能为空';
    }

    if (item.isGroup) {
      if (data.some((v) => v.name === val && item.id !== v.id)) {
        return `此位置已经存在标签集 "${val}"，请选择其他名称`;
      }
    } else {
      const group = data.find((v) => v.id === item.groupId);

      if (group && group.tags.some((v) => v.name === val && item.id !== v.id)) {
        return `此位置已经存在标签 "${val}"，请选择其他名称`;
      }
    }
  };
  const tagAliasValidate = (val: string, item?: TagItemData) => {
    if (val.length === 0 || !item) {
      return;
    }

    if (val === item.title) {
      return '别名不能和名称相同';
    }

    if (item.isGroup) {
      if (data.some((v) => v.alias === val && item.id !== v.id)) {
        return `此位置已经存在标签集别名 "${val}"，请选择其他名称`;
      }
    } else {
      const group = data.find((v) => v.id === item.groupId);

      if (group && group.tags.some((v) => v.alias === val && item.id !== v.id)) {
        return `此位置已经存在标签别名 "${val}"，请选择其他名称`;
      }
    }
  };
  const tagEditEnd = (val: string, item: TagItemData) => {
    // 未修改名称
    if (val === item.title) {
      setList(list.filter((v) => v !== item));
      return;
    }

    if (item.isGroup) {
      if (item.isNew) {
        fetch<void, NewTagGroupData>(ServiceName.AddTagGroup, { name: val }).then(fetchTagData);
      } else {
        fetch<void, PatchTagGroupData>(ServiceName.PatchTagGroup, {
          id: item.id!,
          name: val,
        }).then(fetchTagData);
      }
    } else {
      if (item.isNew) {
        fetch<void, NewTagData>(ServiceName.AddTag, {
          name: val,
          groupId: item.groupId!,
        }).then(fetchTagData);
      } else {
        fetch<void, PatchTagData>(ServiceName.PatchTag, {
          id: item.id!,
          name: val,
        }).then(fetchTagData);
      }
    }
  };

  // 右键菜单回调
  const newTagHandler = () => {
    const tag = menuContext!;
    const newList = list.slice();
    const groupIndex = list.findIndex((data) => data.isGroup && data.id === tag.id);

    // 强制展开该标签集
    list[groupIndex].isCollapse = false;

    // 插入新标签数据
    newList.splice(groupIndex + 1, 0, {
      id: -1,
      title: '',
      groupId: tag.id,
      isGroup: false,
      isNew: true,
    });

    setList(newList);
    setPanelVisible(false);
  };
  const renameHandler = () => {
    const tag = menuContext!;
    tagMap[getKey(tag)]?.edit();
    setPanelVisible(false);
  };
  const copyTextHandler = () => {
    const tag = menuContext!;
    clipboard.writeText(tag.title ?? '');
    setPanelVisible(false);
  };
  const deleteHandler = async () => {
    const tag = menuContext!;

    setPanelVisible(false);

    if (await delateTag(tag.title, tag.isGroup)) {
      fetch(ServiceName.DeleteTagGroup, { id: tag.id }).then(fetchTagData);
    }
  };
  const editMetaHandler = () => {
    const current = menuContext!;

    if (current.isGroup) {
      const group = findGroup(current.id);

      setModalTitle(`标签集“${group.name}”元数据`);
      setModalOption({
        groups: [],
      });
      setModalData({
        name: group.name,
        alias: group.alias ?? '',
        comment: group.comment ?? '',
        groupId: -1,
      });
    } else {
      const tag = findTag(current.groupId, current.id);

      setModalTitle(`标签“${tag.name}”元数据`);
      setModalOption({
        groups: data.map((v) => ({
          name: v.name,
          id: v.id,
        })),
      });
      setModalData({
        name: tag.name,
        alias: tag.alias ?? '',
        comment: tag.comment ?? '',
        groupId: tag.groupId,
      });
    }

    setPanelVisible(false);
    setModalVisible(true);
  };

  // 对话框回调
  const editMetaOkHandler = (formData: ModalFormData) => {
    const current = menuContext!;

    if (current.isGroup) {
      const group = findGroup(current.id);

      if (
        group.name !== formData.name ||
        (group.alias ?? '') !== formData.alias ||
        (group.comment ?? '') !== formData.comment
      ) {
        fetch<void, PatchTagGroupData>(ServiceName.PatchTagGroup, {
          ...formData,
          id: group.id,
        }).then(fetchTagData);
      }
    } else {
      const tag = findTag(current.groupId, current.id);

      if (
        tag.name !== formData.name ||
        tag.groupId !== formData.groupId ||
        (tag.alias ?? '') !== formData.alias ||
        (tag.comment ?? '') !== formData.comment
      ) {
        fetch<void, PatchTagData>(ServiceName.PatchTag, {
          ...formData,
          id: tag.id,
        }).then(fetchTagData);
      }
    }

    setModalVisible(false);
  };

  useEffect(() => {
    let result: TagItemData[] = [];
    const oldGroups = list.filter((data) => data.isGroup);

    for (const group of data) {
      const oldGroup = oldGroups.find((data) => data.id === group.id);
      const newGroup: TagItemData = {
        id: group.id,
        title: group.name,
        isGroup: true,
        isNew: false,
        isCollapse: oldGroup?.isCollapse ?? true,
      };

      result.push(newGroup);

      // 标签集展开时，需插入标签列表
      if (!newGroup.isCollapse) {
        result = insertTags(result, newGroup.id!);
      }
    }

    setList(result);
  }, [data]);

  useImperativeHandle(ref, () => ({
    createTagGroup: createTagGroupHandler,
    collapseAll() {
      list.forEach((v) => {
        if (v.isGroup) {
          v.isCollapse = false;
        }
      });
      setList(list.slice());
    },
  }));

  return (
    <div className={cln.list}>
      {list.map((data) => (
        <Tag
          {...data}
          key={getKey(data)}
          ref={(comp) => (tagMap[getKey(data)] = comp)}
          onClick={() => tagClickHandler(data)}
          onRightClick={(ev) => tagRightClickHandler(ev, data)}
          onEditValidate={(val) => tagNameValidate(val, data)}
          onEditEnd={(val) => tagEditEnd(val, data)}
        />
      ))}
      <Float
        stopPropagation
        visible={panelVisible}
        x={panelPosition[0]}
        y={panelPosition[1]}
        onBlur={() => setPanelVisible(false)}
      >
        {!menuContext?.isGroup && (
          <>
            <MenuItem disabled>选择以搜索</MenuItem>
            <MenuSplit />
          </>
        )}
        {menuContext?.isGroup && <MenuItem onClick={newTagHandler}>新建标签</MenuItem>}
        <MenuItem onClick={copyTextHandler}>复制文本</MenuItem>
        <MenuSplit />
        <MenuItem onClick={editMetaHandler}>编辑元数据</MenuItem>
        <MenuItem onClick={renameHandler}>重命名</MenuItem>
        <MenuItem onClick={deleteHandler}>删除</MenuItem>
      </Float>
      <MetaModal
        visible={modalVisible}
        title={modalTitle}
        value={modalData}
        option={modalOption}
        onOk={editMetaOkHandler}
        onCancel={() => setModalVisible(false)}
        nameValidate={(val) => tagNameValidate(val, menuContext)}
        aliasValidate={(val) => tagAliasValidate(val, menuContext)}
      />
    </div>
  );
});
