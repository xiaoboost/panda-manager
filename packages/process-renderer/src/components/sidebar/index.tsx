import styles from './index.less';

import React from 'react';

import { stringifyClass } from '@utils/web';
import { MenuOutlined } from '@ant-design/icons';

import { MenuList } from './menu';

import {
    useLocation,
    useHistory,
    useState,
    useCallback,
} from '@utils/react-use';

export function Sidebar() {
    const [isFold, setFold] = useState(false);
    const foldSidebar = useCallback(() => setFold(!isFold), [isFold]);
    const history = useHistory();
    const router = useLocation();

    return (
        <aside className={stringifyClass(styles.appSidebar, {
            [styles.appSidebarFold]: isFold,
        })}>
            <div className={`${styles.menuItem} ${styles.menuSwitch}`}>
                <MenuOutlined
                    className='menu-item__icon'
                    onClick={foldSidebar}
                />
            </div>
            {MenuList.map((item) =>
                <div
                    key={item.route}
                    onClick={() => history.push({ pathname: item.route })}
                    className={stringifyClass(styles.menuItem, {
                        [styles.menuItemHighlight]: item.route === router.pathname,
                    })}>
                    <item.Icon />
                    <span className={styles.menuItemTitle}>{item.title}</span>
                </div>,
            )}
        </aside>
    );
}
