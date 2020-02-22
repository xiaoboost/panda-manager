import { Books } from '@utils/components/icon';
import { Router, RouterNames } from '@renderer/router';
import { TagsOutlined, SettingOutlined, ApiOutlined } from '@ant-design/icons';

export const MenuList = [
    {
        label: '漫画列表',
        Icon: Books,
        routerName: RouterNames.ObjectList,
        path: Router.toPath({
            name: RouterNames.ObjectList,
        }),
    },
    {
        label: '标签列表',
        Icon: TagsOutlined,
        routerName: RouterNames.TagGroupList,
        path: Router.toPath({
            name: RouterNames.TagGroupList,
        }),
    },
    {
        label: '插件列表',
        Icon: ApiOutlined,
        routerName: RouterNames.ExtensionList,
        path: Router.toPath({
            name: RouterNames.ExtensionList,
        }),
    },
    {
        label: '设置',
        Icon: SettingOutlined,
        routerName: RouterNames.Setting,
        path: Router.toPath({
            name: RouterNames.Setting,
        }),
    },
];

/** 由路径获取当前高亮路由名称 */
export function getRouteNameByPath(path: string) {
    const router = Router.findRouterByPath(path);

    if (!router) {
        return null;
    }

    const lightRouterName = router.router.meta?.sidebarLight
        ? router.router.meta?.sidebarLight
        : router.router.name;

    for (let i = 0; i < MenuList.length; i++) {
        const main = MenuList[i];

        if (main.routerName === lightRouterName) {
            return main.routerName;
        }
    }

    return null;
}
