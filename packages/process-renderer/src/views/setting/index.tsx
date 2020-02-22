import { InputRouterParam } from '@renderer/lib/router';

import { Setting } from './setting';

export enum RouterNames {
    Setting = 300,
}

export const Routers: InputRouterParam[] = [
    {
        path: '/setting',
        name: RouterNames.Setting,
        component: Setting,
    },
];
