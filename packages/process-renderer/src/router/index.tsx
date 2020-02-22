import React from 'react';

import { Route } from 'react-router-dom';
import { RouterController } from '../lib/router';

import * as Tag from '../views/tag';
import * as Objects from '../views/objects';
import * as Extension from '../views/extensions';
import * as Setting from '../views/setting';

/** 路由列表 */
const routers = [
    ...Objects.Routers,
    ...Extension.Routers,
    ...Setting.Routers,
    ...Tag.Routers,
];

/** 路由名称列表 */
export const RouterNames = {
    ...Objects.RouterNames,
    ...Extension.RouterNames,
    ...Setting.RouterNames,
    ...Tag.RouterNames,
};

/** 路由控制器 */
export const Router = new RouterController(routers);

/** 首页地址 */
export const DefaultPath = Router.toPath({
    name: Objects.RouterNames.ObjectList,
});

export function RouterViewr() {
    return <>
        {routers.map(({ name, path, component }) => (
            <Route exact key={name} path={path} component={component} />
        ))}
    </>;
}
