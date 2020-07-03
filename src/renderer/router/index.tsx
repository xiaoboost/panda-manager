import React from 'react';

import { Route } from 'react-router-dom';

import * as Tags from '../views/tags';
import * as Objects from '../views/objects';
import * as Setting from '../views/setting';

const routers = [
    {
        path: '/',
        component: Objects.Render,
    },
    {
        path: '/tags',
        component: Tags.Render,
    },
    {
        path: '/setting',
        component: Setting.Render,
    },
];

export function RouterViewr() {
    return <>
        {routers.map(({ path, component }, i) => (
            <Route exact key={i} path={path} component={component} />
        ))}
    </>;
}
