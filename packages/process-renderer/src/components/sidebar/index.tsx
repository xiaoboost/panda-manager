import styles from './index.less';

import React from 'react';

import { stringifyClass } from '@utils/web';
import { useRouter, useState, useCallback } from '@utils/react-use';

import { Icon as AIcon } from 'antd';
import { Icon as BIcon } from '@utils/components';

import MenuList from './menu';

export default function Sidebar() {
    const [isFold, setFold] = useState(false);
    const { history, location: router } = useRouter();
    const foldSidebar = useCallback(() => setFold(!isFold), [isFold]);

    return (
        <aside className={stringifyClass(styles.appSidebar, {
            [styles.appSidebarFold]: isFold,
        })}>
            <div className={`${styles.menuItem} ${styles.menuSwitch}`}>
                <AIcon
                    type='menu'
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
                    {item.isAntdIcon
                        ? <AIcon type={item.icon} />
                        : <BIcon type={item.icon as any} />
                    }
                    <span className={styles.menuItemTitle}>{item.title}</span>
                </div>,
            )}
        </aside>
    );
}
