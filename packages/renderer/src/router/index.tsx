import React from 'react';

import { Route } from 'react-router-dom';

import * as Tags from '../views/tags';
import * as Setting from '../views/setting';
import * as FilesList from '../views/files/list';

const routers = [
    {
        path: '/',
        component: FilesList.Render,
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

export function RouterViewer() {
    return <>
        {routers.map(({ path, component }, i) => (
            <Route exact key={i} path={path} component={component} />
        ))}
    </>;
}
