import styles from './index.styl';

import React from 'react';

import { stringifyClass } from 'src/utils/web/dom';
import { MenuList, getRouteNameByPath } from './menu';

import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';

export function Sidebar() {
    const { pathname } = useLocation();
    const highlight = getRouteNameByPath(pathname);

    return (
        <aside className={styles.appSidebar}>
            <ul className={styles.appMenuList}>
                {MenuList.map((item) => (
                    <li
                        key={item.name}
                        className={stringifyClass(styles.appMenuItem, {
                            [styles.appMenuItemHighlight]: highlight === item.name,
                        })}
                    >
                        <item.Icon className={styles.appMenuItemIcon} />
                        <Link
                            to={item.path}
                            className={styles.appMenuItemLink}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
