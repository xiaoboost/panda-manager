import { Books } from '@utils/components/icon';
import { TagsOutlined, SettingOutlined } from '@ant-design/icons';

export const MenuList = [
    {
        title: '漫画列表',
        route: '/',
        Icon: Books,
    },
    {
        title: '标签列表',
        route: '/tags',
        Icon: TagsOutlined,
    },
    {
        title: '设置',
        route: '/setting',
        Icon: SettingOutlined,
    },
];
