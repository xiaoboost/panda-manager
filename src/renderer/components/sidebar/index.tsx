import './index.styl';

import { default as React, useState, useCallback } from 'react';

import { stringifyClass } from 'utils/web';
import { useRouter } from 'renderer/lib/use';
import { Link } from 'react-router-dom';

import AIcon from 'antd/es/icon';
import BIcon from 'renderer/components/icon';

import MenuList from './menu';

export default function Sidebar() {
    const [isFold, setFold] = useState(false);
    const { location: router } = useRouter();

    const foldSidebar = useCallback(() => setFold(!isFold), [isFold]);

    return (
        <aside className={stringifyClass(['app-sidebar', {
            'app-sidebar__fold': isFold,
        }])}>
            <div className='menu-item menu-switch'>
                <AIcon
                    type="menu"
                    className='menu-item__icon'
                    onClick={foldSidebar}
                />
            </div>
            {MenuList.map((item) =>
                <Link
                    key={item.route}
                    to={item.route}
                    className={stringifyClass(['menu-item', {
                        'menu-item__highlight': item.route === router.pathname,
                    }])}>
                    {item.isAntdIcon
                        ? <AIcon type={item.icon} />
                        : <BIcon type={item.icon as any} />
                    }
                    <span className='menu-item__title'>{item.title}</span>
                </Link>
            )}
        </aside>
    );
}
