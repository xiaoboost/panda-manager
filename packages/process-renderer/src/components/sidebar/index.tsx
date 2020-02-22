import styles from './index.less';

import React from 'react';

import { stringifyClass } from '@utils/web';
import { MenuList, getRouteNameByPath } from './menu';

import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useState, useCallback } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

export function Sidebar() {
    const { pathname } = useLocation();
    const [isFold, setFold] = useState(false);
    const foldSidebar = useCallback(() => setFold(!isFold), [isFold]);
    const defaultSelectedId = getRouteNameByPath(pathname);
    const defaultSelectedKey = defaultSelectedId ? String(defaultSelectedId) : '';
    const menuIndent = 24;

    return (
        <aside className={stringifyClass(styles.appSidebar, {
            [styles.appSidebarFold]: isFold,
        })}>
            <Menu
                theme='light'
                mode='inline'
                inlineCollapsed={isFold}
                inlineIndent={menuIndent}
                defaultSelectedKeys={[defaultSelectedKey]}>
                <li className='ant-menu-item' style={{ paddingLeft: menuIndent }}>
                    {isFold
                        ? <MenuUnfoldOutlined onClick={foldSidebar} />
                        : <MenuFoldOutlined onClick={foldSidebar} />
                    }
                </li>
                {MenuList.map((Item) => (
                    <Menu.Item key={Item.routerName}>
                        <Item.Icon />
                        <Link to={Item.path}>{Item.label}</Link>
                    </Menu.Item>
                ))}
            </Menu>
        </aside>
    );
}
