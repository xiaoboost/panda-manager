import { InputRouterParam } from '@renderer/lib/router';

import { ExtensionList } from './list';

export enum RouterNames {
    ExtensionList = 100,
}

export const Routers: InputRouterParam[] = [
    {
        path: '/extensions',
        name: RouterNames.ExtensionList,
        component: ExtensionList,
    },
];
