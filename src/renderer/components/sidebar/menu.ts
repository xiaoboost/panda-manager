import { Books } from 'src/utils/components/icon';
import { TagsOutlined, SettingOutlined } from '@ant-design/icons';

export enum MenuItemName {
    List,
    Tags,
    Setting,
}

export const MenuList = [
    {
        label: '漫画列表',
        Icon: Books,
        name: MenuItemName.List,
        path: '/',
    },
    {
        label: '标签列表',
        Icon: TagsOutlined,
        name: MenuItemName.Tags,
        path: '/tags',
    },
    {
        label: '设置',
        Icon: SettingOutlined,
        name: MenuItemName.Setting,
        path: '/setting',
    },
];

/** 由路径获取当前高亮路由名称 */
export function getRouteNameByPath(pathname: string) {
    const route = MenuList.find(({ path }) => path === pathname);

    if (route) {
        return route.name;
    }

    return null;
}
