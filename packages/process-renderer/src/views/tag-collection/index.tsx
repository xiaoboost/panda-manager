import './index.less';

import React from 'react';

// import { warn } from 'renderer/lib/print';
// import { tagGroups } from 'renderer/store';
// import { useWatcher } from 'src/utils/react';
// import { deleteConfirm } from 'renderer/lib/dialog';
// import { TagGroup, TagGroupData } from 'renderer/lib/tag';

// import { Button, Icon } from 'antd';

// import TagGroupComp from './tag-group';
// import { editTagByModal, FormType } from './tag-edit';

// import { deleteVal } from 'utils/shared';

export function TagCollection() {
    return <div>标签集合</div>;
    // const [groups, setGroup] = useWatcher(tagGroups);

    // const createGroup = () => {
    //     editTagByModal({ type: FormType.TagGroup }).then((data) => {
    //         setGroup(groups.concat([new TagGroup(data)]));
    //     });
    // };

    // const changeGroup = (data: TagGroupData) => {
    //     const newGroups = groups.slice();
    //     const index = newGroups.findIndex(({ id }) => data.id === id);

    //     if (index < 0) {
    //         warn(`当前 ID 无效：${data.id}`);
    //         return;
    //     }

    //     newGroups.splice(index, 1, data);
    //     setGroup(newGroups);
    // };

    // const deleteGroup = async (data: TagGroupData) => {
    //     await deleteConfirm({
    //         okText: '删除',
    //         content: (
    //             <span>
    //                 <span>确认删除此标签集？</span>
    //                 <br />
    //                 <span style={{ color: '#1890FF', marginTop: '6px', display: 'inline-block' }}>{data.name}</span>
    //             </span>
    //         ),
    //     });

    //     setGroup(deleteVal(groups, (item) => item.id !== data.id));
    // };

    // return (
    //     <main id='tags-collection'>
    //         {groups.map((item) => (
    //             <TagGroupComp
    //                 data={item}
    //                 key={item.id}
    //                 onChange={changeGroup}
    //                 onDelete={deleteGroup}
    //             />
    //         ))}
    //         <Button onClick={createGroup}>
    //             <Icon type='plus-circle' /> 添加标签集
    //         </Button>
    //     </main>
    // );
}
