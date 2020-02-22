import { InputRouterParam } from '@renderer/lib/router';

import { ObjectList } from './list';
import { ObjectDetail } from './detail';

export enum RouterNames {
    ObjectList = 200,
    ObjectDetail,
}

export const Routers: InputRouterParam[] = [
    {
        path: '/',
        name: RouterNames.ObjectList,
        component: ObjectList,
    },
    {
        path: '/object/:id',
        name: RouterNames.ObjectDetail,
        component: ObjectDetail,
        meta: {
            sidebarLight: RouterNames.ObjectList,
        },
    },
];
