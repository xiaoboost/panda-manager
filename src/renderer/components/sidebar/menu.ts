import { Books } from 'src/utils/components/icon';
import { TagsOutlined, SettingOutlined } from '@ant-design/icons';

export const MenuList = [
    {
        label: '漫画列表',
        Icon: Books,
        name: 'list',
        path: '/',
    },
    {
        label: '标签列表',
        Icon: TagsOutlined,
        name: 'tags',
        path: '/tags',
    },
    {
        label: '设置',
        Icon: SettingOutlined,
        name: 'setting',
        path: '/setting',
    },
];

/** 由路径获取当前高亮路由名称 */
export function getRouteNameByPath(path: string) {
    // const router = Router.findRouterByPath(path);

    // if (!router) {
    //     return null;
    // }

    // const lightRouterName = router.router.meta?.sidebarLight
    //     ? router.router.meta?.sidebarLight
    //     : router.router.name;

    // for (let i = 0; i < MenuList.length; i++) {
    //     const main = MenuList[i];

    //     if (main.routerName === lightRouterName) {
    //         return main.routerName;
    //     }
    // }

    return null;
}
