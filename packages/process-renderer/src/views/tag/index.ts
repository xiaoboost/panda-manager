import { InputRouterParam } from '@renderer/lib/router';

import { TagList } from './tags';
import { TagGroupList } from './groups';

export enum RouterNames {
    TagGroupList = 400,
    TagList,
}

export const Routers: InputRouterParam[] = [
    {
        path: '/tag-groups',
        name: RouterNames.TagGroupList,
        component: TagGroupList,
    },
    {
        path: '/tag-group/:id',
        name: RouterNames.TagList,
        component: TagList,
        meta: {
            sidebarLight: RouterNames.TagGroupList,
        },
    },
];
